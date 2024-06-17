"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { LatLngBounds, LatLngExpression, LatLngTuple, Marker as LeafletMarker } from 'leaflet';
import { MarkerMuster } from "react-leaflet-muster";
import { divIcon } from 'leaflet';

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface MapProps {
    pois: {
        posix: LatLngExpression,
        poiName: string,
        address?: string
    }[],
    zoom?: number,
    polylineColor?: string
}

const defaults = {
    zoom: 13,
    polylineColor: "#F7775E"
}

// const getBoundsWithPadding = (pois: { posix: LatLngExpression }[], padding: number): LatLngBounds => {
//     const bounds = new LatLngBounds(pois.map(poi => poi.posix as LatLngTuple));
//     bounds.pad(padding); // Add padding to bounds
//     return bounds;
// }

const MapMulti = ({ pois = [], zoom = defaults.zoom, polylineColor = defaults.polylineColor }: MapProps) => {
    const markerRefs = useRef<LeafletMarker[]>([]);

    // const bounds = pois.length > 0 ? getBoundsWithPadding(pois, 0.5) : undefined;

    useEffect(() => {
        // Open the popup of the first marker when component mounts
        if (markerRefs.current.length > 0) {
            markerRefs.current[0]?.openPopup();
        }
    }, []);

    return (
        <MapContainer
            // bounds={bounds}
            center={pois.length > 0 ? pois[0].posix : [0, 0]}
            zoom={zoom}
            scrollWheelZoom={false}
            attributionControl={false}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
                url="https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png"
            />

            <MarkerMuster>
                {pois.map((poi, index) => (
                    <Marker
                        key={index}
                        position={poi.posix}
                        draggable={false}
                        icon={divIcon({
                            iconSize: [30, 30],
                            iconAnchor: [15, 30], // Adjust according to your icon
                            popupAnchor: [0, -30], // Adjust according to your icon
                            html: `<div class='flex h-full justify-center items-center '>${index+1}</div>`,
                            className: 'rounded-full bg-[#F7775E] text-white'
                        })}
                        ref={(marker) => {
                            if (marker) markerRefs.current[index] = marker;
                        }}
                    >
                        <Popup>
                            <p className='text-lg mb-0 important font-bold'>{poi.poiName}</p>
                            {poi.address && <p>{poi.address}</p>}
                        </Popup>
                    </Marker>
                ))}
            </MarkerMuster>

            {/* Add Polyline */}
            {pois.length > 1 && (
                <Polyline
                    positions={pois.map(poi => poi.posix)}
                    color={polylineColor} // Set the color dynamically
                    weight={4}
                    opacity={1}
                />
            )}
        </MapContainer>
    )
}

export default MapMulti;