import React, { useEffect, useState } from "react";
import {
  db,
  collection,
  query,
  where,
  limit,
  getDocs,
  addDoc,
  setDoc,
} from "../../firebase-config";
import Cookies from "js-cookie";
import { decrypt } from "../../crypt";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate, useLocation } from "react-router-dom";

import "../PhotoInput/PhotoInput.css";
import "./Manual.css";

import {
  FaBreadSlice,
  FaDrumstickBite,
  FaAppleAlt,
  FaTint,
  FaCheese,
  FaUtensilSpoon,
} from "react-icons/fa";

// Keys correspond to the `formData` keys (lowercase) for clarity
const ICONS = {
  kalori: <FaAppleAlt />, // generic
  carbs: <FaBreadSlice />,
  protein: <FaDrumstickBite />,
  fat: <FaCheese />,
  sugar: <FaTint />,
  salt: <FaUtensilSpoon />,
};

const LABELS = {
  kalori: "Kalori",
  carbs: "Karbohidrat",
  protein: "Protein",
  fat: "Lemak",
  sugar: "Gula",
  salt: "Garam",
};

const initialFormData = {
  kalori: 0,
  carbs: 0,
  protein: 0,
  fat: 0,
  sugar: 0,
  salt: 0,
};

const Manual = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [info, setInfo] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const enc = Cookies.get("enc");
    if (!enc) return;
    try {
      const decrypted = decrypt(enc);
      setUser(decrypted || null);
    } catch (err) {
      // If decrypt fails, clear cookie and leave user null
      console.error("Failed to decrypt cookie:", err);
      Cookies.remove("enc");
      setUser(null);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Ensure numeric value, fallback to 0
    const num = Number(value);
    setFormData((prev) => ({ ...prev, [name]: Number.isFinite(num) ? num : 0 }));
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setInfo("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.email) return setInfo("Anda harus masuk terlebih dahulu.");

    const email = user.email;
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    try {
      const rptQ = query(
        collection(db, "reports"),
        where("email", "==", email),
        where("tanggal", "==", today),
        limit(1)
      );
      const snap = await getDocs(rptQ);

      let rptRef;
      let current = {};
      if (snap.empty) {
        // Create a document with baseline values so merging is straightforward
        rptRef = await addDoc(collection(db, "reports"), {
          email,
          tanggal: today,
          ...initialFormData,
        });
      } else {
        rptRef = snap.docs[0].ref;
        current = snap.docs[0].data() || {};
      }

      // Build updated values by summing existing values with the form
      const updated = {};
      Object.keys(initialFormData).forEach((k) => {
        const curVal = Number(current[k]) || 0;
        const addVal = Number(formData[k]) || 0;
        updated[k] = curVal + addVal;
      });

      await setDoc(rptRef, updated, { merge: true });

      setFormData(initialFormData);
      setInfo("Data berhasil ditambahkan 👍");
    } catch (err) {
      console.error(err);
      setInfo("Gagal menyimpan data 😭");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8 pt-20 mt-10">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between">
            <div className="w-[100vw]">
              <h2 className="text-2xl font-bold text-center">Input Nutrisi Manual</h2>
              <p className="text-sm text-gray-500 mt-1 text-center">Masukkan nilai nutrisi untuk menambah ke laporan harian Anda.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(formData).map(([key, val]) => (
                <div key={key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                    <span className="text-lg">{ICONS[key] || <FaAppleAlt />}</span>
                  </div>

                  <div className="flex-1">
                    <label htmlFor={key} className="block text-sm font-medium text-gray-700">{LABELS[key] || key}</label>
                    <input
                      id={key}
                      type="number"
                      name={key}
                      min="0"
                      step="any"
                      inputMode="decimal"
                      value={val}
                      onChange={handleChange}
                      placeholder="0"
                      aria-label={LABELS[key] || key}
                      className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </div>
                </div>
              ))}
            </div>

            {info && (
              <div className="mt-4 p-3 rounded-md bg-green-50 border border-green-100 text-green-800 text-sm">{info}</div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-green-500 text-white rounded-md hover:shadow-md transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-green-300 text-center font-bold text-lg"
              >
                Simpan
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-3 bg-orange-500 text-white rounded-md hover:shadow-md transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-orange-300 text-center font-bold text-lg"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={() => { navigate('/personalize'); }}
                className="w-full sm:w-auto px-6 py-3 bg-white text-gray-700 rounded-md shadow-md transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-orange-300 text-center font-bold text-lg"
              >
                 Kembali
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Manual;
