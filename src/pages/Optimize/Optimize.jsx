import Navbar from "../../components/Navbar"; // Pastikan path ini sesuai
import "../FormPhoto/FormPhoto.css";
import ImageUpload from "../ImageUpload/ImageUpload";

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
