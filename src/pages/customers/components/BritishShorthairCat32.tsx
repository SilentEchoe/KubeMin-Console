import React from 'react';

const BritishShorthairCat32: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-8 h-8 scale-100">
        {/* 32px British Shorthair cat - pixel art style */}
        <div className="relative w-8 h-8">

          {/* Main body - silver gradient British Shorthair */}
          <div className="absolute bottom-1 left-1 w-6 h-3 bg-gray-400 pixel-cat-shadow"></div>
          <div className="absolute bottom-1 left-2 w-4 h-2 bg-gray-300 pixel-cat-shadow"></div>

          {/* Head - round British Shorthair shape with silver gradient */}
          <div className="absolute bottom-3 left-2 w-4 h-3 bg-gray-400 pixel-cat-shadow"></div>
          <div className="absolute bottom-4 left-3 w-2 h-2 bg-gray-200 pixel-cat-shadow"></div>

          {/* Folded ears - British Shorthair characteristic */}
          <div className="absolute bottom-4 left-2 w-1 h-1 bg-gray-400 pixel-cat-shadow"></div>
          <div className="absolute bottom-4 left-5 w-1 h-1 bg-gray-400 pixel-cat-shadow"></div>
          <div className="absolute bottom-5 left-2 w-1 h-1 bg-gray-300 pixel-cat-shadow"></div>
          <div className="absolute bottom-5 left-5 w-1 h-1 bg-gray-300 pixel-cat-shadow"></div>

          {/* Eyes - large and round */}
          <div className="absolute bottom-3 left-3 w-1 h-1 bg-amber-600 pixel-cat-shadow"></div>
          <div className="absolute bottom-3 left-5 w-1 h-1 bg-amber-600 pixel-cat-shadow"></div>
          <div className="absolute bottom-4 left-3 w-px h-px bg-black"></div>
          <div className="absolute bottom-4 left-5 w-px h-px bg-black"></div>

          {/* Nose - small pink */}
          <div className="absolute bottom-2 left-4 w-px h-px bg-pink-400"></div>

          {/* Mouth - subtle smile */}
          <div className="absolute bottom-2 left-3 w-px h-px bg-gray-600"></div>
          <div className="absolute bottom-2 left-5 w-px h-px bg-gray-600"></div>

          {/* Paws - British Shorthair stocky build */}
          <div className="absolute bottom-0 left-1 w-1 h-1 bg-gray-400 pixel-cat-shadow"></div>
          <div className="absolute bottom-0 left-6 w-1 h-1 bg-gray-400 pixel-cat-shadow"></div>

          {/* Tail - thick and medium length */}
          <div className="absolute bottom-1 left-0 w-1 h-2 bg-gray-300 pixel-cat-shadow"></div>
          <div className="absolute bottom-2 left-0 w-1 h-1 bg-gray-400 pixel-cat-shadow"></div>

          {/* Silver gradient highlights - British Shorthair characteristic */}
          <div className="absolute bottom-3 left-4 w-px h-px bg-gray-100 opacity-80"></div>
          <div className="absolute bottom-2 left-3 w-px h-px bg-gray-200 opacity-70"></div>
          <div className="absolute bottom-1 left-4 w-px h-px bg-gray-100 opacity-60"></div>

          {/* Subtle cheek blush */}
          <div className="absolute bottom-2 left-2 w-px h-px bg-pink-200 opacity-50"></div>
          <div className="absolute bottom-2 left-6 w-px h-px bg-pink-200 opacity-50"></div>
        </div>

        {/* Mini sparkles for British shorthair elegance */}
        <div className="absolute -top-1 right-0">
          <div className="text-gray-400 text-xs animate-pulse">✦</div>
          <div className="text-gray-300 text-xs animate-pulse delay-100">✧</div>
        </div>
      </div>

      {/* Compact loading text */}
      <div className="ml-3 text-sm text-gray-600">
        Loading...
      </div>

      {/* Pixel cat CSS */}
      <style>{`
        .pixel-cat-shadow {
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(255, 255, 255, 0.4);
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }

        .delay-100 {
          animation-delay: 0.5s;
        }

        .w-px {
          width: 1px;
        }

        .h-px {
          height: 1px;
        }
      `}</style>
    </div>
  );
};

export default BritishShorthairCat32;