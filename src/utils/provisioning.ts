export interface ProvisioningPayload {
    "android.app.extra.PROVISIONING_DEVICE_ADMIN_COMPONENT_NAME": string;
    "android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_DOWNLOAD_LOCATION": string;
    "android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_CHECKSUM": string;
    "android.app.extra.PROVISIONING_SKIP_ENCRYPTION": boolean;
    "android.app.extra.PROVISIONING_ADMIN_EXTRAS_BUNDLE": {
        customerId: string;
        customerName: string;
        phone: string;
        deviceId: string;
        financeName: string;
        imei1: string;
    };
}

export const generateProvisioningPayload = (
    customerId: string,
    customerName: string,
    phone: string,
    deviceId: string,
    financeName: string,
    imei1: string
): ProvisioningPayload => {
    return {
        "android.app.extra.PROVISIONING_DEVICE_ADMIN_COMPONENT_NAME": "com.emilock.admin/.DeviceAdminReceiver",
        "android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_DOWNLOAD_LOCATION": "https://emi-pro.onrender.com/dl/emilock-admin.apk",
        "android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_CHECKSUM": "BASE64_SHA256_CHECKSUM",
        "android.app.extra.PROVISIONING_SKIP_ENCRYPTION": true,
        "android.app.extra.PROVISIONING_ADMIN_EXTRAS_BUNDLE": {
            customerId,
            customerName,
            phone,
            deviceId,
            financeName,
            imei1,
        }
    };
};
