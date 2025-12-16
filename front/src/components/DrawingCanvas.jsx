import { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';

const DrawingCanvas = forwardRef(({
  imageUrl,
  width,
  height,
  brushColor = '#FF0000',
  brushSize = 5,
  isEraser = false,
  onHistoryChange
}, ref) => {
  const backgroundCanvasRef = useRef(null);
  const drawingCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);

  // Notify parent of history state changes
  useEffect(() => {
    if (onHistoryChange) {
      onHistoryChange({
        canUndo: historyStep > 0,
        canRedo: historyStep < history.length - 1
      });
    }
  }, [historyStep, history, onHistoryChange]);

  useEffect(() => {
    const bgCanvas = backgroundCanvasRef.current;
    if (!bgCanvas) return;
    const ctx = bgCanvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      ctx.drawImage(img, 0, 0, bgCanvas.width, bgCanvas.height);
    };
    img.src = imageUrl;
  }, [imageUrl, width, height]);

  useEffect(() => {
    const drawCanvas = drawingCanvasRef.current;
    if (!drawCanvas || history.length > 0) return;
    saveToHistory();
  }, [imageUrl, width, height]);

  const saveToHistory = () => {
    const drawCanvas = drawingCanvasRef.current;
    if (!drawCanvas) return;
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(drawCanvas.toDataURL());
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  useImperativeHandle(ref, () => ({
    getImageData: () => {
      const bgCanvas = backgroundCanvasRef.current;
      const drawCanvas = drawingCanvasRef.current;
      if (!bgCanvas || !drawCanvas) return null;
      const mergedCanvas = document.createElement('canvas');
      mergedCanvas.width = width;
      mergedCanvas.height = height;
      const ctx = mergedCanvas.getContext('2d');
      ctx.drawImage(bgCanvas, 0, 0);
      ctx.drawImage(drawCanvas, 0, 0);
      return mergedCanvas.toDataURL('image/png');
    },
    reloadImage: (imageData) => {
      const bgCanvas = backgroundCanvasRef.current;
      const drawCanvas = drawingCanvasRef.current;
      if (!bgCanvas || !drawCanvas) return;
      const bgCtx = bgCanvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        bgCtx.drawImage(img, 0, 0, bgCanvas.width, bgCanvas.height);
      };
      img.src = imageData;
      const drawCtx = drawCanvas.getContext('2d');
      drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
      setHistory([]);
      setHistoryStep(-1);
      saveToHistory();
    },
    clearCanvas: () => {
      const drawCanvas = drawingCanvasRef.current;
      if (!drawCanvas) return;
      const ctx = drawCanvas.getContext('2d');
      ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
      saveToHistory();
    },
    undo: () => {
      if (historyStep > 0) {
        const drawCanvas = drawingCanvasRef.current;
        const ctx = drawCanvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
          ctx.drawImage(img, 0, 0, drawCanvas.width, drawCanvas.height);
        };
        img.src = history[historyStep - 1];
        setHistoryStep(historyStep - 1);
      }
    },
    redo: () => {
      if (historyStep < history.length - 1) {
        const drawCanvas = drawingCanvasRef.current;
        const ctx = drawCanvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
          ctx.drawImage(img, 0, 0, drawCanvas.width, drawCanvas.height);
        };
        img.src = history[historyStep + 1];
        setHistoryStep(historyStep + 1);
      }
    }
  }));

  const startDrawing = (e) => {
    const drawCanvas = drawingCanvasRef.current;
    const rect = drawCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = drawCanvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const drawCanvas = drawingCanvasRef.current;
    const rect = drawCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = drawCanvas.getContext('2d');
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = brushColor;
    }
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  return (
    <div className="relative inline-block overflow-hidden rounded-2xl shadow-2xl">
      <canvas
        ref={backgroundCanvasRef}
        width={width}
        height={height}
        className="block bg-white"
      />
      <canvas
        ref={drawingCanvasRef}
        width={width}
        height={height}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className={`absolute top-0 left-0 ${isEraser ? 'cursor-cell' : 'cursor-crosshair'}`}
      />
    </div>
  );
});

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas;

