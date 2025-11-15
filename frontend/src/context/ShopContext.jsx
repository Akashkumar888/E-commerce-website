
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const ShopContext=createContext();

export const ShopContextProvider=({children})=>{ // direct destructuring using {}

  const currencySymbol="$";
  const delivery_fee=10;
  const [products,setProducts]=useState([]);
  const [search,setSearch]=useState("");
  const [showSearch,setShowSearch]=useState(false);
  const [cartItems,setCartItems]=useState({});
  const navigate=useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");


  const addToCart=async(itemId,size)=>{
  
    if(!size){
      toast.error("Select Product Size");
      return;
    }
    let cartData=structuredClone(cartItems); // copy of the cartItems
    if(cartData[itemId]){
      if(cartData[itemId][size]){
        cartData[itemId][size]+=1;
      }
      else{
        cartData[itemId][size]=1;
      }
    }
    else{
      cartData[itemId]={};
      cartData[itemId][size]=1;
    }
    setCartItems(cartData);
  }
 
  const updateQuantity=async(itemId,size,quantity)=>{
    let cartData=structuredClone(cartItems);
    cartData[itemId][size]=quantity;
    setCartItems(cartData);
  }


  const getCartCount=()=>{
    let totalCount=0;
    for(const items in cartItems){
     for(const item in cartItems[items]){
      try {
        if(cartItems[items][item]>0){
          totalCount += cartItems[items][item];
        }
      } catch (error) {
        toast.error(error.message);
      }
     }
    }
    return totalCount;
  }


  const getCartAmount=()=>{
    let totalAmount=0;
    for( let items in cartItems){
      let itemInfo=products.find((product)=> product._id ===items)
      for(const item in cartItems[items]){
        try {
          if(cartItems[items][item]>0){
          totalAmount+=itemInfo.price * cartItems[items][item];
          }
        } catch (error) {
          toast.error(error.message);
        }
      }
    }
    return totalAmount;
  }

  const getProductsData=async()=>{
    try {
      const {data}=await api.get(`/api/product/list`);
      if(data.success){
        setProducts(data.products);
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }
  useEffect(()=>{
  getProductsData();
  },[])

  const value={
    products,
    setProducts,
    currencySymbol,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    token,
    setToken
  };

  return (
    <ShopContext.Provider value={value}>
   {children}
  </ShopContext.Provider>
  )
}

export default ShopContext;