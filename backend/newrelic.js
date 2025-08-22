'use strict';

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
  app_name: ['AGROISYNC Backend'],
  
  /**
   * Your New Relic license key.
   */
  license_key: process.env.NEW_RELIC_LICENSE_KEY || 'your_license_key_here',
  
  /**
   * This setting controls distributed tracing.
   * Distributed tracing lets you see the path that a request takes through your
   * distributed system. Enabling distributed tracing changes the behavior of some
   * New Relic features, so carefully consult the transition guide before you enable
   * this feature: https://docs.newrelic.com/docs/transition-guide-distributed-tracing
   * Default is true.
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
   * Attributes are key-value pairs that can be used to provide additional
   * information about a transaction or error. Some attributes are automatically
   * added by the agent, and you can add custom attributes as well.
   */
  attributes: {
    /**
     * Prefix of attributes to exclude from all destinations. Allows * as wildcard
     * at end of prefix.
     *
     * NOTE: If excluding headers, they must be in camelCase form to be filtered.
     *
     * @env NEW_RELIC_ATTRIBUTES_EXCLUDE
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
   * Transaction tracer enables deep visibility into slow transactions and error
   * conditions.
   */
  transaction_tracer: {
    /**
     * Transaction tracer is enabled by default. Set this to false to disable it.
     */
    enabled: true,
    
    /**
     * Transaction threshold in seconds. When negative, the threshold is
     * ignored and the transaction tracer behaves as if this feature is
     * disabled.
     */
    transaction_threshold: 5,
    
    /**
     * When true, includes all arguments to external node calls in the
     * transaction trace.
     */
    record_sql: 'obfuscated',
    
    /**
     * Set to true to log all queries to the console.
     */
    log_queries: false,
    
    /**
     * Set to true to log all queries to the console.
     */
    explain_threshold: 500
  },
  
  /**
   * Error collector captures and reports errors that occur in your application.
   */
  error_collector: {
    /**
     * Error collector is enabled by default. Set this to false to disable it.
     */
    enabled: true,
    
    /**
     * List of error classes to ignore.
     */
    ignore_errors: []
  },
  
  /**
   * Slow query logging enables the agent to record slow queries.
   */
  slow_sql: {
    /**
     * Slow query logging is enabled by default. Set this to false to disable it.
     */
    enabled: true,
    
    /**
     * The agent will record queries that take longer than this many seconds.
     */
    max_samples: 10
  },
  
  /**
   * Browser monitoring gives you insight into the performance of your application's
   * client-side code.
   */
  browser_monitoring: {
    /**
     * Browser monitoring is disabled by default. Set this to true to enable it.
     */
    enabled: false
  },
  
  /**
   * Host display name.
   */
  host_display_name: process.env.NEW_RELIC_HOST_DISPLAY_NAME || 'AGROISYNC Backend',
  
  /**
   * Application logging enables you to see log messages in the New Relic UI.
   */
  application_logging: {
    /**
     * Application logging is enabled by default. Set this to false to disable it.
     */
    enabled: true,
    
    /**
     * When true, the agent will collect log records and send them to New Relic.
     */
    forwarding: {
      /**
       * Toggles whether the agent gathers log records for sending to New Relic.
       */
      enabled: true,
      
      /**
       * Maximum number of log records to buffer in memory. Records are sent
       * to New Relic when the buffer is full, when the process exits, or
       * when the agent is stopped.
       */
      max_samples_stored: 10000
    },
    
    /**
     * When true, the agent will collect log records and send them to New Relic.
     */
    metrics: {
      /**
       * Toggles whether the agent gathers log records for sending to New Relic.
       */
      enabled: true
    }
  },
  
  /**
   * Distributed tracing lets you see the path that a request takes through your
   * distributed system. Enabling distributed tracing changes the behavior of some
   * New Relic features, so carefully consult the transition guide before you enable
   * this feature: https://docs.newrelic.com/docs/transition-guide-distributed-tracing
   */
  distributed_tracing: {
    /**
     * Enables/disables distributed tracing.
     */
    enabled: true
  },
  
  /**
   * Infinite tracing gives you complete visibility into your distributed system by
   * letting you see the end of distributed traces, eliminating any blind spots.
   */
  infinite_tracing: {
    /**
     * Enables/disables infinite tracing.
     */
    enabled: false,
    
    /**
     * The infinite tracing endpoint.
     */
    span_events: {
      /**
       * Enables/disables infinite tracing.
       */
      queue_size: 10000
    }
  },
  
  /**
   * Logging level for log messages.
   */
  logging: {
    /**
     * Level of logging. Should be one of the following:
     * error, warn, info, debug, trace
     */
    level: process.env.NEW_RELIC_LOG_LEVEL || 'info'
  },
  
  /**
   * When true, the agent will capture all query parameters by default for all
   * transactions.
   */
  capture_params: false,
  
  /**
   * Proxy settings for connecting to the New Relic collector.
   */
  proxy: {
    /**
     * Proxy host.
     */
    host: process.env.NEW_RELIC_PROXY_HOST,
    
    /**
     * Proxy port.
     */
    port: process.env.NEW_RELIC_PROXY_PORT,
    
    /**
     * Proxy username.
     */
    user: process.env.NEW_RELIC_PROXY_USER,
    
    /**
     * Proxy password.
     */
    pass: process.env.NEW_RELIC_PROXY_PASS
  },
  
  /**
   * Security settings.
   */
  security: {
    /**
     * Controls whether the agent should capture SQL queries for
     * transactions. Valid values are:
     * - obfuscated (default): SQL queries are captured but obfuscated
     * - raw: SQL queries are captured as-is
     * - off: SQL queries are not captured
     */
    record_sql: 'obfuscated',
    
    /**
     * Controls whether the agent should capture query parameters for
     * transactions. Valid values are:
     * - obfuscated (default): Query parameters are captured but obfuscated
     * - raw: Query parameters are captured as-is
     * - off: Query parameters are not captured
     */
    record_parameters: 'obfuscated'
  },
  
  /**
   * Transaction naming rules.
   */
  transaction_name_rules: [
    {
      /**
       * Pattern to match against the transaction name.
       */
      pattern: '^/api/(.*)$',
      
      /**
       * Name to use for the transaction.
       */
      name: 'API /$1'
    },
    {
      /**
       * Pattern to match against the transaction name.
       */
      pattern: '^/health(.*)$',
      
      /**
       * Name to use for the transaction.
       */
      name: 'Health Check$1'
    }
  ],
  
  /**
   * URL rules for transaction naming.
   */
  url_rules: [
    {
      /**
       * Pattern to match against the URL.
       */
      pattern: '^/api/(.*)$',
      
      /**
       * Name to use for the transaction.
       */
      name: 'API /$1'
    }
  ],
  
  /**
   * Ignore patterns for transactions.
   */
  ignore_patterns: [
    '^/health$',
    '^/metrics$',
    '^/favicon.ico$'
  ],
  
  /**
   * Custom instrumentation rules.
   */
  custom_instrumentation: {
    /**
     * Enables/disables custom instrumentation.
     */
    enabled: true
  },
  
  /**
   * Serverless mode configuration.
   */
  serverless_mode: {
    /**
     * Enables/disables serverless mode.
     */
    enabled: process.env.NEW_RELIC_SERVERLESS_MODE === 'true'
  }
};
