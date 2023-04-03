import express from 'express';
import { pinecone } from './utils/pinecone-client.js';
import { CustomPDFLoader } from './utils/customPDFLoader.js';
import { DirectoryLoader } from 'langchain/document_loaders';

const app = express()
const port = process.env.port || 3000

app.get('/', (req, res) => {
    res.send('run server')
})

const server = app.listen(port, async () => {
    const filePath = 'docs'

    const directoryLoader = new DirectoryLoader(filePath, {
        '.pdf': (path) => new CustomPDFLoader(path),
      });
  
    // const loader = new PDFLoader(filePath);
    const rawDocs = await directoryLoader.load();

    console.log(rawDocs)
      
    console.log(`server on ${port}`)
})