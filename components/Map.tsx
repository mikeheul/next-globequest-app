"use client"

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression, LatLngTuple, Marker as LeafletMarker } from 'leaflet';
import { MarkerMuster } from "react-leaflet-muster";
import { divIcon } from 'leaflet';

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
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />  */}

            {/* <TileLayer
                attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            /> */}

            <TileLayer
                attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
                url="https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png"
            />
            
            <MarkerMuster>
                <Marker 
                    position={posix} 
                    draggable={false}
                    icon={divIcon({
                        iconSize: [30, 30],
                        iconAnchor: [30, 39],
                        popupAnchor: [-5, -30],
                        className: "text-4xl",
                        html: "🌟",
                    })}
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