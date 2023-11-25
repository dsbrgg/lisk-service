/*
 * LiskHQ/lisk-service
 * Copyright © 2019 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 *
 */

module.exports = {
	apps: [
		{
			name: 'lisk-service-gateway',
			script: 'app.js',
			cwd: './services/gateway',
			pid_file: './pids/service_gateway.pid',
			out_file: './logs/service_gateway.log',
			error_file: './logs/service_gateway.err',
			log_date_format: 'YYYY-MM-DD HH:mm:ss SSS',
			watch: false,
			kill_timeout: 10000,
			max_memory_restart: '300M',
			autorestart: true,
			env: {
				// --- Remember to set the properties below
				SERVICE_BROKER: 'redis://127.0.0.1:6379/0',
				SERVICE_GATEWAY_REDIS_VOLATILE: 'redis://127.0.0.1:6379/5',
				ENABLE_HTTP_API: 'http-status,http-version3,http-exports',
				ENABLE_WS_API: 'blockchain,rpc-v3',
				GATEWAY_DEPENDENCIES: 'indexer,connector',
				WS_RATE_LIMIT_ENABLE: false,
				WS_RATE_LIMIT_CONNECTIONS: 5,
				WS_RATE_LIMIT_DURATION: 1, // in seconds
				ENABLE_REQUEST_CACHING: true,
				JSON_RPC_STRICT_MODE: false,
				HTTP_RATE_LIMIT_ENABLE: false,
				HTTP_RATE_LIMIT_CONNECTIONS: 200,
				HTTP_RATE_LIMIT_WINDOW: 10, // in seconds
				HTTP_CACHE_CONTROL_DIRECTIVES: 'public, max-age=10',
				ENABLE_HTTP_CACHE_CONTROL: true,
				HTTP_RATE_LIMIT_ENABLE_X_FORWARDED_FOR: false,
				HTTP_RATE_LIMIT_NUM_KNOWN_PROXIES: 0,
				// ENABLE_REVERSE_PROXY_TIMEOUT_SETTINGS: true,
				// HTTP_KEEP_ALIVE_TIMEOUT: 65000,
				// HTTP_HEADERS_TIMEOUT: 66000,
				// CORS_ALLOWED_ORIGIN: '*',
				// HOST: '0.0.0.0',
				// SERVICE_BROKER_TIMEOUT: 10,
				// HOST: '0.0.0.0',
				// PORT: 9901,
				// SERVICE_LOG_LEVEL: 'info',
				// SERVICE_LOG_CONSOLE: false,
				// SERVICE_LOG_STDOUT: true,
				// SERVICE_LOG_GELF: false,
				// SERVICE_LOG_FILE: false,
				// DOCKER_HOST: 'local',
				// JOB_INTERVAL_UPDATE_READINESS_STATUS: 0,
				// JOB_SCHEDULE_UPDATE_READINESS_STATUS: '* * * * *',
			},
		},
		{
			name: 'lisk-service-blockchain-app-registry',
			script: 'app.js',
			cwd: './services/blockchain-app-registry',
			pid_file: './pids/service_blockchain_app_registry.pid',
			out_file: './logs/service_blockchain_app_registry.log',
			error_file: './logs/service_blockchain_app_registry.err',
			log_date_format: 'YYYY-MM-DD HH:mm:ss SSS',
			watch: false,
			kill_timeout: 10000,
			max_memory_restart: '150M',
			autorestart: true,
			env: {
				// --- Remember to set the properties below
				SERVICE_BROKER: 'redis://127.0.0.1:6379/0',
				SERVICE_APP_REGISTRY_MYSQL: 'mysql://lisk:password@127.0.0.1:3306/lisk',
				ENABLE_REBUILD_INDEX_AT_INIT: false,
				// SERVICE_BROKER_TIMEOUT: 10,
				// SERVICE_LOG_LEVEL: 'info',
				// SERVICE_LOG_CONSOLE: false,
				// SERVICE_LOG_STDOUT: true,
				// SERVICE_LOG_GELF: false,
				// SERVICE_LOG_FILE: false,
				// DOCKER_HOST: 'local',
				// GITHUB_APP_REGISTRY_REPO: 'https://github.com/LiskHQ/app-registry',
				// GITHUB_APP_REGISTRY_REPO_BRANCH: 'main',
				// JOB_INTERVAL_DELETE_NON_METADATA_FILES: 0,
				// JOB_SCHEDULE_DELETE_NON_METADATA_FILES: '0 0 * * *',
				// JOB_INTERVAL_UPDATE_METADATA: 0,
				// JOB_SCHEDULE_UPDATE_METADATA: '*/10 * * * *',
			},
		},
		{
			name: 'lisk-service-blockchain-connector',
			script: 'app.js',
			cwd: './services/blockchain-connector',
			pid_file: './pids/service_blockchain_connector.pid',
			out_file: './logs/service_blockchain_connector.log',
			error_file: './logs/service_blockchain_connector.err',
			log_date_format: 'YYYY-MM-DD HH:mm:ss SSS',
			watch: false,
			kill_timeout: 10000,
			max_memory_restart: '150M',
			autorestart: true,
			env: {
				// --- Remember to set the properties below
				SERVICE_BROKER: 'redis://127.0.0.1:6379/0',
				LISK_APP_WS: 'ws://127.0.0.1:7887',
				GEOIP_JSON: 'https://geoip.lisk.com/json',
				// ENABLE_BLOCK_CACHING: true,
				// EXPIRY_IN_HOURS: 12,
				// USE_LISK_IPC_CLIENT: true,
				// LISK_APP_DATA_PATH: '~/.lisk/lisk-core',
				// ENABLE_TESTING_MODE: false,
				// SERVICE_BROKER_TIMEOUT: 10,
				// SERVICE_LOG_LEVEL: 'info',
				// SERVICE_LOG_CONSOLE: false,
				// SERVICE_LOG_STDOUT: true,
				// SERVICE_LOG_GELF: false,
				// SERVICE_LOG_FILE: false,
				// DOCKER_HOST: 'local',
				// GENESIS_BLOCK_URL: 'https://downloads.lisk.com/lisk/mainnet/genesis_block.json.tar.gz',
				// CLIENT_INSTANTIATION_MAX_WAIT_TIME: 100,
				// CLIENT_INSTANTIATION_RETRY_INTERVAL: 1,
				// CLIENT_ALIVE_ASSUMPTION_TIME: 5 * 1000,
				// ENDPOINT_INVOKE_MAX_RETRIES: 5,
				// ENDPOINT_INVOKE_RETRY_DELAY: 10,
				// JOB_INTERVAL_CACHE_CLEANUP: 0,
				// JOB_SCHEDULE_CACHE_CLEANUP: '0 */12 * * *',
				// JOB_INTERVAL_REFRESH_PEERS: 60,
				// JOB_SCHEDULE_REFRESH_PEERS: '',
			},
		},
		{
			name: 'lisk-service-blockchain-indexer',
			script: 'app.js',
			cwd: './services/blockchain-indexer',
			pid_file: './pids/service_blockchain_indexer.pid',
			out_file: './logs/service_blockchain_indexer.log',
			error_file: './logs/service_blockchain_indexer.err',
			log_date_format: 'YYYY-MM-DD HH:mm:ss SSS',
			watch: false,
			kill_timeout: 10000,
			max_memory_restart: '500M',
			autorestart: true,
			env: {
				// --- Remember to set the properties below
				SERVICE_BROKER: 'redis://127.0.0.1:6379/0',
				SERVICE_INDEXER_CACHE_REDIS: 'redis://127.0.0.1:6379/1',
				SERVICE_INDEXER_REDIS_VOLATILE: 'redis://127.0.0.1:6379/2',
				SERVICE_MESSAGE_QUEUE_REDIS: 'redis://127.0.0.1:6379/3',
				SERVICE_INDEXER_MYSQL: 'mysql://lisk:password@127.0.0.1:3306/lisk',
				ENABLE_DATA_RETRIEVAL_MODE: true,
				ENABLE_INDEXING_MODE: true,
				ENABLE_PERSIST_EVENTS: false,
				// ENABLE_APPLY_SNAPSHOT: false,
				// DURABILITY_VERIFY_FREQUENCY: 1,
				// INDEX_SNAPSHOT_URL: '',
				// ENABLE_SNAPSHOT_ALLOW_INSECURE_HTTP: true,
				// SERVICE_INDEXER_MYSQL_READ_REPLICA: 'mysql://lisk:password@127.0.0.1:3306/lisk',
				// SERVICE_BROKER_TIMEOUT: 10,
				// SERVICE_LOG_LEVEL: 'info',
				// SERVICE_LOG_CONSOLE: false,
				// SERVICE_LOG_STDOUT: true,
				// SERVICE_LOG_GELF: false,
				// SERVICE_LOG_FILE: false,
				// DOCKER_HOST: 'local',
				// MAINCHAIN_SERVICE_URL: 'https://service.lisk.com',
				// LISK_STATIC: 'https://static-data.lisk.com',
				// DEVNET_MAINCHAIN_URL: 'http://devnet-service.liskdev.net:9901',
				// ESTIMATES_BUFFER_BYTES_LENGTH: 0,
				// ACCOUNT_BALANCE_UPDATE_BATCH_SIZE: 1000,
				// INDEX_BLOCKS_QUEUE_SCHEDULED_JOB_MAX_COUNT: 100000,
				// JOB_INTERVAL_DELETE_SERIALIZED_EVENTS: 0,
				// JOB_SCHEDULE_DELETE_SERIALIZED_EVENTS: '*/5 * * * *',
				// JOB_INTERVAL_REFRESH_VALIDATORS: 0,
				// JOB_SCHEDULE_REFRESH_VALIDATORS: '*/5 * * * *',
				// JOB_INTERVAL_VALIDATE_VALIDATORS_RANK: 0,
				// JOB_SCHEDULE_VALIDATE_VALIDATORS_RANK: '4-59/15 * * * *',
				// JOB_INTERVAL_REFRESH_INDEX_STATUS: 10,
				// JOB_SCHEDULE_REFRESH_INDEX_STATUS: '',
				// JOB_INTERVAL_REFRESH_BLOCKCHAIN_APPS_STATS: 0,
				// JOB_SCHEDULE_REFRESH_BLOCKCHAIN_APPS_STATS: '*/15 * * * *',
				// JOB_INTERVAL_REFRESH_ACCOUNT_KNOWLEDGE: 0,
				// JOB_SCHEDULE_REFRESH_ACCOUNT_KNOWLEDGE: '*/15 * * * *',
				// JOB_INTERVAL_DELETE_FINALIZED_CCU_METADATA: 0,
				// JOB_SCHEDULE_DELETE_FINALIZED_CCU_METADATA: '0 2 * * *',
				// JOB_INTERVAL_TRIGGER_ACCOUNT_UPDATES: 0,
				// JOB_SCHEDULE_TRIGGER_ACCOUNT_UPDATES: '*/15 * * * *',
			},
		},
		{
			name: 'lisk-service-blockchain-coordinator',
			script: 'app.js',
			cwd: './services/blockchain-coordinator',
			pid_file: './pids/service_blockchain_coordinator.pid',
			out_file: './logs/service_blockchain_coordinator.log',
			error_file: './logs/service_blockchain_coordinator.err',
			log_date_format: 'YYYY-MM-DD HH:mm:ss SSS',
			watch: false,
			kill_timeout: 10000,
			max_memory_restart: '300M',
			autorestart: true,
			env: {
				// --- Remember to set the properties below
				SERVICE_BROKER: 'redis://127.0.0.1:6379/0',
				SERVICE_MESSAGE_QUEUE_REDIS: 'redis://127.0.0.1:6379/3',
				// SERVICE_BROKER_TIMEOUT: 10,
				// SERVICE_LOG_LEVEL: 'info',
				// SERVICE_LOG_CONSOLE: false,
				// SERVICE_LOG_STDOUT: true,
				// SERVICE_LOG_GELF: false,
				// SERVICE_LOG_FILE: false,
				// DOCKER_HOST: 'local',
				// INDEX_MISSING_BLOCKS_SKIP_THRESHOLD: 1000,
				// INDEX_MISSING_BLOCKS_MAX_SCHEDULE: 25000,
				// JOB_INTERVAL_INDEX_MISSING_BLOCKS: 0,
				// JOB_SCHEDULE_INDEX_MISSING_BLOCKS: '*/5 * * * *',
			},
		},
		{
			name: 'lisk-service-fee-estimator',
			script: 'app.js',
			cwd: './services/fee-estimator',
			pid_file: './pids/service_fee_estimator.pid',
			out_file: './logs/service_fee_estimator.log',
			error_file: './logs/service_fee_estimator.err',
			log_date_format: 'YYYY-MM-DD HH:mm:ss SSS',
			watch: false,
			kill_timeout: 10000,
			max_memory_restart: '300M',
			autorestart: true,
			env: {
				// --- Remember to set the properties below
				SERVICE_BROKER: 'redis://127.0.0.1:6379/0',
				SERVICE_FEE_ESTIMATOR_CACHE: 'redis://127.0.0.1:6379/1',
				ENABLE_FEE_ESTIMATOR_QUICK: true,
				ENABLE_FEE_ESTIMATOR_FULL: false,
				// FEE_EST_COLD_START_BATCH_SIZE: 1,
				// FEE_EST_DEFAULT_START_BLOCK_HEIGHT: 1,
				// FEE_EST_EMA_BATCH_SIZE: 20,
				// FEE_EST_EMA_DECAY_RATE: 0.5,
				// FEE_EST_WAVG_DECAY_PERCENTAGE: 10,
				// SERVICE_BROKER_TIMEOUT: 10,
				// SERVICE_LOG_LEVEL: 'info',
				// SERVICE_LOG_CONSOLE: false,
				// SERVICE_LOG_STDOUT: true,
				// SERVICE_LOG_GELF: false,
				// SERVICE_LOG_FILE: false,
				// DOCKER_HOST: 'local',
			},
		},
		{
			name: 'lisk-service-transaction-statistics',
			script: 'app.js',
			cwd: './services/transaction-statistics',
			pid_file: './pids/service_transaction_statistics.pid',
			out_file: './logs/service_transaction_statistics.log',
			error_file: './logs/service_transaction_statistics.err',
			log_date_format: 'YYYY-MM-DD HH:mm:ss SSS',
			watch: false,
			kill_timeout: 10000,
			max_memory_restart: '300M',
			autorestart: true,
			env: {
				// --- Remember to set the properties below
				SERVICE_BROKER: 'redis://127.0.0.1:6379/0',
				SERVICE_STATISTICS_REDIS: 'redis://127.0.0.1:6379/1',
				SERVICE_STATISTICS_MYSQL: 'mysql://lisk:password@127.0.0.1:3306/lisk',
				TRANSACTION_STATS_HISTORY_LENGTH_DAYS: 366,
				// SERVICE_STATISTICS_MYSQL_READ_REPLICA: 'mysql://reader:password@127.0.0.1:3307/lisk',
				// SERVICE_BROKER_TIMEOUT: 10,
				// SERVICE_LOG_LEVEL: 'info',
				// SERVICE_LOG_CONSOLE: false,
				// SERVICE_LOG_STDOUT: true,
				// SERVICE_LOG_GELF: false,
				// SERVICE_LOG_FILE: false,
				// DOCKER_HOST: 'local',
				// JOB_INTERVAL_REFRESH_TRANSACTION_STATS: 0,
				// JOB_SCHEDULE_REFRESH_TRANSACTION_STATS: '*/30 * * * *',
				// JOB_INTERVAL_VERIFY_TRANSACTION_STATS: 0,
				// JOB_SCHEDULE_VERIFY_TRANSACTION_STATS: '15 */3 * * *',
			},
		},
		{
			name: 'lisk-service-market',
			script: 'app.js',
			cwd: './services/market',
			pid_file: './pids/service_market.pid',
			out_file: './logs/service_market.log',
			error_file: './logs/service_market.err',
			log_date_format: 'YYYY-MM-DD HH:mm:ss SSS',
			watch: false,
			kill_timeout: 10000,
			max_memory_restart: '300M',
			autorestart: true,
			env: {
				// --- Remember to set the properties below
				SERVICE_BROKER: 'redis://127.0.0.1:6379/0',
				SERVICE_MARKET_REDIS: 'redis://127.0.0.1:6379/2',
				SERVICE_MARKET_FIAT_CURRENCIES: 'EUR,USD,CHF,GBP,RUB,PLN,JPY,AUD,GBP,INR',
				SERVICE_MARKET_TARGET_PAIRS:
					'LSK_BTC,LSK_EUR,LSK_USD,LSK_CHF,LSK_PLN,LSK_JPY,LSK_AUD,LSK_GBP,LSK_INR,BTC_EUR,BTC_USD,BTC_CHF',
				// EXCHANGERATESAPI_IO_API_KEY: ''
				// SERVICE_BROKER_TIMEOUT: 10,
				// SERVICE_LOG_LEVEL: 'info',
				// SERVICE_LOG_CONSOLE: false,
				// SERVICE_LOG_STDOUT: true,
				// SERVICE_LOG_GELF: false,
				// SERVICE_LOG_FILE: false,
				// DOCKER_HOST: 'local',
				// JOB_INTERVAL_REFRESH_PRICES_BINANCE: 0,
				// JOB_SCHEDULE_REFRESH_PRICES_BINANCE: '* * * * *',
				// JOB_INTERVAL_REFRESH_PRICES_BITTREX: 0,
				// JOB_SCHEDULE_REFRESH_PRICES_BITTREX: '* * * * *',
				// JOB_INTERVAL_REFRESH_PRICES_EXCHANGERATESAPI: 0,
				// JOB_SCHEDULE_REFRESH_PRICES_EXCHANGERATESAPI: '* * * * *',
				// JOB_INTERVAL_REFRESH_PRICES_KRAKEN: 0,
				// JOB_SCHEDULE_REFRESH_PRICES_KRAKEN: '* * * * *',
				// JOB_INTERVAL_UPDATE_PRICES: 5,
				// JOB_SCHEDULE_UPDATE_PRICES: '',
			},
		},
		{
			name: 'lisk-service-export',
			script: 'app.js',
			cwd: './services/export',
			pid_file: './pids/service_export.pid',
			out_file: './logs/service_export.log',
			error_file: './logs/service_export.err',
			log_date_format: 'YYYY-MM-DD HH:mm:ss SSS',
			watch: false,
			kill_timeout: 10000,
			max_memory_restart: '300M',
			autorestart: true,
			env: {
				SERVICE_BROKER: 'redis://127.0.0.1:6379/0',
				SERVICE_EXPORT_REDIS: 'redis://127.0.0.1:6379/3',
				SERVICE_EXPORT_REDIS_VOLATILE: 'redis://127.0.0.1:6379/4',
				// SERVICE_EXPORT_PARTIALS: './data/partials',
				// EXPORT_S3_BUCKET_NAME_PARTIALS: 'partials',
				// SERVICE_EXPORT_STATIC: './data/static',
				// EXPORT_S3_BUCKET_NAME_EXPORTS: 'exports',
				// SERVICE_BROKER_TIMEOUT: 10,
				// SERVICE_LOG_LEVEL: 'info',
				// SERVICE_LOG_CONSOLE: false,
				// SERVICE_LOG_STDOUT: true,
				// SERVICE_LOG_GELF: false,
				// SERVICE_LOG_FILE: false,
				// DOCKER_HOST: 'local',
				// EXPORT_S3_ENDPOINT: 's3.amazonaws.com',
				// EXPORT_S3_ACCESS_KEY: '',
				// EXPORT_S3_SECRET_KEY: '',
				// EXPORT_S3_SESSION_TOKEN: '',
				// EXPORT_S3_REGION: 'eu-central-1',
				// EXPORT_S3_BUCKET_NAME: 'export',
				// JOB_INTERVAL_CACHE_PURGE: 0,
				// JOB_SCHEDULE_CACHE_PURGE: '45 4 * * *',
			},
		},
	],
};
