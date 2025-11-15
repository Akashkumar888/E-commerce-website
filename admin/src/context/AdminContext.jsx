import { createContext, useEffect, useState } from "react";


const AdminContext=createContext();

export const AdminContextProvider=({children})=>{

  // ✅ Load token from localStorage on first render
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const currencySymbol="$";

  // Optional: Sync token to localStorage automatically when it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token"); // clean up on logout
    }
  }, [token]);
  const value={
  token,
  setToken,
  currencySymbol
  };
  
  return <AdminContext.Provider value={value}>
    {children}
  </AdminContext.Provider>
}

export default AdminContext;