package com.budyclub.app;

import android.app.Activity;
import android.os.Process;
import android.view.Window;
import android.view.WindowManager;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.jetbrains.annotations.NotNull;

import java.util.HashSet;
import java.util.Set;

public class BudyclubNativeUtils extends ReactContextBaseJavaModule {
    private static final String Tag = BudyclubNativeUtils.class.getName();

    private final ReactApplicationContext reactContext;
    private final Set<String> requestersKeepingDeviceAwake = new HashSet<>();
    private final Set<String> requestersShowingOngoingMeetingNotification = new HashSet<>();


    public BudyclubNativeUtils(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

        reactContext.addLifecycleEventListener(new LifecycleEventListener() {

            @Override
            public void onHostResume() {

            }

            @Override
            public void onHostPause() {

            }

            @Override
            public void onHostDestroy() {
                BudyclubForegroundService.stop(reactContext);
//                This seems extreme, but the process won't otherwise immediately stop sending
                // audio and video
                Process.killProcess(Process.myPid());
            }
        });
    }

    @NotNull
    @Override
    public String getName() {
        return "BudyclubNativeUtils";
    }

    @ReactMethod
    public void setKeepDeviceAwake(boolean keepDeviceAwake, String requesterId) {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            activity.runOnUiThread(() -> {
                if (keepDeviceAwake) {
                    requestersKeepingDeviceAwake.add(requesterId);
                } else {
                    requestersKeepingDeviceAwake.remove(requesterId);
                }
                updateKeepScreenOnFlag(activity);
            });
        }
    }

    // Note: notification properties (e.g. title) can't be changed while it is ongoing.
    @ReactMethod
    public void setShowOngoingMeetingNotification(boolean showOngoingMeetingNotification, String title, String subtitle, String iconName, String requesterId) {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            activity.runOnUiThread(() -> {
                if (showOngoingMeetingNotification) {
                    requestersShowingOngoingMeetingNotification.add(requesterId);
                } else {
                    requestersShowingOngoingMeetingNotification.remove(requesterId);
                }
                updateOngoingMeetingForegroundService(activity, title, subtitle, iconName);
            });
        }
    }

    private void updateOngoingMeetingForegroundService(Activity activity, String title, String subtitle, String iconName) {
        if (requestersShowingOngoingMeetingNotification.size() > 0){
            BudyclubForegroundService.start(activity.getClass(), title, subtitle, iconName, reactContext);
        } else {
            BudyclubForegroundService.stop(reactContext);
        }
    }

    private void updateKeepScreenOnFlag(Activity activity) {
        Window window = activity.getWindow();
        if (requestersKeepingDeviceAwake.size() > 0) {
            window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        } else {
            window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        }
    }

}
