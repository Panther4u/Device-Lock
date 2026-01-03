package com.devicelock.app;

import android.app.Activity;
import android.app.admin.DevicePolicyManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.TextView;

public class LockActivity extends Activity {

    private BroadcastReceiver unlockReceiver;
    private TextView lockTitle;
    private TextView lockMessage;
    private TextView supportPhone;
    private Button callSupportButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_lock);

        // Make this activity full-screen and show over lock screen
        getWindow().addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                        WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
                        WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
                        WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);

        // Initialize views
        lockTitle = findViewById(R.id.lockTitle);
        lockMessage = findViewById(R.id.lockMessage);
        supportPhone = findViewById(R.id.supportPhone);
        callSupportButton = findViewById(R.id.callSupportButton);

        // Get data from intent
        String title = getIntent().getStringExtra("message");
        String phone = getIntent().getStringExtra("phone");

        if (title != null)
            lockTitle.setText(title);
        if (phone != null) {
            supportPhone.setText("Contact Support: " + phone);
            callSupportButton.setOnClickListener(v -> {
                Intent callIntent = new Intent(Intent.ACTION_DIAL);
                callIntent.setData(android.net.Uri.parse("tel:" + phone));
                startActivity(callIntent);
            });
        }

        // Register broadcast receiver for unlock command
        unlockReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                finish();
            }
        };
        registerReceiver(unlockReceiver, new IntentFilter("com.devicelock.app.UNLOCK_DEVICE"));

        // Disable back button
        disableBackButton();
    }

    @Override
    public void onBackPressed() {
        // Do nothing - prevent back button
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (unlockReceiver != null) {
            unregisterReceiver(unlockReceiver);
        }
    }

    private void disableBackButton() {
        // Already handled in onBackPressed
    }
}
