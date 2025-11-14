package com.agroisync.app;

import android.os.Bundle;
import android.util.Log;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
	private static final String TAG = "MainActivity";

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		Log.d(TAG, "MainActivity onCreate - App iniciando");
		
		// Configurar WebView após o Capacitor inicializar
		configureWebView();
	}

	private void configureWebView() {
		runOnUiThread(() -> {
			try {
				if (this.bridge != null && this.bridge.getWebView() != null) {
					android.webkit.WebView webView = this.bridge.getWebView();
					android.webkit.WebSettings settings = webView.getSettings();

					// Configurações essenciais
					settings.setJavaScriptEnabled(true);
					settings.setDomStorageEnabled(true);
					settings.setDatabaseEnabled(true);
					settings.setMixedContentMode(android.webkit.WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

					// Configurações de acessibilidade e performance
					settings.setSupportZoom(true);
					settings.setBuiltInZoomControls(true);
					settings.setDisplayZoomControls(false);
					settings.setLoadWithOverviewMode(true);
					settings.setUseWideViewPort(true);

					// Cache para melhor performance
					settings.setCacheMode(android.webkit.WebSettings.LOAD_DEFAULT);
					// Cache methods removidos em versões mais recentes do Android
					// settings.setAppCacheEnabled(true);
					// settings.setAppCachePath(getCacheDir().getAbsolutePath());

					// Suporte a conteúdo moderno
					settings.setMediaPlaybackRequiresUserGesture(false);
					settings.setAllowFileAccess(true);
					settings.setAllowContentAccess(true);

					// Configurações visuais modernas
					webView.setScrollBarStyle(android.webkit.WebView.SCROLLBARS_INSIDE_OVERLAY);
					webView.setScrollbarFadingEnabled(true);

					// Tema escuro automático
					if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
						settings.setAlgorithmicDarkeningAllowed(true);
					}

					Log.d(TAG, "WebView configurado com sucesso - Modo acessível e moderno ativado");
				} else {
					Log.w(TAG, "WebView ainda não disponível");
				}
			} catch (Exception e) {
				Log.e(TAG, "Erro ao configurar WebView", e);
			}
		});
	}

	@Override
	public void onStart() {
		super.onStart();
		configureWebView();
	}
}
