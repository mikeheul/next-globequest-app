"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { LatLngExpression, divIcon } from 'leaflet';
import { MarkerMuster } from "react-leaflet-muster";
import L from 'leaflet';
import 'leaflet-routing-machine';
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

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

const MapMultiWalk = ({ pois = [], zoom = defaults.zoom, routeColor = defaults.routeColor }: MapProps) => {
    const markerRefs = useRef<L.Marker[]>([]);
    const [routeControl, setRouteControl] = useState<L.Routing.Control | null>(null);
    const [profile, setProfile] = useState<string>('foot');
    const [totalDistance, setTotalDistance] = useState<number | null>(null);

    useEffect(() => {
        if (pois.length > 1) {
            const waypoints = pois.map(poi => L.latLng(poi.posix));
            const control = L.Routing.control({
                waypoints,
                router: new L.Routing.OSRMv1({
                    // serviceUrl: 'https://router.project-osrm.org/route/v1/',
                    // https://routing.openstreetmap.de/routed-car/...
                    // https://routing.openstreetmap.de/routed-bike/...
                    // https://routing.openstreetmap.de/routed-foot/...
                    // serviceUrl: 'https://routing.openstreetmap.de/routed-foot/route/v1/',
                    // profile: 'foot',
                    serviceUrl: defaults.profiles[profile as keyof typeof defaults.profiles],
                    profile: profile,
                }),
                createMarker: () => null,
                lineOptions: {
                    styles: [{ color: routeColor, opacity: 0.7, weight: 5 }],
                    extendToWaypoints: true, // Extend the route to the exact waypoints
                    missingRouteTolerance: 0, // Tolerance in pixels for considering a route segment as missing
                    addWaypoints: false,
                },
                // createMarker: () => null, // Disable default markers
                show: false, // Do not show instructions
            }).on('routesfound', function(e) {
                const routes = e.routes;
                const summary = routes[0].summary;
                setTotalDistance(summary.totalDistance / 1000); // Convert to kilometers
            });
            setRouteControl(control);
        } else {
            setRouteControl(null); // Reset route control if less than 2 pois
        }
    }, [pois, profile, routeColor]);

    useEffect(() => {
        // Open the popup of the first marker when component mounts
        if (markerRefs.current.length > 0) {
            // markerRefs.current[0]?.openPopup();
        }

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
            <div className='absolute top-5 right-5 z-[1000] p-4 rounded-lg'>
                <select
                    value={profile}
                    onChange={(e) => setProfile(e.target.value)}
                    className="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 p-4"
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

const RoutingControlWrapper: React.FC<RoutingControlWrapperProps> = ({ routeControl, pois, markerRefs }) => {
    const map = useMap();

    useEffect(() => {
        routeControl.addTo(map);
    }, [routeControl, map]);

    return null;
};

export default MapMultiWalk;
