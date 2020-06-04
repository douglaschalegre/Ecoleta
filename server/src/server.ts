import express from '../node_modules/express/index.js';
import routes from './routes.ts'
import path from 'path';

const app = express();

app.use(express.json());
app.use(routes);

app.use('/uploads', express.static(
    path.resolve(__dirname, '..', 'uploads')
    ));

    
app.listen(1337);

