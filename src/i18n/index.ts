import i18n from "i18next";

// Consolidated translations for English and Hindi.
const resources = {
  en: {
    translation: {
      // Header / Navigation
      search: "Search groceries...",
      cart: "Cart",
      wishlist: "Wishlist",
      account: "Account",
      login: "Login",
      home: "Home",
      products: "Products",
      categories: "Categories",
      offers: "Offers",

      // Home
      heroTitle: "Fresh Groceries Delivered",
      heroSubtitle: "Get daily essentials delivered to your doorstep",
      shopNow: "Shop Now",
      shopByCategory: "Shop by Category",
      bestSellers: "Best Sellers",
      viewAll: "View All",
      newArrivals: "New Arrivals",
      whyChooseUs: "Why Choose Us",

      // Features
      freshStock: "Fresh Stock",
      freshStockDesc: "We source products directly from farms and warehouses",
      trustedBrands: "Trusted Brands",
      trustedBrandsDesc: "Only genuine products from verified sellers",
      fastDelivery: "Fast Delivery",
      fastDeliveryDesc: "Same day delivery for orders before 2 PM",
      affordablePricing: "Affordable Pricing",

      // Products & Cart
      addToCart: "Add to Cart",
      addedToCart: "Added!",
      addToWishlist: "Add to Wishlist",
      removeFromWishlist: "Remove from Wishlist",
      inStock: "In Stock",
      outOfStock: "Out of Stock",
      pricePerUnit: "per",
      off: "OFF",
      yourCart: "Your Cart",
      emptyCart: "Your cart is empty",
      startShopping: "Start Shopping",
      subtotal: "Subtotal",
      discount: "Discount",
      deliveryCharge: "Delivery Charge",
      free: "FREE",
      total: "Total",
      proceedToCheckout: "Proceed to Checkout",

      // Checkout / Payment
      checkout: "Checkout",
      deliveryAddress: "Delivery Address",
      addNewAddress: "Add New Address",
      deliverySlot: "Delivery Slot",
      paymentMethod: "Payment Method",
      orderSummary: "Order Summary",
      placeOrder: "Place Order",
      upi: "UPI",
      creditDebitCard: "Credit/Debit Card",
      cashOnDelivery: "Cash on Delivery",

      // Orders / Tracking
      thankYou: "Thank You!",
      orderPlaced: "Your order has been placed successfully",
      orderId: "Order ID",
      estimatedDelivery: "Estimated Delivery",
      trackOrder: "Track Order",
      orderTracking: "Order Tracking",
      confirmed: "Confirmed",
      packed: "Packed",
      outForDelivery: "Out for Delivery",
      delivered: "Delivered",

      // Misc / Footer
      description: "Description",
      reviews: "Reviews",
      aboutUs: "About Us",
      helpSupport: "Help & Support",
      privacyPolicy: "Privacy Policy",
      termsConditions: "Terms & Conditions",
      contactUs: "Contact Us",
      newsletter: "Newsletter",
      newsletterDesc: "Get the latest offers and updates delivered to your inbox.",
      subscribe: "Subscribe",
      allRightsReserved: "All rights reserved",
      loading: "Loading...",
      noResults: "No products found",
      tryDifferent: "Try a different search term",
      currency: "₹",

      // Auth
      loginSignup: "Login / Sign Up",
      verifyOTP: "Verify OTP",
      welcomeBack: "Welcome!",
      enterPhoneDesc: "Enter your mobile number to continue",
      otpSentTo: "OTP sent to",
      loginSuccessDesc: "You have been successfully logged in",
      mobileNumber: "Mobile Number",
      sendOTP: "Send OTP",
      verifyLogin: "Verify & Login",
      resendOTP: "Resend OTP",
      logout: "Logout",
      myAccount: "My Account",
      myOrders: "My Orders",
    },
  },
  hi: {
    translation: {
      // Header / Navigation
      search: "किराना खोजें...",
      cart: "कार्ट",
      wishlist: "विशलिस्ट",
      account: "अकाउंट",
      login: "लॉगिन",
      home: "होम",
      products: "उत्पाद",
      categories: "श्रेणियां",
      offers: "ऑफर्स",

      // Home
      heroTitle: "ताजा किराना डिलीवरी",
      heroSubtitle: "रोज़मर्रा की चीज़ें आपके दरवाज़े पर",
      shopNow: "अभी खरीदें",
      shopByCategory: "श्रेणी के अनुसार खरीदें",
      bestSellers: "सबसे ज़्यादा बिकने वाले",
      viewAll: "सभी देखें",
      newArrivals: "नए उत्पाद",
      whyChooseUs: "हमें क्यों चुनें",

      // Features
      freshStock: "ताज़ा स्टॉक",
      freshStockDesc: "हम सीधे खेतों और गोदामों से उत्पाद लाते हैं",
      trustedBrands: "विश्वसनीय ब्रांड",
      trustedBrandsDesc: "केवल सत्यापित विक्रेताओं से असली उत्पाद",
      fastDelivery: "तेज़ डिलीवरी",
      fastDeliveryDesc: "दोपहर 2 बजे से पहले के ऑर्डर की उसी दिन डिलीवरी",
      affordablePricing: "किफायती कीमत",

      // Products & Cart
      addToCart: "कार्ट में जोड़ें",
      addedToCart: "जोड़ा गया!",
      addToWishlist: "विशलिस्ट में जोड़ें",
      removeFromWishlist: "विशलिस्ट से हटाएं",
      inStock: "स्टॉक में",
      outOfStock: "स्टॉक में नहीं",
      pricePerUnit: "प्रति",
      off: "छूट",
      yourCart: "आपका कार्ट",
      emptyCart: "आपका कार्ट खाली है",
      startShopping: "खरीदारी शुरू करें",
      subtotal: "उप योग",
      discount: "छूट",
      deliveryCharge: "डिलीवरी शुल्क",
      free: "मुफ्त",
      total: "कुल",
      proceedToCheckout: "चेकआउट पर जाएं",

      // Checkout / Payment
      checkout: "चेकआउट",
      deliveryAddress: "डिलीवरी पता",
      addNewAddress: "नया पता जोड़ें",
      deliverySlot: "डिलीवरी समय",
      paymentMethod: "भुगतान का तरीका",
      orderSummary: "ऑर्डर सारांश",
      placeOrder: "ऑर्डर करें",
      upi: "यूपीआई",
      creditDebitCard: "क्रेडिट/डेबिट कार्ड",
      cashOnDelivery: "कैश ऑन डिलीवरी",

      // Orders / Tracking
      thankYou: "धन्यवाद!",
      orderPlaced: "आपका ऑर्डर सफलतापूर्वक दे दिया गया है",
      orderId: "ऑर्डर आईडी",
      estimatedDelivery: "अनुमानित डिलीवरी",
      trackOrder: "ऑर्डर ट्रैक करें",
      orderTracking: "ऑर्डर ट्रैकिंग",
      confirmed: "पुष्टि हो गई",
      packed: "पैक हो गया",
      outForDelivery: "डिलीवरी के लिए निकला",
      delivered: "डिलीवर हो गया",

      // Misc / Footer
      description: "विवरण",
      reviews: "समीक्षाएं",
      aboutUs: "हमारे बारे में",
      helpSupport: "सहायता और समर्थन",
      privacyPolicy: "गोपनीयता नीति",
      termsConditions: "नियम और शर्तें",
      contactUs: "संपर्क करें",
      newsletter: "न्यूज़लेटर",
      newsletterDesc: "नवीनतम ऑफ़र और अपडेट सीधे आपके इनबॉक्स में प्राप्त करें।",
      subscribe: "सब्सक्राइब",
      allRightsReserved: "सर्वाधिकार सुरक्षित",
      loading: "लोड हो रहा है...",
      noResults: "कोई उत्पाद नहीं मिला",
      tryDifferent: "कोई अलग खोज शब्द आज़माएं",
      currency: "₹",

      // Auth
      loginSignup: "लॉगिन / साइन अप",
      verifyOTP: "OTP सत्यापित करें",
      welcomeBack: "स्वागत है!",
      enterPhoneDesc: "जारी रखने के लिए अपना मोबाइल नंबर दर्ज करें",
      otpSentTo: "OTP भेजा गया",
      loginSuccessDesc: "आप सफलतापूर्वक लॉग इन हो गए हैं",
      mobileNumber: "मोबाइल नंबर",
      sendOTP: "OTP भेजें",
      verifyLogin: "सत्यापित करें और लॉगिन करें",
      resendOTP: "OTP दोबारा भेजें",
      logout: "लॉगआउट",
      myAccount: "मेरा खाता",
      myOrders: "मेरे ऑर्डर",
    },
  },
};

// Initialize i18n core (server-safe). Avoid react-i18next here because it uses React.createContext
// which must only run in client components.
if (!i18n.isInitialized) {
  i18n.init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
}

// Client-side helper to attach react-i18next plugin when needed.
export async function initReactI18nextClient() {
  if (typeof window === "undefined") return;
  const mod = await import("react-i18next");
  const initReactI18next = (mod as any).initReactI18next ?? mod.initReactI18next;
  if (!initReactI18next) return;
  // Attach plugin only once.
  // @ts-ignore
  if (!(i18n as any)._reactInitialized) {
    i18n.use(initReactI18next).init({ resources, lng: i18n.language || "en", interpolation: { escapeValue: false } });
    // mark to avoid re-initializing
    // @ts-ignore
    ;(i18n as any)._reactInitialized = true;
  }
}

export default i18n;
