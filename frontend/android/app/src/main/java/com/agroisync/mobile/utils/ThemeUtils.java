package com.agroisync.mobile.utils;

import android.content.Context;
import android.content.res.Configuration;
import android.os.Build;
import android.view.View;
import android.view.Window;

import androidx.appcompat.app.AppCompatDelegate;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

public class ThemeUtils {
    
    public static void setAppTheme(String theme) {
        switch (theme.toLowerCase()) {
            case "light":
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
                break;
            case "dark":
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
                break;
            default:
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM);
                break;
        }
    }

    public static boolean isDarkMode(Context context) {
        return (context.getResources().getConfiguration().uiMode & 
                Configuration.UI_MODE_NIGHT_MASK) == Configuration.UI_MODE_NIGHT_YES;
    }

    public static void setupEdgeToEdge(Window window, View rootView) {
        // Habilitar layout edge-to-edge
        WindowCompat.setDecorFitsSystemWindows(window, false);

        // Configurar controlador de insets
        WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(window, rootView);
        
        // Configurar comportamento da barra de sistema
        controller.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);

        // Ajustar visibilidade baseado no tema
        boolean isDarkMode = isDarkMode(rootView.getContext());
        
        // Ajustar ícones da barra de status para light/dark
        controller.setAppearanceLightStatusBars(!isDarkMode);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            controller.setAppearanceLightNavigationBars(!isDarkMode);
        }
    }

    public static void applySystemBarInsets(View view) {
        view.setOnApplyWindowInsetsListener((v, insets) -> {
            WindowInsetsCompat insetsCompat = WindowInsetsCompat.toWindowInsetsCompat(insets);
            
            // Aplicar padding baseado nos insets do sistema
            v.setPadding(
                v.getPaddingLeft(),
                v.getPaddingTop() + insetsCompat.getSystemWindowInsetTop(),
                v.getPaddingRight(),
                v.getPaddingBottom() + insetsCompat.getSystemWindowInsetBottom()
            );
            
            return insets;
        });
    }

    public static int getStatusBarHeight(Context context) {
        int result = 0;
        int resourceId = context.getResources().getIdentifier("status_bar_height", "dimen", "android");
        if (resourceId > 0) {
            result = context.getResources().getDimensionPixelSize(resourceId);
        }
        return result;
    }

    public static int getNavigationBarHeight(Context context) {
        int result = 0;
        int resourceId = context.getResources().getIdentifier("navigation_bar_height", "dimen", "android");
        if (resourceId > 0) {
            result = context.getResources().getDimensionPixelSize(resourceId);
        }
        return result;
    }
}