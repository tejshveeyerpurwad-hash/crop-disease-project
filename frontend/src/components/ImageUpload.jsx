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
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="glass-card p-8 md:p-12">
        <div className="flex flex-col items-center mb-10">
           <h2 className="text-3xl font-bold mb-2">{t('upload')}</h2>
           <p className="text-gray-500 dark:text-gray-400">{t('dragDrop')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Upload Area */}
            <div className="relative">
              <AnimatePresence mode="wait">
                {preview ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative aspect-square rounded-2xl overflow-hidden glass-card group"
                  >
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    {!isProcessing && (
                      <button 
                        onClick={clearFile}
                        className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </motion.div>
                ) : useCamera ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative aspect-square rounded-2xl overflow-hidden bg-black"
                  >
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-4">
                       <button onClick={capturePhoto} className="p-4 bg-green-600 text-white rounded-full shadow-xl">
                          <Camera className="w-6 h-6" />
                       </button>
                       <button onClick={stopCamera} className="p-4 bg-red-600 text-white rounded-full shadow-xl">
                          <X className="w-6 h-6" />
                       </button>
                    </div>
                  </motion.div>
                ) : (
                  <div 
                    {...getRootProps()} 
                    className={`relative aspect-square rounded-2xl border-3 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${isDragActive ? 'border-green-500 bg-green-500/10' : 'border-gray-200 dark:border-gray-800 hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-950/20'}`}
                  >
                    <input {...getInputProps()} />
                    <div className="p-6 bg-green-100 dark:bg-green-900/30 rounded-3xl mb-6">
                      <Upload className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-lg font-bold mb-2">{t('browse')}</p>
                    <p className="text-sm text-gray-500">{t('or')} {t('dragDrop')}</p>
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); startCamera(); }}
                      className="mt-6 flex items-center space-x-2 text-green-600 dark:text-green-400 font-bold hover:underline"
                    >
                      <Camera className="w-5 h-5" />
                      <span>Use Camera</span>
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Status & Action */}
            <div className="flex flex-col justify-center space-y-8">
               <div className="space-y-6">
                  <StatusItem 
                    icon={Upload} 
                    label={t('uploading')} 
                    active={progress >= 10} 
                    done={progress >= 50} 
                  />
                  <StatusItem 
                    icon={Loader2} 
                    label={t('processing')} 
                    active={progress >= 50} 
                    done={progress >= 100} 
                    spinning={isProcessing && progress >= 50 && progress < 100} 
                  />
                  <StatusItem 
                    icon={CheckCircle2} 
                    label={t('completed')} 
                    active={progress >= 100} 
                    done={progress >= 100} 
                  />
               </div>

               {isProcessing && (
                 <div className="space-y-2">
                    <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                       <motion.div 
                        className="h-full bg-green-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                       />
                    </div>
                    <p className="text-xs text-right font-medium text-gray-500">{progress}% Completed</p>
                 </div>
               )}

               <button 
                onClick={handleSubmit}
                disabled={!file || isProcessing}
                className="btn-primary py-5 text-xl w-full"
               >
                 {isProcessing ? (
                   <>
                     <Loader2 className="w-6 h-6 animate-spin mr-3" />
                     {t('processing')}
                   </>
                 ) : (
                   t('upload')
                 )}
               </button>

               {!file && !isProcessing && (
                 <div className="flex items-start space-x-3 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5" />
                    <p className="text-sm text-amber-800 dark:text-amber-400">
                      Ensure the image has clear lighting and focuses on the affected parts of the plant for better accuracy.
                    </p>
                 </div>
               )}
            </div>
        </div>
      </div>
    </div>
  );
};

const StatusItem = ({ icon: Icon, label, active, done, spinning }) => (
  <div className={`flex items-center space-x-4 transition-all duration-500 ${active ? 'opacity-100' : 'opacity-40 grayscale'}`}>
    <div className={`p-2.5 rounded-xl ${done ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
      <Icon className={`w-6 h-6 ${spinning ? 'animate-spin text-green-500' : ''}`} />
    </div>
    <span className={`font-bold text-lg ${done ? 'text-green-600 dark:text-green-400' : ''}`}>{label}</span>
  </div>
);

export default ImageUpload;
