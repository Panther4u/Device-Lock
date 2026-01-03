import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { fetchCustomers, fetchDevicesByCustomer, fetchEMIsByCustomer, updateDeviceStatus, deleteCustomer } from '@/services/api';
import { Customer, Device, EMIDetails } from '@/types';
import { User, Smartphone, CreditCard, ChevronLeft, Lock, Unlock, QrCode, Copy, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { generateProvisioningPayload } from '@/utils/provisioning';
import QRCode from "react-qr-code";

const CustomerDetails = () => {
    const { customerId } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [devices, setDevices] = useState<Device[]>([]);
    const [emis, setEmis] = useState<EMIDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showQRModal, setShowQRModal] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedQRDevice, setSelectedQRDevice] = useState<Device | null>(null);

    useEffect(() => {
        if (customerId) {
            loadData();
        }
    }, [customerId]);

    const loadData = async () => {
        try {
            // Fetch all customers and find the one we neeed (since we don't have getById yet)
            const customersData = await fetchCustomers();
            const foundCustomer = customersData.find((c: Customer) => c.id === customerId);
            setCustomer(foundCustomer || null);

            if (foundCustomer) {
                const [devicesData, emisData] = await Promise.all([
                    fetchDevicesByCustomer(customerId!),
                    fetchEMIsByCustomer(customerId!)
                ]);
                setDevices(devicesData);
                setEmis(emisData);
                if (devicesData.length > 0) {
                    setSelectedQRDevice(devicesData[0]);
                }
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to load customer details",
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

    const handleDeleteCustomer = async () => {
        if (!customer) return;
        setIsDeleting(true);
        try {
            await deleteCustomer(customer.id);
            toast({
                title: "Customer Deleted",
                description: "Customer record has been permanently removed.",
            });
            navigate('/manage');
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to delete customer",
                variant: "destructive",
            });
            setIsDeleting(false);
            setShowDeleteAlert(false);
        }
    };

    if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>;
    if (!customer) return <div className="p-6 text-center">Customer not found</div>;

    return (
        <div className="animate-fade-in pb-20">
            <div className="p-4 flex items-center gap-2">
                <button onClick={() => navigate('/manage')} className="p-2 -ml-2 hover:bg-secondary rounded-full transaction-colors">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="flex-1">
                    <h1 className="text-xl font-bold">{customer.name}</h1>
                    <p className="text-xs text-muted-foreground">{customerId}</p>
                </div>
                <button
                    onClick={() => setShowQRModal(true)}
                    className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors mr-2"
                >
                    <QrCode className="w-5 h-5" />
                </button>
                <button
                    onClick={() => setShowDeleteAlert(true)}
                    className="p-2 bg-destructive/10 text-destructive rounded-full hover:bg-destructive/20 transition-colors"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the customer
                            <strong> {customer.name} </strong> and remove their data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleDeleteCustomer();
                            }}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Customer"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
                <DialogContent className="max-w-md bg-card border-border">
                    <DialogHeader>
                        <DialogTitle>Device Setup QR</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col items-center justify-center p-4">
                        {devices.length > 0 ? (
                            <>
                                <div className="mb-4 w-full">
                                    <label className="text-sm font-medium mb-2 block">Select Device</label>
                                    <select
                                        className="input-field w-full"
                                        value={selectedQRDevice?.id || ''}
                                        onChange={(e) => setSelectedQRDevice(devices.find(d => d.id === e.target.value) || devices[0])}
                                    >
                                        {devices.map(d => (
                                            <option key={d.id} value={d.id}>{d.deviceName} - {d.imei1}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="bg-white p-4 rounded-xl mb-4">
                                    <div className="w-full max-w-[200px] aspect-square mx-auto">
                                        {(() => {
                                            if (!selectedQRDevice || !customer) return null;
                                            const relatedEMI = emis.find(e => e.deviceId === selectedQRDevice.id);
                                            const payload = generateProvisioningPayload(
                                                customer.id,
                                                customer.name,
                                                customer.phone,
                                                selectedQRDevice.id,
                                                relatedEMI?.financeCompany || '',
                                                selectedQRDevice.imei1
                                            );

                                            return (
                                                <QRCode
                                                    value={JSON.stringify(payload)}
                                                    size={256}
                                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                                    viewBox={`0 0 256 256`}
                                                />
                                            );
                                        })()}
                                    </div>
                                </div>

                                <p className="text-sm text-center text-muted-foreground mb-4">
                                    Scan this 6 times on the welcome screen of a factory-reset device.
                                </p>

                                <button
                                    className="btn-secondary w-full flex items-center justify-center gap-2"
                                    onClick={() => {
                                        if (!selectedQRDevice) return;
                                        const relatedEMI = emis.find(e => e.deviceId === selectedQRDevice.id);
                                        const payload = generateProvisioningPayload(
                                            customer.id,
                                            customer.name,
                                            customer.phone,
                                            selectedQRDevice.id,
                                            relatedEMI?.financeCompany || '',
                                            selectedQRDevice.imei1
                                        );
                                        navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
                                        toast({ title: "Copied to clipboard" });
                                    }}
                                >
                                    <Copy className="w-4 h-4" /> Copy Payload
                                </button>
                            </>
                        ) : (
                            <p className="text-muted-foreground">No devices linked to this customer.</p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <div className="px-4 space-y-6">
                {/* Profile Section */}
                <section className="glass-card p-6 rounded-xl space-y-4">
                    <div className="flex items-center gap-3 border-b border-border pb-3">
                        <User className="w-5 h-5 text-primary" />
                        <h2 className="font-semibold">Profile</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground mb-1">Phone</p>
                            <p className="font-medium">{customer.phone}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground mb-1">Aadhaar</p>
                            <p className="font-medium">{customer.aadhaar}</p>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <p className="text-muted-foreground mb-1">Address</p>
                            <p className="font-medium line-clamp-2">{customer.address}</p>
                        </div>
                    </div>
                </section>

                {/* Devices Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                        <Smartphone className="w-5 h-5 text-primary" />
                        <h2 className="font-semibold">Linked Devices ({devices.length})</h2>
                    </div>
                    <div className="grid gap-4">
                        {devices.map(device => (
                            <div key={device.id} className="glass-card p-5 rounded-xl">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-semibold">{device.deviceName}</h3>
                                        <p className="text-sm text-muted-foreground">{device.modelName}</p>
                                    </div>
                                    <span className={`status-badge ${device.status === 'locked' ? 'status-locked' : 'status-unlocked'}`}>
                                        {device.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-border mt-2">
                                    <span className="text-xs text-muted-foreground font-mono">{device.imei1}</span>
                                    <button
                                        onClick={() => handleToggleLock(device)}
                                        className={`btn-secondary text-xs flex items-center gap-2 px-3 py-1.5 h-auto ${device.status === 'locked' ? 'text-green-500 hover:text-green-600' : 'text-red-500 hover:text-red-600'}`}
                                    >
                                        {device.status === 'locked' ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                        {device.status === 'locked' ? 'Unlock' : 'Lock'}
                                    </button>
                                </div>
                            </div>
                        ))}
                        {devices.length === 0 && <p className="text-center text-muted-foreground py-4 bg-secondary/20 rounded-lg">No devices linked.</p>}
                    </div>
                </section>

                {/* EMI Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                        <CreditCard className="w-5 h-5 text-primary" />
                        <h2 className="font-semibold">Finance & EMI</h2>
                    </div>
                    <div className="grid gap-4">
                        {emis.map(emi => (
                            <div key={emi.id} className="glass-card p-5 rounded-xl space-y-4">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="font-medium">{emi.financeCompany}</p>
                                        <p className="text-xs text-muted-foreground">Total: ₹{emi.mobileAmount}</p>
                                    </div>
                                    <div className={`status-badge self-start ${emi.status === 'overdue' ? 'status-overdue' : 'status-unlocked'}`}>
                                        {emi.status}
                                    </div>
                                </div>

                                {/* EMI Progress Bar (Mock) */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Paid: {emi.paidEmis}/{emi.totalEmis}</span>
                                        <span>₹{emi.paidEmis * emi.emiMonthly} / ₹{emi.totalEmiAmount}</span>
                                    </div>
                                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-500"
                                            style={{ width: `${(emi.paidEmis / emi.totalEmis) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Monthly EMI</p>
                                        <p className="font-mono pt-1">₹{emi.emiMonthly}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground">Next Due</p>
                                        <p className="font-medium pt-1">{format(new Date(emi.nextDueDate), 'dd MMM')}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {emis.length === 0 && <p className="text-center text-muted-foreground py-4 bg-secondary/20 rounded-lg">No finance records.</p>}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CustomerDetails;
