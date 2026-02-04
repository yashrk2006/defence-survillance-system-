import * as React from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useDevices } from '@/hooks/use-devices';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export function RealTacticalMap({ active }: { active: boolean }) {
    const { data: devices } = useDevices();

    // Default to India Center if no token or inactive
    if (!active) return null;
    if (!MAPBOX_TOKEN) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-green-500 font-mono text-xs z-50 pointer-events-none">
                <div className="bg-black border border-green-500 p-4 rounded text-center">
                    <p className="font-bold">AWAITING_SATELLITE_UPLINK</p>
                    <p className="opacity-70 mt-2">Add VITE_MAPBOX_TOKEN to .env</p>
                </div>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 z-0">
            <Map
                initialViewState={{
                    longitude: 78.9629,
                    latitude: 20.5937,
                    zoom: 4
                }}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/dark-v11" // Tactical Dark Mode
                mapboxAccessToken={MAPBOX_TOKEN}
                attributionControl={false}
            >
                {devices?.map((device) => (
                    <Marker
                        key={device.id}
                        longitude={78.9629 + (Math.random() - 0.5) * 10} // Placeholder until backend has lat/long
                        latitude={20.5937 + (Math.random() - 0.5) * 10}
                        color={device.status === 'online' ? '#22c55e' : '#ef4444'}
                    />
                ))}
            </Map>

            {/* Tactical Overlay Grid on top of Real Map */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(0, 255, 0, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 0, 0.03) 1px, transparent 1px)',
                    backgroundSize: '100px 100px'
                }}
            />
        </div>
    );
}
