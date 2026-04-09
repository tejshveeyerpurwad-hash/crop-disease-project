import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Camera, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const ImageUpload = ({ onPredict, isProcessing }) => {
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
    onDrop, accept: { 'image/*': [] }, multiple: false, disabled: isProcessing
  });

  const clearFile = () => { setFile(null); setPreview(null); };

  const startCamera = async () => {
    try {
      setUseCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch { setUseCamera(false); }
  };

  const capturePhoto = () => {
    const video = videoRef.current, canvas = canvasRef.current;
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
    videoRef.current?.srcObject?.getTracks().forEach(tr => tr.stop());
    setUseCamera(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Preview Area */}
        <div className={`relative aspect-[4/3] bg-slate-50 flex items-center justify-center overflow-hidden ${isDragActive ? 'ring-2 ring-green-500 ring-inset' : ''}`}>
          {/* Scan line during processing */}
          {isProcessing && (
            <div className="absolute left-0 right-0 h-0.5 bg-green-500 shadow-[0_0_12px_#22c55e] z-20" 
              style={{ animation: 'bioscan 2s cubic-bezier(0.4,0,0.2,1) infinite' }} />
          )}

          <AnimatePresence mode="wait">
            {preview ? (
              <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full relative">
                <img src={preview} alt="Preview" className={`w-full h-full object-cover transition-all ${isProcessing ? 'brightness-75 saturate-50' : ''}`} />
                {!isProcessing && (
                  <button onClick={clearFile} className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur text-slate-500 rounded-xl shadow-lg hover:bg-red-50 hover:text-red-500 transition-all">
                    <X className="w-5 h-5" />
                  </button>
                )}
                {isProcessing && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur rounded-2xl px-6 py-4 flex items-center gap-3 shadow-xl">
                      <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
                      <span className="font-semibold text-slate-700 text-sm">{t('processing')}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : useCamera ? (
              <motion.div key="camera" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full relative">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover bg-black" />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
                  <button onClick={capturePhoto} className="p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all">
                    <Camera className="w-6 h-6" />
                  </button>
                  <button onClick={stopCamera} className="p-4 bg-white/20 text-white rounded-full backdrop-blur border border-white/30">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div {...getRootProps()} className="w-full h-full flex flex-col items-center justify-center cursor-pointer group p-8">
                <input {...getInputProps()} />
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-green-100 group-hover:scale-110 transition-all">
                  <Upload className="w-7 h-7 text-green-600" />
                </div>
                <p className="text-sm font-semibold text-slate-900 mb-1">Drop your leaf photo here</p>
                <p className="text-xs text-slate-400">or click to browse files</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Actions */}
        <div className="p-5 border-t border-slate-100 space-y-3">
          {!preview ? (
            <div className="grid grid-cols-2 gap-3">
              <div {...getRootProps()} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm cursor-pointer hover:bg-green-600 transition-all shadow-sm">
                <input {...getInputProps()} />
                <Upload className="w-4 h-4" /> {t('browse')}
              </div>
              <button onClick={startCamera} className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:border-green-400 hover:text-green-600 transition-all">
                <Camera className="w-4 h-4" /> {t('camera')}
              </button>
            </div>
          ) : !isProcessing ? (
            <button onClick={() => file && onPredict(file)}
              className="w-full py-3.5 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 flex items-center justify-center gap-2">
              🚀 Analyze Leaf
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
