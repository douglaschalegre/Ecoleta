import express from 'express';

import CollectsController from './controller/collectsController.ts';
import ItemsController from './controller/itemsController.ts';
const collectsController = new CollectsController();
const itemsController = new ItemsController();

const routes = express.Router();

routes.get('/items', itemsController.index);

routes.post('/collectPoints', collectsController.create);
routes.get('/collectPoints/', collectsController.index);
routes.get('/collectPoints/:id', collectsController.show);

export default routes