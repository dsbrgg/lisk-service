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
const BluebirdPromise = require('bluebird');

const coreApi = require('./coreApi');
const {
	indexAccountsbyAddress,
	indexAccountsbyPublicKey,
	getIndexedAccountInfo,
	getBase32AddressFromHex,
	getAccountsBySearch,
} = require('./accounts');
const { removeVotesByTransactionIDs } = require('./voters');
const { getRegisteredModuleAssets } = require('../common');
const { parseToJSONCompatObj } = require('../../../jsonTools');

const mysqlIndex = require('../../../indexdb/mysql');
const transactionsIndexSchema = require('./schema/transactions');

const getTransactionsIndex = () => mysqlIndex('transactions', transactionsIndexSchema);

const availableLiskModuleAssets = getRegisteredModuleAssets();

const resolveModuleAsset = (moduleAssetVal) => {
	const [module, asset] = moduleAssetVal.split(':');
	let response;
	if (!Number.isNaN(Number(module)) && !Number.isNaN(Number(asset))) {
		const [{ name }] = (availableLiskModuleAssets
			.filter(moduleAsset => moduleAsset.id === moduleAssetVal));
		response = name;
	} else {
		const [{ id }] = (availableLiskModuleAssets
			.filter(moduleAsset => moduleAsset.name === moduleAssetVal));
		response = id;
	}
	if ([undefined, null, '']
		.includes(response)) return new Error(`Incorrect moduleAsset ID/Name combination: ${moduleAssetVal}`);
	return response;
};

const indexTransactions = async blocks => {
	const transactionsDB = await getTransactionsIndex();
	const publicKeysToIndex = [];
	const recipientAddressesToIndex = [];
	const txnMultiArray = blocks.map(block => {
		const transactions = block.payload.map(tx => {
			const [{ id }] = availableLiskModuleAssets
				.filter(module => module.id === String(tx.moduleID).concat(':').concat(tx.assetID));
			tx.height = block.height;
			tx.blockId = block.id;
			tx.moduleAssetId = id;
			tx.timestamp = block.timestamp;
			tx.amount = tx.asset.amount || null;
			tx.data = tx.asset.data || null;
			if (tx.asset.recipientAddress) {
				tx.recipientId = getBase32AddressFromHex(tx.asset.recipientAddress);
				recipientAddressesToIndex.push(tx.asset.recipientAddress);
			}
			publicKeysToIndex.push(tx.senderPublicKey);
			return tx;
		});
		return transactions;
	});
	let allTransactions = [];
	txnMultiArray.forEach(transactions => allTransactions = allTransactions.concat(transactions));
	if (allTransactions.length) await transactionsDB.upsert(allTransactions);
	if (recipientAddressesToIndex.length) await indexAccountsbyAddress(recipientAddressesToIndex);
	if (publicKeysToIndex.length) await indexAccountsbyPublicKey(publicKeysToIndex);
};

const removeTransactionsByBlockIDs = async blockIDs => {
	const transactionsDB = await getTransactionsIndex();
	const forkedTransactions = await transactionsDB.find({
		whereIn: {
			property: 'blockId',
			values: blockIDs,
		},
	});
	const forkedTransactionIDs = forkedTransactions.map(t => t.id);
	await transactionsDB.deleteIds(forkedTransactionIDs);
	await removeVotesByTransactionIDs(forkedTransactionIDs);
};

const normalizeTransaction = tx => {
	const [{ id, name }] = availableLiskModuleAssets
		.filter(module => module.id === String(tx.moduleID).concat(':').concat(tx.assetID));
	tx = parseToJSONCompatObj(tx);
	tx.moduleAssetId = id;
	tx.moduleAssetName = name;
	if (tx.asset.recipientAddress) {
		tx.asset.recipientAddress = getBase32AddressFromHex(tx.asset.recipientAddress);
	}
	return tx;
};

const validateParams = async params => {
	if (params.timestamp && params.timestamp.includes(':')) {
		const { timestamp, ...remParams } = params;
		params = remParams;

		[params.fromTimestamp, params.toTimestamp] = timestamp.split(':');
	}

	if (params.amount && params.amount.includes(':')) {
		const { amount, ...remParams } = params;
		params = remParams;
		if (!params.propBetweens) params.propBetweens = [];
		params.propBetweens.push({
			property: 'amount',
			from: amount.split(':')[0],
			to: amount.split(':')[1],
		});
	}

	if (params.fromTimestamp || params.toTimestamp) {
		const { fromTimestamp, toTimestamp, ...remParams } = params;
		params = remParams;

		if (!params.propBetweens) params.propBetweens = [];
		params.propBetweens.push({
			property: 'timestamp',
			from: Number(fromTimestamp) || 0,
			to: Number(toTimestamp) || Math.floor(Date.now() / 1000),
		});
	}

	if (params.nonce && !params.senderAddress) {
		throw new Error('Nonce based retrieval is only possible along with senderId');
	}

	if (params.senderAddress) {
		const { senderAddress, ...remParams } = params;
		params = remParams;

		const account = await getIndexedAccountInfo({ address: senderAddress });
		params.senderPublicKey = account.publicKey;
	}

	if (params.senderUsername) {
		const { senderUsername, ...remParams } = params;
		params = remParams;

		const account = await getIndexedAccountInfo({ username: senderUsername });
		params.senderPublicKey = account.publicKey;
	}

	if (params.recipientPublicKey) {
		const { recipientPublicKey, ...remParams } = params;
		params = remParams;

		const account = await getIndexedAccountInfo({ publicKey: recipientPublicKey });
		params.recipientId = account.address;
	}

	if (params.recipientUsername) {
		const { recipientUsername, ...remParams } = params;
		params = remParams;

		const account = await getIndexedAccountInfo({ username: recipientUsername });
		params.recipientId = account.address;
	}

	if (params.search) {
		const { search, ...remParams } = params;
		params = remParams;

		const accounts = await getAccountsBySearch('username', search);
		const publicKeys = accounts.map(account => account.publicKey);
		const addresses = await BluebirdPromise.map(
			accounts,
			async account => {
				const accountInfo = await getIndexedAccountInfo({ address: account.address });
				publicKeys.push(accountInfo.publicKey);
				return account.address;
			},
			{ concurrency: accounts.length },
		);
		params.whereIn = { property: 'senderPublicKey', values: publicKeys };
		params.orWhereIn = { property: 'recipientId', values: addresses };
	}

	if (params.data) {
		const { data, ...remParams } = params;
		params = remParams;

		params.search = {
			property: 'data',
			pattern: data,
		};
	}

	if (params.moduleAssetName) {
		const { moduleAssetName, ...remParams } = params;
		params = remParams;

		params.moduleAssetId = resolveModuleAsset(moduleAssetName);
	}

	return params;
};

const getTransactions = async params => {
	const transactionsDB = await getTransactionsIndex();
	const transactions = {
		data: [],
		meta: {},
	};

	params = await validateParams(params);

	const resultSet = await transactionsDB.find(params);
	const total = await transactionsDB.count(params);
	if (resultSet.length) params.ids = resultSet.map(row => row.id);
	if (params.ids || params.id) {
		const response = await coreApi.getTransactions(params);
		if (response.data) transactions.data = response.data.map(tx => normalizeTransaction(tx));
		if (response.meta) transactions.meta = response.meta;

		transactions.data = await BluebirdPromise.map(
			transactions.data,
			async transaction => {
				const [indexedTxInfo] = resultSet.filter(tx => tx.id === transaction.id);
				transaction.unixTimestamp = indexedTxInfo.timestamp;
				transaction.height = indexedTxInfo.height;
				transaction.blockId = indexedTxInfo.blockId;
				const account = await getIndexedAccountInfo({ publicKey: transaction.senderPublicKey });
				transaction.senderId = account && account.address ? account.address : undefined;
				transaction.username = account && account.username ? account.username : undefined;
				transaction.isPending = false;

				// The two lines below are needed for transaction statistics
				if (transaction.moduleAssetId) transaction.type = transaction.moduleAssetId;
				if (transaction.asset.amount) transaction.amount = transaction.asset.amount;

				return transaction;
			},
			{ concurrency: transactions.data.length },
		);
	}
	transactions.meta.total = total;
	transactions.meta.count = transactions.data.length;
	transactions.meta.offset = params.offset;
	return transactions;
};

const getTransactionsByBlockId = async blockId => {
	const [block] = (await coreApi.getBlockByID(blockId)).data;
	const transactions = await BluebirdPromise.map(
		block.payload,
		async transaction => {
			transaction.unixTimestamp = block.header.timestamp;
			transaction.height = block.header.height;
			transaction.blockId = block.header.id;
			const account = await getIndexedAccountInfo({ publicKey: transaction.senderPublicKey });
			transaction.senderId = account && account.address ? account.address : undefined;
			transaction.username = account && account.username ? account.username : undefined;
			transaction.isPending = false;
			return transaction;
		},
		{ concurrency: block.payload.length },
	);
	return {
		data: transactions.map(tx => normalizeTransaction(tx)),
		meta: {
			offset: 0,
			count: transactions.length,
			total: transactions.length,
		},
	};
};

module.exports = {
	getTransactions,
	indexTransactions,
	removeTransactionsByBlockIDs,
	getTransactionsByBlockId,
};
