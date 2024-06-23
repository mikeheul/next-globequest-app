// Import necessary modules and components
"use client";
import { useEffect, useState } from 'react'; // Importing React hooks
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'; // Importing MapContainer, TileLayer, and GeoJSON components from react-leaflet
import L from 'leaflet'; // Importing leaflet library
import "leaflet/dist/leaflet.css"; // Importing leaflet CSS

// Interface defining the structure of a country
interface Country {
    name: string;
    geojsonPath: string;
    color: string;
}

// Props interface for MapCountry component
interface MapCountryProps {
    countries: Country[];
}

// Functional component for rendering the map with GeoJSON data
const MapCountry = ({ countries }: MapCountryProps) => {
    // State hooks for managing GeoJSON data and map instance
    const [geojsonData, setGeojsonData] = useState<{ [key: string]: any }>({});
    const [map, setMap] = useState<L.Map | null>(null);

    // Effect hook to fetch GeoJSON data for each country
    useEffect(() => {
        const fetchData = async () => {
            const promises = countries.map(async (country) => {
                const response = await fetch(country.geojsonPath); // Fetch GeoJSON data from provided URL
                return {
                    name: country.name,
                    data: await response.json(), // Parse response JSON data
                    color: country.color,
                };
            });

            const results = await Promise.all(promises); // Wait for all promises to resolve

            // Construct object with GeoJSON data keyed by country name
            const geoJsonDataObject: { [key: string]: any } = {};
            results.forEach((result) => {
                geoJsonDataObject[result.name] = result.data;
            });

            setGeojsonData(geoJsonDataObject); // Update state with fetched GeoJSON data
        };

        fetchData(); // Invoke fetchData function on component mount or when countries array changes
    }, [countries]); // Dependency array with countries, triggers effect on change

    // Effect hook to fit map bounds once GeoJSON data and map instance are available
    useEffect(() => {
        if (map && Object.keys(geojsonData).length > 0) {
            const bounds = L.latLngBounds([]); // Initialize bounds object
            Object.values(geojsonData).forEach((data: any) => {
                const layer = L.geoJSON(data); // Create Leaflet GeoJSON layer
                bounds.extend(layer.getBounds()); // Extend bounds to include layer's bounds
            });
            map.fitBounds(bounds); // Fit map to calculated bounds
        }
    }, [map, geojsonData]); // Dependency array with map and geojsonData, triggers effect on change

    // Function to define style for GeoJSON features
    const style = (color: string) => {
        return {
            color: color,
            weight: 2,
            opacity: 1,
            fillOpacity: 0.7,
        };
    };

    // JSX structure for rendering MapContainer and its child components
    return (
        <MapContainer
            center={[40, 10]} // Default center position
            zoom={3} // Initial zoom level
            attributionControl={false} // Disable attribution control
            style={{ height: "600px", width: "100%" }} // Inline style for map container
            ref={setMap} // Reference to set map instance
        >
            <TileLayer
                attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" // Tile layer URL template
            />
            {/* Render GeoJSON layers for each country */}
            {countries.map((country: any) => (
                geojsonData[country.name] && (
                    <GeoJSON
                        key={country.name} // Unique key for GeoJSON layer
                        data={geojsonData[country.name]} // GeoJSON data for the country
                        style={() => style(country.color)} // Style function for GeoJSON features
                    />
                )
            ))}
        </MapContainer>
    );
};

export default MapCountry; // Export MapCountry component as default