import React, { useState } from "react";
import { uploadImage } from "../services/api";

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [nutrientData, setNutrientData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Tambahkan state loading

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
      setNutrientData(result.nutrients);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      // Set loading state to false when the upload is finished
      setLoading(false);
    }
  };

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
              <li key={index}>
                <strong>{item.nama}</strong>: Karbohidrat: {item.karbohidrat}g, Protein:{" "}
                {item.protein}g, Lemak: {item.lemak}g, Kalori: {item.kalori}kcal, Gula:{" "}
                {item.gula}g, Garam: {item.garam}mg, Air: {item.air}%
              </li>
            ))}
          </ul>
        ) : (
          <p>No data extracted yet.</p>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
