import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Customer } from '@/types';
import { fetchCustomers, createCustomer, deleteCustomer } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { CustomerCard } from '@/components/customers/CustomerCard';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';

export const CustomersView = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const data = await fetchCustomers();
            setCustomers(data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load customers",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddCustomer = async (data: any) => {
        try {
            const newCustomer = {
                ...data,
                id: `CUS${Math.floor(Math.random() * 10000)}`,
                createdAt: new Date(),
            };
            await createCustomer(newCustomer);
            await loadCustomers();
            setShowAddModal(false);
            toast({
                title: "Success",
                description: "Customer added successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add customer",
                variant: "destructive",
            });
        }
    };

    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery)
    );

    if (isLoading) {
        return <div className="flex justify-center items-center py-12"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search customers..."
                        className="input-field w-full md:w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => navigate('/new-registration')}
                    className="btn-primary flex items-center justify-center gap-2 w-full md:w-auto"
                >
                    <Plus className="w-4 h-4" />
                    Add Customer
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredCustomers.map((cust) => (
                    <CustomerCard
                        key={cust.id}
                        customer={cust}
                        onClick={() => navigate(`/manage/${cust.id}`)}
                        devices={[]}
                        emis={[]}
                    />
                ))}
                {filteredCustomers.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No customers found matching your search.
                    </div>
                )}
            </div>

            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogContent className="max-w-xl bg-card border-border">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">Add New Customer</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4 mt-4" onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        handleAddCustomer({
                            name: formData.get('name'),
                            phone: formData.get('phone'),
                            aadhaar: formData.get('aadhaar'),
                            address: formData.get('address')
                        });
                    }}>
                        <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">Full Name</label>
                            <input name="name" type="text" className="input-field" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Phone Number</label>
                                <input name="phone" type="tel" className="input-field" required />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Aadhaar Number</label>
                                <input name="aadhaar" type="text" className="input-field" />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">Address</label>
                            <textarea name="address" className="input-field resize-none" rows={3} />
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-4">
                            <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary">
                                Add Customer
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};
