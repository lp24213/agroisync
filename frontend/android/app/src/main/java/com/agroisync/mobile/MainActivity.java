package com.agroisync.mobile;

import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;
import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.animation.AccelerateDecelerateInterpolator;

import androidx.core.splashscreen.SplashScreen;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;
import com.agroisync.mobile.auth.CloudflareAuthManager;
import com.agroisync.mobile.utils.AnimationUtils;
import com.agroisync.mobile.utils.ThemeUtils;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "MainActivity";
    private PlayIntegrityManager playIntegrityManager;
    private CloudflareAuthManager authManager;
    private View mainContent;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Gerenciar splash screen antes do super.onCreate
        SplashScreen splashScreen = SplashScreen.installSplashScreen(this);
        super.onCreate(savedInstanceState);
        
        // Configurar tema e edge-to-edge depois do super.onCreate
        ThemeUtils.setupEdgeToEdge(getWindow(), findViewById(android.R.id.content));
        
        // Inicializar managers
        playIntegrityManager = new PlayIntegrityManager(this);
        authManager = new CloudflareAuthManager(this);

        // Configurar animação de fade do splash screen
        mainContent = findViewById(android.R.id.content);
        ThemeUtils.applySystemBarInsets(mainContent);
        
        mainContent.getViewTreeObserver().addOnPreDrawListener(new ViewTreeObserver.OnPreDrawListener() {
            @Override
            public boolean onPreDraw() {
                mainContent.getViewTreeObserver().removeOnPreDrawListener(this);
                setupInitialAnimation();
                return true;
            }
        });

        // Configurar tema adaptativo
        boolean isDarkMode = ThemeUtils.isDarkMode(this);
        setTheme(isDarkMode ? R.style.AppTheme_Dark : R.style.AppTheme);
        
        // Verificar autenticação
        checkAuthentication();
        
        // Verificar integridade do dispositivo
        verifyDeviceIntegrity();
    }

    private void verifyDeviceIntegrity() {
        playIntegrityManager.verifyDeviceIntegrity(new PlayIntegrityManager.IntegrityCallback() {
            @Override
            public void onSuccess() {
                Log.d(TAG, "Verificação de integridade bem sucedida");
                // Continuar com a inicialização normal do app
            }

            @Override
            public void onFailure(String error) {
                Log.e(TAG, "Falha na verificação de integridade: " + error);
                // Mostrar mensagem para o usuário
                runOnUiThread(() -> {
                    Toast.makeText(MainActivity.this, 
                        "Por favor, use apenas versões oficiais do AgroiSync", 
                        Toast.LENGTH_LONG).show();
                });
            }
        });
    }

    private void setupInitialAnimation() {
        // Configurar animação inicial suave
        mainContent.setAlpha(0f);
        AnimationUtils.fadeIn(mainContent, 800);
    }

    private void checkAuthentication() {
        if (!authManager.isAuthenticated()) {
            authManager.refreshAccessToken(new CloudflareAuthManager.AuthCallback() {
                @Override
                public void onSuccess() {
                    Log.d(TAG, "Token atualizado com sucesso");
                }

                @Override
                public void onError(String message) {
                    Log.e(TAG, "Erro ao atualizar token: " + message);
                    // Aqui você pode redirecionar para a tela de login se necessário
                }
            });
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        // Verificar autenticação ao retomar o app
        checkAuthentication();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        // Limpar recursos se necessário
    }
}