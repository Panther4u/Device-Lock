package com.devicelock.app.services;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class SyncWorker extends Worker {

    private static final String TAG = "SyncWorker";
    // UPDATE THIS URL TO YOUR PRODUCTION BACKEND
    private static final String BACKEND_URL = "https://emi-pro.onrender.com/api/devices/sync";

    public SyncWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
    }

    @NonNull
    @Override
    public Result doWork() {
        Log.d(TAG, "Starting SyncWorker...");

        try {
            // 1. Get IMEI (Stored during provisioning or fetched via TelephonyManager)
            // For production, you must use the IMEI saved in SharedPreferences during
            // Device Admin setup
            String imei = getSavedImei();

            if (imei == null || imei.isEmpty()) {
                Log.e(TAG, "No IMEI found. Skipping sync.");
                return Result.failure();
            }

            // 2. Poll Backend
            String responseStr = fetchDeviceStatus(imei);
            if (responseStr == null) {
                return Result.retry();
            }

            // 3. Parse Response
            JSONObject response = new JSONObject(responseStr);
            boolean isLocked = response.optBoolean("locked", false);
            String lockMessage = response.optString("lockMessage", "Device Locked");
            String supportPhone = response.optString("supportPhone", "");

            // 4. Handle Lock State
            if (isLocked) {
                triggerLockScreen(lockMessage, supportPhone);
            } else {
                dismissLockScreen();
            }

            return Result.success();

        } catch (Exception e) {
            Log.e(TAG, "Error in SyncWorker", e);
            return Result.failure();
        }
    }

    private String getSavedImei() {
        SharedPreferences prefs = getApplicationContext().getSharedPreferences("DeviceLockPrefs", Context.MODE_PRIVATE);
        return prefs.getString("imei", "123456789012345"); // Default mock for testing
    }

    private String fetchDeviceStatus(String imei) {
        try {
            URL url = new URL(BACKEND_URL + "?imei=" + imei);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);

            int status = conn.getResponseCode();
            if (status != 200) {
                Log.e(TAG, "Backend returned status: " + status);
                return null;
            }

            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String inputLine;
            StringBuilder content = new StringBuilder();
            while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
            }
            in.close();
            conn.disconnect();

            Log.d(TAG, "Response: " + content.toString());
            return content.toString();

        } catch (Exception e) {
            Log.e(TAG, "Network error", e);
            return null;
        }
    }

    private void triggerLockScreen(String message, String phone) {
        Context context = getApplicationContext();
        Intent intent = new Intent(context, LockActivity.class);
        intent.addFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        intent.putExtra("message", message);
        intent.putExtra("phone", phone);
        context.startActivity(intent);

        Log.i(TAG, "LOCK COMMAND RECEIVED: " + message);
    }

    private void dismissLockScreen() {
        // Send broadcast or intent to close LockActivity
        Context context = getApplicationContext();
        Intent intent = new Intent("com.devicelock.app.UNLOCK_DEVICE");
        context.sendBroadcast(intent);
        Log.i(TAG, "UNLOCK COMMAND RECEIVED");
    }
}
