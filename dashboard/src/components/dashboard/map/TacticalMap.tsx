'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, Tooltip, useMap, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { Agent } from '@/data/mock-agents';
import L from 'leaflet';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, Battery, Signal, Navigation } from 'lucide-react';

interface TacticalMapProps {
    agents: Agent[];
    selectedAgentId?: string;
    onSelectAgent: (agent: Agent) => void;
    showHeatmap: boolean;
    showBoundaries: boolean;
}

// Helper to zoom to selected agent
function MapController({ selectedAgentId, agents }: { selectedAgentId?: string, agents: Agent[] }) {
    const map = useMap();

    useEffect(() => {
        if (selectedAgentId) {
            const agent = agents.find(a => a.id === selectedAgentId);
            if (agent) {
                map.flyTo(agent.coordinates, 15, { animate: true, duration: 1.5 });
            }
        }
    }, [selectedAgentId, agents, map]);

    return null;
}

const createCustomIcon = (status: Agent['status']) => {
    let colorClass = 'bg-slate-500';
    if (status === 'active') colorClass = 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
    if (status === 'idle') colorClass = 'bg-amber-500';
    if (status === 'sos') colorClass = 'bg-rose-600 animate-pulse shadow-[0_0_15px_rgba(225,29,72,0.8)]';

    return L.divIcon({
        className: 'custom-marker',
        html: `<div class="w-4 h-4 rounded-full border-2 border-white ${colorClass}"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -10]
    });
};

export default function TacticalMap({ agents, selectedAgentId, onSelectAgent, showBoundaries }: TacticalMapProps) {
    const center: [number, number] = [-1.2921, 36.8219]; // Nairobi

    const selectedAgent = agents.find(a => a.id === selectedAgentId);

    return (
        <div className="h-full w-full relative bg-slate-950">
            <MapContainer center={center} zoom={12} scrollWheelZoom={true} className="h-full w-full z-0">
                {/* Dark Matter Tiles */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <MapController selectedAgentId={selectedAgentId} agents={agents} />

                {agents.map((agent) => (
                    <Marker
                        key={agent.id}
                        position={agent.coordinates}
                        icon={createCustomIcon(agent.status)}
                        eventHandlers={{
                            click: () => onSelectAgent(agent),
                        }}
                    >
                        <Tooltip direction="top" offset={[0, -10]} opacity={1} className="custom-tooltip">
                            <span className="font-bold text-xs">{agent.name}</span>
                        </Tooltip>

                        <Popup className="tactical-popup">
                            <div className="p-1 min-w-[200px]">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`w-8 h-8 rounded flex items-center justify-center text-white ${agent.status === 'active' ? 'bg-emerald-600' : 'bg-slate-600'}`}>
                                        <Shield size={16} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm leading-none">{agent.name}</h3>
                                        <span className="text-[10px] text-slate-500 uppercase tracking-wide">{agent.role}</span>
                                    </div>
                                </div>
                                <div className="space-y-1 mb-3">
                                    <p className="text-xs text-slate-600 flex items-center gap-1">
                                        <Navigation size={12} /> {agent.pollingStation}
                                    </p>
                                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                                        <span className="flex items-center gap-1"><Battery size={10} /> {agent.battery}%</span>
                                        <span className="flex items-center gap-1"><Signal size={10} /> {agent.signalStrength}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button size="sm" variant="outline" className="h-6 text-[10px]">Message</Button>
                                    <Button size="sm" variant="destructive" className="h-6 text-[10px]">SOS Alert</Button>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* GeoJSON Boundaries Layer */}
                {showBoundaries && (
                    <GeoJSON
                        data={require('@/data/nairobi-boundaries').NAIROBI_BOUNDARIES}
                        style={(feature) => ({
                            color: feature?.properties.color || '#3388ff',
                            weight: 2,
                            opacity: 0.5,
                            fillOpacity: 0.1
                        })}
                        onEachFeature={(feature, layer) => {
                            layer.bindTooltip(`${feature.properties.name}`, {
                                permanent: true,
                                direction: "center",
                                className: "boundary-tooltip"
                            });
                        }}
                    />
                )}

                {/* Geofence Visualization for Selected Agent */}
                {selectedAgent && (
                    <>
                        <Circle
                            center={selectedAgent.coordinates}
                            radius={500}
                            pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.1, dashArray: '5, 10' }}
                        />
                        {/* Mock Geofence Line to "Station" (random offset for demo) */}
                        <Polyline
                            positions={[
                                selectedAgent.coordinates,
                                [selectedAgent.coordinates[0] + 0.002, selectedAgent.coordinates[1] + 0.002]
                            ]}
                            pathOptions={{ color: '#f59e0b', dashArray: '4' }}
                        />
                    </>
                )}
            </MapContainer>
        </div>
    );
}
