import axios from "axios";

// link API Example : https://94db-34-86-3-28.ngrok-free.app/detect-nutrients
const API_URL = "https://a870-35-196-148-24.ngrok-free.app/detect-nutrients";

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
