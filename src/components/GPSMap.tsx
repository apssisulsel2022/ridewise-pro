import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/lib/utils';
import { OSM_ATTRIBUTION, OSM_TILE_URL } from '@/lib/map-tiles';
import { Driver, Route, RoutePoint, Schedule, DriverLocation } from '@/types/shuttle';
import { createDriverIcon, createRouteLine, createDriverPopup, DriverStatusType } from '@/lib/map-icons';
import { toast } from 'sonner';

interface GPSMapProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
  onMapReady?: (map: L.Map) => void;
  // Static data
  drivers?: Driver[];
  routes?: Route[];
  routePoints?: RoutePoint[];
  activeSchedules?: Schedule[];
  driverLocations?: Record<string, DriverLocation>;
  onDriverClick?: (driverId: string) => void;
  // GPS configuration
  enableGPS?: boolean;
  updateInterval?: number;
}

const GPSMap = ({
  center = [3.5952, 98.6722],
  zoom = 13,
  className,
  onMapReady,
  drivers = [],
  routes = [],
  routePoints = [],
  activeSchedules = [],
  driverLocations = {},
  onDriverClick,
  enableGPS = true,
  updateInterval = 5000,
}: GPSMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const routeLinesRef = useRef<Record<string, L.Polyline>>({});
  const driverMarkersRef = useRef<Record<string, L.Marker>>({});
  const [mapReady, setMapReady] = useState(false);

  const [centerLat, centerLng] = center;

  // GPS tracking - using prop data instead of service
  const isConnected = enableGPS && Object.keys(driverLocations).length > 0;

  // Get driver status for icon
  const getDriverStatus = useCallback((driver: Driver, location?: DriverLocation, schedule?: Schedule): DriverStatusType => {
    if (!location) return 'offline';

    const isMoving = (location.speed || 0) > 5;
    const hasActiveTrip = schedule && ['boarding', 'departed', 'in-transit'].includes(schedule.status);

    if (!driver || driver.status !== 'online') return 'offline';
    if (hasActiveTrip) return isMoving ? 'online-moving' : 'online-stopped';
    return 'on-trip';
  }, []);

  // Initialize map
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
  }, [centerLat, centerLng, zoom, onMapReady]);

  // Update map view
  useEffect(() => {
    if (!mapInstance.current) return;
    mapInstance.current.setView([centerLat, centerLng], zoom);
  }, [centerLat, centerLng, zoom]);

  // Add static route points and lines
  useEffect(() => {
    if (!mapInstance.current) return;

    // Add route point markers
    routePoints.forEach((point) => {
      const markerId = `point-${point.id}`;

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

    routes_map.forEach((points, routeId) => {
      if (points.length > 1) {
        const sorted = [...points].sort((a, b) => a.order - b.order);
        const latlngs = sorted.map((p) => [p.lat, p.lng] as L.LatLngExpression);

        const routeLine = L.polyline(latlngs, {
          color: '#f97316',
          weight: 3,
          opacity: 0.7,
          dashArray: '5, 5',
        }).addTo(mapInstance.current!);

        routeLinesRef.current[routeId] = routeLine;
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

      // Clean up route lines
      Object.values(routeLinesRef.current).forEach((line) => {
        if (mapInstance.current) {
          mapInstance.current.removeLayer(line);
        }
      });
      routeLinesRef.current = {};
    };
  }, [routePoints]);

  // Add GPS driver markers
  useEffect(() => {
    if (!mapInstance.current || !enableGPS) return;

    // Update driver markers based on GPS locations
    Object.entries(driverLocations).forEach(([driverId, location]) => {
      const driver = drivers.find(d => d.id === driverId);
      const schedule = activeSchedules.find(s => s.driverId === driverId);

      if (!driver || !location) return;

      const markerId = `driver-${driverId}`;
      const status = getDriverStatus(driver, location, schedule);
      const icon = createDriverIcon(status, driver.name.charAt(0));

      // Remove existing marker
      if (driverMarkersRef.current[markerId]) {
        mapInstance.current!.removeLayer(driverMarkersRef.current[markerId]);
      }

      // Create new marker
      const marker = L.marker([location.lat, location.lng], { icon }).addTo(mapInstance.current!);

      // Create popup
      const popupHTML = createDriverPopup(driver, schedule, location);
      marker.bindPopup(L.popup({ className: 'driver-popup' }).setContent(popupHTML));

      // Add click handler
      marker.on('click', () => {
        if (onDriverClick) {
          onDriverClick(driverId);
        }
        marker.openPopup();
      });

      driverMarkersRef.current[markerId] = marker;
    });

    return () => {
      // Clean up driver markers
      Object.values(driverMarkersRef.current).forEach((marker) => {
        if (mapInstance.current) {
          mapInstance.current.removeLayer(marker);
        }
      });
      driverMarkersRef.current = {};
    };
  }, [driverLocations, drivers, activeSchedules, enableGPS, getDriverStatus, onDriverClick]);

  // Show connection status
  useEffect(() => {
    if (enableGPS && !isConnected) {
      toast.info('GPS tracking initializing...', {
        duration: 2000,
      });
    } else if (enableGPS && isConnected) {
      toast.success('GPS tracking active', {
        duration: 2000,
      });
    }
  }, [isConnected, enableGPS]);

  return (
    <div
      ref={mapRef}
      className={cn('w-full h-full bg-slate-100 relative z-0', className)}
    >
      {/* GPS Status Indicator */}
      {enableGPS && (
        <div className="absolute top-6 right-6 z-[400]">
          <div className={cn(
            "px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2",
            isConnected
              ? "bg-green-500/90 text-white shadow-lg"
              : "bg-yellow-500/90 text-white shadow-lg animate-pulse"
          )}>
            <div className={cn(
              "w-2 h-2 rounded-full",
              isConnected ? "bg-white" : "bg-white animate-ping"
            )} />
            {isConnected ? 'GPS Active' : 'GPS Connecting'}
          </div>
        </div>
      )}
    </div>
  );
};

export default GPSMap;