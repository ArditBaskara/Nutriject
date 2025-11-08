import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Toast from "../../components/Toast";
import { FaUserCircle, FaCalendarDay, FaSignOutAlt, FaCamera, FaBarcode, FaKeyboard } from 'react-icons/fa';
import ProgressBar from "../../components/ProgressBar";
import "./Personalize.css";
import { decrypt } from "../../crypt";
import Cookies from "js-cookie";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Box from "../../components/Box";
import kemasan2 from '../../assets/kemasan2.png';
import kemasan1 from '../../assets/kemasan1.jpg';
import kemasan7 from '../../assets/kemasan7.png';
import {
  db,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from "../../firebase-config";

const imageList1 = [kemasan1];
const imageList2 = [kemasan2];
const imageList3 = [kemasan7];

export default function Personalize() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [carbs, setCarbs] = useState(0);
  const [protein, setProtein] = useState(0);
  const [salts, setSalts] = useState(0);
  const [sugar, setSugar] = useState(0);
  const [fat, setFat] = useState(0);
  const [tanggal, setTanggal] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);  // State for modal visibility
  const [hasReport, setHasReport] = useState(false);
  const location = useLocation();
  const [toastMessage, setToastMessage] = useState('');

  const onDetect = () => navigate("/ocr");
  const onBack = () => navigate("/");

  const enc = Cookies.get("enc");
  const user = enc ? decrypt(enc) : null;
  const email = user?.email;

  const onLogout = () => {
    Cookies.remove("enc");  // Clear the cookie
    navigate("/");  // Redirect to homepage
  };

  const onStartEating = () => {
    setShowModal(true);  // Show the modal when clicked
  };

  useEffect(() => {
    if (!email) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];

        const usersQ = query(
          collection(db, "users"),
          where("email", "==", email),
          limit(1)
        );
        const usersSnap = await getDocs(usersQ);
        if (usersSnap.empty) {
          // user not found in firestore, continue but show message
          setUserData(null);
        } else {
          const userDoc = usersSnap.docs[0].data();
          setUserData(userDoc);
        }

        const reportsQ = query(
          collection(db, "reports"),
          where("email", "==", email),
          where("tanggal", "==", today),
          limit(1)
        );
        const reportsSnap = await getDocs(reportsQ);
        if (reportsSnap.empty) {
          // no report for today — show friendly empty state instead of throwing
          setHasReport(false);
        } else {
          const rpt = reportsSnap.docs[0].data();
          setHasReport(true);

          setCarbs(rpt.carbs || 0);
          setProtein(rpt.protein || 0);
          setSalts(rpt.salt || 0);
          setSugar(rpt.sugar || 0);
          setFat(rpt.fat || 0);
          setTanggal(rpt.tanggal || "-");
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, [email]);

  // Show toast message passed via navigation state (e.g., after form submit)
  useEffect(() => {
    if (location && location.state && location.state.toast) {
      setToastMessage(location.state.toast);
      // remove state so it doesn't reappear on refresh/navigation
      try {
        window.history.replaceState({}, document.title);
      } catch (e) {
        // ignore
      }
    }
  }, [location]);

  if (loading) return <p>Loading...</p>;
  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Oops</h3>
        <p className="text-sm text-gray-600">{error}</p>
        <div className="mt-4 flex gap-2">
          <button onClick={() => navigate('/')} className="px-4 py-2 bg-orange-500 text-white rounded">Kembali</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 mt-4">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-orange-500">
                <FaUserCircle className="w-10 h-10" />
              </div>
              <div className="py-auto">
                <h1 className="text-2xl font-bold m-0">Hello, <span className="text-orange-500">{userData?.name || 'Guest'}</span></h1>
                <div className="text-main text-gray-500 flex items-center gap-2"><FaCalendarDay className="text-gray-400" /> <span>{tanggal || 'Belum ada laporan'}</span></div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={onStartEating} className="px-4 py-2 bg-orange-500 text-white rounded-md shadow">Start Eating</button>
              <button onClick={() => navigate('/')} className="px-3 py-2 border rounded-md text-sm">Kembali</button>
              <button onClick={onLogout} className="px-3 py-2 bg-red-50 text-red-600 rounded-md flex items-center gap-2"><FaSignOutAlt /> Logout</button>
            </div>
          </div>

          <div className="mt-6">
            {hasReport && userData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="text-xl font-bold text-gray-600">Nutritional intake today</div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">BMR</div>
                    <div className="text-lg font-bold text-gray-800">{userData.BMR ? userData.BMR.toFixed(2) : '-'}</div>
                  </div>

                  {/* Unified list of progress bars: show all five in logical order and stack on small screens */}
                  <div className="mt-4 space-y-3">
                    <ProgressBar label="Karbohidrat" min={userData.carbsMin || 0} max={userData.carbsMax || 0} val={carbs} color="#FF6600" />
                    <ProgressBar label="Protein" min={userData.proteinMin || 0} max={userData.proteinMax || 0} val={protein} color="#FF6600" />
                    <ProgressBar label="Lemak" min={userData.fatMin || 0} max={userData.fatMax || 0} val={fat} color="#FF6600" />
                    <ProgressBar label="Gula" min={userData.sugarMin || 0} max={userData.sugarMax || 0} val={sugar} color="#FF6600" />
                    <ProgressBar label="Garam" min={userData.saltMin || 0} max={userData.saltMax || 0} val={salts} color="#FF6600" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-md font-semibold text-gray-700">Ringkasan</h4>
                    <div className="mt-3 text-sm text-gray-600 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Nama</span>
                        <span className="font-medium">{userData.name || '-'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Tanggal</span>
                        <span className="font-medium">{tanggal || '-'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Target Kalori</span>
                        <span className="font-medium">{userData.TDEE ? Math.round(userData.TDEE) : '-'}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button onClick={() => navigate('/data')} className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md">Hitung Kebutuhan Gizi Kembali</button>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="text-sm text-gray-600">Tips singkat</div>
                    <ul className="mt-2 text-sm text-gray-700 list-disc list-inside space-y-1">
                      <li>Perbanyak sumber protein untuk pemulihan otot.</li>
                      <li>Batasi gula olahan untuk kontrol energi jangka panjang.</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-gray-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Belum ada laporan kebutuhan gizi</h3>
                <p className="text-sm text-gray-600 mb-4">Kamu belum memiliki laporan kebutuhan gizi harian. Ayo mulai dengan menghitung kebutuhan gizimu dengan kalkulator gizi kami.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <button onClick={() => navigate('/data')} className="px-4 py-2 bg-orange-500 text-white rounded-md">Kalkulator Gizi</button>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <img src={kemasan1} alt="sample" className="w-full h-20 object-cover rounded-md" />
                  <img src={kemasan2} alt="sample" className="w-full h-20 object-cover rounded-md" />
                  <img src={kemasan7} alt="sample" className="w-full h-20 object-cover rounded-md" />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal for Start Eating */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* backdrop (click to close) */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} aria-hidden="true"></div>

          <div role="dialog" aria-modal="true" className="relative bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4 p-6 max-h-[90vh] overflow-auto">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">Tambahkan Makanan</h3>
                <p className="text-sm text-gray-500">Pilih metode untuk menambahkan makanan ke laporan hari ini.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 p-2" aria-label="Tutup modal">✕</button>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <button
                onClick={() => { setShowModal(false); navigate('/ocr'); }}
                className="w-full text-left p-4 bg-white rounded-lg border hover:shadow-md transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-orange-300"
                aria-label="Mulai dengan OCR"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                    <FaBarcode className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">NutriScan (OCR)</div>
                    <div className="text-sm text-gray-500">Pindai label nutrisi dari foto kemasan.</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => { setShowModal(false); navigate('/photo'); }}
                className="w-full text-left p-4 bg-white rounded-lg border hover:shadow-md transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-orange-300"
                aria-label="Mulai dengan deteksi gambar"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                    <FaCamera className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">FoodSnap (Foto)</div>
                    <div className="text-sm text-gray-500">Ambil foto makanan untuk deteksi otomatis.</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => { setShowModal(false); navigate('/manual'); }}
                className="w-full text-left p-4 bg-white rounded-lg border hover:shadow-md transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-orange-300"
                aria-label="Mulai input manual"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                    <FaKeyboard className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Manual NutriLog</div>
                    <div className="text-sm text-gray-500">Masukkan data gizi secara manual.</div>
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-4 text-right">
              <button className="px-4 py-2 bg-gray-100 rounded-md text-sm" onClick={() => setShowModal(false)}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      {/* Toast (if navigated with state) */}
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
}
