import Knex from 'knex';

export async function up(knex: Knex){
    return knex.schema.createTable('collect_items', table => {
        table.increments('id').primary();

        table.integer('collect_id').notNullable()
        .references('id').inTable('collects');

        table.integer('item_id').notNullable()
        .references('id').inTable('items');
    });
}

export async function down(knex: Knex){
    return knex.schema.dropTable('collect_items');
}