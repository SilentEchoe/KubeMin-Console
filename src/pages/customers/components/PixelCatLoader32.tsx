import React from 'react';

const PixelCatLoader32: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-8 h-8 scale-100">
        {/* 32px pixel sleeping cat - ultra compact */}
        <div className="relative w-8 h-8">

          {/* Body - laying down position */}
          <div className="absolute bottom-1 left-1 w-6 h-2 bg-gray-400 pixel-shadow-32"></div>

          {/* Head - resting on paws */}
          <div className="absolute bottom-3 left-2 w-4 h-2 bg-gray-400 pixel-shadow-32"></div>

          {/* Ears - relaxed position */}
          <div className="absolute bottom-4 left-2 w-1 h-1 bg-gray-400 pixel-shadow-32"></div>
          <div className="absolute bottom-4 left-5 w-1 h-1 bg-gray-400 pixel-shadow-32"></div>

          {/* Closed eyes - sleeping */}
          <div className="absolute bottom-3 left-3 w-1 h-px bg-gray-600 pixel-shadow-32"></div>
          <div className="absolute bottom-3 left-5 w-1 h-px bg-gray-600 pixel-shadow-32"></div>

          {/* Paws - stretched forward */}
          <div className="absolute bottom-1 left-0 w-1 h-1 bg-gray-500 pixel-shadow-32"></div>
          <div className="absolute bottom-1 left-7 w-1 h-1 bg-gray-500 pixel-shadow-32"></div>

          {/* Tail - curled around */}
          <div className="absolute bottom-0 left-3 w-2 h-1 bg-gray-400 pixel-shadow-32"></div>

          {/* Silver gradient highlights (1px each) */}
          <div className="absolute bottom-2 left-4 w-px h-px bg-gray-200 pixel-shadow-32 opacity-70"></div>
          <div className="absolute bottom-1 left-5 w-px h-px bg-gray-300 pixel-shadow-32 opacity-60"></div>
        </div>

        {/* Mini Z's */}
        <div className="absolute -top-2 right-0">
          <div className="text-gray-500 text-[10px] font-bold" style={{animation: 'float-mini 2s ease-in-out infinite'}}>Z</div>
          <div className="text-gray-400 text-[10px] font-bold" style={{animation: 'float-mini-delayed 2s ease-in-out infinite 0.5s'}}>z</div>
        </div>
      </div>

      {/* Compact loading text */}
      <div className="ml-3 text-sm text-gray-600">
        Loading...
      </div>

      {/* Mini animations CSS */}
      <style>{`
        .pixel-shadow-32 {
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(255, 255, 255, 0.2);
        }

        .pixel-shadow {
          box-shadow:
            1px 1px 0 rgba(0, 0, 0, 0.1),
            -1px -1px 0 rgba(255, 255, 255, 0.2);
        }

        @keyframes float-mini {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-1px) translateX(0.5px);
            opacity: 1;
          }
        }

        @keyframes float-mini-delayed {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-0.5px) translateX(-0.5px);
            opacity: 0.8;
          }
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

export default PixelCatLoader32;