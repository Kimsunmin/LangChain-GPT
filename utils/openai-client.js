import { OpenAI } from 'langchain';

if (!process.env.OPENAI_API_KEY){
    throw new Error('Missing OpenAI ApiKey');
}

export const openai = new OpenAI({
    temperature: 0,
});