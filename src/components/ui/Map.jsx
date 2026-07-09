import { useMemo } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const Map = ({ locations = [], onMapClick }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "", 
  });

  // Default to a central coordinate (Colombo, SL) or center on the specific location if single
  const center = useMemo(() => {
    if (locations.length === 1 && locations[0].lat && locations[0].lng) {
      return { lat: parseFloat(locations[0].lat), lng: parseFloat(locations[0].lng) };
    }
    return { lat: 6.9271, lng: 79.8612 };
  }, [locations]); 

  if (!isLoaded) return (
    <div className="h-full w-full bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-500 font-medium border border-slate-200 text-sm">
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

