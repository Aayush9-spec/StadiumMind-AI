"use client";

import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  stadiumName: string;
}

const STADIAS: Record<string, [number, number]> = {
  "SoFi Stadium": [33.9534, -118.3392],
  "MetLife Stadium": [40.8135, -74.0743],
  "Estadio Azteca": [19.3029, -99.1505],
};

export default function Map({ stadiumName }: MapProps) {
  useEffect(() => {
    // Correct Leaflet default icon issues in webpack/next bundles
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });

    const coords = STADIAS[stadiumName] || STADIAS["SoFi Stadium"];
    
    // Check if map container is already initialized
    const container = L.DomUtil.get("map-canvas");
    if (container !== null) {
      (container as any)._leaflet_id = null;
    }

    const map = L.map("map-canvas").setView(coords, 16);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Add Gate Markers
    const gateOffsets = [
      { name: "Gate A (North Entrance)", offset: [0.002, 0.002] },
      { name: "Gate B (East Corridor)", offset: [0.001, -0.002] },
      { name: "Gate C (South Egress Point)", offset: [-0.002, -0.001] },
      { name: "Gate D (West Concourse)", offset: [-0.001, 0.002] },
    ];

    gateOffsets.forEach((gate) => {
      const lat = coords[0] + gate.offset[0];
      const lng = coords[1] + gate.offset[1];
      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`<strong>${gate.name}</strong><br/>Live flow monitoring active.`)
        .openPopup();
    });

    return () => {
      map.remove();
    };
  }, [stadiumName]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
      <div id="map-canvas" className="w-full h-80 z-10" />
      <div className="absolute bottom-2 right-2 bg-slate-950/80 border border-slate-800 text-[10px] text-slate-400 px-2 py-1 rounded backdrop-blur z-20">
        GPS Active: {stadiumName}
      </div>
    </div>
  );
}
