package com.budyclub.app;

import android.app.Activity;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;

import java.util.Random;

// apart from showing notification this also helps to run the app in background
public class BudyclubForegroundService extends Service {
    private static final String TAG = BudyclubForegroundService.class.getName();

    private static final String NOTIFICATION_CHANNEL_ID = "BudyClubMeetingSessionNotificationChannel";

    private static final int NOTIFICATION_ID = new Random().nextInt(99999) + 10000;
    private static long startingTime = 0;

    private static final String EXTRA_TITLE = "title";
    private static final String EXTRA_SUBTITLE = "subtitle";
    private static final String EXTRA_ICON_NAME = "icon_name";

    public  static Class<? extends Activity> activityClassToOpenFromNotification;

    public static void start(Class<? extends Activity> activityClass, String title, String subtitle, String iconName, Context context){
        activityClassToOpenFromNotification = activityClass;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O){
            createNotificationChannel(context);
        }
        Intent intent = new Intent(context, BudyclubForegroundService.class);
        intent.putExtra(EXTRA_TITLE, title);
        intent.putExtra(EXTRA_SUBTITLE, subtitle);
        intent.putExtra(EXTRA_ICON_NAME, iconName);
        ContextCompat.startForegroundService(context, intent);
    }

    public static void stop(Context context){
        Intent intent = new Intent(context, BudyclubForegroundService.class);
        context.stopService(intent);
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId){
        String title = intent.getStringExtra(EXTRA_TITLE);
        if(title == null){
            title = "Room Session";
        }
        String subtitle = intent.getStringExtra(EXTRA_SUBTITLE);
        if (subtitle == null){
            subtitle = "Ongoing room session";
        }
        String iconName = intent.getStringExtra(EXTRA_ICON_NAME);
        if(iconName == null){
            iconName = "ic_daily_videocam_24dp";
        }
        int icon = getResources().getIdentifier(
                iconName,
                "drawable",
                getPackageName());
        Intent notificationIntent = new Intent(this, activityClassToOpenFromNotification);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, notificationIntent, 0);

        if (startingTime == 0) {
            // startingTime = System.currentTimeMillis();
        }

        Notification notification = new NotificationCompat.Builder(this, NOTIFICATION_CHANNEL_ID)
                .setContentTitle(title)
                .setContentText(subtitle)
                .setSmallIcon(R.mipmap.ic_launcher) //R.mipmap.ic_launcher
                .setContentIntent(pendingIntent)
                .setWhen(System.currentTimeMillis())
                .setUsesChronometer(true)
                .setAutoCancel(false)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setCategory(NotificationCompat.CATEGORY_CALL)
                .setOngoing(true)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setOnlyAlertOnce(true)
                .build();
        startForeground(NOTIFICATION_ID, notification);

        return START_NOT_STICKY;

    }

    // This is safe to call multiple times. It will no-op if the channel already exists.
    @RequiresApi(Build.VERSION_CODES.O)
    private static void createNotificationChannel(Context context) {
        NotificationChannel notificationChannel = new NotificationChannel(
                NOTIFICATION_CHANNEL_ID,
                "Ongoing Room Session",
                NotificationManager.IMPORTANCE_DEFAULT
        );

        notificationChannel.setShowBadge(true);
        notificationChannel.enableLights(false);
        notificationChannel.setVibrationPattern(new long[]{0});

        NotificationManager manager = context.getSystemService(NotificationManager.class);
        manager.createNotificationChannel(notificationChannel);
    }
}
