/* eslint-disable */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '../../firebase-config';
import './UserForm.css';
import { decrypt } from '../../crypt';
import Cookies from 'js-cookie';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProgressBar from '../../components/ProgressBar'; // Assuming ProgressBar is a reusable component
import {
  FaBirthdayCake,
  FaVenusMars,
  FaRulerVertical,
  FaWeight,
  FaRunning,
} from 'react-icons/fa';

const UserForm = () => {
  const enc = Cookies.get('enc');
  const userObj = enc ? decrypt(enc) : null;
  const email = userObj?.email;
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    activity: '',
  });

  const [results, setResults] = useState(null); // hitung TDEE dll
  const [diagrams, setDiagrams] = useState({
    kalori: 0,
    karbohidrat: 0,
    protein: 0,
    lemak: 0,
    gula: 0,
    garam: 0,
    air: 0,
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { age, gender, height, weight, activity } = formData;
    if (!age || !gender || !height || !weight || !activity) {
      return alert('Harap isi semua data!');
    }

    setLoading(true);
    setSuccessMessage('');
    const ageN = +age,
      h = +height,
      w = +weight;
    const BMR =
      gender === 'male'
        ? 88.362 + 13.397 * w + 4.799 * h - 5.677 * ageN
        : 447.593 + 9.247 * w + 3.098 * h - 4.33 * ageN;

    const factor =
      {
        very_light: 1.2,
        light: 1.375,
        moderate: 1.55,
        heavy: 1.725,
        very_heavy: 1.9,
      }[activity] || 1;
    const TDEE = BMR * factor;

    const calc = {
      BMR,
      TDEE,
      carbsMin: (0.45 * TDEE) / 4,
      carbsMax: (0.65 * TDEE) / 4,
      proteinMin: (0.1 * TDEE) / 4,
      proteinMax: (0.35 * TDEE) / 4,
      fatMin: (0.2 * TDEE) / 9,
      fatMax: (0.35 * TDEE) / 9,
      sugarMin: (0.05 * TDEE) / 4,
      sugarMax: (0.1 * TDEE) / 4,
      saltMin: 500,
      saltMax: 2000,
      waterRequirement: w * 35,
    };
    setResults(calc);

    setDiagrams({
      kalori: 0,
      karbohidrat: 0,
      protein: 0,
      lemak: 0,
      gula: 0,
      garam: 0,
      air: 0,
    });

    try {
      const usersQ = query(
        collection(db, 'users'),
        where('email', '==', email),
        limit(1)
      );
      const snap = await getDocs(usersQ);
      if (snap.empty) {
        await addDoc(collection(db, 'users'), { email, ...formData, ...calc });
      } else {
        await setDoc(
          snap.docs[0].ref,
          { email, ...formData, ...calc },
          { merge: true }
        );
      }

      await addDoc(collection(db, 'reports'), {
        email,
        tanggal: new Date().toISOString().split('T')[0],
        carbs: 0,
        protein: 0,
        fat: 0,
        sugar: 0,
        salt: 0,
        kalori: 0,
      });

      // Navigate to personalize and show a toast message there
      navigate('/personalize', { state: { toast: 'Perhitungan berhasil' } });
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan ke database!');
    } finally {
      setLoading(false);
    }
  };

  const renderBar = (label, min, max, valKey) => {
    min = min ?? 0;
    max = max ?? 100;
    const value = diagrams[valKey] || 0;
    const pct = Math.min(value / max, 1) * 100;

    return (
      <div className="diagram-container" key={label}>
        <label>
          <strong>{label}</strong>
        </label>
        <div className="diagram">
          <div
            className="diagram-min-line"
            style={{ left: `${(min / max) * 100}%` }}
          ></div>
          <div className="diagram-bar">
            <div className="diagram-bar-filled" style={{ width: `${pct}%` }} />
          </div>
          <div className="diagram-label-left">{min.toFixed(0)}</div>
          <div className="diagram-label-right">{max.toFixed(0)}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-8 pt-20">
      <Navbar />

      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white shadow rounded-lg p-6 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Personal Data</h2>
            <p className="text-sm text-gray-500">
              Isi data untuk mendapatkan rekomendasi nutrisi harian
            </p>
          </div>

          {successMessage && (
            <div className="mt-4 p-3 bg-green-50 border border-green-100 text-green-800 rounded">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Umur (tahun)
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaBirthdayCake className="w-5 h-5" />
                  </div>
                  <input
                    inputMode="numeric"
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="0"
                    required
                    className="mt-0 block w-full border border-gray-200 rounded-md px-3 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="e.g. 30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <FaVenusMars className="w-5 h-5" />
                  </div>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="mt-0 block w-full border border-gray-200 rounded-md px-3 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  >
                    <option value="">Pilih</option>
                    <option value="male">Laki-laki</option>
                    <option value="female">Perempuan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tinggi (cm)
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <FaRulerVertical className="w-5 h-5" />
                  </div>
                  <input
                    inputMode="numeric"
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    min="0"
                    required
                    className="mt-0 block w-full border border-gray-200 rounded-md px-3 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="e.g. 170"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Berat (kg)
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <FaWeight className="w-5 h-5" />
                  </div>
                  <input
                    inputMode="numeric"
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    min="0"
                    required
                    className="mt-0 block w-full border border-gray-200 rounded-md px-3 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="e.g. 65"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Aktivitas
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <FaRunning className="w-5 h-5" />
                  </div>
                  <select
                    name="activity"
                    value={formData.activity}
                    onChange={handleChange}
                    required
                    className="mt-0 block w-full border border-gray-200 rounded-md px-3 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  >
                    <option value="">Pilih</option>
                    <option value="very_light">Sangat Ringan</option>
                    <option value="light">Ringan</option>
                    <option value="moderate">Sedang</option>
                    <option value="heavy">Berat</option>
                    <option value="very_heavy">Sangat Berat</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center sm:items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex justify-center items-center px-5 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 focus:outline-none disabled:opacity-60"
              >
                {loading ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                ) : null}
                Hitung
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    age: '',
                    gender: '',
                    height: '',
                    weight: '',
                    activity: '',
                  });
                  setResults(null);
                  setDiagrams({
                    kalori: 0,
                    karbohidrat: 0,
                    protein: 0,
                    lemak: 0,
                    gula: 0,
                    garam: 0,
                    air: 0,
                  });
                  setSuccessMessage('');
                }}
                className="w-full sm:w-auto px-4 py-3 border rounded-lg text-sm"
              >
                Reset
              </button>
            </div>
          </form>

          {results && (
            <section id="results-section" className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Rekomendasi Harian</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1">
                  <ProgressBar
                    label="Kalori"
                    min={0}
                    max={results.TDEE}
                    val={diagrams.kalori}
                    color="#FF6600"
                  />
                </div>
                <div className="col-span-1">
                  <ProgressBar
                    label="Karbohidrat"
                    min={results.carbsMin}
                    max={results.carbsMax}
                    val={diagrams.karbohidrat}
                    color="#FF6600"
                  />
                </div>
                <div className="col-span-1">
                  <ProgressBar
                    label="Protein"
                    min={results.proteinMin}
                    max={results.proteinMax}
                    val={diagrams.protein}
                    color="#FF6600"
                  />
                </div>
                <div className="col-span-1">
                  <ProgressBar
                    label="Lemak"
                    min={results.fatMin}
                    max={results.fatMax}
                    val={diagrams.lemak}
                    color="#FF6600"
                  />
                </div>
                <div className="col-span-1">
                  <ProgressBar
                    label="Gula"
                    min={results.sugarMin}
                    max={results.sugarMax}
                    val={diagrams.gula}
                    color="#FF6600"
                  />
                </div>
                <div className="col-span-1">
                  <ProgressBar
                    label="Garam"
                    min={results.saltMin}
                    max={results.saltMax}
                    val={diagrams.garam}
                    color="#FF6600"
                  />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <ProgressBar
                    label="Air (ml)"
                    min={0}
                    max={results.waterRequirement}
                    val={diagrams.air}
                    color="#FF6600"
                  />
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserForm;
