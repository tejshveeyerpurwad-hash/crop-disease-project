import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    const translations = {
      en: {
        title: "AI Crop Disease Detection",
        subtitle: "Protect your harvest with advanced machine learning. Upload a photo of your crop to identify diseases instantly and get expert recommendations.",
        upload: "Upload Image",
        history: "History",
        about: "About",
        home: "Home",
        dragDrop: "Drag & drop your crop image here",
        or: "or",
        browse: "Browse Files",
        camera: "Camera",
        processing: "Processing...",
        uploading: "Uploading image...",
        completed: "Analysis complete",
        prediction: "Prediction",
        confidence: "Confidence",
        healthy: "Healthy",
        diseased: "Diseased",
        previous: "Previous Predictions",
        noHistory: "No predictions yet. Upload an image to start!",
        footerNote: "Empowering farmers with AI technology."
      },
      hi: {
        title: "AI फसल रोग पहचान प्रणाली",
        subtitle: "आर्टिफिशियल इंटेलिजेंस के साथ अपनी फसल की रक्षा करें। अपनी फसल की बीमारी को तुरंत पहचानने और विशेषज्ञ सलाह पाने के लिए फोटो अपलोड करें।",
        upload: "इमेज अपलोड करें",
        history: "इतिहास",
        about: "हमारे बारे में",
        home: "होम",
        dragDrop: "अपनी फसल की इमेज यहाँ खींचें और छोड़ें",
        or: "या",
        browse: "फाइलें चुनें",
        camera: "कैमरा",
        processing: "प्रोसेसिंग हो रही है...",
        uploading: "अपलोड हो रहा है...",
        completed: "विश्लेषण पूरा हुआ",
        prediction: "भविष्यवाणी",
        confidence: "विश्वास स्कोर",
        healthy: "स्वस्थ",
        diseased: "रोगग्रस्त",
        previous: "पिछले परिणाम",
        noHistory: "अभी तक कोई परिणाम नहीं। शुरू करने के लिए इमेज अपलोड करें!",
        footerNote: "AI तकनीक के साथ किसानों को सशक्त बनाना।"
      }
    };
    return translations[language][key] || key;
  };

  return (
    <AppContext.Provider value={{ darkMode, setDarkMode, language, setLanguage, t }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
