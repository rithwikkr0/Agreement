import React, { useRef, useState, useEffect, useCallback } from 'react';
import { RotateCcw, Trash2, CheckCircle2, PenTool } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
}

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
  initialData?: string;
}

export default function SignaturePad({ onSave, initialData }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const currentStrokeRef = useRef<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Redraw all strokes cleanly onto canvas
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Set physical dimensions for sharp retina display
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Calligraphy brush style
    ctx.strokeStyle = '#090806';
    ctx.lineWidth = 2.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    strokes.forEach((stroke) => {
      if (stroke.points.length < 2) {
        if (stroke.points.length === 1) {
          const pt = stroke.points[0];
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.4, 0, Math.PI * 2);
          ctx.fillStyle = '#090806';
          ctx.fill();
        }
        return;
      }

      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

      for (let i = 1; i < stroke.points.length - 1; i++) {
        const p1 = stroke.points[i];
        const p2 = stroke.points[i + 1];
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
      }

      const last = stroke.points[stroke.points.length - 1];
      ctx.lineTo(last.x, last.y);
      ctx.stroke();
    });

    ctx.restore();
  }, [strokes]);

  // Handle canvas mounting, resizing, and initialData loading
  useEffect(() => {
    redrawCanvas();
    const handleResize = () => redrawCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [redrawCanvas]);

  // Load initialData if provided and no active strokes
  useEffect(() => {
    if (initialData && strokes.length === 0 && !hasSignature) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        ctx.restore();
        setHasSignature(true);
      };
      img.src = initialData;
    }
  }, [initialData, strokes.length, hasSignature]);

  // Pointer event coordinate extractor
  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const pt = getCanvasPoint(e);
    setIsDrawing(true);
    currentStrokeRef.current = [pt];

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 1.4, 0, Math.PI * 2);
    ctx.fillStyle = '#090806';
    ctx.fill();
    ctx.restore();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pt = getCanvasPoint(e);
    currentStrokeRef.current.push(pt);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const points = currentStrokeRef.current;
    if (points.length < 2) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = '#090806';
    ctx.lineWidth = 2.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const p1 = points[points.length - 2];
    const p2 = points[points.length - 1];
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.restore();
  };

  const finishDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    if (currentStrokeRef.current.length > 0) {
      const newStrokes = [...strokes, { points: [...currentStrokeRef.current] }];
      setStrokes(newStrokes);
      currentStrokeRef.current = [];
      setHasSignature(true);

      const canvas = canvasRef.current;
      if (canvas) {
        onSave(canvas.toDataURL('image/png'));
      }
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setStrokes([]);
    currentStrokeRef.current = [];
    setHasSignature(false);
    onSave('');
  };

  const handleUndo = () => {
    if (strokes.length === 0) return;
    const newStrokes = strokes.slice(0, -1);
    setStrokes(newStrokes);
    if (newStrokes.length === 0) {
      setHasSignature(false);
      onSave('');
    } else {
      setTimeout(() => {
        const canvas = canvasRef.current;
        if (canvas) {
          onSave(canvas.toDataURL('image/png'));
        }
      }, 50);
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none" ref={containerRef}>
      {/* Signature Canvas Frame */}
      <div className="relative w-full max-w-lg rounded border-2 border-imperial-gold/40 shadow-2xl overflow-hidden bg-[#F2E4C0]">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishDrawing}
          onPointerCancel={finishDrawing}
          className="signature-canvas w-full h-48 sm:h-56 block cursor-crosshair"
          style={{ touchAction: 'none' }}
          aria-label="Draw your signature on the parchment canvas"
        />

        {/* Parchment guide watermarks */}
        {!hasSignature && !isDrawing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-45 text-ink">
            <PenTool className="w-6 h-6 mb-1 text-bronze" />
            <span className="font-cinzel text-xs tracking-widest uppercase font-bold text-bronze">
              Sign Your Oath Here
            </span>
            <span className="text-[10px] font-noto italic text-ink/70 mt-0.5">
              (Touch / Stylus / Mouse supported)
            </span>
          </div>
        )}

        {/* Baseline guideline */}
        <div className="absolute bottom-7 left-8 right-8 h-px bg-bronze/30 pointer-events-none" />
      </div>

      {/* Controls and Feedback */}
      <div className="flex items-center justify-between w-full max-w-lg mt-3 px-1 text-xs">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={strokes.length === 0}
            className="px-3 py-1.5 rounded bg-black/50 text-aged-paper hover:text-ivory border border-imperial-gold/20 hover:border-imperial-gold/50 flex items-center gap-1.5 transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Undo
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={!hasSignature && strokes.length === 0}
            className="px-3 py-1.5 rounded bg-ancient-red/20 text-vermilion hover:text-white border border-ancient-red/40 hover:border-vermilion flex items-center gap-1.5 transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        </div>

        {hasSignature ? (
          <span className="text-jade font-cinzel text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>SIGNATURE INSCRIBED</span>
          </span>
        ) : (
          <span className="text-aged-paper/50 font-cinzel text-[11px] italic">
            * Signature is required
          </span>
        )}
      </div>
    </div>
  );
}
