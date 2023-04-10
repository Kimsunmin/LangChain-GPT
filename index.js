import express from 'express';

const app = express()
const port = process.env.port || 3000

app.get('/', (req, res) => {
    res.send('run server')
})

app.get('/api/chat', (req, res) => {
    chatPinecone(res, req);
});

const server = app.listen(port, async () => {    
    console.log(`server on ${port}`)
})