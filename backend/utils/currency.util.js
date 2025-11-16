export const USD_TO_INR = 83;

// Convert to INR based on currency sent from frontend
export const convertToINR = (amount, currencySymbol) =>
  currencySymbol === "$" ? Math.round(amount * USD_TO_INR) : Math.round(amount);

// Convert to paise for Razorpay
export const convertToPaise = (amount, currencySymbol) =>
  convertToINR(amount, currencySymbol) * 100;
