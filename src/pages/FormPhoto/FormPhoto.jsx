import React from "react";
import PhotoInput from "../PhotoInput";

export default function FormPhoto() {
  // PhotoInput already renders Navbar/Footer; avoid duplicate navbars
  return (
    <div className="form-photo-page">
      <div className="form-container">
        <PhotoInput />
      </div>
    </div>
  );
}
