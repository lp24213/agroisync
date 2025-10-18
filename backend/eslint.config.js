import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

// Ajustes: ativar ambiente node e declarar `process` como global readonly
const browserGlobals = globals.browser;
const nodeGlobals = globals.node;

export default defineConfig([
  {
    ignores: [
      '__tests__/',
      '*.test.js',
      '*.spec.js',
      'src/debug-worker.js',
      'src/api-worker.js',
      'src/email-only-worker.js',
      'src/final-working-worker.js',
      'src/fixed-apis-worker.js',
      'src/health-handler.js',
      'src/supabase-api-worker.js',
      'src/ultimate-worker.js',
      'src/whatsapp-email-worker.js',
      'src/working-api-worker.js',
      'src/working-delivery-worker.js',
      'src/working-sms-brazil-worker.js',
      'src/working-sms-email-worker.js',
      'src/working-sms-worker.js',
      'src/lambdas/',
      'src/scripts/',
      'src/config/devConfig.js',
      'src/config/redis.js',
      'src/config/socket.js',
      'src/config/metamask.js',
      'src/services/auditService.js',
      'src/services/backupService.js',
      'src/services/performanceMonitor.js',
      'src/services/externalAPIs.js',
      'src/services/loggingService.js',
      'src/services/notificationService.js',
      'src/services/openaiService.js',
      'src/services/secureURLService.js',
      'src/services/tokenService.js',
      'src/services/addressValidationService.js',
      'src/services/cloudflareService.js',
      'src/utils/finalVerification.js',
      'src/utils/configValidator.js',
      'src/utils/criticalDataValidator.js',
      'src/utils/securityLogger.js',
      'src/utils/responseFormatter.js',
      'src/utils/logger.js',
      'src/utils/ipUtils.js',
      'src/middleware/errorHandler.js',
      'src/middleware/validationMiddleware.js',
      'src/middleware/inputSanitizer.js',
      'src/routes/admin.js',
      'src/routes/messaging.js',
      'src/routes/nfts.js',
      'src/routes/products.js',
      'src/routes/shipments.js',
      'src/routes/stripe-webhook.js',
      'src/routes/transactions.js',
      'src/routes/upload.js',
      'src/routes/users.js',
      'src/routes/validation.js',
      'src/routes/visibility.js',
      'src/routes/weather.js',
      'src/routes/payments.js',
      'src/routes/freights.js',
      'src/routes/subscriptions.js',
      'src/routes/contact.js',
      'src/routes/email.js'
    ],
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...browserGlobals,
        ...nodeGlobals,
        process: "readonly"
      }
    },
    // declarar env node para regras que dependem disso
    rules: {
      // Desativar regra que impede require() — grande base legacy com CJS
      '@typescript-eslint/no-require-imports': 'off'
    }
  },
  // Apply recommended TS and React configs but keep them flexible
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  // Add an override for tests to enable Jest globals
  {
    files: ['**/__tests__/**', '**/*.test.{js,ts,jsx,tsx}', '**/*.spec.{js,ts,jsx,tsx}'],
    languageOptions: {
      globals: {
        ...browserGlobals,
        ...nodeGlobals,
        process: 'readonly',
        // jest globals
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly'
      }
    }
  }
]);
