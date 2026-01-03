import { useEffect, useState } from 'react';
import { Smartphone } from 'lucide-react';
import { format } from 'date-fns';
import { fetchDevices } from '@/services/api';
import { Device } from '@/types';
import { Loader2 } from 'lucide-react';

export const RecentDevices = () => {
  const [recentDevices, setRecentDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDevices = async () => {
      try {
        const data = await fetchDevices();
        // Sort by registeredAt desc and take top 5
        const sorted = data.sort((a: Device, b: Device) =>
          new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
        ).slice(0, 5);
        setRecentDevices(sorted);
      } catch (error) {
        console.error("Failed to load recent devices", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDevices();
  }, []);

  if (isLoading) return <div className="glass-card rounded-xl p-6 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Registrations</h3>
        <button className="text-sm text-primary hover:underline">View All</button>
      </div>

      <div className="space-y-4">
        {recentDevices.map((device) => (
          <div key={device.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-lg">
                <Smartphone className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">{device.deviceName}</p>
                <p className="text-xs text-muted-foreground">{device.modelName}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-xs px-2 py-1 rounded-full ${device.status === 'locked'
                  ? 'bg-destructive/10 text-destructive'
                  : 'bg-primary/10 text-primary'
                }`}>
                {device.status}
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(device.registeredAt), 'MMM dd')}
              </p>
            </div>
          </div>
        ))}
        {recentDevices.length === 0 && <p className="text-center text-muted-foreground text-sm">No recent devices found.</p>}
      </div>
    </div>
  );
};
