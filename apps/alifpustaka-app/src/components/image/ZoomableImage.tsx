'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';
import Image from 'next/image';
import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

// ⚠️ IMPORTANT: These MUST match the values set in <TransformWrapper />
const WRAPPER_MIN_SCALE = 1;
const WRAPPER_MAX_SCALE = 4;

interface TransformCallbackRef {
  state: {
    scale: number;
    positionX: number;
    positionY: number;
    // Include other state properties you might use
  };
  instance: any; // Use 'any' for the full instance object as we only need the state
}

type ControlProps = {
  isMaxScale: boolean;
  isMinScale: boolean;
};

const Controls = ({ isMaxScale, isMinScale }: ControlProps) => {
  // We only rely on the functions and the current scale value.
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-x-0 bottom-0 z-999 flex w-full flex-row items-center justify-center gap-4 space-x-2 p-8"
    >
      <button
        onClick={() => zoomIn()}
        disabled={isMaxScale}
        title="Zoom In"
        className="scale-100 rounded-full bg-gray-500/50 p-3 font-semibold text-white backdrop-blur-lg transition-transform duration-150 ease-in-out hover:scale-110 active:scale-125 disabled:bg-gray-400/20 disabled:hover:scale-100"
      >
        <ZoomIn />
      </button>
      <button
        onClick={() => zoomOut()}
        disabled={isMinScale}
        title="Zoom Out"
        className="scale-100 rounded-full bg-gray-500/50 p-3 font-semibold text-white backdrop-blur-lg transition-transform duration-150 ease-in-out hover:scale-110 active:scale-125 disabled:bg-gray-400/20 disabled:hover:scale-100"
      >
        <ZoomOut />
      </button>
      <button
        onClick={() => resetTransform()}
        disabled={isMinScale}
        title="Reset"
        className="scale-100 rounded-full bg-gray-500/50 p-3 font-semibold text-white backdrop-blur-lg transition-transform duration-150 ease-in-out hover:scale-110 active:scale-125 disabled:bg-gray-400/20 disabled:hover:scale-100"
      >
        <RotateCcw />
      </button>
    </div>
  );
};

interface ZoomableImageProps {
  src: string;
  alt: string;
  containerWidth?: string;
  containerHeight?: string;
}

function ZoomableImage({ src, alt }: ZoomableImageProps) {
  const [isMaxScale, setIsMaxScale] = useState(false);
  const [isMinScale, setIsMinScale] = useState(false);

  // 1. Use state to track the scale in the parent component
  const [currentScale, setCurrentScale] = useState(1);

  // 2. Define the callback function using useCallback
  const handleTransform = useCallback((ref: TransformCallbackRef) => {
    // This is the function that updates your local state with the new scale
    const newScale = ref.state.scale;
    setCurrentScale(newScale);
    console.log('Current Scale:', newScale);
  }, []); // Empty dependency array means this function is stable

  // 3. Use the local state (currentScale) as the useEffect dependency
  useEffect(() => {
    const minScale = currentScale <= WRAPPER_MIN_SCALE;
    setIsMinScale(minScale);

    const maxScale = currentScale >= WRAPPER_MAX_SCALE;
    setIsMaxScale(maxScale);
  }, [currentScale]);

  return (
    <div className={`h-screen w-screen rounded-lg p-4`}>
      {/* TransformWrapper is the main container that provides the context 
        for zooming and panning logic.
      */}
      <TransformWrapper
        initialScale={1}
        minScale={1} // Prevents zooming out smaller than the original size
        maxScale={4}
        limitToBounds={true} // Crucial: Prevents panning the image outside the container
        // You can add options for panning behavior, wheel settings, etc., here
        centerOnInit={true}
        onTransformed={handleTransform}
      >
        {/* The Controls component uses the context provided by TransformWrapper */}
        <Controls isMaxScale={isMaxScale} isMinScale={isMinScale} />

        {/* TransformComponent wraps the element you want to apply the 
          zoom and pan to. 
        */}
        <TransformComponent
          wrapperStyle={{
            width: '100%',
            height: '100%',
            // Apply Tailwind classes for container styling here
          }}
          contentStyle={
            {
              // Style for the zoomed content itself (the image)
              // The library handles the transform properties
            }
          }
        >
          {/* Your Image Element */}
          <div className={`h-full w-full overflow-hidden rounded-lg shadow-xl`}>
            <Image
              src={src} // Put your image in /public
              alt={alt}
              unoptimized
              width={700}
              height={700}
              className="object-contain" // keeps full image visible, no cropping
              priority
            />
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}

export default ZoomableImage;
