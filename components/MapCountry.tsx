"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
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

    useEffect(() => {
        countries.forEach(async (country: any) => {
            const response = await fetch(country.geojsonPath);
            const data = await response.json();
            setGeojsonData((prevData) => ({
                ...prevData,
                [country.name]: data,
            }));
        });
    }, [countries]);

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
            center={[20, 0]} // Default center position
            zoom={2} // Initial zoom level
            style={{ height: "600px", width: "100%" }}
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