# LangChain-GPT
create a chatGPT chatbot for custom files(PDF)

## Development

1. Clone the repo

```
git clone [github https url]
```

2. Install packages

```
npm install
```

3. `.env` 생성

- `.env.example`파일을 복사하여 '.env'로 변경후 내용 작성

4. `config/pinecone.js`에서 `PINECONE_NAME_SPACE`을 작성하여 저장될 이름 작성(선택)

5. `utils/makechain.js`에서 `modelName`에 사용할 GPT모델 작성

## PDF files to embeddings

1. `docs`디렉토리에 원하는 PDF파일 추가

2. `npm run ingest`

## Run the app

`npm run dev`

## Troubleshooting

**Pinecone errors**
- Check that you've set the vector dimensions to `1536`.
- Make sure your pinecone namespace is in lowercase.
- Pinecone indexes of users on the Starter(free) plan are deleted after 7 days of inactivity. To prevent this, send an API request to Pinecone to reset the counter before 7 days.
- Retry from scratch with a new Pinecone project, index, and cloned repo.
