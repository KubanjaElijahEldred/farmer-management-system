import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';

// Fix for default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Location {
  id: string;
  name: string;
  type: 'farmer' | 'officer' | 'field';
  lat: number;
  lng: number;
  status: string;
}

interface RealMapCardProps {
  title: string;
  locations: Location[];
}

// Custom marker icons
const createCustomIcon = (type: string) => {
  const colors = {
    farmer: '#22c55e',
    officer: '#3b82f6',
    field: '#eab308',
  };

  const color = colors[type as keyof typeof colors] || '#64748b';

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-size: 14px;
          font-weight: bold;
        ">
          ${type === 'farmer' ? '🌾' : type === 'officer' ? '👤' : '📍'}
        </div>
      </div>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42],
  });
};

// Map controls component
const MapControls: React.FC = () => {
  const map = useMap();

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2">
      <button
        onClick={() => map.zoomIn()}
        className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
        title="Zoom In"
      >
        <ZoomIn className="w-5 h-5 text-gray-700" />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
        title="Zoom Out"
      >
        <ZoomOut className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
};

const RealMapCard: React.FC<RealMapCardProps> = ({ title, locations }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Calculate map center (average of all locations)
  const center: [number, number] = locations.length > 0
    ? [
        locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length,
        locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length,
      ]
    : [-13.9626, 33.7741]; // Default to Malawi center

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'farmer': return 'text-green-600';
      case 'officer': return 'text-blue-600';
      case 'field': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${isFullscreen ? 'fixed inset-4 z-50' : 'h-full'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-blue-600" />
          {title}
        </h3>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          <Maximize2 className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Real Map Container */}
      <div className="relative rounded-lg overflow-hidden border border-gray-200" style={{ height: isFullscreen ? 'calc(100% - 100px)' : '400px' }}>
        <MapContainer
          center={center}
          zoom={8}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          {/* OpenStreetMap tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Custom zoom controls */}
          <MapControls />

          {/* Markers for each location */}
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={[location.lat, location.lng]}
              icon={createCustomIcon(location.type)}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-semibold text-gray-900 mb-1">{location.name}</h4>
                  <div className="space-y-1 text-sm">
                    <p className={`font-medium capitalize ${getMarkerColor(location.type)}`}>
                      {location.type}
                    </p>
                    <p className="text-gray-600">Status: {location.status}</p>
                    <p className="text-gray-500 text-xs">
                      📍 {location.lat.toFixed(4)}°N, {location.lng.toFixed(4)}°E
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-xs text-gray-600">
            Farmers ({locations.filter(l => l.type === 'farmer').length})
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-xs text-gray-600">
            Officers ({locations.filter(l => l.type === 'officer').length})
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-xs text-gray-600">
            Fields ({locations.filter(l => l.type === 'field').length})
          </span>
        </div>
      </div>
    </div>
  );
};

export default RealMapCard;
