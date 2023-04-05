import express from 'express';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { PineconeStore } from 'langchain/vectorstores';
import { makeChain } from './utils/makechain.js';
import { pinecone } from './utils/pinecone-client.js';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from './config/pinecone.js';

const app = express()
const port = process.env.port || 3000

app.get('/', (req, res) => {
    res.send('run server')
})

app.get('/chat', async (req, res) => {

    const q = req.query['q'];
    const history = req.query['history'];
    if (!q) {
        return res.status(400).json({ message: 'No question in the request' });
    }

    // 질의 공백 및 개행문자 제거
    const sanitizedQuestion = q.trim().replaceAll('\n',' ');

    // 인덱스 불러오기
    const index = pinecone.Index(PINECONE_INDEX_NAME);

    // 벡터 저장소 생성
    const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings({}),
        {
            pineconeIndex: index,
            textKey: 'text',
            namespace: PINECONE_NAME_SPACE,
        },
    );

    // 응답 헤더 설정
    // res.writeHead(200, {
    //     'Content-Type': 'text/event-stream',
    //     'Cache-Control': 'no-cache, no-transform',
    //     Connection: 'keep-alive',
    // });

    
    // 스트리밍 여부
    const sendData = (data) => {
        //res.write(`data : ${data}\n\n`);  
        console.log(data);
    };

    sendData(JSON.stringify({ data: 'hi'}));

    // 체인 생성 callBack True
    const chain = makeChain(vectorStore, (token) => {
        sendData(JSON.stringify({data: token}));
    });

    // 체인 생성 callBack False
    // const chain = makeChain(vectorStore, false);

    try {
        sendData('[try]');
        const response = await chain.call({
            question: sanitizedQuestion,
            chat_history: history || [],
        });
        
        console.log('response', response);
        sendData(JSON.stringify({ sourceDocs: response.text }));
    } catch (error) {
        console.log('error', error);
    } finally {
        sendData('[DONE]');
        //res.end();
    }

});

const server = app.listen(port, async () => {    
    console.log(`server on ${port}`)
})