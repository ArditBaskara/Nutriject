import React from "react";
import { Navigate } from "react-router-dom";
import { encrypt, decrypt } from "../crypt";
import Cookies from "js-cookie";
export default function ProtectedRoute({element}){
    let auth = decrypt(Cookies.get("enc"));
    if(auth === null){
        auth = {};
        auth.status = 400;
    }
    if(auth.status !== 200){
        return <Navigate to="/"/>
    }
    return element;
}
