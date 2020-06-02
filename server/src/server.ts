import express from 'express';

const app = express();

app.get('/users', (request, response) =>{
    console.log('Listagem de usuários');

    response.json(
        [
            'Douglas',
            'Douglas2',
            'Douglas3',
            'Douglas4'
        ]
    );
});

app.listen(1337);

