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
const { requestConnector } = require('./utils/request');

let genesisConfig;
let genesisHeight;
let moduleCommands;
let registeredModules;
let systemMetadata;

const getFinalizedHeight = async () => {
	const { finalizedHeight } = await requestConnector('getNodeInfo');
	return finalizedHeight;
};

const getGenesisHeight = async () => {
	if (!genesisHeight) {
		genesisHeight = await requestConnector('getGenesisHeight');
	}
	return genesisHeight;
};

const getCurrentHeight = async () => {
	const currentHeight = (await requestConnector('getNodeInfo')).height;
	return currentHeight;
};

const getGenesisConfig = async () => {
	if (!genesisConfig) genesisConfig = await requestConnector('getGenesisConfig');
	return genesisConfig;
};

const resolveModuleCommands = (data) => {
	let result = [];
	data.forEach(liskModule => {
		if (liskModule.commands.length) {
			result = result.concat(
				liskModule.commands.map(command => {
					const name = liskModule.name.concat(':').concat(command.name);
					return { name };
				}),
			);
		}
	});
	return result;
};

const getAvailableModuleCommands = async () => {
	if (!moduleCommands) {
		const response = await requestConnector('getSystemMetadata');
		moduleCommands = resolveModuleCommands(response.modules);
	}
	return moduleCommands;
};

const getRegisteredModules = async () => {
	if (!registeredModules) {
		const response = await requestConnector('getSystemMetadata');
		registeredModules = response.modules.map(module => module.name);
	}
	return registeredModules;
};

const getSystemMetadata = async () => {
	if (!systemMetadata) {
		systemMetadata = await requestConnector('getSystemMetadata');
	}
	return systemMetadata;
};

const MODULE_NAME = {
	DPOS: process.env.MODULE_NAME_DPOS || 'dpos',
};

const COMMAND_NAME = {
	REGISTER_DELEGATE: process.env.COMMAND_NAME_DPOS_REGISTER_DELEGATE || 'registerDelegate',
	VOTE_DELEGATE: process.env.COMMAND_NAME_DPOS_VOTE_DELEGATE || 'voteDelegate',
};

module.exports = {
	getFinalizedHeight,
	getCurrentHeight,
	getGenesisConfig,
	getGenesisHeight,
	getAvailableModuleCommands,
	resolveModuleCommands,
	getRegisteredModules,
	getSystemMetadata,

	MODULE_NAME,
	COMMAND_NAME,
};
