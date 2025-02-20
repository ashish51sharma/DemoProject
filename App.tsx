import React, { useEffect } from "react";
import { View, StyleSheet, PermissionsAndroid, Platform, Alert, Linking, AppState } from "react-native";
import WebView from "react-native-webview";
import BackgroundService from "react-native-background-actions";
import Geolocation from "react-native-geolocation-service";
import AsyncStorage from "@react-native-async-storage/async-storage";

//  Background Task chale Even After App is Killed
const backgroundTask = async () => {
  console.log(" Background Tracking Started");

  await new Promise((resolve) => {
    const interval = setInterval(async () => {
      Geolocation.getCurrentPosition(
        async (position) => {
          console.log("Location:", position.coords);

          // Save Location to AsyncStorage
          let locations = JSON.parse(await AsyncStorage.getItem("locations")) || [];
          locations.unshift({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date().toISOString(),
          });

          await AsyncStorage.setItem("locations", JSON.stringify(locations));
          console.log("Location saved locally");

          // Check if Background Service is Running
          if (await BackgroundService.isRunning()) {
            BackgroundService.updateNotification({
              taskDesc: ` Location: ${position.coords.latitude}, ${position.coords.longitude}`,
            });
          } else {
            console.log("Background service not running, restarting...");
            await BackgroundService.start(backgroundTask, options);
          }
        },
        (error) => {
          console.log("Location Error:", error.message);
        },
        { enableHighAccuracy: true, interval: 10000, fastestInterval: 5000 }
      );
    }, 10000);

    resolve();
  });
};

// Foreground Service Options (Auto Restart)
const options = {
  taskName: "LiveLocation",
  taskTitle: "Live Location Tracking",
  taskDesc: "Tracking your location in background...",
  taskIcon: {
    name: "ic_launcher",
    type: "mipmap",
  },
  color: "#ff0000",
  linkingURI: "com.demoproject://webview", // Auto Restart
  parameters: { delay: 1000 },
  allowExecutionInForeground: true,
  stopOnTerminate: false, // App close hone ke baad bhi background me chalega
  startOnBoot: true, // Device restart hone par bhi service auto start hogi
};

// Request Permissions
const requestPermissions = async () => {
  if (Platform.OS === "android") {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, // Foreground Location
    ];

    // Android 10 (API 29) aur upar ke versions ke liye background location chahiye
    if (Platform.Version >= 29) {
      permissions.push(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION);
    }

    try {
      const granted = await PermissionsAndroid.requestMultiple(permissions);

      // Foreground Location Required
      if (granted["android.permission.ACCESS_FINE_LOCATION"] === PermissionsAndroid.RESULTS.GRANTED) {
        console.log(" Fine Location Permission Granted");

        // Background location check for Android 10+
        if (Platform.Version >= 29) {
          if (granted["android.permission.ACCESS_BACKGROUND_LOCATION"] === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Background Location Permission Granted");
          } else {
            console.log("Background Location Permission Denied, but foreground location is available.");
          }
        }
        return true;
      } else {
        console.log("Location Permission Denied");
        return false;
      }
    } catch (error) {
      console.log("Permission request failed:", error);
      return false;
    }
  } else {
    return true; 
  }
};



// Start Background Service
const startBackgroundService = async () => {
  if (await requestPermissions()) {
    console.log(" Starting Background Service...");
    await BackgroundService.start(backgroundTask, options);
    BackgroundService.isRunning();
  }
};

// Monitor App State (Restart Background Task)
const handleAppStateChange = async (nextAppState) => {
  if (nextAppState === "background") {
    console.log("App went to background, restarting background service...");
    await startBackgroundService();
  }
};

//  App Component
export default function App() {
  useEffect(() => {
    startBackgroundService();
    AppState.addEventListener("change", handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);

  return (
    <View style={styles.container}>
      
      <WebView source={{ uri: "https://ezypayroll.in/" }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
