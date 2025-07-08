import axios from "axios";

export const uploadImage = async (formData) => {
  try {
    const storedApi = sessionStorage.getItem('apiLink');
    const API_URL = `${storedApi}/detect-nutrients`;

    if (!storedApi) {
      alert("API link belum disetting. Silakan pergi ke halaman setting untuk menyetting.");

      window.location.href = "/setting";
      return;
    }

    const response = await axios.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data",
                "ngrok-skip-browser-warning": "any-value" },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Server Error");
  }
};
