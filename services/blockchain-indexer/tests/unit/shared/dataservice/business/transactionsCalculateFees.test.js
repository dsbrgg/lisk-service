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
const { calcDynamicFeeEstimates } = require('../../../../../shared/dataService/business/transactionsCalculateFees');

describe('Test calcDynamicFeeEstimates method', () => {
	const feeEstimatePerByte = { low: 0, med: 10, high: 50 };
	const minFee = 150000;
	const size = 150;

	it('should return dynamic fee estimates', async () => {
		const expectResponse = {
			low: BigInt('150000'),
			medium: BigInt('151500'),
			high: BigInt('157500'),
		};

		const dynamicFeeEstimates = await calcDynamicFeeEstimates(feeEstimatePerByte, minFee, size);
		expect(Object.getOwnPropertyNames(dynamicFeeEstimates).length).toBeGreaterThan(0);
		expect(dynamicFeeEstimates).toMatchObject(expectResponse);
	});

	it('should throw error -> undefined feeEstimatePerByte', async () => {
		expect(() => {
			calcDynamicFeeEstimates(undefined, minFee, size);
		}).toThrow(TypeError);
	});

	it('should throw error -> undefined minFee', async () => {
		expect(() => {
			calcDynamicFeeEstimates(feeEstimatePerByte, undefined, size);
		}).toThrow(TypeError);
	});

	it('should throw error -> undefined size', async () => {
		expect(() => {
			calcDynamicFeeEstimates(feeEstimatePerByte, minFee, undefined);
		}).toThrow(TypeError);
	});

	it('should throw error -> null feeEstimatePerByte', async () => {
		expect(() => {
			calcDynamicFeeEstimates(null, minFee, size);
		}).toThrow(TypeError);
	});

	it('should throw error -> null minFee', async () => {
		expect(() => {
			calcDynamicFeeEstimates(feeEstimatePerByte, null, size);
		}).toThrow(TypeError);
	});

	it('should throw error -> null size', async () => {
		expect(() => {
			calcDynamicFeeEstimates(feeEstimatePerByte, minFee, null);
		}).toThrow(TypeError);
	});
});
