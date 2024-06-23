"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

interface Country {
    name: string;
    geojsonPath: string;
    color: string;
}

interface MapCountryProps {
    countries: Country[];
}

const MapCountry = ({ countries }: MapCountryProps) => {
    const [geojsonData, setGeojsonData] = useState<{ [key: string]: any }>({});
    const [map, setMap] = useState<L.Map | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const promises = countries.map(async (country) => {
                const response = await fetch(country.geojsonPath);
                return {
                    name: country.name,
                    data: await response.json(),
                    color: country.color,
                };
            });

            const results = await Promise.all(promises);

            const geoJsonDataObject: { [key: string]: any } = {};
            results.forEach((result) => {
                geoJsonDataObject[result.name] = result.data;
            });

            setGeojsonData(geoJsonDataObject);
        };

        fetchData();
    }, [countries]);

    useEffect(() => {
        if (map && Object.keys(geojsonData).length > 0) {
            const bounds = L.latLngBounds([]);
            Object.values(geojsonData).forEach((data: any) => {
                const layer = L.geoJSON(data);
                bounds.extend(layer.getBounds());
            });
            map.fitBounds(bounds);
        }
    }, [map, geojsonData]);

    const style = (color: string) => {
        return {
            color: color,
            weight: 2,
            opacity: 1,
            fillOpacity: 0.7,
        };
    };

    return (
        <MapContainer
            center={[40, 10]} // Default center position
            zoom={3} // Initial zoom level
            style={{ height: "600px", width: "100%" }}
            ref={setMap}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {countries.map((country: any) => (
                geojsonData[country.name] && (
                    <GeoJSON 
                        key={country.name}
                        data={geojsonData[country.name]}
                        style={() => style(country.color)}
                    />
                )
            ))}
        </MapContainer>
    );
};

export default MapCountry;