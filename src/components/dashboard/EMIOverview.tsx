import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fetchEMIs, fetchCustomers, fetchDevices } from '@/services/api';
import { EMIDetails, Customer, Device } from '@/types';
import { Loader2 } from 'lucide-react';

const statusStyles: Record<string, string> = {
  active: 'status-unlocked',
  completed: 'status-unlocked',
  overdue: 'status-overdue',
  defaulted: 'status-locked',
};

export const EMIOverview = () => {
  const [emis, setEmis] = useState<EMIDetails[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [emiData, custData, devData] = await Promise.all([
          fetchEMIs(),
          fetchCustomers(),
          fetchDevices()
        ]);
        setEmis(emiData);
        setCustomers(custData);
        setDevices(devData);
      } catch (error) {
        console.error("Failed to load EMI data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const getCustomerName = (id: string) => customers.find(c => c.id === id)?.name || id;
  const getDeviceName = (id: string) => devices.find(d => d.id === id)?.deviceName || id;

  if (isLoading) return <div className="glass-card rounded-xl p-6 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">EMI Overview</h3>
        <button className="text-sm text-primary hover:underline">View All</button>
      </div>

      {/* Mobile View: Cards */}
      <div className="grid gap-4 md:hidden">
        {emis.map((emi) => {
          const progress = emi.totalEmis > 0 ? (emi.paidEmis / emi.totalEmis) * 100 : 0;

          return (
            <div key={emi.id} className="p-4 bg-secondary/30 rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-foreground">{getCustomerName(emi.customerId)}</h4>
                  <p className="text-sm text-muted-foreground">{emi.financeCompany}</p>
                </div>
                <span className={`status-badge ${statusStyles[emi.status] || 'status-unlocked'}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {emi.status.charAt(0).toUpperCase() + emi.status.slice(1)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Device</span>
                <span className="text-foreground">{getDeviceName(emi.deviceId)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly EMI</span>
                <span className="font-mono text-foreground">₹{emi.emiMonthly.toLocaleString()}</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-foreground">{emi.paidEmis}/{emi.totalEmis} Paid</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between text-sm pt-2 border-t border-border/50">
                <span className="text-muted-foreground">Next Due</span>
                <span className="text-foreground">{format(new Date(emi.nextDueDate), 'dd MMM yyyy')}</span>
              </div>
            </div>
          );
        })}
        {emis.length === 0 && <p className="text-center text-muted-foreground text-sm py-4">No active EMIs.</p>}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Device</th>
              <th>Monthly EMI</th>
              <th>Progress</th>
              <th>Next Due</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {emis.map((emi) => {
              const progress = emi.totalEmis > 0 ? (emi.paidEmis / emi.totalEmis) * 100 : 0;

              return (
                <tr key={emi.id}>
                  <td>
                    <div>
                      <p className="font-medium text-foreground">{getCustomerName(emi.customerId)}</p>
                      <p className="text-xs text-muted-foreground">{emi.financeCompany}</p>
                    </div>
                  </td>
                  <td className="text-muted-foreground">{getDeviceName(emi.deviceId)}</td>
                  <td className="font-mono text-foreground">₹{emi.emiMonthly.toLocaleString()}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {emi.paidEmis}/{emi.totalEmis}
                      </span>
                    </div>
                  </td>
                  <td className="text-muted-foreground">
                    {format(new Date(emi.nextDueDate), 'dd MMM yyyy')}
                  </td>
                  <td>
                    <span className={`status-badge ${statusStyles[emi.status] || 'status-unlocked'}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {emi.status.charAt(0).toUpperCase() + emi.status.slice(1)}
                    </span>
                  </td>
                </tr>
              );
            })}
            {emis.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-muted-foreground py-8">No active EMIs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
