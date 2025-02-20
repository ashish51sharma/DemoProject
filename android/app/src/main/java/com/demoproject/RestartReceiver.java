package com.demoproject;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import com.demoproject.LocationService;

public class RestartReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d("RestartReceiver", "Boot Completed - Restarting Location Service");

        Intent serviceIntent = new Intent(context, LocationService.class);
        context.startForegroundService(serviceIntent);
    }
}
