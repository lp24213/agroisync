package com.agroisync.mobile;

import android.content.Context;
import android.util.Log;

import com.google.android.gms.tasks.Task;
import com.google.android.play.core.integrity.IntegrityManager;
import com.google.android.play.core.integrity.IntegrityManagerFactory;
import com.google.android.play.core.integrity.IntegrityTokenRequest;
import com.google.android.play.core.integrity.IntegrityTokenResponse;

public class PlayIntegrityManager {
    private static final String TAG = "PlayIntegrityManager";
    private final IntegrityManager integrityManager;
    private final Context context;

    public PlayIntegrityManager(Context context) {
        this.context = context;
        this.integrityManager = IntegrityManagerFactory.create(context);
    }

    public void verifyDeviceIntegrity(IntegrityCallback callback) {
        // Criar um nonce aleatório para esta verificação
        String nonce = String.valueOf(System.currentTimeMillis());

        // Preparar a requisição do token
        IntegrityTokenRequest request = IntegrityTokenRequest.builder()
                .setNonce(nonce)
                .build();

        // Obter o token de integridade
        Task<IntegrityTokenResponse> task = integrityManager.requestIntegrityToken(request);

        task.addOnSuccessListener(response -> {
            // Token obtido com sucesso
            String integrityToken = response.token();
            // Enviar o token para o backend verificar
            verifyTokenWithBackend(integrityToken, callback);
        }).addOnFailureListener(e -> {
            // Erro ao obter o token
            Log.e(TAG, "Erro ao obter token de integridade", e);
            callback.onFailure("Falha na verificação de integridade: " + e.getMessage());
        });
    }

    private void verifyTokenWithBackend(String token, IntegrityCallback callback) {
        // TODO: Implementar chamada para o backend
        // Por enquanto, vamos assumir que está ok
        callback.onSuccess();
    }

    public interface IntegrityCallback {
        void onSuccess();
        void onFailure(String error);
    }
}