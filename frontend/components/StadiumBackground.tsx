import React from "react";

export default function StadiumBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Layer 1: blurred stadium backdrop image */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter blur-md scale-105 opacity-10"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop')" }}
      />
      {/* Layer 2: dark gradient overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(6, 15, 40, 0.85), rgba(10, 18, 48, 0.9))"
        }}
      />
      {/* Layer 3: animated mesh gradient effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(79,70,229,0.15),transparent_50%)] animate-pulse" />
      {/* Layer 4: soft radial glows behind grid areas */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl pointer-events-none" />
    </div>
  );
}
