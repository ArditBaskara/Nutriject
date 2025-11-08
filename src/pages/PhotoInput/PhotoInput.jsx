/* eslint-disable */

// PhotoInput.jsx (moved into folder)
import { useState } from 'react';
import Tesseract from 'tesseract.js';
import axios from 'axios';
import Cookies from 'js-cookie';
import { decrypt } from '../../crypt';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FaImage, FaCamera } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

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
} from '../../firebase-config';

import './PhotoInput.css';

const PhotoInput = () => {
  const [image, setImage] = useState(null);
  const [ocrText, setOcrText] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const enc = Cookies.get('enc');
  const user = enc ? decrypt(enc) : null;
  const email = user?.email;

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

  // Drag & drop handlers (clickable drop area)
  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
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
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      const img64 = canvas.toDataURL('image/png');

      setImage(img64);
      performOCR(img64);
      stream.getTracks().forEach((t) => t.stop());
    } catch (err) {
      console.error('Camera error:', err);
    }
  };

  const performOCR = async (img64) => {
    setLoading(true);

    try {
      const {
        data: { text },
      } = await Tesseract.recognize(img64, 'eng', {
        logger: (m) => console.log(m), // debug
      });

      const storedApi = sessionStorage.getItem('apiLink');

      if (!storedApi) {
        alert(
          'API link belum disetting. Silakan pergi ke halaman setting untuk menyetting.'
        );

        window.location.href = '/setting';
        return;
      }

      const { data } = await axios.post(
        `${storedApi}/extract-nutrients`,
        { ocr_text: text },
        { headers: { 'ngrok-skip-browser-warning': 'true' } }
      );

      const clean = {
        kalori: data.kalori ?? 0,
        lemak_total: data.lemak_total ?? 0,
        karbohidrat_total: data.karbohidrat_total ?? 0,
        protein: data.protein ?? 0,
        gula: data.gula ?? 0,
        garam: data.garam ?? 0,
        air: data.air ?? 0,
      };

      setOcrText(clean);
    } catch (err) {
      console.error('OCR / Extract error:', err);
      setOcrText('Gagal membaca atau mengekstraksi nutrisi.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendToFirebase = async () => {
    if (!email || typeof ocrText !== 'object') {
      return alert('Data tidak valid / user belum login');
    }

    try {
      const today = new Date().toISOString().split('T')[0]; // format "YYYY-MM-DD"

      const rptQ = query(
        collection(db, 'reports'),
        where('email', '==', email),
        where('tanggal', '==', today),
        limit(1)
      );

      const snap = await getDocs(rptQ);
      let rptRef;

      if (snap.empty) {
        rptRef = await addDoc(collection(db, 'reports'), {
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
        rptRef = snap.docs[0].ref;
      }

      const cur = snap.empty ? {} : snap.docs[0].data();
      const upd = {
        kalori: (cur.kalori || 0) + (ocrText.kalori || 0),
        fat: (cur.fat || 0) + (ocrText.lemak_total || 0),
        carbs:
          (cur.carbs || 0) +
          (ocrText.karbohidrat_total || ocrText.karbohidrat || 0),
        protein: (cur.protein || 0) + (ocrText.protein || 0),
        sugar: (cur.sugar || 0) + (ocrText.gula || 0),
        salt: (cur.salt || 0) + (ocrText.garam || 0),
      };

      await setDoc(rptRef, upd, { merge: true });

      alert('Nutrisi berhasil ditambahkan ke laporan hari ini!');
      setOcrText(null);
      setImage(null);
      navigate('/personalize');
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan ke database.');
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gray-50 pt-20 mt-2">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <header className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">Deteksi Nutrisi</h2>
              <p className="text-sm text-gray-500 mt-1">
                Unggah foto label kemasan atau ambil foto untuk ekstraksi
                nutrisi otomatis.
              </p>
            </div>
          </header>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileUpload}
              />

              {/* Drag & drop area (also clickable) */}
              <div
                onDragOver={onDragOver}
                onDrop={onDrop}
                onClick={() => document.getElementById('fileInput').click()}
                className="mt-2 cursor-pointer rounded-md border-2 border-dashed border-gray-200 p-6 text-center hover:border-orange-300 transition-colors"
                aria-label="Area unggah gambar (klik atau tarik dan lepas file)"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <FaImage className="w-8 h-8 text-gray-400" />
                  <div className="text-sm font-medium">
                    Seret & lepaskan gambar di sini atau klik untuk memilih
                  </div>
                  <div className="text-xs text-gray-400">
                    (JPG, PNG) — maksimal 10MB
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => document.getElementById('fileInput').click()}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-md hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                  <FaImage />
                  <span>Unggah Foto</span>
                </button>

                <button
                  type="button"
                  onClick={startCamera}
                  className="flex-1 px-4 py-3 bg-white border border-orange-500 text-orange-600 rounded-md hover:shadow-sm flex items-center justify-center gap-2 "
                >
                  <FaCamera />
                  <span>Ambil Kamera</span>
                </button>

                <button
                  onClick={() => navigate('/personalize')}
                  className="flex-1 px-4 py-3 bg-white border rounded-md text-center"
                >
                  Kembali
                </button>
              </div>

              {loading && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <svg
                    className="w-5 h-5 animate-spin text-gray-600"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  <span>Membaca/mengekstraksi nutrisi…</span>
                </div>
              )}

              {image && (
                <div className="mt-4 w-full rounded-md overflow-hidden border border-gray-100 shadow-sm">
                  <img
                    src={image}
                    alt="preview"
                    className="w-full h-56 object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              {ocrText && typeof ocrText === 'object' ? (
                <div className="p-4 bg-gray-50 rounded-md">
                  <h3 className="text-lg font-semibold">Hasil Ekstraksi</h3>
                  <ul className="mt-3 space-y-1 text-sm text-gray-700">
                    <li>
                      <strong>Kalori:</strong> {ocrText.kalori || 0} kkal
                    </li>
                    <li>
                      <strong>Lemak:</strong> {ocrText.lemak_total || 0} g
                    </li>
                    <li>
                      <strong>Karbo:</strong> {ocrText.karbohidrat || 0} g
                    </li>
                    <li>
                      <strong>Protein:</strong> {ocrText.protein || 0} g
                    </li>
                    <li>
                      <strong>Gula:</strong> {ocrText.gula || 0} g
                    </li>
                    <li>
                      <strong>Garam:</strong> {ocrText.garam || 0} mg
                    </li>
                  </ul>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={handleSendToFirebase}
                      className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => {
                        setOcrText(null);
                        setImage(null);
                      }}
                      className="px-4 py-2 bg-orange-500 text-white rounded-md"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-md border border-dashed border-gray-200 text-sm text-gray-600">
                  Hasil ekstraksi akan muncul di sini setelah proses berhasil.
                </div>
              )}

              {typeof ocrText === 'string' && (
                <div className="mt-3 text-sm text-red-600">{ocrText}</div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PhotoInput;
