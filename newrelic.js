'use strict'

/**
 * New Relic agent configuration.
 *
 * See lib/config/default.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name: ['AGROISYNC Platform'],
  
  /**
   * Your New Relic license key.
   */
  license_key: process.env.NEW_RELIC_LICENSE_KEY || 'your-license-key',
  
  /**
   * This setting controls distributed tracing.
   */
  distributed_tracing: {
    enabled: true
  },
  
  /**
   * When true, all request headers except for those listed in attributes.exclude
   * will be captured for all traces, unless otherwise specified in a destination's
   * attributes include/exclude lists.
   */
  allow_all_headers: true,
  
  /**
   * Attributes are key-value pairs that can be used to add business context
   * to your metrics and traces.
   */
  attributes: {
    /**
     * Prefix of attributes to exclude from all destinations. Allows
     * you to prevent sensitive information from being sent to New Relic.
     */
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie*',
      'request.headers.x*',
      'response.headers.cookie',
      'response.headers.authorization',
      'response.headers.proxyAuthorization',
      'response.headers.setCookie*',
      'response.headers.x*'
    ]
  },
  
  /**
   * Transaction tracer enables capture of detailed transaction trace data for
   * slow transactions and error traces.
   */
  transaction_tracer: {
    enabled: true,
    transaction_threshold: 500,
    record_sql: 'obfuscated',
    stack_trace_threshold: 500,
    explain_threshold: 500
  },
  
  /**
   * Error collector captures and reports errors that occur in your application.
   */
  error_collector: {
    enabled: true,
    collect_errors: true,
    ignore_status_codes: [404, 405, 410, 429, 500, 502, 503, 504]
  },
  
  /**
   * Browser monitoring gives you insight into the performance real users are
   * experiencing with your website.
   */
  browser_monitoring: {
    enable: true
  },
  
  /**
   * Host display name when using multiple hosts to run a single application.
   */
  process_host: {
    display_name: 'AGROISYNC Backend'
  },
  
  /**
   * Application logging provides a way to see logs from your application in
   * the context of the rest of your application's performance data.
   */
  application_logging: {
    forwarding: {
      enabled: true
    }
  },
  
  /**
   * Custom instrumentation for specific modules or functions.
   */
  custom_instrumentation: {
    enabled: true
  },
  
  /**
   * Transaction naming rules.
   */
  transaction_naming: {
    enabled: true
  },
  
  /**
   * Rules for naming transactions.
   */
  rules: {
    name: [
      { pattern: '/api/auth/*', name: 'Auth API' },
      { pattern: '/api/users/*', name: 'Users API' },
      { pattern: '/api/staking/*', name: 'Staking API' },
      { pattern: '/api/nfts/*', name: 'NFTs API' },
      { pattern: '/api/marketplace/*', name: 'Marketplace API' },
      { pattern: '/api/dashboard/*', name: 'Dashboard API' }
    ]
  }
}
