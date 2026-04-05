import { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/lib/utils';
import { OSM_ATTRIBUTION, OSM_TILE_URL } from '@/lib/map-tiles';
import { Driver, Route, RoutePoint, Schedule } from '@/types/shuttle';

interface StaticMapProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
  onMapReady?: (map: L.Map) => void;
  // Static data
  drivers?: Driver[];
  routes?: Route[];
  routePoints?: RoutePoint[];
  activeSchedules?: Schedule[];
  onDriverClick?: (driverId: string) => void;
}

const StaticMap = ({
  center = [3.5952, 98.6722],
  zoom = 13,
  className,
  onMapReady,
  drivers = [],
  routes = [],
  routePoints = [],
  activeSchedules = [],
  onDriverClick,
}: StaticMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const [mapReady, setMapReady] = useState(false);

  const [centerLat, centerLng] = center;

  // Initialize map with base layer once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Fix for Leaflet icons in Vite
    const iconPrototypeObj = L.Icon.Default.prototype as unknown as Record<string, unknown>;
    delete iconPrototypeObj._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });

    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView([centerLat, centerLng], zoom);

    // OpenStreetMap base layer
    L.tileLayer(OSM_TILE_URL, {
      attribution: OSM_ATTRIBUTION,
      maxZoom: 19,
      minZoom: 2,
    }).addTo(map);

    mapInstance.current = map;
    setMapReady(true);

    if (onMapReady) {
      onMapReady(map);
    }

    return () => {
      map.remove();
      mapInstance.current = null;
      setMapReady(false);
    };
  }, []);

  // Update map view only when coordinates or zoom change
  useEffect(() => {
    if (!mapInstance.current) return;
    mapInstance.current.setView([centerLat, centerLng], zoom);
  }, [centerLat, centerLng, zoom]);

  // Add static markers for schedule locations
  useEffect(() => {
    if (!mapInstance.current) return;

    // Add route point markers
    routePoints.forEach((point) => {
      const markerId = `point-${point.id}`;

      // Create simple marker
      const marker = L.circleMarker([point.lat, point.lng], {
        radius: 6,
        fillColor: '#3b82f6',
        color: '#1e40af',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      }).addTo(mapInstance.current!);

      marker.bindPopup(`<div style="font-size: 12px; font-weight: bold;">${point.name}</div>`, {
        closeButton: true,
      });

      marker.on('click', () => {
        marker.openPopup();
      });

      markersRef.current[markerId] = marker;
    });

    // Add route lines
    const routes_map = new Map<string, RoutePoint[]>();
    routePoints.forEach((point) => {
      if (!routes_map.has(point.routeId)) {
        routes_map.set(point.routeId, []);
      }
      routes_map.get(point.routeId)!.push(point);
    });

    routes_map.forEach((points) => {
      if (points.length > 1) {
        const sorted = [...points].sort((a, b) => a.order - b.order);
        const latlngs = sorted.map((p) => [p.lat, p.lng] as L.LatLngExpression);
        
        L.polyline(latlngs, {
          color: '#f97316',
          weight: 3,
          opacity: 0.7,
          dashArray: '5, 5',
        }).addTo(mapInstance.current!);
      }
    });

    return () => {
      // Clean up markers
      Object.values(markersRef.current).forEach((marker) => {
        if (mapInstance.current) {
          mapInstance.current.removeLayer(marker);
        }
      });
      markersRef.current = {};
    };
  }, [routePoints]);

  return (
    <div
      ref={mapRef}
      className={cn('w-full h-full bg-slate-100 relative z-0', className)}
    />
  );
};

export default StaticMap;
