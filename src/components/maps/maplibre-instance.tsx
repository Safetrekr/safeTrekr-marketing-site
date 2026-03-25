"use client";

/**
 * ST-840: REQ-048 -- MapLibre GL JS Instance (Internal)
 *
 * This component is loaded via `next/dynamic` with `ssr: false` to keep
 * MapLibre GL JS (~180KB gzipped) out of the initial bundle. It should
 * never be imported directly -- use `HeroMap` instead.
 *
 * Responsibilities:
 * - Initialize MapLibre GL JS with MapTiler basemap tiles
 * - Apply a custom desaturated style matching the #e7ecee palette
 * - Render a route line in primary-500 from origin to destination
 * - Place 3-4 waypoint markers along the route
 * - Draw a dashed geofence boundary outline
 *
 * @internal Not for direct use -- imported dynamically by hero-map.tsx
 */

import { useRef, useEffect, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MapLibreInstanceProps {
  /** Additional CSS class names for the map container. */
  className?: string;

  /** Whether to display the route line and waypoints. */
  showRoute?: boolean;

  /** Whether the map should be interactive (pan, zoom, rotate). */
  interactive?: boolean;

  /** Callback fired once the map style has loaded and layers are ready. */
  onReady?: () => void;
}

// ---------------------------------------------------------------------------
// Route Data
// ---------------------------------------------------------------------------

/**
 * Representative route coordinates [lng, lat] forming a curved path.
 * These create a visually appealing route for the hero composition
 * without tying to any real-world location.
 */
const ROUTE_COORDINATES: [number, number][] = [
  [-73.99, 40.73], // Origin
  [-73.98, 40.74], // Waypoint 1
  [-73.97, 40.755], // Waypoint 2
  [-73.955, 40.765], // Waypoint 3
  [-73.945, 40.78], // Destination
];

/** Center point for initial map view. */
const MAP_CENTER: [number, number] = [-73.968, 40.755];

/** Geofence center and radius (approximate visual circle). */
const GEOFENCE_CENTER: [number, number] = [-73.968, 40.757];
const GEOFENCE_RADIUS_KM = 0.8;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Generates a GeoJSON polygon approximating a circle for the geofence.
 * Uses 64 segments for smooth rendering at all zoom levels.
 */
function createCirclePolygon(
  center: [number, number],
  radiusKm: number,
  segments = 64,
): GeoJSON.Feature<GeoJSON.Polygon> {
  const coords: [number, number][] = [];
  const km2deg = 1 / 111.32; // rough km-to-degree conversion at equator

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * 2 * Math.PI;
    const dx = radiusKm * Math.cos(angle) * km2deg;
    // Adjust for longitude compression at this latitude
    const dy =
      radiusKm *
      Math.sin(angle) *
      km2deg *
      (1 / Math.cos((center[1] * Math.PI) / 180));
    coords.push([center[0] + dy, center[1] + dx]);
  }

  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [coords],
    },
  };
}

/**
 * Custom desaturated MapTiler style.
 *
 * When a MapTiler API key is present, we use the "dataviz-light" style
 * which provides a clean, muted basemap. We override the background
 * and water colors to match our design system.
 *
 * When no API key is present (local dev), we fall back to a minimal
 * self-contained style that renders without tile requests.
 */
function getMapStyle(): maplibregl.StyleSpecification | string {
  const apiKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;

  if (apiKey) {
    return `https://api.maptiler.com/maps/dataviz-light/style.json?key=${apiKey}`;
  }

  // Fallback: minimal style with OpenStreetMap raster tiles
  // This ensures the component still works without a MapTiler key
  return {
    version: 8,
    name: "safetrekr-fallback",
    sources: {
      "osm-raster": {
        type: "raster",
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      },
    },
    layers: [
      {
        id: "background",
        type: "background",
        paint: {
          "background-color": "#e7ecee",
        },
      },
      {
        id: "osm-tiles",
        type: "raster",
        source: "osm-raster",
        paint: {
          "raster-saturation": -0.85,
          "raster-brightness-min": 0.1,
          "raster-brightness-max": 0.95,
          "raster-contrast": -0.15,
          "raster-opacity": 0.7,
        },
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Waypoint Marker Element Factory
// ---------------------------------------------------------------------------

/**
 * Creates a DOM element for a waypoint marker matching the design system.
 * Outer halo: primary-100, inner: primary-600, center dot: white.
 */
function createWaypointElement(isEndpoint: boolean): HTMLElement {
  const el = document.createElement("div");
  const size = isEndpoint ? 24 : 20;
  const innerSize = isEndpoint ? 14 : 12;
  const dotSize = isEndpoint ? 6 : 5;

  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.borderRadius = "50%";
  el.style.backgroundColor = "#e0f1e6"; // primary-100
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.justifyContent = "center";
  el.style.cursor = "default";

  const inner = document.createElement("div");
  inner.style.width = `${innerSize}px`;
  inner.style.height = `${innerSize}px`;
  inner.style.borderRadius = "50%";
  inner.style.backgroundColor = "#3f885b"; // primary-600
  inner.style.display = "flex";
  inner.style.alignItems = "center";
  inner.style.justifyContent = "center";

  const dot = document.createElement("div");
  dot.style.width = `${dotSize}px`;
  dot.style.height = `${dotSize}px`;
  dot.style.borderRadius = "50%";
  dot.style.backgroundColor = "#ffffff";

  inner.appendChild(dot);
  el.appendChild(inner);

  return el;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MapLibreInstance({
  className,
  showRoute = true,
  interactive = false,
  onReady,
}: MapLibreInstanceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  const addRouteAndMarkers = useCallback(
    (map: maplibregl.Map) => {
      if (!showRoute) {
        onReadyRef.current?.();
        return;
      }

      // ── Geofence boundary ──
      map.addSource("geofence", {
        type: "geojson",
        data: createCirclePolygon(GEOFENCE_CENTER, GEOFENCE_RADIUS_KM),
      });

      map.addLayer({
        id: "geofence-outline",
        type: "line",
        source: "geofence",
        paint: {
          "line-color": "#6cbc8b", // primary-400
          "line-width": 1.5,
          "line-dasharray": [4, 3],
          "line-opacity": 0.5,
        },
      });

      // ── Route line ──
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: ROUTE_COORDINATES,
          },
        },
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#4ca46e", // primary-500
          "line-width": 3,
        },
      });

      // ── Waypoint markers ──
      for (let i = 0; i < ROUTE_COORDINATES.length; i++) {
        const coords = ROUTE_COORDINATES[i];
        if (!coords) continue;

        const isEndpoint = i === 0 || i === ROUTE_COORDINATES.length - 1;
        const el = createWaypointElement(isEndpoint);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat(coords)
          .addTo(map);

        markersRef.current.push(marker);
      }

      onReadyRef.current?.();
    },
    [showRoute],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const map = new maplibregl.Map({
      container,
      style: getMapStyle(),
      center: MAP_CENTER,
      zoom: 13.5,
      pitch: 0,
      bearing: 0,
      interactive,
      attributionControl: false,
      fadeDuration: 0,
    });

    mapRef.current = map;

    // Add lightweight attribution in bottom-right
    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-right",
    );

    // Apply desaturation filter when using MapTiler style
    map.on("style.load", () => {
      const apiKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;
      if (apiKey) {
        // Desaturate the base layers to match the muted hero palette.
        // MapTiler dataviz-light is already fairly muted, but we push
        // it further to ensure the route line stands out clearly.
        const layers = map.getStyle().layers;
        if (layers) {
          for (const layer of layers) {
            if (layer.type === "raster") {
              map.setPaintProperty(layer.id, "raster-saturation", -0.7);
              map.setPaintProperty(layer.id, "raster-brightness-min", 0.15);
              map.setPaintProperty(layer.id, "raster-brightness-max", 0.92);
            }
          }
        }
      }
    });

    map.on("load", () => {
      addRouteAndMarkers(map);
    });

    return () => {
      // Clean up markers
      for (const marker of markersRef.current) {
        marker.remove();
      }
      markersRef.current = [];

      map.remove();
      mapRef.current = null;
    };
  }, [interactive, addRouteAndMarkers]);

  return (
    <div
      ref={containerRef}
      className={cn("h-full w-full", className)}
      // MapLibre manages its own interactive region; screen readers
      // should skip this decorative element entirely.
      aria-hidden="true"
    />
  );
}
