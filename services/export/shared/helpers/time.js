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
const moment = require('moment');

const config = require('../../config');

const momentFromTimestamp = timestamp => moment.unix(timestamp);

const dateFromTimestamp = timestamp => {
	const dateTime = momentFromTimestamp(timestamp);
	return dateTime.utcOffset(0).format(config.csv.dateFormat);
};

const timeFromTimestamp = timestamp => {
	const dateTime = momentFromTimestamp(timestamp);
	return dateTime.utcOffset(0).format(config.csv.timeFormat);
};

module.exports = {
	dateFromTimestamp,
	timeFromTimestamp,
};
