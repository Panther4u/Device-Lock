import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';

interface AddCustomerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: any) => Promise<void>;
}

export const AddCustomerModal = ({ isOpen, onClose, onAdd }: AddCustomerModalProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            aadhaar: formData.get('aadhaar'),
            address: formData.get('address')
        };
        await onAdd(data);
        setIsLoading(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-xl bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="text-foreground">Add New Customer</DialogTitle>
                </DialogHeader>
                <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
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
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={isLoading}>
                            {isLoading ? 'Adding...' : 'Add Customer'}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
