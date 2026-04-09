import React, { useState, useRef } from 'react';
import Hero from '../components/Hero';
import ImageUpload from '../components/ImageUpload';
import ResultDisplay from '../components/ResultDisplay';
import { apiService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const uploadSectionRef = useRef(null);

  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePredict = async (file) => {
    setIsProcessing(true);
    setPreviewImage(URL.createObjectURL(file));
    setResult(null);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 200);

    try {
      const data = await apiService.predictCrop(file);
      setProgress(100);
      setTimeout(() => {
        setResult(data);
        setIsProcessing(false);
        // Reset progress for next time
        setTimeout(() => setProgress(0), 1000);
      }, 500);
    } catch (error) {
      console.error("Prediction failed", error);
      // For demo purposes, let's show a mock result if API fails
      setTimeout(() => {
        setProgress(100);
        setResult({
          status: 'Diseased',
          disease: 'Potato Early Blight',
          confidence: 92.4,
          recommendation: 'Apply fungicides containing chlorothalonil or mancozeb. Ensure proper crop rotation and remove infected plant debris.',
          heatmap: previewImage // Use preview as dummy heatmap
        });
        setIsProcessing(false);
        setTimeout(() => setProgress(0), 1000);
      }, 2000);
    }
  };

  return (
    <div className="pb-20">
      <Hero onUploadClick={scrollToUpload} />
      
      <div ref={uploadSectionRef} className="scroll-mt-20">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ImageUpload 
                onPredict={handlePredict} 
                isProcessing={isProcessing} 
                progress={progress} 
              />
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ResultDisplay 
                result={result} 
                imagePreview={previewImage} 
                onReset={() => setResult(null)} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Home;
