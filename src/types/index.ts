export interface Customer {
  id: string;
  name: string;
  phone: string;
  aadhaar: string;
  address: string;
  createdAt: Date;
}

export interface Device {
  id: string;
  customerId: string;
  deviceName: string;
  modelName: string;
  imei1: string;
  imei2: string;
  status: 'locked' | 'unlocked' | 'pending';
  lastSyncAt: Date;
  registeredAt: Date;
}

export interface EMIDetails {
  id: string;
  customerId: string;
  deviceId: string;
  financeCompany: string;
  mobileAmount: number;
  totalEmiAmount: number;
  emiMonthly: number;
  emiStartDate: Date;
  emiEndDate: Date;
  paidEmis: number;
  totalEmis: number;
  nextDueDate: Date;
  status: 'active' | 'completed' | 'overdue' | 'defaulted';
}

export interface EMIPayment {
  id: string;
  emiId: string;
  amount: number;
  paidAt: Date;
  status: 'paid' | 'pending' | 'failed';
  transactionId: string;
}

export interface DashboardStats {
  totalDevices: number;
  lockedDevices: number;
  activeEmis: number;
  overdueEmis: number;
  totalCollection: number;
  pendingCollection: number;
}
