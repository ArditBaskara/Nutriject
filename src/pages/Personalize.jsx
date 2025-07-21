import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProgressBar from "../components/ProgressBar";
import "./Personalize.css";
import { decrypt } from "../crypt";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Box from "../components/Box";
import kemasan2 from '../assets/kemasan2.png';
import kemasan1 from '../assets/kemasan1.jpg';
import kemasan7 from '../assets/kemasan7.png';
import {
  db,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from "../firebase-config";

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
        if (usersSnap.empty) throw new Error("User not found");
        const userDoc = usersSnap.docs[0].data();

        const reportsQ = query(
          collection(db, "reports"),
          where("email", "==", email),
          where("tanggal", "==", today),
          limit(1)
        );
        const reportsSnap = await getDocs(reportsQ);
        if (reportsSnap.empty) throw new Error("Belum ada report");

        const rpt = reportsSnap.docs[0].data();

        setUserData(userDoc);
        setCarbs(rpt.carbs || 0);
        setProtein(rpt.protein || 0);
        setSalts(rpt.salt || 0);
        setSugar(rpt.sugar || 0);
        setFat(rpt.fat || 0);
        setTanggal(rpt.tanggal || "-");

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, [email]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="personalize-container">
      <Navbar />
      <div className="personalize-card">
        <h1 className="personalize-title">
          Hello <span>{userData?.name || "Guest"}</span>!
        </h1>

        {userData.BMR ? (
        <>
          <p className="personalize-date">Tanggal: {tanggal}</p>

          {!userData && <p className="personalize-bmr">BMR: {userData.BMR.toFixed(2) || 0}</p>}
          
          <div className="progress-wrapper">
            {userData && (
              <>
                <ProgressBar
                  label="Karbohidrat"
                  min={userData.carbsMin || 0}
                  max={userData.carbsMax || 0}
                  val={carbs}
                  color="#FF6600"
                />
                <ProgressBar
                  label="Garam"
                  min={userData.saltMin || 0}
                  max={userData.saltMax || 0}
                  val={salts}
                  color="#FF6600"
                />
                <ProgressBar
                  label="Protein"
                  min={userData.proteinMin || 0}
                  max={userData.proteinMax || 0}
                  val={protein}
                  color="#FF6600"
                />
                <ProgressBar
                  label="Gula"
                  min={userData.sugarMin || 0}
                  max={userData.sugarMax || 0}
                  val={sugar}
                  color="#FF6600"
                />
                <ProgressBar
                  label="Lemak"
                  min={userData.fatMin || 0}
                  max={userData.fatMax || 0}
                  val={fat}
                  color="#FF6600"
                />
              </>
            )}
          </div>
        </>) : 
        <p className="alert-needs">There is no nutritional needs data yet, please generate it first.</p>
      }

          <div className="double-button">
            <button className="dangger-button" onClick={onLogout}>
              Logout
            </button>
            <button className="get-started-button back" onClick={()=>navigate("/")}>
              Kembali
            </button>
            {userData.BMR ?
            <button className="get-started-button" onClick={onStartEating}>
              Start Eating
            </button>:
            ""
            }
          </div>
        </div>
      {/* Modal for Start Eating */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div id="service" className="d-flex justify-center scroll-section">
              <Box images={imageList1} title="NutriScan OCR" claimText="Scan Nutri Facts Instantly" registerText="" navto="/ocr" />
              <Box images={imageList2} title="FoodSnap Nutrition" claimText="Snap and See Nutritional Insights" registerText="" navto="/photo" />
              <Box images={imageList3} title="Manual NutriLog" claimText="Track Nutrition the Classic Way" registerText="" navto="/manual" />
            </div>
            <button className="warning-button" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
