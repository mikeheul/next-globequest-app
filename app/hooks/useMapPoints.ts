interface Poi {
    latitude: number;
    longitude: number;
    name: string;
}

export const useMapPoints = (pois: Poi[], cityName: string, cityLatitude: number, cityLongitude: number) => {
    return pois.length > 0
        ? pois.map(poi => ({
            posix: [poi.latitude, poi.longitude] as [number, number],
            pointName: poi.name,
        }))
        : [{
            posix: [cityLatitude, cityLongitude] as [number, number],
            pointName: cityName,
        }];
};