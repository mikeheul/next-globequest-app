"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { LatLngBounds, LatLngExpression, LatLngTuple, Marker as LeafletMarker } from 'leaflet';
import { MarkerMuster } from "react-leaflet-muster";
import { divIcon } from 'leaflet';

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

// Define the interface for map properties
interface MapProps {
    pois: {
        posix: LatLngExpression,
        poiName: string,
        address?: string,
        website?: string
    }[],
    zoom?: number,
    polylineColor?: string
}

// Default values for zoom level and polyline color
const defaults = {
    zoom: 15,
    polylineColor: "#F7775E"
}

// Helper function to calculate bounds with padding
const getBoundsWithPadding = (pois: { posix: LatLngExpression }[], padding: number): LatLngBounds => {
    const bounds = new LatLngBounds(pois.map(poi => poi.posix as LatLngTuple));
    bounds.pad(padding); 
    return bounds;
}

// Component to fit map bounds with padding
const FitBounds = ({ pois }: { pois: { posix: LatLngExpression }[] }) => {
    const map = useMap();
    useEffect(() => {
        if (pois.length > 0) {
            const bounds = getBoundsWithPadding(pois, 0.1); // 10% padding
            map.fitBounds(bounds);
        }
    }, [map, pois]);
    return null;
};

// Main MapMulti component
const MapMulti = ({ pois = [], zoom = defaults.zoom, polylineColor = defaults.polylineColor }: MapProps) => {
    const markerRefs = useRef<LeafletMarker[]>([]);

    useEffect(() => {
        // Open the popup of the first marker when component mounts
        if (markerRefs.current.length > 0) {
            markerRefs.current[0]?.openPopup();
        }
    }, []);

    return (
        <MapContainer
            center={pois.length > 0 ? pois[0].posix : [0, 0]} // Set initial center position
            zoom={zoom} // Set initial zoom level
            scrollWheelZoom={true} // Disable scroll wheel zoom
            attributionControl={false} // Disable attribution control
            style={{ height: "100%", width: "100%" }} // Set map container size
        >
            {/* <TileLayer
                attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
                url="https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png" // Set tile layer URL
            /> */}

            <TileLayer
                attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
            />

            <MarkerMuster>
                {pois.map((poi, index) => (
                    <Marker
                        key={index}
                        position={poi.posix}
                        draggable={false} // Markers are not draggable
                        icon={divIcon({
                            iconSize: [30, 30], // Size of the custom icon
                            iconAnchor: [15, 30], // Anchor point of the icon
                            popupAnchor: [0, -30], // Popup anchor point
                            html: `<div class='flex h-full justify-center items-center '>${index+1}</div>`, // Custom icon HTML
                            className: 'rounded-full bg-[#F7775E] text-white' // Custom icon CSS class
                        })}
                        ref={(marker) => {
                            if (marker) markerRefs.current[index] = marker; // Store marker reference
                        }}
                    >
                        <Popup>
                            {/* Display POI name */}
                            <p className='text-lg mb-0 important font-bold'>{poi.poiName}</p>
                            {/* Display POI address if available */}
                            {poi.address && <p>{poi.address}</p>} 
                            {poi.website && <a target='_blank' href={poi.website}>Website</a>} 
                        </Popup>
                    </Marker>
                ))}
            </MarkerMuster>

            {/* Add Polyline to connect markers */}
            {pois.length > 1 && (
                <Polyline
                    positions={pois.map(poi => poi.posix)} // Set polyline positions
                    color={polylineColor} // Set polyline color
                    weight={4} // Set polyline weight
                    opacity={1} // Set polyline opacity
                />
            )}

            <FitBounds pois={pois} /> {/* Fit bounds to markers with padding */}

        </MapContainer>
    )
}

export default MapMulti;