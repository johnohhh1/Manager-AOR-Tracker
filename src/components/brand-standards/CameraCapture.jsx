import React, { useRef, useEffect, useState } from 'react';
import { X, Camera } from 'lucide-react';

const CameraCapture = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setError(null);
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Camera access denied. Please enable camera permissions in your browser settings.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    // Set canvas dimensions to video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    // Compress to max 100KB
    let quality = 0.7;
    let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

    // Keep reducing quality until under 100KB
    // Base64 encoding adds ~37% overhead, so 136533 chars ≈ 100KB
    while (compressedDataUrl.length > 136533 && quality > 0.1) {
      quality -= 0.1;
      compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
    }

    stopCamera();
    onCapture(compressedDataUrl);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-bold mb-4 text-red-600">Camera Error</h3>
          <p className="mb-4 text-gray-700">{error}</p>
          <button
            onClick={handleClose}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-black text-white p-4 flex justify-between items-center">
        <h3 className="font-bold text-lg">Take Photo</h3>
        <button
          onClick={handleClose}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <X size={28} />
        </button>
      </div>

      {/* Video Preview */}
      <div className="flex-1 relative overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* Capture Button */}
      <div className="bg-black p-6 flex justify-center items-center">
        <button
          onClick={capturePhoto}
          className="w-20 h-20 rounded-full border-4 border-white bg-white flex items-center justify-center hover:scale-105 transition-transform"
          style={{ boxShadow: '0 0 0 4px rgba(255,255,255,0.3)' }}
        >
          <Camera size={32} className="text-gray-700" />
        </button>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
