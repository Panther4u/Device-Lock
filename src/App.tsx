import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Index from "./pages/Index";
import Customers from "./pages/Customers";
import Devices from "./pages/Devices";
import EMIManagement from "./pages/EMIManagement";
import QRGenerator from "./pages/QRGenerator";
import LockControl from "./pages/LockControl";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import NewRegistration from "./pages/NewRegistration";
import UnifiedManagement from "./pages/UnifiedManagement";
import CustomerDetails from "./pages/CustomerDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/manage" element={<UnifiedManagement />} />
            <Route path="/manage/:customerId" element={<CustomerDetails />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/emi" element={<EMIManagement />} />
            <Route path="/qr-generator" element={<QRGenerator />} />
            <Route path="/lock-control" element={<LockControl />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/new-registration" element={<NewRegistration />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
