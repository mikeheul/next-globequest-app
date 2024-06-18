"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { LatLngExpression, divIcon } from 'leaflet';
import { MarkerMuster } from "react-leaflet-muster";
import L from 'leaflet';
import 'leaflet-routing-machine';
import "leaflet/dist/leaflet.css";

interface MapProps {
    pois: {
        posix: LatLngExpression,
        poiName: string,
        address?: string,
        website?: string
    }[],
    zoom?: number,
    routeColor?: string, 
}

const defaults = {
    zoom: 15,
    routeColor: "#F7775E",
    profiles: {
        foot: 'https://routing.openstreetmap.de/routed-foot/route/v1/',
        bike: 'https://routing.openstreetmap.de/routed-bike/route/v1/',
        car: 'https://routing.openstreetmap.de/routed-car/route/v1/'
    }
}

const FitBounds = ({ pois }: { pois: { posix: LatLngExpression }[] }) => {
    const map = useMap();
    useEffect(() => {
        if (pois.length > 0) {
            const bounds = L.latLngBounds(pois.map(poi => poi.posix));
            map.fitBounds(bounds);
        }
    }, [map, pois]);
    return null;
};

const MapRoute = ({ pois = [], zoom = defaults.zoom, routeColor = defaults.routeColor }: MapProps) => {
    const markerRefs = useRef<L.Marker[]>([]);
    const [routeControl, setRouteControl] = useState<L.Routing.Control | null>(null);
    const [profile, setProfile] = useState<string>('foot');
    const [totalDistance, setTotalDistance] = useState<number | null>(null);
    const [totalTime, setTotalTime] = useState<number | null>(null);

    useEffect(() => {
        if (pois.length > 1) {
            const waypoints = pois.map(poi => L.latLng(poi.posix));
            const control = L.Routing.control({
                waypoints,
                router: new L.Routing.OSRMv1({
                    serviceUrl: defaults.profiles[profile as keyof typeof defaults.profiles],
                    profile: profile,
                }),
                lineOptions: {
                    styles: [{ color: routeColor, opacity: 0.7, weight: 5 }],
                    extendToWaypoints: true,
                    missingRouteTolerance: 0,
                    addWaypoints: false,
                },
                show: true,
                plan: L.Routing.plan(waypoints, {
                    createMarker: () => {
                        return false; // Returning false to use default markers
                    },
                }),
            }).on('routesfound', function(e) {
                const routes = e.routes;
                const summary = routes[0].summary;
                setTotalDistance(summary.totalDistance / 1000); // Convert to kilometers
                setTotalTime(summary.totalTime / 60); // Convert to minutes
            });
            setRouteControl(control);
        } else {
            setRouteControl(null); // Reset route control if less than 2 pois
        }
    }, [pois, profile, routeColor]);

    useEffect(() => {
        return () => {
            // Cleanup function to remove route control from the map
            if (routeControl) {
                routeControl.getPlan().setWaypoints([]); // Clear waypoints
                routeControl.remove(); // Remove from map
            }
        };
    }, [routeControl]);

    return (
        <div className='h-full w-full relative'>
            <div className='absolute top-5 right-5 z-[1000] rounded-lg p-5 bg-white/60'>
                <select
                    value={profile}
                    onChange={(e) => setProfile(e.target.value)}
                    className="border border-gray-300 rounded-md shadow-sm focus:outline-none p-4"
                >
                    <option value="foot">Foot</option>
                    <option value="bike">Bike</option>
                    <option value="car">Car</option>
                </select>
                {totalDistance !== null && (
                    <div className="mt-2">
                        Total Distance: {totalDistance.toFixed(2)} km
                    </div>
                )}
                {totalTime !== null && (
                    <div>
                        Estimated Time: {Math.floor(totalTime / 60)} h {Math.floor(totalTime % 60)} m
                    </div>
                )}
            </div>
            <MapContainer
                center={pois.length > 0 ? pois[0].posix : [0, 0]}
                zoom={zoom}
                scrollWheelZoom={true}
                attributionControl={false}
                style={{ height: "100%", width: "100%" }}
                touchZoom={true}
                tap={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                <FitBounds pois={pois} />

                {routeControl && (
                    <RoutingControlWrapper
                        routeControl={routeControl}
                        pois={pois}
                        markerRefs={markerRefs}
                    />
                )}

                <MarkerMuster>
                    {pois.map((poi, index) => (
                        <Marker
                            key={index}
                            position={poi.posix}
                            draggable={false}
                            icon={divIcon({
                                iconSize: [30, 30],
                                iconAnchor: [15, 30],
                                popupAnchor: [0, -30],
                                html: `<div class='flex h-full justify-center items-center '>${index + 1}</div>`,
                                className: 'rounded-full bg-[#F7775E] text-white'
                            })}
                            ref={(marker) => {
                                if (marker) markerRefs.current[index] = marker;
                            }}
                        >
                            <Popup>
                                <p className='text-lg mb-0 important font-bold'>{poi.poiName}</p>
                                {poi.address && <p>{poi.address}</p>}
                                {poi.website && <a target='_blank' href={poi.website}>Website</a>}
                            </Popup>
                        </Marker>
                    ))}
                </MarkerMuster>
            </MapContainer>
        </div>
    )
}

interface RoutingControlWrapperProps {
    routeControl: L.Routing.Control,
    pois: { posix: LatLngExpression }[],
    markerRefs: React.MutableRefObject<L.Marker[]>
}

const RoutingControlWrapper: React.FC<RoutingControlWrapperProps> = ({ routeControl }) => {
    const map = useMap();

    useEffect(() => {
        routeControl.addTo(map);
    }, [routeControl, map]);

    return null;
};

export default MapRoute;
