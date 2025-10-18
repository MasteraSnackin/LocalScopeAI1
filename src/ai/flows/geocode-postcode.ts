'use server';
/**
 * @fileOverview A flow for getting the lat/lng coordinates for a postcode.
 *
 * - geocodePostcode - A function that returns coordinates for a postcode.
 * - GeocodePostcodeInput - The input type for the geocodePostcode function.
 * - GeocodePostcodeOutput - The return type for the geocodePostcode function.
 */

import axios from 'axios';
import { z } from 'genkit';

const GeocodePostcodeInputSchema = z.object({
  postcode: z.string().describe('The UK postcode.'),
});
export type GeocodePostcodeInput = z.infer<typeof GeocodePostcodeInputSchema>;

const GeocodePostcodeOutputSchema = z.object({
  lat: z.number().describe('The latitude of the postcode.'),
  lng: z.number().describe('The longitude of the postcode.'),
});
export type GeocodePostcodeOutput = z.infer<typeof GeocodePostcodeOutputSchema>;

export async function geocodePostcode(input: GeocodePostcodeInput): Promise<GeocodePostcodeOutput> {
  const postcode = encodeURIComponent(input.postcode.trim());

  // 1. Try postcodes.io
  try {
    const url = `https://api.postcodes.io/postcodes/${postcode}`;
    const response = await axios.get(url);
    if (response.data.status === 200 && response.data.result) {
      return {
        lat: response.data.result.latitude,
        lng: response.data.result.longitude,
      };
    }
  } catch (err) {
    // Ignore and try Google as fallback
  }

  // 2. Fallback: Google Maps Geocoding API
  const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
  if (!googleApiKey) throw new Error('Google Maps API key is missing for fallback geocoding.');

  const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${postcode}&region=uk&key=${googleApiKey}`;
  const googleResp = await axios.get(googleUrl);
  if (
    googleResp.data.status === "OK" &&
    googleResp.data.results &&
    googleResp.data.results.length > 0
  ) {
    const loc = googleResp.data.results[0].geometry.location;
    return {
      lat: loc.lat,
      lng: loc.lng,
    };
  }

  throw new Error('Could not geocode postcode (tried postcodes.io and Google Maps)');
}
