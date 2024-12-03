import React, { useEffect, useState } from "react";
import { db, getDoc } from "../firebase-config";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

const UserForm = ( {ocrText} ) => {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    activity: '',
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
    const docRef = doc(db, "info", "wgI66JZDlk9dTOkdokIL"); // Referensi dokumen
  
    // Listener untuk perubahan data
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Real-time data from Firestore:", data);
  
          // Perbarui state dengan data dari Firestore
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
  
    // Cleanup listener saat komponen di-unmount
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
      alert('Harap isi semua data!');
      return;
    }

    const ageNum = parseFloat(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (isNaN(ageNum) || isNaN(heightNum) || isNaN(weightNum)) {
      alert('Input harus berupa angka!');
      return;
    }

    let BMR = 0;
    if (gender === 'male') {
      BMR = 88.362 + (13.397 * weightNum) + (4.799 * heightNum) - (5.677 * ageNum);
    } else if (gender === 'female') {
      BMR = 447.593 + (9.247 * weightNum) + (3.098 * heightNum) - (4.330 * ageNum);
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
    }

    console.log(resu);

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
      const docRef = doc(db, "info", "wgI66JZDlk9dTOkdokIL"); // Ganti path koleksi & dokumen sesuai kebutuhan

      // Ambil data awal dari Firestore
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

      // Perbarui data di Firestore
      await setDoc(docRef, updatedData);

      alert("Proses Berhasil !!!");
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
    const valueToDisplay = (typeof value === 'number' && !isNaN(value)) ? value : 0; // Nilai default untuk value
    const maxToDisplay = max || 100;
    
    return (
      <div style={{ marginBottom: '20px' }}>
        <label ><strong>{label}:</strong></label>
        <div style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '10px',
          width: '100%',
        }}>
          {label !== "Air" && label !== "Kalori" && (
            <>
              {/* Garis Merah untuk Min */}
              <div style={{
                position: 'absolute',
                top: '10%',
                left: `${(min / maxToDisplay) * 100}%`,
                width: '2px',
                height: '100%',
                backgroundColor: 'blue',
                zIndex: 1,
              }}></div>

              <div style={{
                position: 'absolute',
                top: '-13px',
                left: `${(min / maxToDisplay) * 100}%`,
                transform: 'translateX(-50%)',
                fontSize: '12px',
                color: '#000',
              }}>
                {min.toFixed(2)}
              </div>
            </>
          )}

  
          {/* Diagram */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            height: '20px',
            position: 'relative',
            marginTop: '8px'
          }}>
            {/* Bagian sebelum nilai slider */}
            <div
              style={{
                height: '100%',
                backgroundColor: '#4caf50',
                width: `${(valueToDisplay / maxToDisplay) * 100}%`,
              }}
            ></div>
            {/* Bagian setelah nilai slider */}
            <div
              style={{
                height: '100%',
                backgroundColor: '#ddd',
                width: `${((maxToDisplay - valueToDisplay) / maxToDisplay) * 100}%`,
              }}
            ></div>
          </div>
  
          {/* Text yang mengikuti pergerakan slider */}
          <div style={{
            position: 'absolute',
            top: '-25px',
            left: `${(valueToDisplay / maxToDisplay) * 100}%`,
            transform: 'translateX(-50%)',
            fontSize: '12px',
            margin: '10px',
            fontWeight: 'bold',
            color: '#000',
            zIndex: 2,
          }}>
            {valueToDisplay.toFixed(2)}
          </div>
  
          {/* Label 0 (di kiri diagram) */}
          <div style={{
            position: 'absolute',
            bottom: '-20px',
            left: '0',
            fontSize: '12px',
            color: '#fff',
          }}>
            0
          </div>
  
          {/* Label Max (di kanan diagram) */}
          <div style={{
            position: 'absolute',
            bottom: '-20px',
            right: '0',
            fontSize: '12px',
            color: '#fff',
          }}>
            {maxToDisplay.toFixed(2)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2>Form Data Pengguna</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Umur (tahun):
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="0"
            />
          </label>
        </div>
        <div>
          <label>
            Gender:
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Pilih Gender</option>
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Tinggi Badan (cm):
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
              min="0"
            />
          </label>
        </div>
        <div>
          <label>
            Berat Badan (kg):
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
              min="0"
            />
          </label>
        </div>
        <div>
          <label>
            Aktivitas Harian:
            <select name="activity" value={formData.activity} onChange={handleChange} required>
              <option value="">Pilih Aktivitas</option>
              <option value="very_light">Sangat Ringan</option>
              <option value="light">Ringan</option>
              <option value="moderate">Sedang</option>
              <option value="heavy">Berat</option>
              <option value="very_heavy">Sangat Berat</option>
            </select>
          </label>
        </div>
        <button type="submit">Hitung</button>
      </form>

      {results && (
        <div>
          <h3>Hasil Perhitungan</h3>
          {renderDiagram('Kalori', 0, results.TDEE, kalori, setKalori)}
          {renderDiagram('Karbohidrat', results.carbsMin, results.carbsMax, karbohidrat, setKarbohidrat)}
          {renderDiagram('Protein', results.proteinMin, results.proteinMax, protein, setProtein)}
          {renderDiagram('Lemak', results.fatMin, results.fatMax, lemak, setLemak)}
          {renderDiagram('Gula', results.sugarMin, results.sugarMax, gula, setGula)}
          {renderDiagram('Garam', results.saltMin, results.saltMax, garam, setGaram)}
          {renderDiagram('Air', 0, results.waterRequirement, air, setAir)}
        </div>
      )}
    </div>
  );
};

export default UserForm;
