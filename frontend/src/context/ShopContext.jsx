import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const ShopContext = createContext();

export const ShopContextProvider = ({ children }) => {

  const currencySymbol = "$";
  const delivery_fee = 10;

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  const navigate = useNavigate();

  /* ---------- ADD TO CART ---------- */
  const addToCart = async (itemId, size) => {
    if (!size) return toast.error("Select Product Size");

    let cartData = structuredClone(cartItems);
    cartData[itemId] = cartData[itemId] || {};
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    setCartItems(cartData);

    if (token) {
      try {
        await api.post("/api/cart/add", { itemId, size });
      } catch (error) {
        console.log(error);
        toast.error("Failed to sync cart");
      }
    }
  };

  /* ---------- UPDATE CART QUANTITY ---------- */
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    if (quantity <= 0) delete cartData[itemId][size];
    else cartData[itemId][size] = quantity;

    setCartItems(cartData);

    if (token) {
      try {
        await api.put("/api/cart/update", { itemId, size, quantity });
      } catch (error) {
        console.log(error);
        toast.error("Failed to update cart");
      }
    }
  };

  /* ---------- CART COUNT ---------- */
  const getCartCount = () =>
    Object.values(cartItems)
      .flatMap((sizes) => Object.values(sizes))
      .reduce((sum, qty) => sum + qty, 0);

  /* ---------- CART TOTAL ---------- */
  const getCartAmount = () => {
    let total = 0;
    for (let id in cartItems) {
      const product = products.find((p) => p._id === id);
      if (!product) continue;

      for (let qty of Object.values(cartItems[id])) {
        total += product.price * qty;
      }
    }
    return total;
  };

  /* ---------- FETCH PRODUCTS ---------- */
  const getProductsData = async () => {
    try {
      const { data } = await api.get("/api/product/list");
      if (data.success) setProducts(data.products);
      else toast.error(data.message);
    } catch (error) {
      console.log(error);
      toast.error("Product fetch failed");
    }
  };

  /* ---------- LOAD USER CART ---------- */
  const getUserCart = async () => {
    if (!token) return;

    try {
      const { data } = await api.get("/api/cart/get");
      if (data.success) setCartItems(data.cartData);
    } catch (err) {
      console.log(err);
    }
  };

  /* ---------- INITIAL LOAD ---------- */
  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    getUserCart();
  }, [token]);

  /* ---------- PROVIDER VALUE ---------- */
  const value = {
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
    updateQuantity,
    getCartCount,
    getCartAmount,
    navigate,
    token,
    setToken,
    setCartItems,
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
      </ShopContext.Provider>
  );
};

export default ShopContext;
