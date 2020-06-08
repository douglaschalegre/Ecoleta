import express from 'express';
import multer from 'multer';
import {celebrate, Joi} from 'celebrate';

import multerConfig from './config/multer';

import CollectsController from './controller/collectsController';
import ItemsController from './controller/itemsController';


const routes = express.Router();
const upload = multer(multerConfig);

const collectsController = new CollectsController();
const itemsController = new ItemsController();


routes.get('/items', itemsController.index);

routes.post('/collectPoints', upload.single('image'),
 celebrate({
   body: Joi.object().keys({
     name: Joi.string().required(),
     email: Joi.string().required(),
     whatsapp: Joi.number().required(),
     latitude: Joi.number().required(),
     longitude: Joi.number().required(),
     city: Joi.string().required(),
     uf: Joi.string().required().max(2),
     items: Joi.string().required(),
   })
 },{
   abortEarly: false
 })
 ,collectsController.create);
routes.get('/collectPoints/', collectsController.index);
routes.get('/collectPoints/:id', collectsController.show);

export default routes