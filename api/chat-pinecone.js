import { OpenAIEmbeddings } from 'langchain/embeddings';
import { PineconeStore } from 'langchain/vectorstores';
import { makeChain } from '../utils/makechain.js';
import { pinecone } from '../utils/pinecone-client.js';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '../config/pinecone.js';

export const chatPinecone = async (res, req) => {
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
    /**
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
    });
    */

    const sendData = (data) => {
        res.send(`data : ${data}\n\n`);  
    };

    //sendData(JSON.stringify({ data: ''}));

    // 체인 생성 callBack True
    // const chain = makeChain(vectorStore, (token) => {
    //     sendData(JSON.stringify({data: token}));
    // });

    // 체인 생성 callBack False
    const chain = makeChain(vectorStore, false);

    try {

        const response = await chain.call({
            question: sanitizedQuestion,
            chat_history: history || [],
        });
        
        console.log('response', response);
        sendData(JSON.stringify({ sourceDocs: response.text }));
    } catch (error) {
        console.log('error', error);
    } finally {
        //sendData('[DONE]');
        //res.end();
    }
}