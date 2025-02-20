package com.demoproject;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;

public class LocationService extends Service {

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d("LocationService", "Service started");
        return START_STICKY;
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.d("LocationService", "Service destroyed");
    }
}
