import ImageUpload from "../ImageUpload/ImageUpload";

export default function Optimize() {
  // ImageUpload already renders Navbar/Footer, just render the component to avoid duplicate navbars
  return <ImageUpload />;
}
