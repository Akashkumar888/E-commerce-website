
import { createContext } from "react";
import { products } from "../assets/assets";

const ShopContext=createContext();

export const ShopContextProvider=({children})=>{ // direct destructuring using {}

  const currencySymbol="$";
  const delivery_fee=10;

  const value={
    products,
    currencySymbol,
    delivery_fee,
  };

  return (
    <ShopContext.Provider value={value}>
   {children}
  </ShopContext.Provider>
  )
}

export default ShopContext;