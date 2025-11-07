import React from "react";
import PhotoInput from "../PhotoInput";
import UserForm from "../UseForm/UseForm";
import ObjectDetect from "../ImageUpload/ImageUpload";
import Navbar from "../../components/Navbar";

export default function FormPhoto() {
  return (
    <>
      <Navbar />
      <div className="form-photo-page">
        <div className="form-container">
          <PhotoInput />
        </div>
      </div>
    </>
  );
}
