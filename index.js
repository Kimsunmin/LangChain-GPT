import express from 'express';
import { pinecone } from './utils/pinecone-client.js';

const app = express()
const port = process.env.port || 3000

app.get('/', (req, res) => {
    res.send('run server')
})

const server = app.listen(port, () => {
    console.log(process.env)
    console.log(`server on ${port}`)
})