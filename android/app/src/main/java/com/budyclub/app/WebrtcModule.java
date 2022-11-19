package com.budyclub.app;

import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import javax.annotation.Nonnull;

public class WebrtcModule extends ReactContextBaseJavaModule {
  
  public static final String REACT_CLASS = "Webrtc";
    private static ReactApplicationContext reactContext;

    public WebrtcModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void startService() {
        this.reactContext.startService(new Intent(this.reactContext, WebrtcService.class));
    }

    @ReactMethod
    public void stopService() {
        this.reactContext.stopService(new Intent(this.reactContext, WebrtcService.class));
    }
}
