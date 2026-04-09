import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Camera, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const ImageUpload = ({ onPredict, isProcessing, progress }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [useCamera, setUseCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { t } = useAppContext();

  const onDrop = useCallback(acceptedFiles => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setUseCamera(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
    disabled: isProcessing
  });

  const clearFile = () => {
    setFile(null);
    setPreview(null);
  };

  const startCamera = async () => {
    try {
      setUseCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setUseCamera(false);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      canvas.toBlob(blob => {
        const capturedFile = new File([blob], "capture.jpg", { type: "image/jpeg" });
        setFile(capturedFile);
        setPreview(URL.createObjectURL(blob));
        stopCamera();
      }, 'image/jpeg');
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setUseCamera(false);
  };

  const handleSubmit = () => {
    if (file) {
      onPredict(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="bg-white rounded-[2rem] p-8 shadow-2xl border-4 border-gray-100">
        <div className="text-center mb-8">
           <h2 className="text-4xl font-black mb-2 text-gray-800">{t('upload')}</h2>
           <p className="text-xl text-gray-500 font-medium">{t('subtitle')}</p>
        </div>

        <div className="flex flex-col items-center gap-8">
            {/* Capture/Upload Preview */}
            <div className="w-full max-w-lg aspect-square relative rounded-3xl overflow-hidden bg-gray-50 border-4 border-dashed border-gray-200 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {preview ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full relative">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    {!isProcessing && (
                      <button onClick={clearFile} className="absolute top-4 right-4 p-4 bg-red-500 text-white rounded-2xl shadow-xl">
                        <X className="w-8 h-8" />
                      </button>
                    )}
                  </motion.div>
                ) : useCamera ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full relative">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover bg-black" />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6">
                       <button onClick={capturePhoto} className="p-8 bg-green-500 text-white rounded-full shadow-2xl scale-125">
                          <Camera className="w-10 h-10" />
                       </button>
                       <button onClick={stopCamera} className="p-8 bg-black/50 text-white rounded-full backdrop-blur-md">
                          <X className="w-8 h-8" />
                       </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center p-10 space-y-6">
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                      <ImageIcon className="w-12 h-12" />
                    </div>
                    <p className="text-2xl font-bold text-gray-400">Click button below to start</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="w-full max-w-lg space-y-6">
               {isProcessing ? (
                 <div className="text-center p-10 bg-blue-50 rounded-3xl border-4 border-blue-200">
                    <Loader2 className="w-20 h-20 animate-spin text-blue-500 mx-auto mb-4" />
                    <h3 className="text-3xl font-black text-blue-700">{t('processing')}</h3>
                    <p className="text-blue-500 font-bold mt-2 text-xl">Please wait...</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 gap-4">
                    {!preview ? (
                      <>
                        <button 
                          onClick={startCamera}
                          className="w-full py-8 bg-green-500 hover:bg-green-600 text-white rounded-3xl text-3xl font-black flex items-center justify-center gap-6 shadow-xl transition-all active:scale-95"
                        >
                          <Camera className="w-12 h-12" />
                          {t('camera')}
                        </button>
                        <div {...getRootProps()} className="w-full py-6 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-3xl text-xl font-bold flex items-center justify-center gap-4 cursor-pointer">
                          <input {...getInputProps()} />
                          <Upload className="w-6 h-6" />
                          {t('browse')}
                        </div>
                      </>
                    ) : (
                      <button 
                        onClick={handleSubmit}
                        className="w-full py-8 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl text-3xl font-black shadow-xl transition-all active:scale-95"
                      >
                        ✅ CHECK NOW
                      </button>
                    )}
                 </div>
               )}
            </div>
        </div>
      </div>
  );
};

export default ImageUpload;
