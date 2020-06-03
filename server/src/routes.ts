import express from 'express';

const routes = express.Router();

routes.get('/', (request: any, response: any) => {
    return response.json({ message: 'Hello World!'});
});

export default routes