import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { fetchDevices, fetchCustomers, fetchEMIs, updateDeviceStatus } from '@/services/api';
import { Device, Customer, EMIDetails } from '@/types';
import { Lock, Unlock, Smartphone, AlertTriangle, Shield, RefreshCw, Clock, Wifi, WifiOff, Search, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const LockControl = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [emis, setEmis] = useState<EMIDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmAction, setConfirmAction] = useState<{ deviceId: string; action: 'lock' | 'unlock' } | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [devicesData, customersData, emisData] = await Promise.all([
        fetchDevices(),
        fetchCustomers(),
        fetchEMIs()
      ]);
      setDevices(devicesData);
      setCustomers(customersData);
      setEmis(emisData);
    } catch (error) {
      console.error("Failed to load data", error);
      toast({
        title: "Error",
        description: "Failed to load device data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCustomerById = (id: string) => customers.find(c => c.id === id);
  const getEMIByDeviceId = (id: string) => emis.find(e => e.deviceId === id);

  const lockedDevices = devices.filter(d => d.status === 'locked');
  const unlockedDevices = devices.filter(d => d.status === 'unlocked');

  const isOnline = (lastSync: Date) => {
    const hourAgo = new Date(Date.now() - 3600000);
    return new Date(lastSync) > hourAgo;
  };

  const handleAction = async () => {
    if (!confirmAction) return;

    setProcessing(true);
    try {
      const newStatus = confirmAction.action === 'lock' ? 'locked' : 'unlocked';
      await updateDeviceStatus(confirmAction.deviceId, newStatus);

      // Optimistic update
      setDevices(devices.map(d =>
        d.id === confirmAction.deviceId ? { ...d, status: newStatus } : d
      ));

      toast({
        title: "Success",
        description: `Device ${confirmAction.action}ed successfully`,
      });
      setConfirmAction(null);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${confirmAction.action} device`,
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const filteredDevices = devices.filter(d => {
    const customer = getCustomerById(d.customerId);
    const searchLower = searchQuery.toLowerCase();
    return (
      d.deviceName.toLowerCase().includes(searchLower) ||
      d.imei1.includes(searchQuery) ||
      (customer?.name.toLowerCase().includes(searchLower) ?? false)
    );
  });

  const device = confirmAction ? devices.find(d => d.id === confirmAction.deviceId) : null;
  const deviceCustomer = device ? getCustomerById(device.customerId) : null;

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
  }

  return (
    <div className="animate-fade-in">
      <Header
        title="Lock Control"
        subtitle="Manage device lock status remotely"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="stat-card border border-border/50 p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">Total Devices</p>
              <p className="text-xl md:text-2xl font-bold text-foreground mt-1">{devices.length}</p>
            </div>
            <div className="p-2 md:p-3 bg-primary/20 rounded-xl self-end md:self-auto">
              <Smartphone className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="stat-card border border-border/50 p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">Locked</p>
              <p className="text-xl md:text-2xl font-bold text-destructive mt-1">{lockedDevices.length}</p>
            </div>
            <div className="p-2 md:p-3 bg-destructive/20 rounded-xl self-end md:self-auto">
              <Lock className="w-5 h-5 md:w-6 md:h-6 text-destructive" />
            </div>
          </div>
        </div>
        <div className="stat-card border border-border/50 p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">Unlocked</p>
              <p className="text-xl md:text-2xl font-bold text-accent mt-1">{unlockedDevices.length}</p>
            </div>
            <div className="p-2 md:p-3 bg-accent/20 rounded-xl self-end md:self-auto">
              <Unlock className="w-5 h-5 md:w-6 md:h-6 text-accent" />
            </div>
          </div>
        </div>
        <div className="stat-card border border-border/50 p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">Pending</p>
              <p className="text-xl md:text-2xl font-bold text-warning mt-1">
                {devices.filter(d => d.status === 'pending').length}
              </p>
            </div>
            <div className="p-2 md:p-3 bg-warning/20 rounded-xl self-end md:self-auto">
              <Clock className="w-5 h-5 md:w-6 md:h-6 text-warning" />
            </div>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="p-4 bg-warning/10 border border-warning/20 rounded-xl flex items-start gap-3 mb-6">
        <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-foreground">Remote Lock Control</p>
          <p className="text-sm text-muted-foreground mt-1">
            Lock/unlock commands are sent via Firebase Cloud Messaging.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search device, IMEI, customer..."
          className="input-field pl-12 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredDevices.map((dev) => {
          const customer = getCustomerById(dev.customerId);
          const emi = getEMIByDeviceId(dev.id);
          const online = isOnline(dev.lastSyncAt);

          return (
            <div
              key={dev.id}
              className={`glass-card rounded-xl p-6 transition-all duration-300 ${dev.status === 'locked'
                ? 'border-destructive/30 hover:border-destructive/50'
                : 'hover:border-primary/50'
                }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${dev.status === 'locked' ? 'bg-destructive/20' : 'bg-accent/20'
                    }`}>
                    {dev.status === 'locked' ? (
                      <Lock className="w-5 h-5 text-destructive" />
                    ) : (
                      <Unlock className="w-5 h-5 text-accent" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{dev.deviceName}</h3>
                    <p className="text-sm text-muted-foreground">{customer?.name || 'Unknown Customer'}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-xs ${online ? 'text-accent' : 'text-muted-foreground'}`}>
                  {online ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  {online ? 'Online' : 'Offline'}
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">IMEI</span>
                  <span className="font-mono text-foreground">{dev.imei1}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Sync</span>
                  <span className="text-foreground">{dev.lastSyncAt ? formatDistanceToNow(new Date(dev.lastSyncAt), { addSuffix: true }) : 'Never'}</span>
                </div>
                {emi && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">EMI Status</span>
                    <span className={`${emi.status === 'overdue' ? 'text-destructive' : 'text-foreground'}`}>
                      {emi.status.charAt(0).toUpperCase() + emi.status.slice(1)}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {dev.status === 'locked' ? (
                  <button
                    onClick={() => setConfirmAction({ deviceId: dev.id, action: 'unlock' })}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors font-medium text-sm"
                  >
                    <Unlock className="w-4 h-4" />
                    Unlock
                  </button>
                ) : (
                  <button
                    onClick={() => setConfirmAction({ deviceId: dev.id, action: 'lock' })}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors font-medium text-sm"
                  >
                    <Lock className="w-4 h-4" />
                    Lock
                  </button>
                )}
                <button
                  onClick={loadData}
                  className="p-2.5 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
        {filteredDevices.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground bg-secondary/20 rounded-xl">
            No devices found matching your search.
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-foreground">
              <div className={`p-3 rounded-xl ${confirmAction?.action === 'lock' ? 'bg-destructive/20' : 'bg-accent/20'
                }`}>
                {confirmAction?.action === 'lock' ? (
                  <Lock className="w-6 h-6 text-destructive" />
                ) : (
                  <Shield className="w-6 h-6 text-accent" />
                )}
              </div>
              Confirm {confirmAction?.action === 'lock' ? 'Lock' : 'Unlock'} Device
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {confirmAction?.action === 'lock'
                ? 'This will immediately lock the device and prevent the user from accessing it.'
                : 'This will unlock the device and restore full access to the user.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Device Info */}
            <div className="p-4 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">{device?.deviceName}</p>
                  <p className="text-sm text-muted-foreground">{deviceCustomer?.name}</p>
                </div>
              </div>
            </div>

            {confirmAction?.action === 'lock' && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">
                  ⚠️ The user will not be able to use the device until it is unlocked.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={() => setConfirmAction(null)}
                className="btn-secondary flex-1"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                disabled={processing}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${confirmAction?.action === 'lock'
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  : 'bg-accent text-accent-foreground hover:bg-accent/90'
                  }`}
              >
                {processing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {confirmAction?.action === 'lock' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    {confirmAction?.action === 'lock' ? 'Lock Device' : 'Unlock Device'}
                  </>
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LockControl;
