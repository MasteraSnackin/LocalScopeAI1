'use client';

import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { MapPin } from 'lucide-react';
import { getCoordinates } from '@/lib/actions';
import { Skeleton } from '../ui/skeleton';

export default function InteractiveMap({ postcode }: { postcode: string }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCoords = async () => {
      setLoading(true);
      setError(null);
      const result = await getCoordinates(postcode);
      if (result.success) {
        setCenter(result.data);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };
    getCoords();
  }, [postcode]);

  if (!apiKey) {
    return (
      <Alert variant="destructive">
        <MapPin className="h-4 w-4" />
        <AlertTitle>Google Maps API Key Missing</AlertTitle>
        <AlertDescription>
          Please add your Google Maps API key to the .env.local file to enable the interactive map.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return <Skeleton className="h-[400px] w-full rounded-lg" />;
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <MapPin className="h-4 w-4" />
        <AlertTitle>Could not load map</AlertTitle>
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!center) {
    return null;
  }

  return (
    <div className="h-[400px] w-full overflow-hidden rounded-lg border">
      <APIProvider apiKey={apiKey}>
        <Map
          center={center}
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
