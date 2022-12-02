/*
 * LiskHQ/lisk-service
 * Copyright © 2022 Lisk Foundation
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
	getDelegates,
	getPoSConstants,
	getPoSUnlocks,
	getPoSStakers,
	getVotesSent,
} = require('./controllers/pos');

module.exports = [
	{
		name: 'dpos.delegates',
		controller: getDelegates,
		params: {
			address: { optional: true, type: 'any' },
			name: { optional: true, type: 'any' },
			status: { optional: true, type: 'any' },
			offset: { optional: true, type: 'any' },
			limit: { optional: true, type: 'any' },
		},
	},
	{
		name: 'pos.constants',
		controller: getPoSConstants,
		params: {},
	},
	{
		name: 'pos.unlocks',
		controller: getPoSUnlocks,
		params: {
			address: { optional: true, type: 'string' },
			name: { optional: true, type: 'string' },
			publicKey: { optional: true, type: 'string' },
			isUnlockable: { optional: true, type: 'boolean' },
			limit: { optional: true, type: 'number' },
			offset: { optional: true, type: 'number' },
		},
	},
	{
		name: 'pos.stakers',
		controller: getPoSStakers,
		params: {
			address: { optional: true, type: 'string' },
			publicKey: { optional: true, type: 'string' },
			name: { optional: true, type: 'string' },
			limit: { optional: true, type: 'number' },
			offset: { optional: true, type: 'number' },
		},
	},
	{
		name: 'dpos.votes.sent',
		controller: getVotesSent,
		params: {
			address: { optional: true, type: 'string' },
			name: { optional: true, type: 'string' },
			limit: { optional: true, type: 'number' },
			offset: { optional: true, type: 'number' },
		},
	},
];
