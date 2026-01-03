import { Header } from '@/components/layout/Header';
import { CustomersView } from '@/components/management/CustomersView';

const UnifiedManagement = () => {
    return (
        <div className="animate-fade-in pb-20"> {/* pb-20 for bottom nav space */}
            <Header
                title="Manage Customers"
                subtitle="View and manage customer profiles"
            />

            <div className="px-4 md:px-6">
                <CustomersView />
            </div>
        </div>
    );
};

export default UnifiedManagement;
