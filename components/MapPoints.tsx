"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { LatLngBounds, LatLngExpression, LatLngTuple, Marker as LeafletMarker } from 'leaflet';
import { MarkerMuster } from "react-leaflet-muster";
import { divIcon } from 'leaflet';

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

// Define the interface for map properties
interface MapProps {
    points: {
        posix: LatLngExpression,
        pointName: string,
    }[],
    zoom?: number,
}

// Default values for zoom level and polyline color
const defaults = {
    zoomWithoutPOIs: 5,
    zoomWithPOIs: 15,
}

// Helper function to calculate bounds with padding
const getBoundsWithPadding = (points: { posix: LatLngExpression }[]): LatLngBounds => {
    return new LatLngBounds(points.map(point => point.posix as LatLngTuple));
};

const FitBounds = ({ points }: { points: { posix: LatLngExpression }[] }) => {
    const map = useMap();
    useEffect(() => {
        if (points.length > 0) {
            const bounds = getBoundsWithPadding(points);
            map.fitBounds(bounds, {
                paddingTopLeft: [100, 100],   // 100 pixels padding on the top-left
                paddingBottomRight: [100, 100] // 100 pixels padding on the bottom-right
            });
        }
    }, [map, points]);
    return null;
};

// Main MapMulti component
const MapPoints = ({ points = [], zoom }: MapProps) => {
    const markerRefs = useRef<LeafletMarker[]>([]);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [tileLayerUrl, setTileLayerUrl] = useState("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png");

    useEffect(() => {
        // Open the popup of the first marker when component mounts
        if (markerRefs.current.length > 0) {
            markerRefs.current[0]?.openPopup();
        }
    }, []);

    useEffect(() => {
        // Function to check if dark mode is enabled
        const checkDarkMode = () => {
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        };

        const updateTileLayer = () => {
            const darkMode = checkDarkMode();
            setIsDarkMode(darkMode);
            // ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            setTileLayerUrl(darkMode
                ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            );
        };

        // Add listener for changes to the dark mode preference
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        darkModeMediaQuery.addEventListener('change', updateTileLayer);

        // Initial check
        updateTileLayer();

        // Cleanup listener on unmount
        return () => {
            darkModeMediaQuery.removeEventListener('change', updateTileLayer);
        };
    }, []);

    const initialZoom = zoom || (points.length > 1 ? defaults.zoomWithPOIs : defaults.zoomWithoutPOIs);

    return (
        <MapContainer
            center={points.length > 0 ? points[0].posix : [0,0]} // Set initial center position
            zoom={initialZoom} // Set initial zoom level
            scrollWheelZoom={false} // Disable scroll wheel zoom
            attributionControl={false} // Disable attribution control
            style={{ height: "400px", width: "100%" }} // Set map container size
            touchZoom={false} // Allow touch zooming
            tap={false} // Disable tap interaction
            dragging={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                // url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                url={tileLayerUrl}
            />

            <MarkerMuster>
                {points.map((point, index) => (
                    <Marker
                        key={index}
                        position={point.posix}
                        draggable={false} // Markers are not draggable
                        icon={divIcon({
                            iconSize: [15, 15], // Size of the custom icon
                            iconAnchor: [15, 30], // Anchor point of the icon
                            popupAnchor: [-7.5, -30], // Popup anchor point
                            html: `<div class='marker-icon'></div>`, // Custom icon HTML
                            className: '' // Custom icon CSS class
                        })}
                        ref={(marker) => {
                            if (marker) markerRefs.current[index] = marker; // Store marker reference
                        }}
                    >
                        <Popup>
                            {/* Display point name */}
                            <p className='text-md mb-0 important font-light'>{point.pointName}</p>
                        </Popup>
                    </Marker>
                ))}
            </MarkerMuster>

            {/* Fit bounds to markers with padding */}
            {points.length > 1 && <FitBounds points={points} />} 

        </MapContainer>
    )
}

export default MapPoints;