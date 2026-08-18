import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Check, Upload, AlertCircle } from 'lucide-react';

interface SelfieCaptureProps {
  onCapture: (dataUrl: string) => void;
  initialPhoto?: string;
}

export default function SelfieCapture({ onCapture, initialPhoto }: SelfieCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(initialPhoto || null);
  const [cameraActive, setCameraActive] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // Stop camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    setIsInitializing(true);
    setPermissionError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 480 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      setStream(mediaStream);
      setCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setPermissionError(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Camera permission was denied. You may grant access or upload an image below.'
          : 'Could not connect to camera. You can upload an image file instead.'
      );
      setCameraActive(false);
    } finally {
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 400;
    canvas.height = video.videoHeight || 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw and horizontally flip to match selfie preview
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedPhoto(dataUrl);
    onCapture(dataUrl);
    stopCamera();
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    onCapture('');
    startCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCapturedPhoto(dataUrl);
      onCapture(dataUrl);
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Frame Container */}
      <div className="camera-frame w-56 h-56 sm:w-64 sm:h-64 rounded-sm bg-obsidian flex items-center justify-center relative shadow-2xl">
        {/* State 1: Captured Photo */}
        {capturedPhoto ? (
          <div className="relative w-full h-full">
            <img
              src={capturedPhoto}
              alt="Identity Portrait Seal"
              className="w-full h-full object-cover rounded-sm"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1 text-jade font-cinzel text-xs font-bold">
              <Check className="w-4 h-4" />
              <span>PORTRAIT SEALED</span>
            </div>
          </div>
        ) : cameraActive ? (
          /* State 2: Active Camera Stream */
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover -scale-x-100"
            />
            {/* Viewfinder crosshairs */}
            <div className="absolute inset-0 border border-imperial-gold/30 m-4 pointer-events-none flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-vermilion animate-pulse" />
            </div>
          </div>
        ) : (
          /* State 3: Idle / Request Permission Prompt */
          <div className="p-4 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-imperial-gold/10 border border-imperial-gold/30 flex items-center justify-center text-imperial-gold">
              <Camera className="w-6 h-6" />
            </div>
            <p className="font-cinzel text-xs text-aged-paper/80 font-bold uppercase tracking-wider">
              Identity Seal
            </p>
            <p className="text-[11px] text-aged-paper/50 font-noto">
              Capture your portrait to bind your identity with the covenant.
            </p>
          </div>
        )}
      </div>

      {/* Error / Fallback Notice */}
      {permissionError && (
        <div className="w-full max-w-sm mt-3 p-3 rounded bg-ancient-red/20 border border-ancient-red/40 text-[11px] text-ivory flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-vermilion shrink-0 mt-0.5" />
          <span>{permissionError}</span>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        {capturedPhoto ? (
          <button
            type="button"
            onClick={handleRetake}
            className="px-4 py-2 rounded bg-black/60 text-aged-paper hover:text-ivory border border-imperial-gold/30 hover:border-imperial-gold flex items-center gap-1.5 text-xs font-cinzel tracking-wider transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retake Photo
          </button>
        ) : cameraActive ? (
          <button
            type="button"
            onClick={handleCapture}
            className="btn-imperial px-6 py-2.5 rounded text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>CAPTURE IDENTITY SEAL</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={startCamera}
            disabled={isInitializing}
            className="btn-imperial px-6 py-2.5 rounded text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Camera className="w-4 h-4" />
            <span>{isInitializing ? 'INITIALIZING...' : 'ENABLE CAMERA'}</span>
          </button>
        )}

        {/* Upload Fallback */}
        <label className="px-4 py-2 rounded bg-obsidian text-aged-paper/70 hover:text-ivory border border-imperial-gold/20 hover:border-imperial-gold/40 flex items-center gap-1.5 text-xs font-cinzel tracking-wider transition-colors cursor-pointer">
          <Upload className="w-3.5 h-3.5" />
          <span>{capturedPhoto ? 'Upload Alternative' : 'Upload Image'}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      <p className="mt-2 text-[10px] text-aged-paper/40 font-noto italic">
        Photos are processed entirely inside your browser and never sent to any external server.
      </p>
    </div>
  );
}
