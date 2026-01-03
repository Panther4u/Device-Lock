import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Customer } from "@/types";
import { Phone, MapPin, Smartphone, CreditCard } from "lucide-react";

interface CustomerDetailsModalProps {
    customer: Customer | null;
    isOpen: boolean;
    onClose: () => void;
}

export const CustomerDetailsModal = ({ customer, isOpen, onClose }: CustomerDetailsModalProps) => {
    if (!customer) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <span className="text-lg font-bold text-primary-foreground">
                                {customer.name.charAt(0)}
                            </span>
                        </div>
                        <div>
                            <span className="text-foreground">{customer.name}</span>
                            <p className="text-sm font-normal text-muted-foreground">{customer.id}</p>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-secondary/30 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Phone</p>
                            <p className="font-medium text-foreground">{customer.phone}</p>
                        </div>
                        <div className="p-4 bg-secondary/30 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Aadhaar</p>
                            <p className="font-medium text-foreground">{customer.aadhaar}</p>
                        </div>
                        <div className="col-span-2 p-4 bg-secondary/30 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Address</p>
                            <p className="font-medium text-foreground">{customer.address}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
