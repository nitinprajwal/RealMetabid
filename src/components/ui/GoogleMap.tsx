import React, { useState } from 'react';

interface GoogleMapProps {
  address?: string;
  latitude?: number;
  longitude?: number;
  className?: string;
  height?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  address,
  latitude,
  longitude,
  className = "",
  height = "300px"
}) => {
  const [mapError, setMapError] = useState(false);

  // Use OpenStreetMap as the primary map service (no API key required)
  const getOpenStreetMapUrl = () => {
    if (latitude && longitude) {
      // Use coordinates if provided
      const bbox = `${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}`;
      return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;
    } else if (address) {
      // For address, show a general map (users can search within the map)
      return `https://www.openstreetmap.org/export/embed.html?bbox=-74.1,40.6,-73.9,40.9&layer=mapnik`;
    } else {
      // Default view (New York area)
      return `https://www.openstreetmap.org/export/embed.html?bbox=-74.1,40.6,-73.9,40.9&layer=mapnik`;
    }
  };

  const handleIframeError = () => {
    setMapError(true);
  };

  if (mapError) {
    return (
      <div className={`w-full ${className} flex items-center justify-center bg-gray-100 rounded-lg`} style={{ height }}>
        <div className="text-center p-6">
          <div className="text-4xl mb-4">🗺️</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Map Unavailable</h3>
          <p className="text-gray-600 mb-4">Unable to load the interactive map</p>
          {address && (
            <div className="space-y-2">
              <p className="text-sm font-medium">📍 {address}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                View in Google Maps
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <div className="relative w-full h-full">        <iframe
          src={getOpenStreetMapUrl()}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Property Location Map"
          className="rounded-lg"
          onError={handleIframeError}
        />
        
        {/* Map overlay with location info */}
        {address && (
          <div className="absolute top-2 left-2 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md max-w-xs">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="text-sm text-gray-700 font-medium">{address}</p>
            </div>
          </div>
        )}
        
        {/* Instructions overlay for interactive use */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          Click to interact with map
        </div>
      </div>
      
      {/* Alternative: Provide a link to open in Google Maps */}
      {address && (
        <div className="mt-2 flex justify-between items-center text-sm">
          <span className="text-gray-600">📍 {address}</span>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Open in Google Maps
          </a>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;
