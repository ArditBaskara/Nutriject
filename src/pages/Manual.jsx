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
} from "../firebase-config";
import { decrypt } from "../crypt";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button"; 
import "./PhotoInput.css";
import "./Manual.css";
import {
  FaBreadSlice,
  FaDrumstickBite,
  FaAppleAlt,
  FaTint,
  FaCheese,
  FaUtensilSpoon,
} from "react-icons/fa";

const icons = {
  Carbs: <FaBreadSlice />,
  Protein: <FaDrumstickBite />,
  Sugar: <FaAppleAlt />,
  Salt: <FaUtensilSpoon />,
  Fat: <FaCheese />,
};

const Manual = () => {
  /* ---------- STATE ---------- */
  const [formData, setFormData] = useState({
    kalori: 0,
    carbs: 0,
    protein: 0,
    fat: 0,
    sugar: 0,
    salt: 0,
  });
  const [info, setInfo] = useState("");
  const [user, setUser] = useState(null);

  /* ---------- GET USER ---------- */
  useEffect(() => {
    const decrypted = decrypt(Cookies.get("enc"));
    setUser(decrypted); // cookies cuma nyimpen nama‑email‑password ➜ cukup
  }, []);

  /* ---------- HANDLE CHANGE ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: Number(value) }));
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.email) return alert("Lo belum login, bro!");

    const email = user.email;
    const today = new Date().toISOString().split("T")[0]; // YYYY‑MM‑DD

    try {
      // 🔍 cek report hari ini via query email+tanggal
      const rptQ = query(
        collection(db, "reports"),
        where("email", "==", email),
        where("tanggal", "==", today),
        limit(1)
      );
      const snap = await getDocs(rptQ);

      let rptRef, cur;
      if (snap.empty) {
        // belum ada ⇒ bikin dokumen kosong
        rptRef = await addDoc(collection(db, "reports"), {
          email,
          tanggal: today,
          kalori: 0,
          carbs: 0,
          protein: 0,
          fat: 0,
          sugar: 0,
          salt: 0,
        });
        cur = {};
      } else {
        rptRef = snap.docs[0].ref;
        cur = snap.docs[0].data();
      }

      // 🧮 tambahkan data lama + baru
      const upd = {
        kalori: (cur.kalori || 0) + formData.kalori,
        carbs: (cur.carbs || 0) + formData.carbs,
        protein: (cur.protein || 0) + formData.protein,
        fat: (cur.fat || 0) + formData.fat,
        sugar: (cur.sugar || 0) + formData.sugar,
        salt: (cur.salt || 0) + formData.salt,
      };

      // 🔄 merge ke Firebase
      await setDoc(rptRef, upd, { merge: true });
      setFormData({ kalori: 0, carbs: 0, protein: 0, fat: 0, sugar: 0, salt: 0 });
      setInfo("Data berhasil ditambahkan 👍");
    } catch (err) {
      console.error(err);
      setInfo("Gagal menyimpan data 😭");
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="photo-page">
      <Navbar />
      <div className="photo-card">
        <h2 className="title">Input Nutrisi Manual</h2>

        <form onSubmit={handleSubmit} className="manual-form">
          {Object.entries(formData).map(([key, val]) => (
            <div className="form-group" key={key}>
              <label htmlFor={key}>
                {icons[key.charAt(0).toUpperCase() + key.slice(1)] || <FaAppleAlt />}<span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              </label>
              <input
                id={key}
                type="number"
                name={key}
                min="0"
                value={val}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          ))}

          {info && <p style={{ marginBottom: "12px" }}>{info}</p>}

          <div className="btn-row">
            <Button 
              bgCol="green" type="submit">Simpan</Button>
            <Button
              bgCol="red"
              type="button"
              onClick={() =>
                setFormData({
                  kalori: 0,
                  carbs: 0,
                  protein: 0,
                  fat: 0,
                  sugar: 0,
                  salt: 0,
                })
              }
            >
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
