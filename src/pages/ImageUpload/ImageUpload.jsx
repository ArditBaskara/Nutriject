import { useState } from "react";
import { uploadImage } from "../../services/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Cookies from "js-cookie";
import { decrypt } from "../../crypt";
import { useNavigate } from "react-router-dom";

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
} from "../../firebase-config";

import {
  FaCamera,
  FaImage,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import "../PhotoInput/PhotoInput.css"; 

const ImageUpload = () => {
  const Navigate = useNavigate();
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

  // Drag & drop handlers
  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (!f) return;
    setSelectedImage(f);
    setPreview(URL.createObjectURL(f));
    setNutri(null);
    setMsg({ ok: null, text: "" });
  };

  // Capture from camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');

      // convert dataURL to File object
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });

      setSelectedImage(file);
      setPreview(dataUrl);
      setNutri(null);
      setMsg({ ok: null, text: "" });

      // stop camera
      stream.getTracks().forEach((t) => t.stop());
    } catch (err) {
      console.error('Camera error:', err);
      setMsg({ ok: false, text: 'Gagal mengakses kamera.' });
    }
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
    <div className="min-h-screen bg-gray-50 pt-20 mt-6">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <header className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">Deteksi Nutrisi via Foto</h2>
              <p className="text-sm text-gray-500 mt-1">Pilih foto makanan atau ambil foto untuk ekstraksi nutrisi otomatis.</p>
            </div>
          </header>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <input id="fileInp" type="file" accept="image/*" hidden onChange={handleFile} />

              {/* Drag & drop area (also clickable) */}
              <div
                onDragOver={onDragOver}
                onDrop={onDrop}
                onClick={() => document.getElementById('fileInp').click()}
                className="mt-2 cursor-pointer rounded-md border-2 border-dashed border-gray-200 p-6 text-center hover:border-orange-300 transition-colors"
                aria-label="Area unggah gambar (klik atau tarik dan lepas file)"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <FaImage className="w-8 h-8 text-gray-400" />
                  <div className="text-sm font-medium">Seret & lepaskan gambar di sini atau klik untuk memilih</div>
                  <div className="text-xs text-gray-400">(JPG, PNG) — maksimal 10MB</div>
                </div>
              </div>

              {/* Preview (if any) */}
              {preview && (
                <div className="mt-4">
                  <div className="w-full rounded-md overflow-hidden border border-gray-100 shadow-sm">
                    <img src={preview} alt="preview" className="w-full h-56 object-cover" />
                  </div>
                </div>
              )}

              {/* Actions: stacked on mobile, inline on larger screens */}
              <div className="mt-3 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={doUpload}
                  disabled={!selectedImage || loading}
                  className="flex-1 px-4 py-3 bg-green-500 text-white rounded-md hover:shadow-md disabled:opacity-60 text-center"
                  aria-disabled={!selectedImage || loading}
                >
                  {loading ? 'Menganalisis...' : 'Ekstrak Nutrisi'}
                </button>

                <button
                  onClick={() => startCamera()}
                  className="flex-1 px-4 py-3 bg-white border border-orange-500 text-orange-600 rounded-md hover:shadow-sm flex items-center justify-center gap-2"
                >
                  <FaCamera />
                  <span>Camera</span>
                </button>

                <button
                  onClick={() => Navigate('/personalize')}
                  className="flex-1 px-4 py-3 bg-white border rounded-md text-center"
                >
                  Kembali
                </button>
              </div>
            </div>

            <div>
              {/* Result / info area */}
              {nutri ? (
                <div className="p-4 bg-gray-50 rounded-md">
                  <h3 className="text-lg font-semibold">Hasil Ekstraksi</h3>
                  <ul className="mt-3 space-y-1 text-sm text-gray-700">
                    <li><strong>Kalori:</strong> {nutri.kalori || 0} kkal</li>
                    <li><strong>Lemak:</strong> {nutri.lemak || 0} g</li>
                    <li><strong>Karbo:</strong> {nutri.karbohidrat || 0} g</li>
                    <li><strong>Protein:</strong> {nutri.protein || 0} g</li>
                    <li><strong>Gula:</strong> {nutri.gula || 0} g</li>
                    <li><strong>Garam:</strong> {nutri.garam || 0} mg</li>
                    <li><strong>Air:</strong> {nutri.air || 0}%</li>
                  </ul>

                  <div className="mt-4 flex gap-3">
                    <button onClick={handleMakan} className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md">Simpan</button>
                    <button onClick={() => { setSelectedImage(null); setPreview(null); setNutri(null); setMsg({ ok: null, text: "" }); }} className="px-4 py-2 bg-orange-500 text-white rounded-md">Batal</button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-md border border-dashed border-gray-200 text-sm text-gray-600">
                  Hasil ekstraksi akan muncul di sini setelah Anda menekan "Ekstrak Nutrisi".
                </div>
              )}

              {/* ALERT */}
              {msg.text && (
                <div className={`mt-4 p-3 rounded-md text-sm ${msg.ok ? 'bg-green-50 border border-green-100 text-green-800' : 'bg-red-50 border border-red-100 text-red-700'}`} role="status" aria-live="polite">
                  {msg.text}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ImageUpload;
