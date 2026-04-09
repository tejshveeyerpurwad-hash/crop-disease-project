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
        title: "Smart Farmer AI",
        subtitle: "Click a photo of your leaf to check if it's sick or healthy.",
        upload: "📸 Take / Upload Photo",
        history: "📜 Past Reports",
        about: "❓ Help",
        home: "🏠 Home",
        dragDrop: "Put your leaf photo here",
        or: "OR",
        browse: "Choose from Gallery",
        camera: "Use Camera",
        processing: "Analyzing Leaf...",
        uploading: "Sending Photo...",
        completed: "Done!",
        prediction: "Our Result",
        confidence: "How sure we are",
        healthy: "Healthy 🌿",
        diseased: "Disease Found ⚠️",
        uncertain: "Not Sure 🧐",
        speak: "🔊 Read Aloud",
        previous: "Your History",
        noHistory: "No reports yet. Click the camera!",
        footerNote: "Built for Farmers with Love."
      },
      hi: {
        title: "स्मार्ट किसान AI",
        subtitle: "अपने पत्ते की फोटो खींचे और देखें कि वह बीमार है या स्वस्थ।",
        upload: "📸 फोटो खींचें / अपलोड करें",
        history: "📜 पिछला इतिहास",
        about: "❓ सहायता",
        home: "🏠 मुख्य पृष्ठ",
        dragDrop: "पत्ते की फोटो यहाँ डालें",
        or: "या",
        browse: "गैलरी से चुनें",
        camera: "कैमरा चलाएं",
        processing: "जांच हो रही है...",
        uploading: "फोटो भेजी जा रही है...",
        completed: "हो गया!",
        prediction: "परिणाम",
        confidence: "AI का भरोसा",
        healthy: "स्वस्थ है 🌿",
        diseased: "बीमारी मिली ⚠️",
        uncertain: "पता नहीं चल रहा 🧐",
        speak: "🔊 बोलकर सुनाएं",
        previous: "आपका इतिहास",
        noHistory: "अभी कोई रिपोर्ट नहीं है। कैमरा बटन दबाएं!",
        footerNote: "किसानों के लिए बनाया गया।"
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
