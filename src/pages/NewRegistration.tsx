import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { User, Smartphone, CreditCard, QrCode, Loader2, Download, Copy, Check } from 'lucide-react';
import { createCustomer, createDevice, createEMI } from '@/services/api';
import { generateProvisioningPayload } from '@/utils/provisioning';
import QRCode from "react-qr-code";
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const NewRegistration = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generatedQR, setGeneratedQR] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        // Customer
        name: '',
        phone: '',
        aadhaar: '',
        address: '',
        // Device
        deviceName: '',
        modelName: '',
        imei1: '',
        imei2: '',
        // Finance
        financeCompany: '',
        mobileAmount: '',
        totalEmis: '',
        emiMonthly: '',
        emiStartDate: new Date().toISOString().split('T')[0],
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const calculateTotalEmi = () => {
        const monthly = Number(formData.emiMonthly) || 0;
        const months = Number(formData.totalEmis) || 0;
        return monthly * months;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // 1. Create Customer
            const customerId = `CUS${Math.floor(Math.random() * 100000)}`;
            const customerPayload = {
                id: customerId,
                name: formData.name,
                phone: formData.phone,
                aadhaar: formData.aadhaar,
                address: formData.address,
                createdAt: new Date(),
            };
            await createCustomer(customerPayload);

            // 2. Create Device
            const deviceId = `DEV${Math.floor(Math.random() * 100000)}`;
            const devicePayload = {
                id: deviceId,
                customerId: customerId,
                deviceName: formData.deviceName,
                modelName: formData.modelName,
                imei1: formData.imei1,
                imei2: formData.imei2,
                status: 'locked',
                registeredAt: new Date(),
                lastSyncAt: new Date(),
            };
            await createDevice(devicePayload);

            // 3. Create EMI
            const emiPayload = {
                id: `EMI${Math.floor(Math.random() * 100000)}`,
                customerId: customerId,
                deviceId: deviceId,
                financeCompany: formData.financeCompany,
                mobileAmount: Number(formData.mobileAmount),
                totalEmiAmount: calculateTotalEmi(),
                emiMonthly: Number(formData.emiMonthly),
                emiStartDate: formData.emiStartDate,
                totalEmis: Number(formData.totalEmis),
                paidEmis: 0,
                status: 'active',
                nextDueDate: new Date(new Date(formData.emiStartDate).setMonth(new Date(formData.emiStartDate).getMonth() + 1)),
            };
            await createEMI(emiPayload);

            // 4. Generate QR Payload
            // 4. Generate QR Payload
            const qrPayload = generateProvisioningPayload(
                customerId,
                formData.name,
                formData.phone,
                deviceId,
                formData.financeCompany,
                formData.imei1
            );

            setGeneratedQR(qrPayload);
            toast({
                title: "Registration Successful",
                description: "Records created and QR code generated.",
            });

        } catch (error) {
            console.error(error);
            toast({
                title: "Registration Failed",
                description: "An error occurred. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(generatedQR, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (generatedQR) {
        return (
            <div className="animate-fade-in flex flex-col items-center p-4 min-h-[80vh] justify-center">
                <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-10 h-10 text-success" />
                </div>
                <h3 className="text-2xl font-bold text-center mb-2">Registration Complete!</h3>
                <p className="text-muted-foreground text-center max-w-md mb-8">
                    Scan this QR code on the target device to start provisioning.
                </p>

                <div className="bg-white p-6 rounded-3xl shadow-xl border border-border mb-8">
                    <div className="bg-white p-4 rounded-xl mb-4">
                        <QRCode
                            value={JSON.stringify(generatedQR)}
                            size={256}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            viewBox={`0 0 256 256`}
                        />
                    </div>

                    <p className="text-sm text-center text-muted-foreground mb-4">
                        Scan this 6 times on the welcome screen of a factory-reset device.
                    </p>
                </div>

                <div className="flex gap-4 w-full max-w-sm mb-8">
                    <button className="btn-secondary flex-1 flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" /> Download
                    </button>
                    <button onClick={handleCopy} className="btn-secondary flex-1 flex items-center justify-center gap-2">
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied' : 'Copy Data'}
                    </button>
                </div>

                <button onClick={() => navigate('/manage')} className="btn-primary w-full max-w-sm">
                    Return to Management
                </button>
            </div>
        );
    }

    return (
        <div className="animate-fade-in pb-24">
            <Header
                title="New Registration"
                subtitle="Complete form to generate setup QR"
            />

            <form onSubmit={handleSubmit} className="px-4 md:px-8 space-y-8 max-w-3xl mx-auto">

                {/* Customer Section */}
                <section className="glass-card p-6 rounded-xl space-y-4">
                    <div className="flex items-center gap-3 mb-2 border-b border-border pb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <User className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold">Customer Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                            <input name="name" required value={formData.name} onChange={handleInputChange} className="input-field" placeholder="John Doe" />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">Phone Number</label>
                            <input name="phone" required type="tel" value={formData.phone} onChange={handleInputChange} className="input-field" placeholder="+91 98765 43210" />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">Aadhaar Number</label>
                            <input name="aadhaar" value={formData.aadhaar} onChange={handleInputChange} className="input-field" placeholder="1234 5678 9012" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-sm font-medium mb-1.5 block">Address</label>
                            <textarea name="address" value={formData.address} onChange={handleInputChange} className="input-field resize-none" rows={3} placeholder="Enter full address" />
                        </div>
                    </div>
                </section>

                {/* Device Section */}
                <section className="glass-card p-6 rounded-xl space-y-4">
                    <div className="flex items-center gap-3 mb-2 border-b border-border pb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Smartphone className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold">Device Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">Model Name</label>
                            <input name="modelName" required value={formData.modelName} onChange={handleInputChange} className="input-field" placeholder="e.g. Samsung Galaxy A15" />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">Device Alias</label>
                            <input name="deviceName" required value={formData.deviceName} onChange={handleInputChange} className="input-field" placeholder="e.g. John's Phone" />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">IMEI 1</label>
                            <input name="imei1" required value={formData.imei1} onChange={handleInputChange} className="input-field" placeholder="15-digit IMEI" />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">IMEI 2 (Optional)</label>
                            <input name="imei2" value={formData.imei2} onChange={handleInputChange} className="input-field" placeholder="15-digit IMEI" />
                        </div>
                    </div>
                </section>

                {/* Finance Section */}
                <section className="glass-card p-6 rounded-xl space-y-4">
                    <div className="flex items-center gap-3 mb-2 border-b border-border pb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold">Finance Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">Finance Company</label>
                            <input name="financeCompany" required value={formData.financeCompany} onChange={handleInputChange} className="input-field" placeholder="e.g. Bajaj Finserv" />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">Total Device Value (₹)</label>
                            <input name="mobileAmount" type="number" required value={formData.mobileAmount} onChange={handleInputChange} className="input-field" placeholder="15000" />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">Monthly EMI (₹)</label>
                            <input name="emiMonthly" type="number" required value={formData.emiMonthly} onChange={handleInputChange} className="input-field" placeholder="2000" />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">Total Months</label>
                            <input name="totalEmis" type="number" required value={formData.totalEmis} onChange={handleInputChange} className="input-field" placeholder="12" />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">EMI Start Date</label>
                            <input name="emiStartDate" type="date" required value={formData.emiStartDate} onChange={handleInputChange} className="input-field" />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">Total Payable</label>
                            <div className="input-field bg-secondary/50 flex items-center text-muted-foreground">
                                ₹ {calculateTotalEmi()}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border flex justify-center z-40">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full max-w-lg shadow-lg py-6 text-lg"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <QrCode className="w-5 h-5 mr-2" />}
                        {isSubmitting ? 'Registering...' : 'Submit & Generate QR'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default NewRegistration;
