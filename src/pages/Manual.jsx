import React, { useEffect, useState } from "react";
import { db, getDoc } from "../firebase-config";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import "./FormPhoto.css"; // Import CSS file for styling
import axios from "axios";
import { decrypt } from "../crypt";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";
import "./UserForm.css"

const Manual = ({ ocrText }) => {
  const [formData, setFormData] = useState({
    BMR: "",
    carbs: "",
    protein: "",
    fat: "",
    sugar: "",
    salt:""
  });
  const [isResponding, setIsResponding] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: Number(value),
    });
  };

  
  const handleSubmit = async(e) => {
    e.preventDefault();
    const user = decrypt(Cookies.get("enc"));
    const userDat = user.user;
    const combined = {...formData, userId:userDat._id}
    try {
        // Kirim data ke server menggunakan axios
        const res = await axios.post(
          "https://nutriject-server.vercel.app/user/makan",
          combined
        );
    
        // Jika berhasil, set `isResponding` ke true
        setIsResponding(true);
    
        // Kosongkan formData
        setFormData({
          BMR: "",
          carbs: "",
          protein: "",
          fat: "",
          sugar: "",
          salt: ""
        }); // Reset ke nilai awal
      } catch (err) {
        console.error("Axios Failed: ", err);
      } 
    
  };


  return (
    <div>
      <Navbar/>
      <div className="user-form-container">
        <h2>Masukan nilai gizi</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Kalori :</label>
            <input
              type="number"
              name="BMR"
              value={formData.BMR}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Karbohidrat :</label>
            <input
              type="number"
              name="carbs"
              value={formData.carbs}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Garam /Natrium:</label>
            <input
              type="number"
              name="salt"
              value={formData.salt}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Lemak :</label>
            <input
              type="number"
              name="fat"
              value={formData.fat}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Gula :</label>
            <input
              type="number"
              name="sugar"
              value={formData.sugar}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Protein :</label>
            <input
              type="number"
              name="protein"
              value={formData.protein}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          {isResponding ? <p style={{color:'green'}}>Data berhasil diperbarui</p> : ""}
          <button type="submit" className="submit-button">Masukan Data</button>
        </form>
      </div>
    </div>
  );
};

export default Manual;
