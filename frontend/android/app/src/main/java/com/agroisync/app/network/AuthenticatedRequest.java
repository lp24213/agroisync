package com.agroisync.app.network;

import com.android.volley.AuthFailureError;
import com.android.volley.Response;
import com.android.volley.toolbox.JsonObjectRequest;
import com.agroisync.app.auth.CloudflareAuthManager;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class AuthenticatedRequest extends JsonObjectRequest {
    private final CloudflareAuthManager authManager;

    public AuthenticatedRequest(int method, String url, JSONObject jsonRequest,
                              Response.Listener<JSONObject> listener,
                              Response.ErrorListener errorListener,
                              CloudflareAuthManager authManager) {
        super(method, url, jsonRequest, listener, errorListener);
        this.authManager = authManager;
    }

    @Override
    public Map<String, String> getHeaders() throws AuthFailureError {
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        if (authManager.isAuthenticated()) {
            headers.put("Authorization", "Bearer " + authManager.getAccessToken());
        }
        return headers;
    }
}