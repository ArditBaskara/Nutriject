import React from "react";
import PhotoInput from "./PhotoInput";
import UserForm from "./UseForm";
import ObjectDetect from "./ImageUpload";
import Navbar from "../components/Navbar"; // Pastikan path ini sesuai
import "./FormPhoto.css";
import ImageUpload from "./ImageUpload";

export default function Optimize() {
  return (
    <>
      <Navbar />
      <div className="form-photo-page">
        <div className="form-container">
          <ImageUpload />
          
        </div>
      </div>
    </>
  );
}
