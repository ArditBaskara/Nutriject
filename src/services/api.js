import axios from "axios";
import { db, doc, getDoc } from "../firebase-config";

/**
 * Resolve API base URL using this order:
 * 1. Firestore document `config/mUIOBDUemJm4EbANfmkV` field `link-api` (or `api-link`)
 * 2. sessionStorage key `apiLink`
 * Returns string or null.
 */
export const getApiBase = async () => {
  try {
    const cfgRef = doc(db, "config", "mUIOBDUemJm4EbANfmkV");
    const snap = await getDoc(cfgRef);
    if (snap && snap.exists && snap.exists()) {
      const data = snap.data();
      // prefer `link-api`, then `api-link`, then `apiLink` as a fallback
      const val = data?.["link-api"] ?? data?.["api-link"] ?? data?.apiLink ?? null;
      if (val && typeof val === "string" && val.trim() !== "") return val.trim();
    }
  } catch (err) {
    console.warn("getApiBase: unable to read config doc", err);
  }

  // final fallback: sessionStorage
  try {
    const fromSession = sessionStorage.getItem("apiLink");
    return fromSession || null;
  } catch (err) {
    return null;
  }
};

export const uploadImage = async (formData) => {
  try {
    const storedApi = await getApiBase();
    if (!storedApi) {
      alert("API link belum disetting. Silakan pergi ke halaman setting untuk menyetting.");
      window.location.href = "/setting";
      return;
    }

    const API_URL = `${storedApi}/detect-nutrients`;

    const response = await axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "ngrok-skip-browser-warning": "any-value",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Server Error");
  }
};
