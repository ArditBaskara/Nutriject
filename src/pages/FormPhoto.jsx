import React from "react";
import PhotoInput from "./PhotoInput";
import UserForm from "./UseForm";
import ObjectDetect from "./ImageUpload";
import Navbar from "../components/Navbar"; // Pastikan path ini sesuai
import "./FormPhoto.css";

export default function FormPhoto() {
  return (
    <>
      <Navbar />
      <div className="form-photo-page">
        <div className="form-container">
          <UserForm />
          <PhotoInput />
          <ObjectDetect/>
          
        </div>
      </div>
    </>
  );
}
