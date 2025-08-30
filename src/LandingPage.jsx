import { useState } from 'react';
import logo from './assets/firebyte-logo.svg';

export default function LandingPage() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 40;
    setOffset({ x, y });
  };

  const layerStyle = (depth) => ({
    transform: `translate3d(${offset.x / depth}px, ${offset.y / depth}px, 0)`
  });

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-screen h-screen overflow-hidden bg-black text-white"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-lg"
        style={layerStyle(-4)}
      />
      <div
        className="absolute inset-0"
        style={{
          ...layerStyle(-2),
          background:
            'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1), transparent 70%)'
        }}
      />
      <div
        className="relative flex items-center justify-center w-full h-full"
        style={layerStyle(1)}
      >
        <img src={logo} alt="Firebyte logo" className="w-64 h-64 object-contain" />
      </div>
    </div>
  );
}
