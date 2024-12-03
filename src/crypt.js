import CryptoJS from "crypto-js";

const SECRET_KEY = "HEHE";
const encrypt = (data) => {
    const enc = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY);
    return enc;
}

const decrypt = (data) => {
    if(data == null){
        return null;
    }
    const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
    const decr = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decr;
}

export {encrypt, decrypt};