import { useEffect, useState } from "react";
import {
  db,
  collection,
  query,
  where,
  limit,
  getDocs,
  addDoc,
  setDoc,
  orderBy,
} from "../firebase-config";
import "./UserForm.css";
import { decrypt } from "../crypt";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProgressBar from "../components/ProgressBar"; // Assuming ProgressBar is a reusable component

const UserForm = () => {
  const enc = Cookies.get("enc");
  const userObj = enc ? decrypt(enc) : null;
  const email = userObj?.email;
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    activity: "",
  });

  const [results, setResults] = useState(null); // hitung TDEE dll
  const [diagrams, setDiagrams] = useState({
    kalori: 0, karbohidrat: 0, protein: 0,
    lemak: 0, gula: 0, garam: 0, air: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { age, gender, height, weight, activity } = formData;
    if (!age || !gender || !height || !weight || !activity) {
      return alert("Harap isi semua data!");
    }

    const ageN = +age, h = +height, w = +weight;
    const BMR = gender === "male"
      ? 88.362 + 13.397 * w + 4.799 * h - 5.677 * ageN
      : 447.593 + 9.247 * w + 3.098 * h - 4.33 * ageN;

    const factor = { very_light: 1.2, light: 1.375, moderate: 1.55, heavy: 1.725, very_heavy: 1.9 }[activity] || 1;
    const TDEE = BMR * factor;

    const calc = {
      BMR, TDEE,
      carbsMin: (0.45 * TDEE) / 4, carbsMax: (0.65 * TDEE) / 4,
      proteinMin: (0.1 * TDEE) / 4, proteinMax: (0.35 * TDEE) / 4,
      fatMin: (0.2 * TDEE) / 9, fatMax: (0.35 * TDEE) / 9,
      sugarMin: (0.05 * TDEE) / 4, sugarMax: (0.1 * TDEE) / 4,
      saltMin: 500, saltMax: 2000,
      waterRequirement: w * 35,
    };
    setResults(calc);

    setDiagrams({
      kalori: 0, karbohidrat: 0, protein: 0, lemak: 0, gula: 0, garam: 0, air: 0,
    });

    try {
      const usersQ = query(collection(db, "users"), where("email", "==", email), limit(1));
      const snap = await getDocs(usersQ);
      if (snap.empty) {
        await addDoc(collection(db, "users"), { email, ...formData, ...calc });
      } else {
        await setDoc(snap.docs[0].ref, { email, ...formData, ...calc }, { merge: true });
      }

      await addDoc(collection(db, "reports"), {
        email,
        tanggal: new Date().toISOString().split("T")[0],
        carbs: 0, protein: 0, fat: 0, sugar: 0, salt: 0, kalori: 0,
      });

    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan ke database!");
    }
  };

  const renderBar = (label, min, max, valKey) => {
    min = min ?? 0;
    max = max ?? 100;
    const value = diagrams[valKey] || 0;
    const pct = Math.min(value / max, 1) * 100;

    return (
      <div className="diagram-container" key={label}>
        <label><strong>{label}</strong></label>
        <div className="diagram">
          <div className="diagram-min-line" style={{ left: `${(min / max) * 100}%` }}></div>
          <div className="diagram-bar">
            <div className="diagram-bar-filled" style={{ width: `${pct}%` }} />
          </div>
          <div className="diagram-label-left">{min.toFixed(0)}</div>
          <div className="diagram-label-right">{max.toFixed(0)}</div>
        </div>
      </div>
    );
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="userform-page">
      <Navbar />

      <div className="userform-card">
        <h2 className="title">Personal Data</h2>

        <form onSubmit={handleSubmit} className="userform">
          <div className="form-group">
            <label>Umur (tahun)</label>
            <input type="number" name="age" value={formData.age}
              onChange={handleChange} min="0" required />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={formData.gender}
              onChange={handleChange} required>
              <option value="">Pilih</option>
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </select>
          </div>

          <div className="form-group">
            <label>Tinggi (cm)</label>
            <input type="number" name="height" value={formData.height}
              onChange={handleChange} min="0" required />
          </div>

          <div className="form-group">
            <label>Berat (kg)</label>
            <input type="number" name="weight" value={formData.weight}
              onChange={handleChange} min="0" required />
          </div>

          <div className="form-group">
            <label>Aktivitas</label>
            <select name="activity" value={formData.activity}
              onChange={handleChange} required>
              <option value="">Pilih</option>
              <option value="very_light">Sangat Ringan</option>
              <option value="light">Ringan</option>
              <option value="moderate">Sedang</option>
              <option value="heavy">Berat</option>
              <option value="very_heavy">Sangat Berat</option>
            </select>
          </div>

          <button className="submit-btn" type="submit">Hitung</button>
        </form>

        {results && (
          <div className="results">
            <h3>Rekomendasi Harian</h3>
            <ProgressBar label="Kalori" min={0} max={results.TDEE} val={diagrams.kalori} color="#FF6600" />
            <ProgressBar label="Karbohidrat" min={results.carbsMin} max={results.carbsMax} val={diagrams.karbohidrat} color="#FF6600" />
            <ProgressBar label="Protein" min={results.proteinMin} max={results.proteinMax} val={diagrams.protein} color="#FF6600" />
            <ProgressBar label="Lemak" min={results.fatMin} max={results.fatMax} val={diagrams.lemak} color="#FF6600" />
            <ProgressBar label="Gula" min={results.sugarMin} max={results.sugarMax} val={diagrams.gula} color="#FF6600" />
            <ProgressBar label="Garam" min={results.saltMin} max={results.saltMax} val={diagrams.garam} color="#FF6600" />
            <ProgressBar label="Air (ml)" min={0} max={results.waterRequirement} val={diagrams.air} color="#FF6600" />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default UserForm;
