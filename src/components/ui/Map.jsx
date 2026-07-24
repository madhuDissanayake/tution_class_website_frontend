import { useMemo } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const Map = ({ locations = [], onMapClick }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey, 
  });

  // Default to a central coordinate (Colombo, SL) or center on the specific location if single
  const center = useMemo(() => {
    if (locations.length === 1 && locations[0].lat && locations[0].lng) {
      return { lat: parseFloat(locations[0].lat), lng: parseFloat(locations[0].lng) };
    }
    return { lat: 6.9271, lng: 79.8612 };
  }, [locations]); 

  // If there's no API key or there's a load error, show the static fallback
  if (!apiKey || loadError) {
    return (
      <div className="h-full w-full bg-slate-100/50 rounded-2xl flex items-center justify-center border border-slate-200 p-4">
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-6 py-3 bg-white border border-slate-200 shadow-sm rounded-xl text-blue-600 font-medium hover:bg-slate-50 hover:shadow transition-all flex items-center gap-3"
        >
          <span className="text-xl">🗺️</span>
          Open in Google Maps
        </a>
      </div>
    );
  }

  if (!isLoaded) return (
    <div className="h-full w-full bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-900 font-medium border border-slate-200 text-sm">
      Loading Interactive Map...
    </div>
  );

  return (
    <GoogleMap 
      zoom={locations.length === 1 ? 15 : 12} 
      center={center} 
      mapContainerClassName="w-full h-full rounded-2xl shadow-sm border border-slate-100"
      onClick={onMapClick}
    >
      {locations.map((loc, idx) => (
        loc.lat && loc.lng && (
          <Marker 
            key={idx} 
            position={{ lat: parseFloat(loc.lat), lng: parseFloat(loc.lng) }} 
            title={loc.title} 
          />
        )
      ))}
    </GoogleMap>
  );
};

export default Map;
