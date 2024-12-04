import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import axios from "axios";
import UserForm from './UseForm';
import { doc, setDoc } from "firebase/firestore";
import { db, getDoc  } from "../firebase-config";
import { renderDiagram } from "./UseForm";
import Button from "../components/Button"
import { decrypt } from '../crypt';
import Cookies from 'js-cookie';


const PhotoInput = () => {
  const [image, setImage] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [currentData, setCurrentData] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setImage(imageData);
        performOCR(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapturePhoto = (stream) => {
    const video = document.createElement('video');
    video.srcObject = stream;
    video.play();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');
      setImage(imageData);
      performOCR(imageData);
      stream.getTracks().forEach((track) => track.stop());
    };
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      handleCapturePhoto(stream);
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const performOCR = (imageData) => {
    setLoading(true);
    Tesseract.recognize(imageData, 'eng', {
      logger: (info) => console.log(info), // Opsional, untuk debugging
    })
      .then(async ({ data: { text } }) => {
        try {
          const response = await axios.post("http://127.0.0.1:5000/extract-nutrients", {
            ocr_text: text,
          });
          console.log("Nutrisi yang diekstraksi:", response.data);
          setOcrText(response.data);

          try {
            const docRef = doc(db, "info", "wgI66JZDlk9dTOkdokIL"); // Ganti path koleksi & dokumen sesuai kebutuhan
      
            const docSnap = await getDoc(docRef);
            const currentData = docSnap.exists() ? docSnap.data() : {};
      
            const initialData = {
              kalori: currentData.kalori || 0,
              lemak: currentData.lemak || 0,
              karbohidrat: currentData.karbohidrat || 0,
              protein: currentData.protein || 0,
              gula: currentData.gula || 0,
              garam: currentData.garam || 0,
            };

            setCurrentData(initialData);
          } catch (error) {
            console.error("Error memperbarui data di Firebase:", error);
            alert("Terjadi kesalahan saat memproses makanan");
          }
        } catch (error) {
          console.error("Error extracting nutrients:", error);
        }
      })
      .catch((error) => {
        console.error('OCR Error:', error);
        setOcrText('Gagal membaca teks dari gambar.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSendToFirebase = async () => {
    if (ocrText && typeof ocrText === "object") {
      try {
        const docRef = doc(db, "info", "wgI66JZDlk9dTOkdokIL"); // Ganti path koleksi & dokumen sesuai kebutuhan
  
        const docSnap = await getDoc(docRef);
        const currentData = docSnap.exists() ? docSnap.data() : {};
  
        const initialData = {
          kalori: currentData.kalori || 0,
          lemak: currentData.lemak || 0,
          karbohidrat: currentData.karbohidrat || 0,
          protein: currentData.protein || 0,
          gula: currentData.gula || 0,
          garam: currentData.garam || 0,
        };
  
        // Tambahkan nilai baru dari ocrText ke data awal
        const updatedData = {
          kalori: initialData.kalori + (ocrText.kalori || 0),
          lemak: initialData.lemak + (ocrText.lemak || 0),
          karbohidrat: initialData.karbohidrat + (ocrText.karbohidrat || 0),
          protein: initialData.protein + (ocrText.protein || 0),
          gula: initialData.gula + (ocrText.gula || 0),
          garam: initialData.garam + (ocrText.garam || 0),
        };

        const account = decrypt(Cookies.get("enc"));
        const data = {
          carbs:ocrText.karbohidrat_total || 0,
          protein:ocrText.protein || 0,
          salt:ocrText.garam || 0,
          sugar:ocrText.gula || 0,
          fat:ocrText.lemak_total || 0,
          userId:account.user._id
        }
        
        const response = await axios.post("http://localhost:3001/user/makan", data);
        console.log("Makanan Dimakan : " + response.data);
        
        // Perbarui data di Firestore
        await setDoc(docRef, updatedData);
  
        alert("Siip, data Kamu berhasil diperbarui!");
      } catch (error) {
        console.error("Error memperbarui data di Firebase:", error);
        alert("Terjadi kesalahan saat memproses makanan");
      }
    } else {
      alert("Data pembacaan tidak valid.");
    }
  };

  const cancelMakan = () => {
    alert("Gajadi");
  }

  return (
    <div>
      <h2>Input Foto</h2>
      <div style={{marginBottom : "60px"}}>
        <button onClick={() => document.getElementById('fileInput').click()}>Unggah dari File</button>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <button onClick={startCamera}>Ambil dengan Kamera</button>
      </div>
      {image && (
        <div>
          <h3>Preview Gambar</h3>
          <img src={image} alt="Preview" style={{ maxWidth: '500px' }} />
        </div>
      )}
      {loading && <p>Pembacaan nilai gizi, mohon tunggu...</p>}
      {ocrText && (
        <div>
        {ocrText && typeof ocrText === "object" ? (
          <div>
          <ul style={{textAlign:'left'}}>
            <li><strong>Kalori:</strong> {ocrText.kalori || "Tidak terdeteksi"} kkal</li>
            <li><strong>Lemak Total:</strong> {ocrText.lemak || "Tidak terdeteksi"} g</li>
            <li><strong>Karbohidrat Total:</strong> {ocrText.karbohidrat || "Tidak terdeteksi"} g</li>
            <li><strong>Protein:</strong> {ocrText.protein || "Tidak terdeteksi"} g</li>
            <li><strong>Gula:</strong> {ocrText.gula || "Tidak terdeteksi"} g</li>
            <li><strong>Garam:</strong> {ocrText.garam || "Tidak terdeteksi"} mg</li>
            <li><strong>Air:</strong> {ocrText.air || "Tidak terdeteksi"} ml</li>
          </ul>

          <Button onClick={handleSendToFirebase} style={{ marginTop: "5px", marginBottom: "20px" }}>
          Makan
          </Button>

          <Button onClick={cancelMakan} bgCol={'red'} style={{marginTop: "5px", marginBottom: "20px" }}>
          Cancel
          </Button>

        </div>
        ) : (
          <p>{ocrText}</p>
        )}
      </div>
      )}
    </div>
  );
};

export default PhotoInput;
