import express from 'express'
const app = express()
const port = process.env.port || 3000

app.get('/', (req, res) => {
    res.send('Hello world!')
})

const server = app.listen(port, () => {
    console.log(`server on ${port}`)
})