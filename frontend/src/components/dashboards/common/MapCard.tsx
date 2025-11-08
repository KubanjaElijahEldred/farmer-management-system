import React, { useState } from 'react';
import { MapPin, Maximize2 } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  type: 'farmer' | 'officer' | 'field';
  lat: number;
  lng: number;
  status: string;
}

interface MapCardProps {
  title: string;
  locations: Location[];
}

const MapCard: React.FC<MapCardProps> = ({ title, locations }) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  // Calculate position on the SVG map (simple projection)
  const getMapPosition = (lat: number, lng: number) => {
    // Simple mercator-like projection for display
    const x = ((lng - 32.5) / 3.5) * 100; // Normalize to 0-100
    const y = ((lat - (-17)) / 6) * 100; // Normalize to 0-100
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, 100 - y)) };
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'farmer': return '#22c55e'; // green
      case 'officer': return '#3b82f6'; // blue
      case 'field': return '#eab308'; // yellow
      default: return '#64748b'; // gray
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-blue-600" />
          {title}
        </h3>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Maximize2 className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden border border-gray-200" style={{ height: '400px' }}>
        {/* SVG Map Background */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          {/* Map grid */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
          
          {/* Simplified Malawi shape */}
          <path
            d="M 45,10 L 55,10 L 58,30 L 60,50 L 58,70 L 55,85 L 50,90 L 45,85 L 42,70 L 40,50 L 42,30 Z"
            fill="#d1fae5"
            stroke="#22c55e"
            strokeWidth="0.5"
            opacity="0.3"
          />

          {/* Location markers */}
          {locations.map((location) => {
            const pos = getMapPosition(location.lat, location.lng);
            return (
              <g key={location.id}>
                {/* Marker circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="2"
                  fill={getMarkerColor(location.type)}
                  stroke="white"
                  strokeWidth="0.5"
                  className="cursor-pointer hover:r-3 transition-all"
                  onClick={() => setSelectedLocation(location)}
                />
                {/* Pulse effect */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="2"
                  fill={getMarkerColor(location.type)}
                  opacity="0.3"
                  className="animate-ping"
                />
              </g>
            );
          })}
        </svg>

        {/* Info tooltip */}
        {selectedLocation && (
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200 animate-fadeIn">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getMarkerColor(selectedLocation.type) }}
                  />
                  <h4 className="font-semibold text-gray-900 text-sm">{selectedLocation.name}</h4>
                </div>
                <p className="text-xs text-gray-600 capitalize">Type: {selectedLocation.type}</p>
                <p className="text-xs text-gray-600">Status: {selectedLocation.status}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedLocation.lat.toFixed(4)}°N, {selectedLocation.lng.toFixed(4)}°E
                </p>
              </div>
              <button
                onClick={() => setSelectedLocation(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-xs text-gray-600">Farmers ({locations.filter(l => l.type === 'farmer').length})</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-xs text-gray-600">Officers ({locations.filter(l => l.type === 'officer').length})</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-xs text-gray-600">Fields ({locations.filter(l => l.type === 'field').length})</span>
        </div>
      </div>
    </div>
  );
};

export default MapCard;
