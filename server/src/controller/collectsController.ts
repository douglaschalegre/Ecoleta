import {Request, Response} from 'express';
import knex from '../database/connection.ts';

class collectsController {
    async index (request: Request, response: Response) {
        const { uf, city, items } = request.query;
        const parsedItems = String(items).split(',').map(item => Number(item.trim()));

        const collects = await knex('collects')
        .join('collect_items', 'collects.id', '=', 'collect_items.collect_id')
        .whereIn('collect_items.item_id', parsedItems)
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct()
        .select('collects.*');

        return response.json(collects);
    }

    async show (request: Request, response: Response) {
        const { id } = request.params;

        const collectPoint = await knex('collects').where('id', id).first();
        if(!collectPoint){
            return response.status(400).json({ message: `No collection point with ${Number(id)}`});
        }

        const items = await knex('items')
        .join('collect_items', 'items.id' ,'=', 'collect_items.item_id')
        .where('collect_items.collect_id', id)
        .select('title');

        return response.json({collectPoint, items});
    }

    async create (request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;
    
        //creates a transaction meaning knex only execute when both following inserts are sucessfull
        //not working
        const trx = await knex.transaction();
       
        const collects = {
            image: 'temp-img',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };
        const insertedIds = await trx('collects').insert(collects);
    
        const collect_id = insertedIds[0]
        const collectItems = items.map((item_id: number) => {
            return {
                item_id,
                collect_id
            };
        });
        await trx('collect_items').insert(collectItems);

        await trx.commit();
    
        return response.json({
            id: collect_id,
            ...collects,
        })
    }
}

export default collectsController;