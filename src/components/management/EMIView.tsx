import { useState, useEffect } from 'react';
import { fetchEMIs } from '@/services/api';
import { EMIDetails } from '@/types';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export const EMIView = () => {
    const [emis, setEmis] = useState<EMIDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadEMIs();
    }, []);

    const loadEMIs = async () => {
        try {
            const data = await fetchEMIs();
            setEmis(data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load EMI details",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-4">
            <div className="grid gap-4">
                {emis.map(emi => (
                    <div key={emi.id} className="glass-card p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                            <p className="font-semibold">{emi.financeCompany}</p>
                            <p className="text-sm text-muted-foreground">Amount: ₹{emi.mobileAmount}</p>
                        </div>
                        <div className={`status-badge self-start sm:self-auto ${emi.status === 'overdue' ? 'status-overdue' : 'status-unlocked'}`}>
                            {emi.status}
                        </div>
                    </div>
                ))}
                {emis.length === 0 && <p className="text-center text-muted-foreground py-8">No EMI records found.</p>}
            </div>
        </div>
    );
};
