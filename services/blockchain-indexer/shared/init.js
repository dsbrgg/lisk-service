/*
 * LiskHQ/lisk-service
 * Copyright © 2023 Lisk Foundation
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
const {
	Logger,
} = require('lisk-service-framework');

const config = require('../config');

const { getTokenConstants, getRewardConstants, getPosConstants } = require('./dataService');
const indexStatus = require('./indexer/indexStatus');
const messageProcessor = require('./messageProcessor');

const logger = Logger();
const snapshotUtils = require('./utils/snapshot');

const init = async () => {
	try {
		// Update the constants cache
		await getPosConstants();
		await getTokenConstants();
		await getRewardConstants();

		if (config.snapshot.enable) {
			logger.info('Initialising the automatic index snapshot application process.');

			try {
				await snapshotUtils.initSnapshot();
				logger.info('Successfully downloaded and applied the snapshot.');
			} catch (err) {
				logger.warn(`Unable to apply snapshot:\n${err.message}.`);
			}
		}

		// Init index status updates
		await indexStatus.init();

		if (config.operations.isIndexingModeEnabled) {
			await messageProcessor.init();
		}
	} catch (error) {
		logger.error(`Unable to initialize due to: ${error.message}. Try restarting the application.`);
		logger.trace(error.stack);
	}
};

module.exports = {
	init,
};
