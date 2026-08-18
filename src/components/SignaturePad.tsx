import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Trash2, Check } from 'lucide-react';

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
  initialData?: string;
}

export default function SignaturePad({ onSave, initialData }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Default brush style (black calligraphy ink)
    ctx.strokeStyle = '#090806';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // If initialData is provided
    if (initialData) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        setHasDrawn(true);
      };
      img.src = initialData;
    }
  }, [initialData]);

  const saveHistoryState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const state = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory(prev => [...prev.slice(-10), state]);
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent | TouchEvent | MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else if ('clientX' in e) {
      return {
        x: (e as MouseEvent).clientX - rect.left,
        y: (e as MouseEvent).clientY - rect.top,
      };
    }
    return { x: 0, y: 0 };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    saveHistoryState();
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onSave(canvas.toDataURL('image/png'));
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setHistory([]);
    onSave('');
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...history];
    const previousState = newHistory.pop();
    setHistory(newHistory);

    if (previousState) {
      ctx.putImageData(previousState, 0, 0);
      onSave(canvas.toDataURL('image/png'));
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
      onSave('');
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Signature Box Frame */}
      <div className="relative w-full max-w-lg rounded border-2 border-imperial-gold/40 shadow-inner overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="signature-canvas w-full h-44 sm:h-52 block"
          style={{ width: '100%' }}
          aria-label="Touch or draw your signature here"
        />

        {/* Parchment guide lines & prompt text watermark */}
        {!hasDrawn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-40 text-ink">
            <span className="font-cinzel text-xs tracking-widest uppercase font-semibold">
              Draw Your Signature Here
            </span>
            <span className="text-[10px] font-noto italic mt-0.5">
              (Touch / Mouse / Stylus supported)
            </span>
          </div>
        )}

        {/* Bottom baseline watermark */}
        <div className="absolute bottom-6 left-8 right-8 h-px bg-bronze/30 pointer-events-none" />
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between w-full max-w-lg mt-3 px-1 text-xs">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length === 0}
            className="px-3 py-1.5 rounded bg-black/40 text-aged-paper/80 hover:text-ivory border border-imperial-gold/20 hover:border-imperial-gold/50 flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Undo
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={!hasDrawn}
            className="px-3 py-1.5 rounded bg-ancient-red/20 text-vermilion hover:text-white border border-ancient-red/40 hover:border-vermilion flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        </div>

        {hasDrawn && (
          <span className="text-jade font-cinzel text-xs flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Inked
          </span>
        )}
      </div>
    </div>
  );
}
