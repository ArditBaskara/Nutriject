import axios from "axios";

const API_URL = "https://78c2-34-139-32-151.ngrok-free.app/detect-nutrients"; // Flask server endpoint

export const uploadImage = async (formData) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data",
                "ngrok-skip-browser-warning": "any-value" },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Server Error");
  }
};
