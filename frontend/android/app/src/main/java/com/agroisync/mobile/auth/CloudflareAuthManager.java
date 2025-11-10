package com.agroisync.mobile.auth;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class CloudflareAuthManager {
    private static final String TAG = "CloudflareAuthManager";
    private static final String PREF_NAME = "CloudflareAuth";
    private static final String KEY_ACCESS_TOKEN = "access_token";
    private static final String KEY_REFRESH_TOKEN = "refresh_token";

    private final Context context;
    private final RequestQueue requestQueue;
    private final SharedPreferences preferences;
    private String accessToken;
    private String refreshToken;

    public CloudflareAuthManager(Context context) {
        this.context = context;
        this.requestQueue = Volley.newRequestQueue(context);
        this.preferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        loadTokens();
    }

    private void loadTokens() {
        accessToken = preferences.getString(KEY_ACCESS_TOKEN, null);
        refreshToken = preferences.getString(KEY_REFRESH_TOKEN, null);
    }

    private void saveTokens(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        preferences.edit()
                .putString(KEY_ACCESS_TOKEN, accessToken)
                .putString(KEY_REFRESH_TOKEN, refreshToken)
                .apply();
    }

    public void authenticate(String username, String password, AuthCallback callback) {
        String url = "https://agroisync.com/api/auth/login";
        Map<String, String> params = new HashMap<>();
        params.put("username", username);
        params.put("password", password);

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST, url,
                new JSONObject(params),
                response -> {
                    try {
                        String newAccessToken = response.getString("access_token");
                        String newRefreshToken = response.getString("refresh_token");
                        saveTokens(newAccessToken, newRefreshToken);
                        callback.onSuccess();
                    } catch (Exception e) {
                        callback.onError("Erro ao processar resposta: " + e.getMessage());
                    }
                },
                error -> callback.onError("Erro na autenticação: " + error.getMessage()));

        requestQueue.add(request);
    }

    public void refreshAccessToken(AuthCallback callback) {
        if (refreshToken == null) {
            callback.onError("Refresh token não disponível");
            return;
        }

        String url = "https://agroisync.com/api/auth/refresh";
        Map<String, String> params = new HashMap<>();
        params.put("refresh_token", refreshToken);

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST, url,
                new JSONObject(params),
                response -> {
                    try {
                        String newAccessToken = response.getString("access_token");
                        String newRefreshToken = response.getString("refresh_token");
                        saveTokens(newAccessToken, newRefreshToken);
                        callback.onSuccess();
                    } catch (Exception e) {
                        callback.onError("Erro ao processar resposta: " + e.getMessage());
                    }
                },
                error -> callback.onError("Erro ao atualizar token: " + error.getMessage()));

        requestQueue.add(request);
    }

    public String getAccessToken() {
        return accessToken;
    }

    public boolean isAuthenticated() {
        return accessToken != null;
    }

    public void logout() {
        accessToken = null;
        refreshToken = null;
        preferences.edit().clear().apply();
    }

    public interface AuthCallback {
        void onSuccess();
        void onError(String message);
    }
}