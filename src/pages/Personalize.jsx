import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProgressBar from "../components/ProgressBar";
import "./Personalize.css";
import { decrypt } from "../crypt";
import Cookies from "js-cookie";

export default function Personalize() {
    const navigate = useNavigate();

    // State untuk menyimpan data pengguna
    const [userData, setUserData] = useState(null); // Default null agar dapat memeriksa apakah data sudah siap
    const [carbs, setCarbs] = useState(0);
    const [protein, setProtein] = useState(0);
    const [salts, setSalts] = useState(0);
    const [sugar, setSugar] = useState(0);
    const [fat, setFat] = useState(0);
    const [tanggal, setTanggal] = useState(""); // Default string kosong
    const [loading, setLoading] = useState(true); // State untuk menunjukkan status loading
    const [error, setError] = useState(null); // State untuk menyimpan pesan error

    const onDetect = () => {
        navigate("/ocr");
    };

    const onBack = () => {
        navigate("/");
    };

    const user = decrypt(Cookies.get("enc"))
    console.log("Decrypted user")
    console.log(user.user._id)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://nutriject-server.vercel.app/user/report", {
                    params: { userId: '67505a5ee5eaf23d12160512' },
                });
                const res = response.data.combined;
                console.log("RES");
                console.log(response)
                // Simpan data ke dalam state
                setUserData(res.user);
                setFat(res.fat);
                setCarbs(res.carbs);
                setProtein(res.protein);
                setSalts(res.salt);
                setSugar(res.sugar);
                setTanggal(res.tanggal);

                setLoading(false); // Loading selesai
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data. Please try again."); // Simpan pesan error
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Tampilkan pesan loading atau error jika ada
    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    // Render halaman jika data sudah tersedia
    return (
        <div className="pages">
            <div className="contents">
                <h1>Hello Keyzar!</h1>
                <h3>Tanggal : {tanggal}</h3>

                {/* Pastikan userData sudah ada sebelum mengakses properti */}
                {userData && <p>BMR : {userData.BMR}</p>}
            
                <div className="p-bar">
                    {/* Gunakan conditional rendering untuk ProgressBar */}
                    {userData && (
                        <>
                            <ProgressBar
                                label={"Karbohidrat"}
                                min={userData.carbsMin}
                                max={userData.carbsMax}
                                val={carbs}
                                color="#FF6600"
                            />
                            <ProgressBar
                                label={"Garam"}
                                min={userData.saltMin}
                                max={userData.saltMax}
                                val={salts}
                                color="#FF6600"
                            />
                            <ProgressBar
                                label={"Protein"}
                                min={userData.proteinMin}
                                max={userData.proteinMax}
                                val={protein}
                                color="#FF6600"
                            />
                            <ProgressBar
                                label={"Gula"}
                                min={userData.sugarMin}
                                max={userData.sugarMax}
                                val={sugar}
                                color="#FF6600"
                            />
                            <ProgressBar
                                label={"Lemak"}
                                min={userData.fatMin}
                                max={userData.fatMax}
                                val={fat}
                                color="#FF6600"
                            />
                        </>
                    )}
                </div>
                <div className="all-button">
                    <button className="get-started-button" onClick={onBack}>Back</button>
                    <button className="get-started-button" onClick={onDetect}>Deteksi Makanan</button>
                </div>
            </div>
        </div>
    );
}
