import DashboardMap from '@/components/DashboardMap';

export default function MapPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Mission Map</h1>
            </div>
            <DashboardMap />
        </div>
    );
}
