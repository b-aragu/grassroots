import { FeatureCollection } from 'geojson';

export const NAIROBI_BOUNDARIES: FeatureCollection = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: { name: "KIBRA", color: "#f59e0b" }, // ODM Stronghold (Orange)
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [36.770, -1.300], [36.800, -1.300], [36.800, -1.330], [36.770, -1.330], [36.770, -1.300]
                ]]
            }
        },
        {
            type: "Feature",
            properties: { name: "LANGATA", color: "#3b82f6" }, // UDA Stronghold (Blue)
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [36.730, -1.330], [36.770, -1.330], [36.770, -1.360], [36.730, -1.360], [36.730, -1.330]
                ]]
            }
        },
        {
            type: "Feature",
            properties: { name: "WESTLANDS", color: "#10b981" }, // Battleground (Green)
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [36.780, -1.250], [36.830, -1.250], [36.830, -1.290], [36.780, -1.290], [36.780, -1.250]
                ]]
            }
        }
    ]
};
