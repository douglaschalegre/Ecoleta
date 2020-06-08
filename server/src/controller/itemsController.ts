import {Request, Response} from 'express';
import knex from '../database/connection';

class itemsController {
    async index(request: Request, response: Response){
        const items = await knex('items').select('*');
        const serializedItems = items.map(item => {
            return{
               id: item.id,
               title: item.title,
               image: item.image,
                url: `http://192.168.0.35:1337/uploads/${item.image}`
            }
        });
    
        return response.json(serializedItems);
    }
}

export default itemsController;