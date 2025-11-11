package com.agroisync.app;

import android.app.Application;
import android.util.Log;

public class App extends Application {

    private static final String TAG = "AgroiSyncApp";

    @Override
    public void onCreate() {
        super.onCreate();

        // Registrador global de exceções para evitar crashes inesperados terminando o processo
        Thread.setDefaultUncaughtExceptionHandler((thread, throwable) -> {
            try {
                Log.e(TAG, "Uncaught exception in thread " + thread, throwable);
                // Aqui poderíamos logar em um endpoint remoto ou salvar em arquivo para análise
            } catch (Throwable t) {
                // Não fazer nada além de evitar crashing adicional
            }
            // Não chamar System.exit ou rethrow — preferimos tentar manter o app vivo e colher logs
        });
    }
}
