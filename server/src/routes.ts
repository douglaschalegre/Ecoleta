import express from '../node_modules/express/index.js';
import knex from './database/connection.ts';

const routes = express.Router();

routes.get('/items', async (request: any, response: any) => {
    const items = await knex('items').select('*');
    const serializedItems = items.map(item => {

        return{
           id: item.id,
           title: item.title,
           image: item.image,
            url: `http://localhost:1337/uploads/${item.image}`

        }
    });

    return response.json(serializedItems);
});

routes.post('/collectPoints', async (request: any, response: any) => {
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
    const trx = await knex.transaction();
   
    const insertedIds = await trx('collects').insert({
        image: 'temp-img',
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf
    });

    const collect_id = insertedIds[0]
    const collectItems = items.map((item_id: number) =>{
        return {
            item_id,
            collect_id
        };
    });
    await trx('collect_items').insert(collectItems)

    return response.json({sucess: true})
});

export default routes