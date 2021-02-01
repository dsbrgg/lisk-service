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
const tableName = 'votes';

exports.up = knex => knex.schema
    .createTable(tableName, table => {
        table.string('sentAddress').notNullable().index();
        table.integer('receivedAddress').notNullable().index();
        table.integer('amount').notNullable().index();
        table.integer('timestamp').notNullable().index();

        table.primary(['sentAddress', 'receivedAddress', 'timestamp']);
    });

exports.down = knex => knex.schema.dropTable(tableName);

exports.config = { transaction: false };
