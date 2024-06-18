"use client"

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression, LatLngTuple, Marker as LeafletMarker } from 'leaflet';
import { MarkerMuster } from "react-leaflet-muster";
import { divIcon } from 'leaflet';
import { LeafyGreenIcon } from 'lucide-react';

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface MapProps {
    posix: LatLngExpression | LatLngTuple,
    poiName: String,
    address?: String,
    zoom?: number,
}

const defaults = {
    zoom: 17,
}

const customIcon = divIcon({
    html: `
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    `,
    iconSize: [30, 30],
    iconAnchor: [30, 39],
    popupAnchor: [-5, -30],
    className: 'text-[#F7775E]'
});

const Map = (Map: MapProps) => {
    const { zoom = defaults.zoom, posix, poiName, address } = Map

    const markerRef = useRef<LeafletMarker>(null);

    useEffect(() => {
        if (markerRef.current) {
            markerRef.current.openPopup();
        }
    }, []);

    return (
        <MapContainer
            center={posix}
            zoom={zoom}
            scrollWheelZoom={false}
            attributionControl={false}
            style={{ height: "100%", width: "100%" }}
        >
            {/* <TileLayer
                attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
                url="https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png"
            /> */}

            <TileLayer
                attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
            />
            
            <MarkerMuster>
                <Marker 
                    position={posix} 
                    draggable={false}
                    // icon={divIcon({
                    //     iconSize: [30, 30],
                    //     iconAnchor: [30, 39],
                    //     popupAnchor: [-5, -30],
                    //     className: "text-4xl",
                    //     // html: "💀",
                    //     // html: "<p class='w-[200px] text-center text-sm text-white bg-red-500 border-slate-200 px-2 py-1'>Kevin was here</p>",
                    // })}
                    icon={customIcon}
                    ref={markerRef}
                >
                    <Popup>
                        <p className='text-lg mb-0 important font-bold'>{ poiName }</p>
                        <p>{ address }</p>
                    </Popup>
                </Marker>
            </MarkerMuster>

        </MapContainer>
    )
}

export default Map