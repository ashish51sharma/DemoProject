package com.demoproject;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;
import androidx.annotation.Nullable;

public class MyBackgroundService extends Service {

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d("BackgroundService", "Background Service Running...");
        return START_STICKY;
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
