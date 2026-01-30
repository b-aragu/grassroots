'use client';

import { useEffect, useState } from 'react';
import { Map, MapControls, useMap } from '@/components/ui/map';
import { Card } from '@/components/ui/card';
import useSWR from 'swr';
import api from '@/lib/api';
import maplibregl from 'maplibre-gl';

// Fetcher function for SWR
const fetcher = (url: string) => api.get(url).then((res) => res.data);

function MapLayers({ missions, wards }: { missions: any, wards: any }) {
    const { map, isLoaded } = useMap();

    useEffect(() => {
        if (!map || !isLoaded) return;

        // Add Wards Source and Layers
        if (wards && !map.getSource('wards')) {
            map.addSource('wards', {
                type: 'geojson',
                data: wards,
            });

            map.addLayer({
                id: 'wards-fill',
                type: 'fill',
                source: 'wards',
                paint: {
                    'fill-color': [
                        'match',
                        ['get', 'name'], // Randomly color based on name hash (simple trick) or fixed
                        'Ruiru', '#dcfce7', // specific color example
                        '#f0fdf4' // default very light green
                    ],
                    'fill-opacity': 0.4,
                    'fill-outline-color': '#16a34a'
                },
            });

            map.addLayer({
                id: 'wards-line',
                type: 'line',
                source: 'wards',
                paint: {
                    'line-color': '#16a34a',
                    'line-width': 2,
                },
            });
        }

        // Add Missions Source (with Clustering)
        if (missions && !map.getSource('missions')) {
            map.addSource('missions', {
                type: 'geojson',
                data: missions,
                cluster: true,
                clusterMaxZoom: 14, // Max zoom to cluster points on
                clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
            });

            // Clusters Layer (Circles)
            map.addLayer({
                id: 'clusters',
                type: 'circle',
                source: 'missions',
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': [
                        'step',
                        ['get', 'point_count'],
                        '#4ade80', // green-400 (small)
                        10,
                        '#22c55e', // green-500 (medium)
                        50,
                        '#15803d'  // green-700 (large)
                    ],
                    'circle-radius': [
                        'step',
                        ['get', 'point_count'],
                        20,
                        100,
                        30,
                        750,
                        40
                    ],
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff'
                },
            });

            // Cluster Count Label
            map.addLayer({
                id: 'cluster-count',
                type: 'symbol',
                source: 'missions',
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': '{point_count_abbreviated}',
                    'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                    'text-size': 12,
                },
                paint: {
                    'text-color': '#ffffff',
                },
            });

            // Unclustered Points Layer
            map.addLayer({
                id: 'unclustered-point',
                type: 'circle',
                source: 'missions',
                filter: ['!', ['has', 'point_count']],
                paint: {
                    'circle-color': '#16a34a',
                    'circle-radius': 8,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#fff',
                },
            });

            // Click on cluster to zoom
            map.on('click', 'clusters', (e) => {
                const features = map.queryRenderedFeatures(e.point, {
                    layers: ['clusters']
                });
                const clusterId = features[0].properties.cluster_id;
                (map.getSource('missions') as any).getClusterExpansionZoom(
                    clusterId,
                    (err: any, zoom: number) => {
                        if (err) return;
                        map.easeTo({
                            center: (features[0].geometry as any).coordinates,
                            zoom,
                        });
                    }
                );
            });

            // Click on unclustered point to show popup
            map.on('click', 'unclustered-point', (e) => {
                if (!e.features || !e.features[0]) return;

                const coordinates = (e.features[0].geometry as any).coordinates.slice();
                const props = e.features[0].properties;

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                new maplibregl.Popup({ closeButton: false, maxWidth: '300px' })
                    .setLngLat(coordinates)
                    .setHTML(`
                        <div class="font-sans">
                            <div class="bg-green-700 text-white p-2 rounded-t-md">
                                <h3 class="font-bold text-sm">${props.ward}</h3>
                            </div>
                            <div class="p-3 bg-white rounded-b-md shadow-sm">
                                <p class="text-xs text-gray-500 uppercase tracking-wide mb-1 font-semibold">Location</p>
                                <p class="text-sm text-gray-800 mb-3">${props.location}</p>
                                
                                <div class="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                                    <span class="text-xs text-gray-500 font-semibold">STATUS</span>
                                    <span class="px-2 py-0.5 rounded text-xs font-medium uppercase ${props.status === 'COMPLETED' ? 'bg-green-100 text-green-800 border border-green-200' :
                            props.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                'bg-gray-100 text-gray-800 border border-gray-200'
                        }">${props.status}</span>
                                </div>
                                
                                <div class="flex items-center gap-2">
                                    <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">👤</div>
                                    <span class="text-sm font-medium text-gray-700">${props.assignedTo}</span>
                                </div>
                            </div>
                        </div>
                    `)
                    .addTo(map);
            });

            // Change cursor on hover
            map.on('mouseenter', 'clusters', () => {
                map.getCanvas().style.cursor = 'pointer';
            });
            map.on('mouseleave', 'clusters', () => {
                map.getCanvas().style.cursor = '';
            });

            map.on('mouseenter', 'unclustered-point', () => {
                map.getCanvas().style.cursor = 'pointer';
            });
            map.on('mouseleave', 'unclustered-point', () => {
                map.getCanvas().style.cursor = '';
            });
        }
    }, [map, isLoaded, missions, wards]);

    return null;
}

export default function DashboardMap() {
    // Fetch GeoJSON data
    const { data: missionsGeoJSON } = useSWR('/missions/geojson', fetcher);
    const { data: wardsGeoJSON } = useSWR('/wards/geojson', fetcher);

    // Default center (Nairobi)
    const [viewState, setViewState] = useState({
        longitude: 36.8219,
        latitude: -1.2921,
        zoom: 11
    });

    return (
        <Card className="h-[600px] w-full overflow-hidden relative">
            <Map
                center={[viewState.longitude, viewState.latitude]}
                zoom={viewState.zoom}
                styles={{
                    light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                }}
            >
                <MapControls position="top-right" />
                <MapLayers missions={missionsGeoJSON} wards={wardsGeoJSON} />
            </Map>
        </Card>
    );
}
