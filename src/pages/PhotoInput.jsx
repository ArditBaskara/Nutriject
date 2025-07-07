// PhotoInput.jsx
import { useState } from "react";
import Tesseract from "tesseract.js";
import axios from "axios";
import Cookies from "js-cookie";
import { decrypt } from "../crypt";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";

import {
  db,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  setDoc,
} from "../firebase-config";

import "./PhotoInput.css";

const PhotoInput = () => {
  /* ---------- STATE ---------- */
  const [image, setImage]         = useState(null);
  const [ocrText, setOcrText]     = useState(null);
  const [loading, setLoading]     = useState(false);

  /* ---------- USER EMAIL ---------- */
  const enc   = Cookies.get("enc");
  const user  = enc ? decrypt(enc) : null;
  const email = user?.email;

  /* ---------- UPLOAD / CAMERA ---------- */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const img64 = reader.result;
      setImage(img64);
      performOCR(img64);
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video  = document.createElement("video");
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement("canvas");
      canvas.width  = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      const img64 = canvas.toDataURL("image/png");

      setImage(img64);
      performOCR(img64);
      stream.getTracks().forEach((t) => t.stop());
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  /* ---------- OCR + EXTRACT NUTRISI ---------- */
  const performOCR = async (img64) => {
    setLoading(true);

    try {
      /* 1️⃣  OCR dengan Tesseract */
      const {
        data: { text },
      } = await Tesseract.recognize(img64, "eng", {
        logger: (m) => console.log(m), // debug
      });

      /* 2️⃣  Kirim ke API NGROK */
      const { data } = await axios.post(
        "https://9084-35-196-144-27.ngrok-free.app/extract-nutrients",
        { ocr_text: text },
        { headers: { "ngrok-skip-browser-warning": "true" } }
      );

      /* 3️⃣  Normalisasi respons ⇒ pastikan semua field ada */
      const clean = {
        kalori:            data.kalori            ?? 0,
        lemak_total:       data.lemak_total       ?? 0,
        karbohidrat_total: data.karbohidrat_total ?? 0,
        protein:           data.protein           ?? 0,
        gula:              data.gula              ?? 0,
        garam:             data.garam             ?? 0,
        air:               data.air               ?? 0,
      };

      setOcrText(clean); // simpan objek nutrisi

    } catch (err) {
      console.error("OCR / Extract error:", err);
      setOcrText("Gagal membaca atau mengekstraksi nutrisi.");
    } finally {
      setLoading(false);
    }
  };


  const handleSendToFirebase = async () => {
  if (!email || typeof ocrText !== "object") {
    return alert("Data tidak valid / user belum login");
  }

  try {
    const today = new Date().toISOString().split("T")[0]; // format "YYYY-MM-DD"

    // ✅ Cek apakah laporan hari ini sudah ada
    const rptQ = query(
      collection(db, "reports"),
      where("email", "==", email),
      where("tanggal", "==", today),
      limit(1)
    );

    const snap = await getDocs(rptQ);
    let rptRef;

    if (snap.empty) {
      // 🆕 Buat baru kalau belum ada report untuk hari ini
      rptRef = await addDoc(collection(db, "reports"), {
        email,
        tanggal: today,
        carbs: 0, protein: 0, fat: 0, sugar: 0, salt: 0, kalori: 0,
      });
    } else {
      // 📝 Ambil ref dari dokumen yg udah ada
      rptRef = snap.docs[0].ref;
    }

    const cur = snap.empty ? {} : snap.docs[0].data();
    const upd = {
      kalori : (cur.kalori || 0) + (ocrText.kalori       || 0),
      fat    : (cur.fat    || 0) + (ocrText.lemak_total  || 0),
      carbs  : (cur.carbs  || 0) + (ocrText.karbohidrat_total || ocrText.karbohidrat || 0),
      protein: (cur.protein|| 0) + (ocrText.protein      || 0),
      sugar  : (cur.sugar  || 0) + (ocrText.gula         || 0),
      salt   : (cur.salt   || 0) + (ocrText.garam        || 0),
    };

    await setDoc(rptRef, upd, { merge: true });

    alert("Nutrisi berhasil ditambahkan ke laporan hari ini!");
    setOcrText(null);
    setImage(null);
  } catch (err) {
    console.error(err);
    alert("Gagal menyimpan ke database.");
  }
};


  /* ---------- UI ---------- */
  return (
    <div className="photo-page">
      <Navbar />

      <div className="photo-card">
        <h2 className="title">Deteksi Nutrisi</h2>

        <div className="btn-row">
          <Button onClick={() => document.getElementById("fileInput").click()}>
            Unggah Foto
          </Button>
          {/* <Button onClick={startCamera}>Kamera</Button> */}
        </div>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileUpload}
        />

        {loading && <p>Membaca nutrisi…</p>}

        {image && (
          <div className="preview">
            <img src={image} alt="preview" />
          </div>
        )}

        {ocrText && typeof ocrText === "object" && (
          <div className="nutrisi-card">
            <h3>Hasil Ekstraksi</h3>
            <ul>
              <li>Kalori : {ocrText.kalori || 0} kkal</li>
              <li>Lemak  : {ocrText.lemak_total || 0} g</li>
              <li>Karbo  : {ocrText.karbohidrat || 0} g</li>
              <li>Protein: {ocrText.protein || 0} g</li>
              <li>Gula   : {ocrText.gula || 0} g</li>
              <li>Garam  : {ocrText.garam || 0} mg</li>
            </ul>

            <div className="btn-row">
              <Button onClick={handleSendToFirebase}>Makan</Button>
              <Button bgCol="red" onClick={() => window.location.reload()}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {typeof ocrText === "string" && <p>{ocrText}</p>}
      </div>

      <Footer />
    </div>
  );
};

export default PhotoInput;
