import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentDevices } from '@/components/dashboard/RecentDevices';
import { EMIOverview } from '@/components/dashboard/EMIOverview';
import { CollectionChart } from '@/components/dashboard/CollectionChart';
import { Smartphone, Lock, CreditCard, AlertTriangle, IndianRupee, Clock, Loader2 } from 'lucide-react';
import { fetchDevices, fetchEMIs } from '@/services/api';
import { Device, EMIDetails } from '@/types';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDevices: 0,
    lockedDevices: 0,
    activeEmis: 0,
    overdueEmis: 0,
    totalCollection: 0,
    pendingCollection: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [devices, emis] = await Promise.all([
          fetchDevices(),
          fetchEMIs()
        ]);

        const totalDevices = devices.length;
        const lockedDevices = devices.filter((d: Device) => d.status === 'locked').length;

        const activeEmis = emis.filter((e: EMIDetails) => e.status === 'active' || e.status === 'overdue').length;
        const overdueEmis = emis.filter((e: EMIDetails) => e.status === 'overdue').length;

        // Calculate collections
        // Total Collection = Paid EMIs * Monthly Amount
        const totalCollection = emis.reduce((acc: number, curr: EMIDetails) => acc + (curr.paidEmis * curr.emiMonthly), 0);

        // Pending Collection = (Total EMIs - Paid EMIs) * Monthly Amount
        const pendingCollection = emis.reduce((acc: number, curr: EMIDetails) => acc + ((curr.totalEmis - curr.paidEmis) * curr.emiMonthly), 0);

        setStats({
          totalDevices,
          lockedDevices,
          activeEmis,
          overdueEmis,
          totalCollection,
          pendingCollection
        });

      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
  }

  return (
    <div className="animate-fade-in">
      <Header
        title="Dashboard"
        subtitle="Monitor your EMI lock system performance"
      />

      {/* Stats Grid - Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Devices"
          value={stats.totalDevices}
          icon={Smartphone}
          trend={{ value: 0, isPositive: true }}
          variant="primary"
        />
        <StatCard
          title="Locked Devices"
          value={stats.lockedDevices}
          icon={Lock}
          variant="danger"
        />
        <StatCard
          title="Active EMIs"
          value={stats.activeEmis}
          icon={CreditCard}
          variant="success"
        />
        <StatCard
          title="Overdue EMIs"
          value={stats.overdueEmis}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="Total Collection"
          value={`₹${(stats.totalCollection / 1000).toFixed(1)}K`}
          icon={IndianRupee}
          variant="success"
        />
        <StatCard
          title="Pending"
          value={`₹${(stats.pendingCollection / 1000).toFixed(1)}K`}
          icon={Clock}
          variant="warning"
        />
      </div>

      {/* Charts - Stack on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <CollectionChart />
        <RecentDevices />
      </div>

      {/* EMI Table */}
      <EMIOverview />
    </div>
  );
};

export default Dashboard;
