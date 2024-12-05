import React, { useEffect, useState } from "react";
import { db, getDoc } from "../firebase-config";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import "./FormPhoto.css"; // Import CSS file for styling
import axios from "axios";
import { decrypt } from "../crypt";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";
import "./UserForm.css"

const UserForm = ({ ocrText }) => {
  const user = decrypt(Cookies.get("enc"))
  console.log("DECR")
  const datUser = user.user;
  console.log(user.user)
  const [formData, setFormData] = useState({
    age: datUser.age,
    gender: datUser.gender,
    height: datUser.height,
    weight: datUser.weight,
    activity: datUser.activity,
  });

  const [kalori, setKalori] = useState(0);
  const [karbohidrat, setKarbohidrat] = useState(0);
  const [protein, setProtein] = useState(0);
  const [lemak, setLemak] = useState(0);
  const [gula, setGula] = useState(0);
  const [garam, setGaram] = useState(0);
  const [air, setAir] = useState(0);

  const [results, setResults] = useState(null);

  useEffect(() => {
    const docRef = doc(db, "info", "wgI66JZDlk9dTOkdokIL");

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Real-time data from Firestore:", data);

          setKarbohidrat(data.karbohidrat || 0);
          setProtein(data.protein || 0);
          setLemak(data.lemak || 0);
          setGula(data.gula || 0);
          setGaram(data.garam || 0);
          setAir(data.air || 0);
        } else {
          console.log("No such document!");
        }
      },
      (error) => {
        console.error("Error fetching real-time updates:", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const calculateResults = async () => {
    const { age, gender, height, weight, activity } = formData;

    if (!age || !gender || !height || !weight || !activity) {
      alert("Harap isi semua data!");
      return;
    }

    const ageNum = parseFloat(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);



    if (isNaN(ageNum) || isNaN(heightNum) || isNaN(weightNum)) {
      alert("Input harus berupa angka!");
      return;
    }

    let BMR = 0;
    if (gender === "male") {
      BMR = 88.362 + 13.397 * weightNum + 4.799 * heightNum - 5.677 * ageNum;
    } else if (gender === "female") {
      BMR = 447.593 + 9.247 * weightNum + 3.098 * heightNum - 4.33 * ageNum;
    }

    const activityFactors = {
      very_light: 1.2,
      light: 1.375,
      moderate: 1.55,
      heavy: 1.725,
      very_heavy: 1.9,
    };

    const activityFactor = activityFactors[activity] || 1;
    const TDEE = BMR * activityFactor;

    const carbsMin = (0.45 * TDEE) / 4;
    const carbsMax = (0.65 * TDEE) / 4;
    const proteinMin = (0.1 * TDEE) / 4;
    const proteinMax = (0.35 * TDEE) / 4;
    const fatMin = (0.2 * TDEE) / 9;
    const fatMax = (0.35 * TDEE) / 9;
    const sugarMin = (0.05 * TDEE) / 4;
    const sugarMax = (0.1 * TDEE) / 4;
    const saltMin = 500;
    const saltMax = 2000;
    const waterRequirement = weightNum * 35;

    const user = decrypt(Cookies.get("enc"));

    const resu = {
      BMR,
      TDEE,
      carbsMin,
      carbsMax,
      proteinMin,
      proteinMax,
      fatMin,
      fatMax,
      sugarMin,
      sugarMax,
      saltMin,
      saltMax,
      waterRequirement,
      age:ageNum,
      height:heightNum,
      weight:weightNum,
      gender,
      activity,
      userId:user.user._id
    }

    const response = await axios.post("https://nutriject-server.vercel.app/user/update", resu);
    console.log(response);

    setResults({
      BMR,
      TDEE,
      carbsMin,
      carbsMax,
      proteinMin,
      proteinMax,
      fatMin,
      fatMax,
      sugarMin,
      sugarMax,
      saltMin,
      saltMax,
      waterRequirement,
    });

    try {
      const docRef = doc(db, "info", "wgI66JZDlk9dTOkdokIL");

      const docSnap = await getDoc(docRef);
      const currentData = docSnap.exists() ? docSnap.data() : {};

      const updatedData = {
        kalori: 0,
        lemak_total: 0,
        karbohidrat_total: 0,
        protein: 0,
        gula: 0,
        garam: 0,
      };

      await setDoc(docRef, updatedData);

    } catch (error) {
      console.error("Error memperbarui data di Firebase:", error);
      alert("Ada kesalah dalam proses :(");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateResults();
  };

  const renderDiagram = (label, min, max, value, setValue) => {
    const valueToDisplay =
      typeof value === "number" && !isNaN(value) ? value : 0;
    const maxToDisplay = max || 100;

    return (
      <div className="diagram-container">
        <label>
          <strong>{label}:</strong>
        </label>
        <div className="diagram">
          {label !== "Air" && label !== "Kalori" && (
            <>
              <div
                className="diagram-min-line"
                style={{
                  left: `${(min / maxToDisplay) * 100}%`,
                }}
              ></div>
              <div
                className="diagram-min-label"
                style={{
                  left: `${(min / maxToDisplay) * 100}%`,
                }}
              >
                {min.toFixed(2)}
              </div>
            </>
          )}
          <div className="diagram-bar">
            <div
              className="diagram-bar-filled"
              style={{
                width: `${(valueToDisplay / maxToDisplay) * 100}%`,
              }}
            ></div>
            <div
              className="diagram-bar-empty"
              style={{
                width: `${((maxToDisplay - valueToDisplay) / maxToDisplay) *
                  100}%`,
              }}
            ></div>
          </div>
          {/*<div
            className="diagram-value-label"
            style={{
              left: `${(valueToDisplay / maxToDisplay) * 100}%`,
            }}
          >
            {valueToDisplay.toFixed(2)}
          </div>*/}
          <div className="diagram-label-left">0</div>
          <div className="diagram-label-right">
            {maxToDisplay.toFixed(2)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Navbar/>
      <div className="user-form-container">
        <h2>Form Data Pengguna</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Umur (tahun):</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Gender</option>
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </select>
          </div>
          <div className="form-group">
            <label>Tinggi Badan (cm):</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Berat Badan (kg):</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Aktivitas Harian:</label>
            <select
              name="activity"
              value={formData.activity}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Aktivitas</option>
              <option value="very_light">Sangat Ringan</option>
              <option value="light">Ringan</option>
              <option value="moderate">Sedang</option>
              <option value="heavy">Berat</option>
              <option value="very_heavy">Sangat Berat</option>
              </select>
          </div>
          <button type="submit" className="submit-button">Hitung</button>
        </form>

        {results && (
          <div className="results-container">
            <h3>Hasil Perhitungan</h3>
            {renderDiagram("Kalori", 0, results.TDEE, kalori, setKalori)}
            {renderDiagram("Karbohidrat", results.carbsMin, results.carbsMax, karbohidrat, setKarbohidrat)}
            {renderDiagram("Protein", results.proteinMin, results.proteinMax, protein, setProtein)}
            {renderDiagram("Lemak", results.fatMin, results.fatMax, lemak, setLemak)}
            {renderDiagram("Gula", results.sugarMin, results.sugarMax, gula, setGula)}
            {renderDiagram("Garam", results.saltMin, results.saltMax, garam, setGaram)}
            {renderDiagram("Air", 0, results.waterRequirement, air, setAir)}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserForm;
