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
const { Logger, Signals } = require('lisk-service-framework');

const dataService = require('./shared/dataService');

const logger = Logger();

const serviceTasks = {
    isBlockchainIndexReady: false,
    isValidatorsReady: false,
};

const isIndexerServiceReady = () => !Object.keys(serviceTasks).some(value => !serviceTasks[value]);

// Check if all blocks are indexed
const blockIndexReadyListener = () => {
    logger.debug('The blockchain index is complete');
    serviceTasks.isBlockchainIndexReady = true;
};

Signals.get('blockIndexReady').add(blockIndexReadyListener);

const newBlockListener = async () => {
    if (!isIndexerServiceReady()) {
        // Check if validators list is ready
        const validators = await dataService.getPosValidators({ limit: 10, offset: 0, sort: 'commission:asc' });
        if (validators.data.length) serviceTasks.isValidatorsReady = true;
    }

    logger.debug(`============== 'indexerServiceReady' signal: ${Signals.get('indexerServiceReady')} ==============`);
    if (isIndexerServiceReady()) Signals.get('indexerServiceReady').dispatch(true);
};

Signals.get('chainNewBlock').add(newBlockListener);

const getCurrentStatus = async () => serviceTasks;

module.exports = {
    getCurrentStatus,
};
