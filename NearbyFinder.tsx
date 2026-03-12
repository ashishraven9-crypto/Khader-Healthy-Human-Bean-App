/*
 * DESIGN: Organic Wellness - Nearby Hospital & Pharmacy Finder
 * Uses Google Maps Places API with geolocation
 * Warm sage/cream palette, organic card design
 */

/// <reference types="@types/google.maps" />

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapView } from "@/components/Map";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MapPin,
  Navigation,
  Hospital,
  Pill,
  Star,
  Clock,
  Phone,
  ExternalLink,
  Locate,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  Route,
  Loader2,
  Building2,
} from "lucide-react";

type PlaceType = "hospital" | "pharmacy";

interface CityOption {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

const AP_CITIES: CityOption[] = [
  { id: "vijayawada", name: "Vijayawada", lat: 16.5062, lng: 80.6480 },
  { id: "kurnool", name: "Kurnool", lat: 15.8281, lng: 78.0373 },
];

interface NearbyPlace {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating?: number;
  userRatingsTotal?: number;
  isOpen?: boolean;
  distance?: string;
  distanceMeters?: number;
  phone?: string;
  placeType: PlaceType;
}

export default function NearbyFinder() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [activeType, setActiveType] = useState<PlaceType>("hospital");
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>("vijayawada");

  // Clear existing markers
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => (m.map = null));
    markersRef.current = [];
  }, []);

  // Create a styled marker element
  const createMarkerContent = useCallback(
    (type: PlaceType, isSelected: boolean = false) => {
      const div = document.createElement("div");
      div.style.cssText = `
      width: ${isSelected ? "40px" : "32px"};
      height: ${isSelected ? "40px" : "32px"};
      border-radius: 50%;
      background: ${type === "hospital" ? "#dc4a3f" : "#2d6a4f"};
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      cursor: pointer;
    `;
      div.innerHTML =
        type === "hospital"
          ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><path d="M12 2v4"/><path d="M3 10h18"/><path d="M3 10v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10"/><path d="M12 14v4"/><path d="M10 16h4"/></svg>`
          : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>`;
      return div;
    },
    []
  );

  // Create user location marker
  const createUserMarker = useCallback(() => {
    const div = document.createElement("div");
    div.style.cssText = `
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #4285f4;
      border: 3px solid white;
      box-shadow: 0 0 0 8px rgba(66, 133, 244, 0.2), 0 2px 6px rgba(0,0,0,0.3);
    `;
    return div;
  }, []);

  // Calculate distance between two points
  const calcDistance = useCallback(
    (lat1: number, lng1: number, lat2: number, lng2: number): number => {
      const R = 6371e3;
      const p1 = (lat1 * Math.PI) / 180;
      const p2 = (lat2 * Math.PI) / 180;
      const dp = ((lat2 - lat1) * Math.PI) / 180;
      const dl = ((lng2 - lng1) * Math.PI) / 180;
      const a =
        Math.sin(dp / 2) * Math.sin(dp / 2) +
        Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    },
    []
  );

  const formatDistance = useCallback((meters: number): string => {
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  }, []);

  // Search for nearby places
  const searchNearby = useCallback(
    (type: PlaceType, location: google.maps.LatLngLiteral) => {
      if (!placesServiceRef.current || !mapRef.current) return;

      setLoading(true);
      setError(null);
      clearMarkers();

      const request: google.maps.places.PlaceSearchRequest = {
        location: new google.maps.LatLng(location.lat, location.lng),
        rankBy: google.maps.places.RankBy.DISTANCE,
        type: type,
      };

      placesServiceRef.current.nearbySearch(
        request,
        (
          results: google.maps.places.PlaceResult[] | null,
          status: google.maps.places.PlacesServiceStatus
        ) => {
          setLoading(false);

          if (
            status !== google.maps.places.PlacesServiceStatus.OK ||
            !results ||
            results.length === 0
          ) {
            setError(
              `No ${type === "hospital" ? "hospitals" : "pharmacies"} found nearby. Try a different location.`
            );
            setPlaces([]);
            return;
          }

          const mappedPlaces: NearbyPlace[] = results.slice(0, 15).map((r) => {
            const lat = r.geometry?.location?.lat() ?? 0;
            const lng = r.geometry?.location?.lng() ?? 0;
            const distMeters = calcDistance(location.lat, location.lng, lat, lng);
            return {
              id: r.place_id ?? Math.random().toString(),
              name: r.name ?? "Unknown",
              address: r.vicinity ?? "Address unavailable",
              lat,
              lng,
              rating: r.rating,
              userRatingsTotal: r.user_ratings_total,
              isOpen: r.opening_hours?.open_now,
              distance: formatDistance(distMeters),
              distanceMeters: distMeters,
              phone: r.formatted_phone_number,
              placeType: type,
            };
          });

          // Sort by distance
          mappedPlaces.sort(
            (a, b) => (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0)
          );
          setPlaces(mappedPlaces);

          // Add markers
          mappedPlaces.forEach((place) => {
            const marker = new google.maps.marker.AdvancedMarkerElement({
              map: mapRef.current!,
              position: { lat: place.lat, lng: place.lng },
              title: place.name,
              content: createMarkerContent(type),
            });

            marker.addListener("gmp-click", () => {
              setSelectedPlace(place.id);
              mapRef.current?.panTo({ lat: place.lat, lng: place.lng });
              mapRef.current?.setZoom(16);
            });

            markersRef.current.push(marker);
          });
        }
      );
    },
    [clearMarkers, calcDistance, formatDistance, createMarkerContent]
  );

  // Get user location
  const getUserLocation = useCallback(() => {
    setLocationLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(loc);
        setLocationLoading(false);

        if (mapRef.current) {
          mapRef.current.panTo(loc);
          mapRef.current.setZoom(14);

          // Add/update user marker
          if (userMarkerRef.current) {
            userMarkerRef.current.position = loc;
          } else {
            userMarkerRef.current =
              new google.maps.marker.AdvancedMarkerElement({
                map: mapRef.current,
                position: loc,
                title: "Your Location",
                content: createUserMarker(),
              });
          }

          searchNearby(activeType, loc);
        }
      },
      (err) => {
        setLocationLoading(false);
        // Fallback to Andhra Pradesh, India
        const fallback = { lat: 16.5062, lng: 80.6480 };
        setUserLocation(fallback);
        if (mapRef.current) {
          mapRef.current.panTo(fallback);
          mapRef.current.setZoom(14);
          if (!userMarkerRef.current) {
            userMarkerRef.current =
              new google.maps.marker.AdvancedMarkerElement({
                map: mapRef.current,
                position: fallback,
                title: "Default Location (Andhra Pradesh)",
                content: createUserMarker(),
              });
          }
          searchNearby(activeType, fallback);
        }
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError(
              "Location access was denied. Showing results for Andhra Pradesh, India. Enable location permissions for accurate results."
            );
            break;
          case err.POSITION_UNAVAILABLE:
            setError(
              "Your location could not be determined. Showing results for Andhra Pradesh, India."
            );
            break;
          case err.TIMEOUT:
            setError(
              "Location request timed out. Showing results for Andhra Pradesh, India."
            );
            break;
          default:
            setError("Location unavailable. Showing results for Andhra Pradesh, India.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [activeType, searchNearby, createUserMarker]);

  // Handle map ready
  const handleMapReady = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      placesServiceRef.current = new google.maps.places.PlacesService(map);
      setMapReady(true);

      // Immediately search with default city location so users see results right away
      const city = AP_CITIES.find((c) => c.id === "vijayawada") ?? AP_CITIES[0];
      const defaultLoc = { lat: city.lat, lng: city.lng };
      setUserLocation(defaultLoc);
      setLoading(true);

      const service = new google.maps.places.PlacesService(map);
      const request: google.maps.places.PlaceSearchRequest = {
        location: defaultLoc,
        radius: 5000,
        type: "hospital",
      };

      service.nearbySearch(request, (results, status) => {
        setLoading(false);
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          results
        ) {
          clearMarkers();
          const mappedPlaces: NearbyPlace[] = results.map((r) => {
            const lat = r.geometry?.location?.lat() ?? 0;
            const lng = r.geometry?.location?.lng() ?? 0;
            const distMeters = calcDistance(defaultLoc.lat, defaultLoc.lng, lat, lng);
            return {
              id: r.place_id ?? Math.random().toString(),
              name: r.name ?? "Unknown",
              address: r.vicinity ?? "Address unavailable",
              lat,
              lng,
              rating: r.rating,
              userRatingsTotal: r.user_ratings_total,
              isOpen: r.opening_hours?.open_now,
              distance: formatDistance(distMeters),
              distanceMeters: distMeters,
              phone: r.formatted_phone_number,
              placeType: "hospital" as PlaceType,
            };
          });
          mappedPlaces.sort(
            (a, b) => (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0)
          );
          setPlaces(mappedPlaces);

          // Add markers
          mappedPlaces.forEach((place) => {
            const marker = new google.maps.marker.AdvancedMarkerElement({
              map,
              position: { lat: place.lat, lng: place.lng },
              title: place.name,
              content: createMarkerContent("hospital"),
            });
            marker.addListener("gmp-click", () => {
              setSelectedPlace(place.id);
              map.panTo({ lat: place.lat, lng: place.lng });
              map.setZoom(16);
            });
            markersRef.current.push(marker);
          });
        }
      });

      // Also add user marker at default location
      userMarkerRef.current =
        new google.maps.marker.AdvancedMarkerElement({
          map,
          position: defaultLoc,
          title: `Your Location (${city.name})`,
          content: createUserMarker(),
        });

      // Try to get real location in parallel - if successful, it will override
      getUserLocation();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Switch place type
  const handleTypeSwitch = useCallback(
    (type: PlaceType) => {
      setActiveType(type);
      setSelectedPlace(null);
      if (userLocation) {
        searchNearby(type, userLocation);
      }
    },
    [userLocation, searchNearby]
  );

  // Switch city
  const handleCitySwitch = useCallback(
    (cityId: string) => {
      setSelectedCity(cityId);
      setSelectedPlace(null);
      setError(null);
      const city = AP_CITIES.find((c) => c.id === cityId);
      if (!city || !mapRef.current) return;
      const loc = { lat: city.lat, lng: city.lng };
      setUserLocation(loc);
      mapRef.current.panTo(loc);
      mapRef.current.setZoom(13);

      // Update user marker
      if (userMarkerRef.current) {
        userMarkerRef.current.map = null;
      }
      userMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position: loc,
        title: `Your Location (${city.name})`,
        content: createUserMarker(),
      });

      searchNearby(activeType, loc);
    },
    [activeType, searchNearby, createUserMarker]
  );

  // Open directions in Google Maps
  const openDirections = useCallback(
    (place: NearbyPlace) => {
      const origin = userLocation
        ? `${userLocation.lat},${userLocation.lng}`
        : "";
      const dest = `${place.lat},${place.lng}`;
      window.open(
        `https://www.google.com/maps/dir/${origin}/${dest}`,
        "_blank"
      );
    },
    [userLocation]
  );

  return (
    <div className="space-y-5">
      {/* Controls Row */}
      <div className="flex flex-col gap-3">
        {/* City Selector */}
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">City:</span>
          <div className="flex items-center gap-1.5 bg-secondary/50 rounded-full p-1">
            {AP_CITIES.map((city) => (
              <button
                key={city.id}
                onClick={() => handleCitySwitch(city.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCity === city.id
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>

        {/* Type Toggle & Location Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-secondary/50 rounded-full p-1">
            <button
              onClick={() => handleTypeSwitch("hospital")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeType === "hospital"
                  ? "bg-coral text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Hospital className="w-3.5 h-3.5" />
              Hospitals
            </button>
            <button
              onClick={() => handleTypeSwitch("pharmacy")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeType === "pharmacy"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Pill className="w-3.5 h-3.5" />
              Pharmacies
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="rounded-full gap-1.5"
            onClick={getUserLocation}
            disabled={locationLoading}
          >
            {locationLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Locate className="w-3.5 h-3.5" />
            )}
            {locationLoading ? "Locating..." : "Update Location"}
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert className="border-coral/20 bg-coral/5">
              <AlertCircle className="w-4 h-4 text-coral" />
              <AlertDescription className="text-sm text-muted-foreground">
                {error}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map & Results Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Map */}
        <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-border/50 shadow-sm">
          <MapView
            className="w-full h-[400px] lg:h-[520px]"
            initialCenter={userLocation ?? { lat: 16.5062, lng: 80.6480 }}
            initialZoom={13}
            onMapReady={handleMapReady}
          />
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          <Card className="border-border/50 h-full">
            <div className="p-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {activeType === "hospital" ? (
                    <Hospital className="w-4 h-4 text-coral" />
                  ) : (
                    <Pill className="w-4 h-4 text-primary" />
                  )}
                  <h3 className="font-serif text-base">
                    Nearby{" "}
                    {activeType === "hospital" ? "Hospitals" : "Pharmacies"}
                  </h3>
                </div>
                {!loading && places.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="rounded-full text-[10px]"
                  >
                    {places.length} found
                  </Badge>
                )}
              </div>
              {userLocation && (
                <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                  <Navigation className="w-3 h-3" />
                  Showing results near your location
                </p>
              )}
            </div>

            <ScrollArea className="h-[340px] lg:h-[440px]">
              <div className="p-3 space-y-2">
                {/* Loading State */}
                {loading && (
                  <div className="space-y-3 p-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-1/2" />
                        {i < 4 && <Separator className="my-2" />}
                      </div>
                    ))}
                  </div>
                )}

                {/* No Location State */}
                {!loading && !userLocation && !error && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <Locate className="w-7 h-7 text-primary" />
                    </div>
                    <p className="font-serif text-base text-foreground mb-1">
                      Enable Location
                    </p>
                    <p className="text-sm text-muted-foreground max-w-xs mb-4">
                      Allow location access to find hospitals and pharmacies
                      near you.
                    </p>
                    <Button
                      size="sm"
                      className="rounded-full gap-1.5"
                      onClick={getUserLocation}
                    >
                      <Locate className="w-3.5 h-3.5" />
                      Share My Location
                    </Button>
                  </div>
                )}

                {/* Empty Results */}
                {!loading && userLocation && places.length === 0 && !error && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                      <MapPin className="w-7 h-7 text-muted-foreground" />
                    </div>
                    <p className="font-serif text-base text-foreground mb-1">
                      No Results
                    </p>
                    <p className="text-sm text-muted-foreground max-w-xs mb-4">
                      No{" "}
                      {activeType === "hospital" ? "hospitals" : "pharmacies"}{" "}
                      found nearby. Try refreshing your location.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full gap-1.5"
                      onClick={getUserLocation}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Retry
                    </Button>
                  </div>
                )}

                {/* Place Cards */}
                {!loading &&
                  places.map((place, i) => (
                    <motion.div
                      key={place.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                    >
                      <button
                        onClick={() => {
                          setSelectedPlace(place.id);
                          mapRef.current?.panTo({
                            lat: place.lat,
                            lng: place.lng,
                          });
                          mapRef.current?.setZoom(16);
                        }}
                        className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
                          selectedPlace === place.id
                            ? "border-primary/40 bg-primary/5 shadow-sm"
                            : "border-border/50 hover:border-primary/20 hover:bg-secondary/30"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="font-medium text-sm text-foreground truncate">
                                {place.name}
                              </p>
                              {place.isOpen !== undefined && (
                                <Badge
                                  variant="secondary"
                                  className={`text-[9px] rounded-full shrink-0 ${
                                    place.isOpen
                                      ? "bg-sage/10 text-sage border-sage/20"
                                      : "bg-coral/10 text-coral border-coral/20"
                                  }`}
                                >
                                  {place.isOpen ? "Open" : "Closed"}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate mb-1.5">
                              {place.address}
                            </p>
                            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                              {place.rating && (
                                <span className="flex items-center gap-0.5">
                                  <Star className="w-3 h-3 text-amber-warm fill-amber-warm" />
                                  {place.rating.toFixed(1)}
                                  {place.userRatingsTotal && (
                                    <span className="text-muted-foreground/60">
                                      ({place.userRatingsTotal})
                                    </span>
                                  )}
                                </span>
                              )}
                              {place.distance && (
                                <span className="flex items-center gap-0.5">
                                  <Route className="w-3 h-3" />
                                  {place.distance}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openDirections(place);
                            }}
                            className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                            title="Get Directions"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Expanded details when selected */}
                        <AnimatePresence>
                          {selectedPlace === place.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <Separator className="my-2" />
                              <div className="flex items-center gap-2 flex-wrap">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-full text-xs gap-1 h-7"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDirections(place);
                                  }}
                                >
                                  <Navigation className="w-3 h-3" />
                                  Directions
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-full text-xs gap-1 h-7"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(
                                      `https://www.google.com/maps/place/?q=place_id:${place.id}`,
                                      "_blank"
                                    );
                                  }}
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  View on Maps
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </button>
                    </motion.div>
                  ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>

      {/* Info Note */}
      <p className="text-xs text-muted-foreground text-center">
        Results are based on your current location and sorted by distance. Tap
        any result to see it on the map.
      </p>
    </div>
  );
}
