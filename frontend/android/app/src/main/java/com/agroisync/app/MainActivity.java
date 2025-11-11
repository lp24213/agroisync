package com.agroisync.app;

import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;
import android.view.View;
import androidx.core.splashscreen.SplashScreen;
import com.getcapacitor.BridgeActivity;
import com.agroisync.app.auth.CloudflareAuthManager;
import com.agroisync.app.utils.ThemeUtils;

public class MainActivity extends BridgeActivity {
	private static final String TAG = "MainActivity";
	private PlayIntegrityManager playIntegrityManager;
	private CloudflareAuthManager authManager;
	private View mainContent;
	private boolean initialLoadComplete = false;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		// Envolver a inicialização principal em try/catch para evitar crashes fatais no startup
		SplashScreen splashScreen = null;
		super.onCreate(savedInstanceState);
		try {
			// Configurar splash screen
			splashScreen = SplashScreen.installSplashScreen(this);

			// Configurar tema
			try {
				View contentView = findViewById(android.R.id.content);
				if (contentView != null) {
					ThemeUtils.setupEdgeToEdge(getWindow(), contentView);
				} else {
					Log.w(TAG, "contentView is null when setting up edge-to-edge");
				}
			} catch (Throwable t) {
				Log.w(TAG, "Failed to setup edge-to-edge", t);
			}

			// Inicializar managers em background
			initializeManagers();

			// Configurar conteúdo principal
			mainContent = findViewById(android.R.id.content);
			try {
				if (mainContent != null) {
					ThemeUtils.applySystemBarInsets(mainContent);
				} else {
					Log.w(TAG, "mainContent is null when applying system bar insets");
				}
			} catch (Throwable t) {
				Log.w(TAG, "Failed to apply system bar insets", t);
			}

			// Configurar tema adaptativo (proteção)
			try {
				boolean isDarkMode = ThemeUtils.isDarkMode(this);
				setTheme(isDarkMode ? R.style.AppTheme_Dark : R.style.AppTheme);
			} catch (Throwable t) {
				Log.w(TAG, "Failed to apply adaptive theme", t);
				setTheme(R.style.AppTheme);
			}

			// Manter splash até o carregamento completo (ou liberar se algo falhar)
			if (splashScreen != null) {
				splashScreen.setKeepOnScreenCondition(() -> !initialLoadComplete);
			}

			// Iniciar carregamento assíncrono
			startAsyncInitialization();
		} catch (Throwable t) {
			// Se ocorrer qualquer erro durante a inicialização, logamos e garantimos que
			// a UI não fique travada na tela de splash. Evitamos crashar o processo.
			Log.e(TAG, "Erro não tratado durante onCreate; evitando crash", t);
			initialLoadComplete = true; // permitir que a UI avance
			try {
				Toast.makeText(this, "Erro interno ao iniciar o app. Reinicie e tente novamente.", Toast.LENGTH_LONG).show();
			} catch (Throwable ignore) {}
		}
	}

	private void initializeManagers() {
		new Thread(() -> {
			playIntegrityManager = new PlayIntegrityManager(this);
			authManager = new CloudflareAuthManager(this);
			// Verificar autenticação em background
			checkAuthentication();
		}).start();
	}

	private void startAsyncInitialization() {
		runOnUiThread(() -> {
			try {
				// Marcar como completo imediatamente para evitar tela branca
				initialLoadComplete = true;

				// Configurar WebView para Turnstile após o bridge estar pronto
				configureWebViewForTurnstile();

				// Verificar integridade em background
				new Thread(() -> {
					try {
						Thread.sleep(1000); // Dar tempo para a UI carregar
						verifyDeviceIntegrity();
					} catch (Exception e) {
						Log.e(TAG, "Erro ao verificar integridade", e);
					}
				}).start();

			} catch (Exception e) {
				Log.e(TAG, "Erro durante inicialização", e);
			}
		});
	}

	private void configureWebViewForTurnstile() {
		// Aguardar até que o bridge esteja totalmente inicializado
		runOnUiThread(() -> {
			try {
				if (this.bridge != null) {
					android.webkit.WebView webView = this.bridge.getWebView();
					if (webView != null) {
						android.webkit.WebSettings settings = webView.getSettings();
						
						// Configurações essenciais para JavaScript
						settings.setJavaScriptEnabled(true);
						settings.setDomStorageEnabled(true);
						settings.setDatabaseEnabled(true);
						
						// Configurações de acesso
						settings.setAllowFileAccess(true);
						settings.setAllowContentAccess(true);
						settings.setAllowFileAccessFromFileURLs(true);
						settings.setAllowUniversalAccessFromFileURLs(true);
						
						// Configurações de conteúdo misto (HTTPS/HTTP) - necessário para Turnstile
						settings.setMixedContentMode(android.webkit.WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
						
						// Configurações de cache para melhor performance
						settings.setCacheMode(android.webkit.WebSettings.LOAD_DEFAULT);
						
						// User Agent padrão (necessário para Turnstile detectar dispositivo)
						String userAgent = settings.getUserAgentString();
						settings.setUserAgentString(userAgent);
						
						// Habilitar zoom e viewport
						settings.setSupportZoom(true);
						settings.setBuiltInZoomControls(false);
						settings.setDisplayZoomControls(false);
						
						// Configurações de renderização
						settings.setRenderPriority(android.webkit.WebSettings.RenderPriority.HIGH);
						
						Log.d(TAG, "WebView configurado para Turnstile com sucesso");
					} else {
						Log.w(TAG, "WebView ainda não está disponível, tentando novamente em onStart...");
					}
				}
			} catch (Exception e) {
				Log.e(TAG, "Erro ao configurar WebView para Turnstile", e);
			}
		});
	}

	private void verifyDeviceIntegrity() {
		if (playIntegrityManager != null) {
			playIntegrityManager.verifyDeviceIntegrity(new PlayIntegrityManager.IntegrityCallback() {
				@Override
				public void onSuccess() {
					Log.d(TAG, "Verificação de integridade bem sucedida");
				}

				@Override
				public void onFailure(String error) {
					Log.e(TAG, "Falha na verificação de integridade: " + error);
					runOnUiThread(() -> {
						Toast.makeText(MainActivity.this,
								"Por favor, use apenas versões oficiais do AgroiSync",
								Toast.LENGTH_LONG).show();
					});
				}
			});
		}
	}

	private void checkAuthentication() {
		if (authManager != null && !authManager.isAuthenticated()) {
			authManager.refreshAccessToken(new CloudflareAuthManager.AuthCallback() {
				@Override
				public void onSuccess() {
					Log.d(TAG, "Token atualizado com sucesso");
				}

				@Override
				public void onError(String message) {
					Log.e(TAG, "Erro ao atualizar token: " + message);
				}
			});
		}
	}

	@Override
	public void onStart() {
		super.onStart();
		// Configurar WebView quando estiver disponível
		if (this.bridge != null && this.bridge.getWebView() != null) {
			configureWebViewForTurnstile();
		}
	}

	@Override
	public void onResume() {
		super.onResume();
		if (initialLoadComplete) {
			checkAuthentication();
		}
		// Garantir que o WebView está configurado
		if (this.bridge != null && this.bridge.getWebView() != null) {
			configureWebViewForTurnstile();
		}
	}
}
