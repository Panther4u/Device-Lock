import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { fetchCustomers, fetchDevicesByCustomer } from '@/services/api';
import { generateProvisioningPayload } from '@/utils/provisioning';
import { Customer, Device } from '@/types';
import { QrCode, Download, Copy, Check, Smartphone, User, Building2, Info, Loader2 } from 'lucide-react';
import QRCode from "react-qr-code";
import { toast } from '@/hooks/use-toast';

const QRGenerator = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);

  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedDevice, setSelectedDevice] = useState('');
  const [financeCompany, setFinanceCompany] = useState('');
  const [qrGenerated, setQrGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await fetchCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Failed to load customers", error);
      toast({
        title: "Error",
        description: "Failed to load customers",
        variant: "destructive"
      });
    } finally {
      setIsLoadingCustomers(false);
    }
  };

  const handleCustomerChange = async (customerId: string) => {
    setSelectedCustomer(customerId);
    setSelectedDevice('');
    setQrGenerated(false);

    if (customerId) {
      setIsLoadingDevices(true);
      try {
        const data = await fetchDevicesByCustomer(customerId);
        setDevices(data);
      } catch (error) {
        console.error("Failed to load devices", error);
        toast({
          title: "Error",
          description: "Failed to load devices for selected customer",
          variant: "destructive"
        });
        setDevices([]);
      } finally {
        setIsLoadingDevices(false);
      }
    } else {
      setDevices([]);
    }
  };

  const selectedCustomerData = customers.find(c => c.id === selectedCustomer);
  const selectedDeviceData = devices.find(d => d.id === selectedDevice);

  const generateQR = () => {
    if (selectedCustomer && selectedDevice && financeCompany) {
      setQrGenerated(true);
    }
  };

  const handleCopy = () => {
    setCopied(true);
    // Copy logic would go here
    navigator.clipboard.writeText(JSON.stringify(qrPayload));
    setTimeout(() => setCopied(false), 2000);
  };

  // Find full customer object
  const fullCustomer = customers.find(c => c.id === selectedCustomer);

  const qrPayload = generateProvisioningPayload(
    selectedCustomer,
    fullCustomer?.name || 'Unknown',
    fullCustomer?.phone || '',
    selectedDevice,
    financeCompany,
    selectedDeviceData?.imei1 || ''
  );

  return (
    <div className="animate-fade-in pb-32">
      <Header
        title="QR Generator"
        subtitle="Generate Android Enterprise provisioning QR codes"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          {/* Info Banner */}
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Android Enterprise Provisioning</p>
              <p className="text-sm text-muted-foreground mt-1">
                This QR code will provision a factory-reset Android device with the EMI Lock Admin APK
                as Device Owner. Only works on new or factory-reset devices.
              </p>
            </div>
          </div>

          {/* Customer Selection */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Customer Details</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Select Customer</label>
                {isLoadingCustomers ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading customers...</div>
                ) : (
                  <select
                    className="input-field"
                    value={selectedCustomer}
                    onChange={(e) => handleCustomerChange(e.target.value)}
                  >
                    <option value="">Choose a customer...</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                )}
              </div>

              {selectedCustomerData && (
                <div className="p-4 bg-secondary/30 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Phone</span>
                    <span className="text-sm text-foreground">{selectedCustomerData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Aadhaar</span>
                    <span className="text-sm text-foreground">{selectedCustomerData.aadhaar}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Device Selection */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Smartphone className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground">Device Details</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Select Device</label>
                {isLoadingDevices ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading devices...</div>
                ) : (
                  <select
                    className="input-field w-full"
                    value={selectedDevice}
                    onChange={(e) => {
                      setSelectedDevice(e.target.value);
                      setQrGenerated(false);
                    }}
                    disabled={!selectedCustomer}
                  >
                    <option value="">Choose a device...</option>
                    {devices.map(d => (
                      <option key={d.id} value={d.id}>{d.deviceName} - {d.imei1}</option>
                    ))}
                  </select>
                )}
              </div>

              {selectedDeviceData && (
                <div className="p-4 bg-secondary/30 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Model</span>
                    <span className="text-sm text-foreground">{selectedDeviceData.modelName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">IMEI 1</span>
                    <span className="text-sm font-mono text-foreground break-all">{selectedDeviceData.imei1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">IMEI 2</span>
                    <span className="text-sm font-mono text-foreground break-all">{selectedDeviceData.imei2}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Finance Company */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Building2 className="w-5 h-5 text-warning" />
              </div>
              <h3 className="font-semibold text-foreground">Finance Details</h3>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Finance Company</label>
              <input
                type="text"
                className="input-field w-full"
                placeholder="e.g., Bajaj Finserv"
                value={financeCompany}
                onChange={(e) => {
                  setFinanceCompany(e.target.value);
                  setQrGenerated(false);
                }}
              />
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateQR}
            disabled={!selectedCustomer || !selectedDevice || !financeCompany}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed py-4 md:py-3"
          >
            <QrCode className="w-5 h-5" />
            Generate Provisioning QR
          </button>
        </div>

        {/* QR Preview Section */}
        <div className="space-y-6">
          <div className="glass-card rounded-xl p-8">
            <div className="text-center mb-6">
              <h3 className="font-semibold text-foreground">Provisioning QR Code</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Scan this on a factory-reset Android device
              </p>
            </div>

            {/* QR Code Display */}
            <div className="flex justify-center mb-6">
              <div className={`w-fit h-fit p-4 bg-white rounded-xl shadow-sm transition-all duration-300 border border-primary/10`}>
                {qrGenerated ? (
                  <QRCode
                    value={JSON.stringify(qrPayload)}
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    viewBox={`0 0 256 256`}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center w-64 h-64">
                    <QrCode className="w-16 h-16 text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground text-center px-4">
                      Select customer and device details to generate QR
                    </p>
                  </div>
                )}
              </div>
            </div>       {qrGenerated && (
              <div className="flex items-center justify-center gap-4">
                <button className="btn-secondary flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download PNG
                </button>
                <button
                  onClick={handleCopy}
                  className="btn-secondary flex items-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Payload'}
                </button>
              </div>
            )}
          </div>

          {/* Payload Preview */}
          {qrGenerated && (
            <div className="glass-card rounded-xl p-6">
              <h4 className="font-semibold text-foreground mb-4">QR Payload (JSON)</h4>
              <pre className="p-4 bg-secondary/50 rounded-lg overflow-x-auto text-xs font-mono text-muted-foreground">
                {JSON.stringify(qrPayload, null, 2)}
              </pre>
            </div>
          )}

          {/* Instructions */}
          <div className="glass-card rounded-xl p-6">
            <h4 className="font-semibold text-foreground mb-4">Setup Instructions</h4>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
                <span>Factory reset the Android device</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
                <span>On the welcome screen, tap 6 times to enter QR setup mode</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
                <span>Connect to WiFi and scan this QR code</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold">4</span>
                <span>Device will download and install the Admin APK automatically</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold">5</span>
                <span>User APK will be installed silently by the Admin app</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
