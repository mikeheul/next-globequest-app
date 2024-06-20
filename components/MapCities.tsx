"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { LatLngBounds, LatLngExpression, LatLngTuple, Marker as LeafletMarker } from 'leaflet';
import { MarkerMuster } from "react-leaflet-muster";
import { divIcon } from 'leaflet';

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { Poi } from "@prisma/client";

// Define the interface for map properties
interface MapProps {
    cities: {
        posix: LatLngExpression,
        cityName: string,
    }[],
    zoom?: number,
}

// Default values for zoom level and polyline color
const defaults = {
    zoom: 15,
}

// Helper function to calculate bounds with padding
const getBoundsWithPadding = (cities: { posix: LatLngExpression }[], padding: number): LatLngBounds => {
    const bounds = new LatLngBounds(cities.map(city => city.posix as LatLngTuple));
    bounds.pad(padding); 
    return bounds;
}

// Component to fit map bounds with padding
const FitBounds = ({ cities }: { cities: { posix: LatLngExpression }[] }) => {
    const map = useMap();
    useEffect(() => {
        if (cities.length > 0) {
            const bounds = getBoundsWithPadding(cities, 0.1); // 10% padding
            map.fitBounds(bounds);
        }
    }, [map, cities]);
    return null;
};

// Main MapMulti component
const MapCities = ({ cities = [], zoom = defaults.zoom }: MapProps) => {
    const markerRefs = useRef<LeafletMarker[]>([]);

    useEffect(() => {
        // Open the popup of the first marker when component mounts
        if (markerRefs.current.length > 0) {
            markerRefs.current[0]?.openPopup();
        }
    }, []);

    return (
        <MapContainer
            center={cities.length > 0 ? cities[0].posix : [0, 0]} // Set initial center position
            zoom={zoom} // Set initial zoom level
            scrollWheelZoom={false} // Disable scroll wheel zoom
            attributionControl={false} // Disable attribution control
            style={{ height: "400px", width: "100%" }} // Set map container size
            touchZoom={false} // Allow touch zooming
            tap={false} // Disable tap interaction
            dragging={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />

            <MarkerMuster>
                {cities.map((city, index) => (
                    <Marker
                        key={index}
                        position={city.posix}
                        draggable={false} // Markers are not draggable
                        icon={divIcon({
                            iconSize: [15, 15], // Size of the custom icon
                            iconAnchor: [15, 30], // Anchor point of the icon
                            popupAnchor: [-7.5, -30], // Popup anchor point
                            html: `<div class='flex h-full justify-center items-center'></div>`, // Custom icon HTML
                            className: 'rounded-full bg-[#F7775E] text-white animation-scale' // Custom icon CSS class
                        })}
                        ref={(marker) => {
                            if (marker) markerRefs.current[index] = marker; // Store marker reference
                        }}
                    >
                        <Popup>
                            {/* Display city name */}
                            <p className='text-md mb-0 important font-light'>{city.cityName}</p>
                        </Popup>
                    </Marker>
                ))}
            </MarkerMuster>

            <FitBounds cities={cities} /> {/* Fit bounds to markers with padding */}

        </MapContainer>
    )
}

export default MapCities;