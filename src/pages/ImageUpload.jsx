import { useState } from "react";
import { uploadImage } from "../services/api";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Cookies from "js-cookie";
import { decrypt } from "../crypt";

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

import {
  FaCamera,
  FaImage,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import "./PhotoInput.css"; 

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview]             = useState(null);
  const [nutri, setNutri]                 = useState(null);
  const [loading, setLoading]             = useState(false);
  const [msg, setMsg]                     = useState({ ok: null, text: "" });

  const enc   = Cookies.get("enc");
  const user  = enc ? decrypt(enc) : null;
  const email = user?.email;

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setSelectedImage(f);
    setPreview(URL.createObjectURL(f));
    setNutri(null);
    setMsg({ ok: null, text: "" });
  };

  const doUpload = async () => {
    if (!selectedImage) return setMsg({ ok: false, text: "Pilih foto dulu!" });
    setLoading(true);
    setMsg({ ok: null, text: "" });

    try {
      const fd = new FormData();
      fd.append("image", selectedImage);

      const res = await uploadImage(fd); 
      setNutri(res.nutrients[0]);
    } catch (err) {
      console.error(err);
      setMsg({ ok: false, text: "Gagal ekstraksi nutrisi." });
    } finally {
      setLoading(false);
    }
  };

  const handleMakan = async () => {
    if (!email || !nutri) return;
    try {
      const today = new Date().toISOString().split("T")[0];

      const q = query(
        collection(db, "reports"),
        where("email", "==", email),
        where("tanggal", "==", today),
        limit(1)
      );
      const snap = await getDocs(q);
      let ref;
      if (snap.empty) {
        ref = await addDoc(collection(db, "reports"), {
          email,
          tanggal: today,
          carbs: 0,
          protein: 0,
          fat: 0,
          sugar: 0,
          salt: 0,
          kalori: 0,
        });
      } else {
        ref = snap.docs[0].ref;
      }

      const cur = snap.empty ? {} : snap.docs[0].data();
      const upd = {
        kalori : (cur.kalori || 0) + (nutri.kalori            || 0),
        fat    : (cur.fat    || 0) + (nutri.lemak             || 0),
        carbs  : (cur.carbs  || 0) + (nutri.karbohidrat       || 0),
        protein: (cur.protein|| 0) + (nutri.protein           || 0),
        sugar  : (cur.sugar  || 0) + (nutri.gula              || 0),
        salt   : (cur.salt   || 0) + (nutri.garam             || 0),
      };
      await setDoc(ref, upd, { merge: true });

      setMsg({ ok: true, text: "Data nutrisi tersimpan!" });
      setSelectedImage(null);
      setPreview(null);
      setNutri(null);
    } catch (err) {
      console.error(err);
      setMsg({ ok: false, text: "Gagal menyimpan ke database." });
    }
  };

  return (
    <div className="photo-page">
      <Navbar />

      <div className="photo-card">
        <h2 className="title">Deteksi Nutrisi via Foto</h2>

        <div className="btn-row">
          <Button onClick={() => document.getElementById("fileInp").click()}>
            Pilih Foto
          </Button>
        </div>
        <input id="fileInp" type="file" accept="image/*" hidden onChange={handleFile} />

        {preview && (
          <>
            <img className="preview" src={preview} alt="preview" />
            <Button onClick={doUpload} disabled={loading}>
              {loading ? "Menganalisis..." : "Ekstrak Nutrisi"}
            </Button>
          </>
        )}

        {/* HASIL NUTRISI */}
        {nutri && (
          <div className="nutrisi-card">
            <h3>Hasil Ekstraksi</h3>
            <ul>
              <li>Kalori : {nutri.kalori || 0} kkal</li>
              <li>Lemak  : {nutri.lemak || 0} g</li>
              <li>Karbo  : {nutri.karbohidrat || 0} g</li>
              <li>Protein: {nutri.protein || 0} g</li>
              <li>Gula   : {nutri.gula || 0} g</li>
              <li>Garam  : {nutri.garam || 0} mg</li>
              <li>Air    : {nutri.air || 0}%</li>
            </ul>

            <div className="btn-row">
              <Button onClick={handleMakan}>Makan</Button>
              <Button bgCol="red" onClick={() => window.location.reload()}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* ALERT */}
        {msg.text && (
          <p style={{ color: msg.ok ? "#2ecc71" : "#e74c3c", marginTop: 12 }}>
            {msg.text}
          </p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ImageUpload;
