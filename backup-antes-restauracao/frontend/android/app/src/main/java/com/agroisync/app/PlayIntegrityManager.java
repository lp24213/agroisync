package com.agroisync.app;

import android.content.Context;
import android.util.Log;

/**
 * Stub simples de PlayIntegrityManager para evitar crashes quando a implementação
 * real não estiver presente. Em produção, substitua por implementação que
 * execute a API Play Integrity corretamente.
 */
public class PlayIntegrityManager {
    private static final String TAG = "PlayIntegrityManager";
    private final Context context;

    public PlayIntegrityManager(Context context) {
        this.context = context;
    }

    public interface IntegrityCallback {
        void onSuccess();
        void onFailure(String error);
    }

    // Versão simples que always succeed (não bloqueante). Substituir conforme necessário.
    public void verifyDeviceIntegrity(IntegrityCallback callback) {
        try {
            // Placeholder: em produção, chame a API real e invoque callback conforme resultado.
            Log.d(TAG, "verifyDeviceIntegrity: stub success");
            if (callback != null) callback.onSuccess();
        } catch (Exception e) {
            Log.e(TAG, "verifyDeviceIntegrity error", e);
            if (callback != null) callback.onFailure(e.getMessage());
        }
    }
}
