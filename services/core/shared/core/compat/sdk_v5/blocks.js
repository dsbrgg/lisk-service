/*
 * LiskHQ/lisk-service
 * Copyright © 2021 Lisk Foundation
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
const { computeMinFee } = require('@liskhq/lisk-transactions-v5');

const coreApi = require('./coreApi');
const { knex } = require('../../../database');

let finalizedHeight;

const setFinalizedHeight = (height) => finalizedHeight = height;

const updateFinalizedHeight = async () => {
	const result = await coreApi.getNetworkStatus();
	setFinalizedHeight(result.data.finalizedHeight);
	return result;
};

const getFinalizedHeight = () => finalizedHeight;

const writeBlocksToDB = async originalBlocks => {
	const blocksDB = await knex('blocks');
	const blocks = originalBlocks.map(block => {
		const skimmedBlock = {};
		skimmedBlock['blockId'] = block['id'];
		skimmedBlock['height'] = block['height'];
		skimmedBlock['unixTimestamp'] = block['unixTimestamp'];
		skimmedBlock['generatorPublicKey'] = block['generatorPublicKey'];
		skimmedBlock['generatorAddress'] = block['generatorAddress'] || null;
		skimmedBlock['generatorUsername'] = block['generatorUsername'] || null;
		return skimmedBlock;
	});
	const result = await blocksDB.writeBatch(blocks);
	return result;
};

const normalizeBlock = block => {
	block.id = block.id.toString('hex');
	block.signature = block.signature.toString('hex');
	block.previousBlockID = block.previousBlockID.toString('hex');
	block.transactionRoot = block.transactionRoot.toString('hex');
	block.generatorPublicKey = block.generatorPublicKey.toString('hex');
	block.reward = Number(block.reward);
	block.asset.seedReveal = block.asset.seedReveal.toString('hex');

	return block;
};

const getBlocks = async params => {
	const blocks = {
		data: [],
		meta: {},
	};

	const response = await coreApi.getBlocks(params);
	if (response.data) blocks.data = response.data.map(block => Object
		.assign(normalizeBlock(block.header), { payload: block.payload }));
	if (response.meta) blocks.meta = response.meta; // TODO: Build meta manually

	blocks.data.map(block => {
		block.unixTimestamp = block.timestamp;
		block.totalForged = Number(block.reward);
		block.totalBurnt = 0;
		block.totalFee = 0;

		block.payload.forEach(txn => {
			const txnMinFee = Number(computeMinFee(txn));

			block.totalForged += Number(txn.fee);
			block.totalBurnt += txnMinFee;
			block.totalFee += Number(txn.fee) - txnMinFee;
		});
		delete block.payload;
		return block;
	});

	if (params.limit === 1) await writeBlocksToDB(blocks.data);

	return blocks;
};

module.exports = {
	getBlocks,
	updateFinalizedHeight,
	getFinalizedHeight,
};
