import React, { useState } from "react";
import { uploadImage } from "../services/api";
import Button from "../components/Button";
import "./FormPhoto.css";
import { decrypt } from "../crypt";
import Cookies from "js-cookie"
import axios from "axios";

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [nutrientData, setNutrientData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Tambahkan state loading
  const [isValid, setIsValid] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const handleFileChange = (event) => {
    setSelectedImage(event.target.files[0]);
    setError("");
  };

  const handleCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      setError("Please select or capture an image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    // Set loading state to true when the upload starts
    setLoading(true);
    setError(""); // Clear any previous errors

    try {
      const result = await uploadImage(formData);
      console.log(result.nutrients[0]);
      setNutrientData(result.nutrients);
      setError("");
      setShowButton(true)
    } catch (err) {
      setError(err.message);
    } finally {
      // Set loading state to false when the upload is finished
      setLoading(false);
    }
  };

  const handleMakan = async (e) =>{
    e.preventDefault()
    const account = decrypt(Cookies.get("enc"))
    const data = {
      BMR:nutrientData[0].kalori || 0,
      carbs:nutrientData[0].karbohidrat || 0,
      protein:nutrientData[0].protein || 0,
      salt:nutrientData[0].garam || 0,
      sugar:nutrientData[0].gula || 0,
      fat:nutrientData[0].lemak || 0,
      userId:account.user._id
    }

    console.log(data)

    try{
      const response = await axios.post("https://nutriject-server.vercel.app/user/makan", data);
      console.log(response.data);
      setIsValid(true);
      setIsError(false);
      setShowButton(false)
    }catch(err){
      console.log(err);
      setIsValid(false);
      setIsError(true);
    }
  }

  const handleCancle = () => {
    window.location.reload()
  }
  

  return (
    <div>
      <h1>Extract Nutrients</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Image</button>
      <br />
      <input
        type="file"
        accept="image/*"
        capture="camera"
        onChange={handleCapture}
      />
      <button onClick={handleUpload}>Capture Image</button>

      {loading && <p>Loading...</p>} {/* Tampilkan loading saat state loading true */}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <h3>Extracted Nutrient Data:</h3>
        {nutrientData.length > 0 ? (
          <ul>
            {nutrientData.map((item, index) => (
              <li key={index} style={{color:"black"}}>
                <strong>{item.nama.toUpperCase()}</strong>: <br/>
                Karbohidrat: {item.karbohidrat}g<br/>
                Protein:{" "}{item.protein}g<br/>
                Lemak: {item.lemak}g<br/>
                Kalori: {item.kalori}kcal<br/>
                Gula:{" "}{item.gula}g<br/>
                Garam: {item.garam}mg<br/>
                Air: {item.air}%<br/>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{color:"black"}}>No data extracted yet.</p>
        )}
      </div>
      {isValid  ? <p style={{color:"green"}}>Data berhasil ditambahkan</p> : isError ? <p style={{color:"red"}}>Coba beberapa saat lagi</p> : ""}
      {showButton ?
      <>
      
       <Button onClick={handleMakan}  style={{ marginTop: "5px", marginBottom: "20px" }}>
          Makan
          </Button>

          <Button onClick={handleCancle}  bgCol={'red'} style={{marginTop: "5px", marginBottom: "20px" }}>
            Cancel
          </Button> 
      </>
          : ""}
    </div>
  );
};

export default ImageUpload;
