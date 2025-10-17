"use client";

import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { MapPin } from 'lucide-react';

// In a real app, this would come from an API call based on the postcode
const geocodePostcode = async (postcode: string): Promise<{ lat: number, lng: number } | null> => {
    // This is a mock. A real implementation would use Google's Geocoding API.
    // The lat/lng are approximate for central London.
    if(postcode.startsWith('SW1A')) {
        return { lat: 51.503364, lng: -0.127625 };
    }
    // A default fallback
    return { lat: 51.5074, lng: -0.1278 };
};


export default function InteractiveMap({ postcode }: { postcode: string }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const getCoords = async () => {
        const coords = await geocodePostcode(postcode);
        setCenter(coords);
    }
    getCoords();
  }, [postcode]);

  if (!apiKey) {
    return (
      <Alert variant="destructive">
        <MapPin className="h-4 w-4" />
        <AlertTitle>Google Maps API Key Missing</AlertTitle>
        <AlertDescription>
          Please add your Google Maps API key to a `.env.local` file to enable the interactive map.
        </AlertDescription>
      </Alert>
    );
  }

  if (!center) {
    return <div className="h-[400px] w-full bg-muted animate-pulse rounded-lg" />;
  }

  return (
    <div className="h-[400px] w-full overflow-hidden rounded-lg border">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={center}
          defaultZoom={14}
          mapId="localscope_map"
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
            <Marker position={center} />
        </Map>
      </APIProvider>
    </div>
  );
}
