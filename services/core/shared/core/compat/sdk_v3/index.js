/*
 * LiskHQ/lisk-service
 * Copyright © 2020 Lisk Foundation
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
	getBlocks,
	updateFinalizedHeight,
	getFinalizedHeight,
} = require('./blocks');

const {
	getDelegates,
	getNextForgers,
	setCacheDelegateRedis,
} = require('./delegates');
const { getVotes } = require('./votes');
const { getVoters } = require('./voters');
const events = require('./events');

module.exports = {
	...require('../sdk_v2'),
	getBlocks,
	updateFinalizedHeight,
	getFinalizedHeight,
	getDelegates,
	getNextForgers,
	getVotes,
	getVoters,
	events,
	setCacheDelegateRedis,
};
