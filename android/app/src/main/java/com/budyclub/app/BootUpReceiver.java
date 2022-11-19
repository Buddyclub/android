package com.budyclub.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

public class BootUpReceiver extends BroadcastReceiver {
@Override
public void onReceive(Context context, Intent intent) {
    if(intent.getAction() == Intent.ACTION_BOOT_COMPLETED){
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            final int importance = NotificationManager.IMPORTANCE_LOW;
            context.startForegroundService(new Intent(context, WebrtcService.class));
            return;
            // final NotificationChannel channel = new NotificationChannel(CHANNEL_ID, taskTitle, importance);
            // channel.setDescription(taskDesc);
            // final NotificationManager notificationManager = getSystemService(NotificationManager.class);
            // notificationManager.createNotificationChannel(channel);
        }
        // log("Starting the service in < 26 Mode from a BroadcastReceiver");
        context.startService(new Intent(context, WebrtcService.class));
    }

}
}
