/* eslint-disable */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { encrypt, decrypt } from '../crypt';
import Cookies from 'js-cookie';
export default function ProtectedRoute({ element }) {
  let auth = decrypt(Cookies.get('enc'));
  if (auth === null) {
    return <Navigate to="/auth" />;
  }
  if (auth.email === 200) {
    return <Navigate to="/auth" />;
  }
  return element;
}
