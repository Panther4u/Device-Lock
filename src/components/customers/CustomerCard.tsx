import { Customer, Device, EMIDetails } from '@/types';
import { MoreVertical, Phone, CreditCard, MapPin, Smartphone } from 'lucide-react';

interface CustomerCardProps {
    customer: Customer;
    onClick: () => void;
    devices: Device[]; // Optional or passed if available
    emis: EMIDetails[]; // Optional
}

export const CustomerCard = ({ customer, onClick, devices = [], emis = [] }: CustomerCardProps) => {
    const activeEmi = emis.find(e => e.status === 'active' || e.status === 'overdue');

    return (
        <div
            className="glass-card rounded-xl p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer group"
            onClick={onClick}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <span className="text-lg font-bold text-primary-foreground">
                            {customer.name.charAt(0)}
                        </span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">{customer.name}</h3>
                        <p className="text-sm text-muted-foreground">{customer.id}</p>
                    </div>
                </div>
                <button className="p-2 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <CreditCard className="w-4 h-4" />
                    <span>Aadhaar: {customer.aadhaar}</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{customer.address}</span>
                </div>
            </div>

            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">{devices.length} Device{devices.length !== 1 ? 's' : ''}</span>
                </div>
                {activeEmi && (
                    <span className={`status-badge ${activeEmi.status === 'overdue' ? 'status-overdue' : 'status-unlocked'}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {activeEmi.status === 'overdue' ? 'Overdue' : 'Active EMI'}
                    </span>
                )}
            </div>
        </div>
    );
};
