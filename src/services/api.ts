const API_URL = 'http://localhost:5000/api';

export const fetchCustomers = async () => {
    const response = await fetch(`${API_URL}/customers`);
    if (!response.ok) throw new Error('Failed to fetch customers');
    return response.json();
};

export const createCustomer = async (customerData: any) => {
    const response = await fetch(`${API_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData),
    });
    if (!response.ok) throw new Error('Failed to create customer');
    return response.json();
};

export const deleteCustomer = async (id: string) => {
    const response = await fetch(`${API_URL}/customers/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete customer');
    return response.json();
};

export const fetchDevices = async () => {
    const response = await fetch(`${API_URL}/devices`);
    if (!response.ok) throw new Error('Failed to fetch devices');
    return response.json();
};

export const fetchDevicesByCustomer = async (customerId: string) => {
    const response = await fetch(`${API_URL}/devices/customer/${customerId}`);
    if (!response.ok) throw new Error('Failed to fetch devices');
    return response.json();
};

export const updateDeviceStatus = async (id: string, status: string) => {
    const response = await fetch(`${API_URL}/devices/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update device status');
    return response.json();
};

export const fetchEMIs = async () => {
    const response = await fetch(`${API_URL}/emi`);
    if (!response.ok) throw new Error('Failed to fetch EMIs');
    return response.json();
};

export const fetchEMIsByCustomer = async (customerId: string) => {
    const response = await fetch(`${API_URL}/emi/customer/${customerId}`);
    if (!response.ok) throw new Error('Failed to fetch EMIs');
    return response.json();
};

export const createDevice = async (deviceData: any) => {
    const response = await fetch(`${API_URL}/devices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deviceData),
    });
    if (!response.ok) throw new Error('Failed to create device');
    return response.json();
};

export const createEMI = async (emiData: any) => {
    const response = await fetch(`${API_URL}/emi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emiData),
    });
    if (!response.ok) throw new Error('Failed to create EMI');
    return response.json();
};

export const resetDatabase = async () => {
    const response = await fetch(`${API_URL}/reset`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to reset database');
    return response.json();
};
