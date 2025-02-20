package com.demoproject;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.work.Configuration; // ✅ Ensure this import works

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;

import java.util.List;

public class MainApplication extends Application implements ReactApplication, Configuration.Provider {

    private final ReactNativeHost mReactNativeHost =
            new DefaultReactNativeHost(this) {
                @Override
                public boolean getUseDeveloperSupport() {
                    return BuildConfig.DEBUG;
                }

                @Override
                protected List<ReactPackage> getPackages() {
                    return new PackageList(this).getPackages();
                }

                @Override
                protected String getJSMainModuleName() {
                    return "index";
                }

                @Override
                protected boolean isNewArchEnabled() {
                    return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
                }

                @Override
                protected Boolean isHermesEnabled() {
                    return BuildConfig.IS_HERMES_ENABLED;
                }
            };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this,  false);
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            DefaultNewArchitectureEntryPoint.load();
        }
        ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    }

  
    @Override
    public @NonNull Configuration getWorkManagerConfiguration() {
        return new Configuration.Builder()
                .setMinimumLoggingLevel(android.util.Log.INFO)
                .build();
    }
}
