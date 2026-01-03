import { useState, useEffect } from 'react';
import { Device } from '@/types';
import { fetchDevices, updateDeviceStatus } from '@/services/api';
import { Search, Smartphone, Lock, Unlock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export const DevicesView = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadDevices();
    }, []);

    const loadDevices = async () => {
        try {
            const data = await fetchDevices();
            setDevices(data);
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to load devices",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleLock = async (device: Device) => {
        const newStatus = device.status === 'locked' ? 'unlocked' : 'locked';
        try {
            await updateDeviceStatus(device.id, newStatus);
            // Optimistic update
            setDevices(devices.map(d => d.id === device.id ? { ...d, status: newStatus } : d));
            toast({
                title: "Status Updated",
                description: `Device ${newStatus} successfully`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update status",
                variant: "destructive",
            });
        }
    };

    const filteredDevices = devices.filter(d =>
        d.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.imei1.includes(searchQuery)
    );

    if (isLoading) {
        return <div className="flex justify-center items-center py-12"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div className="relative flex-1 w-full max-w-none md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        className="input-field pl-10 w-full"
                        placeholder="Search by name or IMEI..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredDevices.map(device => (
                    <div key={device.id} className="glass-card rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Smartphone className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{device.deviceName}</h3>
                                    <p className="text-sm text-muted-foreground">{device.modelName}</p>
                                </div>
                            </div>
                            <span className={`status-badge ${device.status === 'locked' ? 'status-locked' : 'status-unlocked'}`}>
                                {device.status}
                            </span>
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground mb-4">
                            <p>IMEI: {device.imei1}</p>
                            <p>Registered: {format(new Date(device.registeredAt), 'dd MMM yyyy')}</p>
                        </div>

                        <div className="pt-4 border-t border-border flex justify-end">
                            <button
                                onClick={() => handleToggleLock(device)}
                                className={`btn-secondary text-xs flex items-center gap-2 ${device.status === 'locked' ? 'text-green-500 hover:text-green-600' : 'text-red-500 hover:text-red-600'}`}
                            >
                                {device.status === 'locked' ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                {device.status === 'locked' ? 'Unlock Device' : 'Lock Device'}
                            </button>
                        </div>
                    </div>
                ))}
                {filteredDevices.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No devices found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};
