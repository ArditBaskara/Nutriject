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
import Button from "../../components/Button";

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
    <div className="photo-page">
      <Navbar />
      <div className="photo-card">
        <h2 className="title">Input Nutrisi Manual</h2>

        <form onSubmit={handleSubmit} className="manual-form">
          {Object.entries(formData).map(([key, val]) => (
            <div className="form-group" key={key}>
              <label htmlFor={key}>
                <span className="icon">{ICONS[key] || <FaAppleAlt />}</span>
                <span className="label-text">{LABELS[key] || key}</span>
              </label>
              <input
                id={key}
                type="number"
                name={key}
                min="0"
                value={val}
                onChange={handleChange}
                placeholder="0"
                aria-label={LABELS[key] || key}
              />
            </div>
          ))}

          {info && <p className="info-message">{info}</p>}

          <div className="btn-row">
            <Button bgCol="green" type="submit">
              Simpan
            </Button>
            <Button bgCol="red" type="button" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Manual;
