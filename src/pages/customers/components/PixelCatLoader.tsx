import React from 'react';

const PixelCatLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative scale-150">
        {/* Pixel sleeping silver gradient British Shorthair */}
        <div className="relative w-40 h-32">

          {/* Main body - silver gradient effect */}
          <div className="absolute bottom-0 left-6 w-28 h-20 bg-gray-300 pixel-shadow"></div>

          {/* Body highlights for silver gradient */}
          <div className="absolute bottom-4 left-8 w-6 h-3 bg-gray-100 pixel-shadow opacity-70"></div>
          <div className="absolute bottom-8 left-10 w-4 h-2 bg-gray-200 pixel-shadow opacity-60"></div>

          {/* Head */}
          <div className="absolute bottom-12 left-0 w-20 h-16 bg-gray-300 pixel-shadow"></div>

          {/* Head gradient highlights */}
          <div className="absolute bottom-20 left-2 w-4 h-4 bg-gray-100 pixel-shadow opacity-70"></div>
          <div className="absolute bottom-16 left-4 w-3 h-3 bg-gray-200 pixel-shadow opacity-60"></div>

          {/* Ears */}
          <div className="absolute bottom-24 left-2 w-4 h-4 bg-gray-300 pixel-shadow"></div>
          <div className="absolute bottom-24 left-10 w-4 h-4 bg-gray-300 pixel-shadow"></div>

          {/* Inner ears */}
          <div className="absolute bottom-25 left-3 w-2 h-2 bg-pink-300 pixel-shadow"></div>
          <div className="absolute bottom-25 left-11 w-2 h-2 bg-pink-300 pixel-shadow"></div>

          {/* Round cheeks (British Shorthair characteristic) */}
          <div className="absolute bottom-16 left-0 w-3 h-6 bg-gray-300 pixel-shadow"></div>
          <div className="absolute bottom-16 right-12 w-3 h-6 bg-gray-300 pixel-shadow"></div>

          {/* Closed eyes (sleeping) */}
          <div className="absolute bottom-18 left-4 w-5 h-1 bg-gray-600 pixel-shadow"></div>
          <div className="absolute bottom-18 left-11 w-5 h-1 bg-gray-600 pixel-shadow"></div>

          {/* Eye lashes */}
          <div className="absolute bottom-19 left-5 w-1 h-2 bg-gray-400 pixel-shadow"></div>
          <div className="absolute bottom-19 left-7 w-1 h-2 bg-gray-400 pixel-shadow"></div>
          <div className="absolute bottom-19 left-12 w-1 h-2 bg-gray-400 pixel-shadow"></div>
          <div className="absolute bottom-19 left-14 w-1 h-2 bg-gray-400 pixel-shadow"></div>

          {/* Nose */}
          <div className="absolute bottom-14 left-9 w-2 h-1 bg-pink-400 pixel-shadow"></div>

          {/* Mouth (slight smile) */}
          <div className="absolute bottom-12 left-8 w-1 h-1 bg-gray-500 pixel-shadow"></div>
          <div className="absolute bottom-12 left-11 w-1 h-1 bg-gray-500 pixel-shadow"></div>

          {/* Whiskers */}
          <div className="absolute bottom-15 left-0 w-4 h-1 bg-gray-400 pixel-shadow"></div>
          <div className="absolute bottom-13 left-0 w-3 h-1 bg-gray-400 pixel-shadow"></div>
          <div className="absolute bottom-15 right-12 w-4 h-1 bg-gray-400 pixel-shadow"></div>
          <div className="absolute bottom-13 right-12 w-3 h-1 bg-gray-400 pixel-shadow"></div>

          {/* Front paws */}
          <div className="absolute bottom-2 left-8 w-5 h-5 bg-gray-400 pixel-shadow"></div>
          <div className="absolute bottom-2 left-16 w-5 h-5 bg-gray-400 pixel-shadow"></div>

          {/* Paw pads */}
          <div className="absolute bottom-3 left-9 w-3 h-3 bg-pink-300 pixel-shadow"></div>
          <div className="absolute bottom-3 left-17 w-3 h-3 bg-pink-300 pixel-shadow"></div>

          {/* Tail - curved around body */}
          <div className="absolute bottom-4 right-0 w-10 h-4 bg-gray-300 pixel-shadow"></div>
          <div className="absolute bottom-8 right-4 w-4 h-4 bg-gray-300 pixel-shadow"></div>

          {/* Tail gradient */}
          <div className="absolute bottom-6 right-1 w-3 h-2 bg-gray-100 pixel-shadow opacity-60"></div>

          {/* Body stripes (British Shorthair pattern) */}
          <div className="absolute bottom-6 left-12 w-2 h-1 bg-gray-400 pixel-shadow opacity-50"></div>
          <div className="absolute bottom-10 left-14 w-2 h-1 bg-gray-400 pixel-shadow opacity-50"></div>

          {/* Belly */}
          <div className="absolute bottom-4 left-12 w-8 h-8 bg-gray-200 pixel-shadow opacity-80"></div>
        </div>

        {/* Sleeping Z's with animation */}
        <div className="absolute -top-8 right-0">
          <div className="z-1 text-gray-500 text-lg font-bold animate-float-slow">Z</div>
          <div className="z-2 text-gray-400 text-base font-bold animate-float">z</div>
          <div className="z-3 text-gray-300 text-sm font-bold animate-float-delayed">z</div>
          <div className="z-4 text-gray-200 text-xs font-bold animate-float-slower">z</div>
        </div>

        {/* Snoring bubbles */}
        <div className="absolute bottom-0 left-8">
          <div className="bubble-1 w-2 h-2 bg-blue-200 rounded-full animate-bubble opacity-60"></div>
          <div className="bubble-2 w-1 h-1 bg-blue-300 rounded-full animate-bubble-delayed opacity-40"></div>
        </div>
      </div>

      {/* Loading text */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 font-medium text-lg">Loading customers...</p>
        <p className="text-gray-400 text-sm mt-2">Silver kitty is dreaming of customer data 💤</p>
      </div>

      {/* Enhanced pixel-style CSS animations */}
      <style>{`
        .pixel-cat * {
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
          image-rendering: -webkit-crisp-edges;
        }

        .pixel-shadow {
          box-shadow:
            2px 2px 0 rgba(0, 0, 0, 0.1),
            -1px -1px 0 rgba(255, 255, 255, 0.2),
            inset 1px 1px 0 rgba(255, 255, 255, 0.1);
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-12px) translateX(3px) scale(1.1);
            opacity: 1;
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-8px) translateX(-2px);
            opacity: 0.8;
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-6px) translateX(2px);
            opacity: 0.6;
          }
        }

        @keyframes float-slower {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-4px) translateX(-1px);
            opacity: 0.5;
          }
        }

        @keyframes bubble {
          0% {
            transform: translateY(0px) scale(1);
            opacity: 0.6;
          }
          100% {
            transform: translateY(-20px) scale(0.3);
            opacity: 0;
          }
        }

        @keyframes bubble-delayed {
          0% {
            transform: translateY(0px) scale(1);
            opacity: 0.4;
          }
          100% {
            transform: translateY(-15px) scale(0.2);
            opacity: 0;
          }
        }

        .animate-float {
          animation: float 2.5s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite;
          animation-delay: 0.8s;
        }

        .animate-float-slow {
          animation: float-slow 3.5s ease-in-out infinite;
          animation-delay: 1.5s;
        }

        .animate-float-slower {
          animation: float-slower 4s ease-in-out infinite;
          animation-delay: 2.2s;
        }

        .animate-bubble {
          animation: bubble 2s ease-out infinite;
        }

        .animate-bubble-delayed {
          animation: bubble-delayed 2.5s ease-out infinite;
          animation-delay: 1s;
        }

        .z-1 {
          position: absolute;
          top: 0;
          right: 0;
        }

        .z-2 {
          position: absolute;
          top: 12px;
          right: 8px;
        }

        .z-3 {
          position: absolute;
          top: 24px;
          right: 4px;
        }

        .z-4 {
          position: absolute;
          top: 32px;
          right: 12px;
        }

        .bubble-1 {
          position: absolute;
          bottom: 0;
          left: 0;
        }

        .bubble-2 {
          position: absolute;
          bottom: 4px;
          left: 8px;
        }

        .scale-150 {
          transform: scale(1.5);
        }
      `}</style>
    </div>
  );
};

export default PixelCatLoader;