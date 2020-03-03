import React, { useState, useRef, useEffect } from 'react';

interface Props {
  useCanvas?: boolean | null;
}

export interface Scape {
  renderer?: CanvasRenderingContext2D | null;
}

export const ScapeContext = React.createContext<Scape>({ renderer: null });

const Reactscape: React.FC<Props> = ({ useCanvas, children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderer, setRenderer] = useState<CanvasRenderingContext2D | null>();

  useEffect(() => {
    if (!canvasRef.current) {
      setRenderer(null);
      return;
    }
    setRenderer(canvasRef.current.getContext('2d'));
  }, [canvasRef.current]);

  return (
    <ScapeContext.Provider value={{ renderer }}>
      <div>
        {useCanvas ? (
          <canvas ref={canvasRef} height="600" width="900">
            {children}
          </canvas>
        ) : (
          <svg width="900" height="600">
            {children}
          </svg>
        )}
      </div>
    </ScapeContext.Provider>
  );
};

export default Reactscape;
