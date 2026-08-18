import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, CheckCircle2, Upload, AlertCircle, Sparkles, Image as ImageIcon } from 'lucide-react';
import { optimizeImage } from '../services/agreement';

interface SelfieCaptureProps {
  onCapture: (dataUrl: string) => void;
  initialPhoto?: string;
  onSkip?: () => void;
}

export default function SelfieCapture({ onCapture, initialPhoto, onSkip }: SelfieCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(initialPhoto || null);
  const [cameraActive, setCameraActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Safe camera stream terminator
  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {}
      });
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  // Strict cleanup on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, [stopCameraStream]);

  // Start front camera stream with HTTPS check
  const startCamera = async () => {
    setIsInitializing(true);
    setErrorMessage(null);
    stopCameraStream();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage('CAMERA NOT AVAILABLE: Your browser does not support live video capture. Please upload a photo.');
      setIsInitializing(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera initialization error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('CAMERA ACCESS DENIED: Camera permission was denied. Enable camera access in your browser settings or upload a photo instead.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMessage('NO CAMERA FOUND: No camera hardware was detected on this device. You can upload an image file instead.');
      } else {
        setErrorMessage('CAMERA ERROR: Unable to access camera. Please upload an image file instead.');
      }
      stopCameraStream();
    } finally {
      setIsInitializing(false);
    }
  };

  // Capture current frame from video and compress
  const handleCapture = async () => {
    const video = videoRef.current;
    if (!video) return;

    setIsProcessing(true);
    try {
      const canvas = document.createElement('canvas');
      const vWidth = video.videoWidth || 480;
      const vHeight = video.videoHeight || 480;
      const size = Math.min(vWidth, vHeight);

      // Square crop centered
      canvas.width = 600;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const sx = (vWidth - size) / 2;
      const sy = (vHeight - size) / 2;

      // Horizontally flip for natural mirror selfie view
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, sx, sy, size, size, 0, 0, canvas.width, canvas.height);

      const rawData = canvas.toDataURL('image/jpeg', 0.85);
      const optimized = await optimizeImage(rawData, 600, 600, 0.85);

      setCapturedPhoto(optimized);
      onCapture(optimized);
      stopCameraStream();
    } catch (err) {
      console.error('Frame capture error:', err);
      setErrorMessage('Failed to capture frame. Please try again or upload a photo.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Retake photo handler
  const handleRetake = () => {
    setCapturedPhoto(null);
    onCapture('');
    startCamera();
  };

  // File upload fallback with image optimization
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const rawData = event.target?.result as string;
      try {
        const optimized = await optimizeImage(rawData, 600, 600, 0.85);
        setCapturedPhoto(optimized);
        onCapture(optimized);
        stopCameraStream();
      } catch {
        setCapturedPhoto(rawData);
        onCapture(rawData);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to load image file. Please try another file.');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Frame Container */}
      <div className="camera-frame w-60 h-60 sm:w-72 sm:h-72 rounded-sm bg-obsidian flex items-center justify-center relative shadow-2xl overflow-hidden">
        {/* State 1: Captured Photo */}
        {capturedPhoto ? (
          <div className="relative w-full h-full">
            <img
              src={capturedPhoto}
              alt="Identity Portrait Seal"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
            <div className="absolute bottom-3 left-2 right-2 flex items-center justify-center gap-1.5 text-jade font-cinzel text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>PORTRAIT SEAL READY</span>
            </div>
          </div>
        ) : cameraActive ? (
          /* State 2: Live Camera Stream */
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover -scale-x-100"
            />
            {/* Viewfinder Target */}
            <div className="absolute inset-0 border border-imperial-gold/30 m-6 pointer-events-none flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-vermilion animate-ping" />
            </div>
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[9px] font-cinzel text-bright-gold border border-imperial-gold/30">
              ● LIVE VIEW
            </div>
          </div>
        ) : (
          /* State 3: Idle / Enable Camera View */
          <div className="p-6 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full bg-imperial-gold/10 border border-imperial-gold/30 flex items-center justify-center text-bright-gold shadow-inner">
              <Camera className="w-7 h-7" />
            </div>
            <div>
              <p className="font-cinzel text-xs text-ivory font-bold uppercase tracking-wider">
                Identity Portrait Seal
              </p>
              <p className="text-[11px] text-aged-paper/60 font-noto mt-1 max-w-[200px] mx-auto">
                Capture your portrait with your camera or upload a photo to bind your seal.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message Box */}
      {errorMessage && (
        <div className="w-full max-w-md mt-3 p-3 rounded bg-ancient-red/20 border border-ancient-red/50 text-[11px] text-ivory flex items-start gap-2 animate-fade-up">
          <AlertCircle className="w-4 h-4 text-vermilion shrink-0 mt-0.5" />
          <span className="font-noto">{errorMessage}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        {capturedPhoto ? (
          <>
            <button
              type="button"
              onClick={handleRetake}
              className="px-4 py-2.5 rounded bg-black/60 text-aged-paper hover:text-ivory border border-imperial-gold/30 hover:border-imperial-gold flex items-center gap-1.5 text-xs font-cinzel tracking-wider transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retake Photo
            </button>

            <label className="px-4 py-2.5 rounded bg-obsidian text-aged-paper/80 hover:text-ivory border border-imperial-gold/30 hover:border-imperial-gold flex items-center gap-1.5 text-xs font-cinzel tracking-wider transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Change Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </>
        ) : cameraActive ? (
          <button
            type="button"
            onClick={handleCapture}
            disabled={isProcessing}
            className="btn-vermilion px-6 py-2.5 rounded text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
          >
            <Camera className="w-4 h-4" />
            <span>{isProcessing ? 'PROCESSING...' : 'CAPTURE PHOTO'}</span>
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={startCamera}
              disabled={isInitializing}
              className="btn-imperial px-6 py-2.5 rounded text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg"
            >
              <Camera className="w-4 h-4" />
              <span>{isInitializing ? 'STARTING CAMERA...' : 'ENABLE CAMERA'}</span>
            </button>

            <label className="px-4 py-2.5 rounded bg-obsidian text-aged-paper/80 hover:text-ivory border border-imperial-gold/30 hover:border-imperial-gold flex items-center gap-1.5 text-xs font-cinzel tracking-wider transition-colors cursor-pointer">
              <ImageIcon className="w-3.5 h-3.5 text-bright-gold" />
              <span>Upload Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </>
        )}
      </div>

      <p className="mt-3 text-[10px] text-aged-paper/50 font-noto italic text-center max-w-sm">
        🔒 All images are processed and stored 100% locally in your browser. No photos are ever uploaded to any external server.
      </p>
    </div>
  );
}
