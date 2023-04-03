import { Document } from 'langchain/document';
import { readFile } from 'fs/promises';
import { BaseDocumentLoader } from 'langchain/document_loaders';

export class CustomPDFLoader{

    constructor(filePathOrBlob){
        this.filePathOrBlob = filePathOrBlob;
    }

    async parse(raw, metadata){
        const { pdf } = await PDFLoaderImports();
        const parsed = await pdf(raw);
        return [
            new Document({
                pageContent: parsed.text,
                metadata: {
                    ...metadata,
                    pdf_numpages: parsed.numpages,
                },
            }),
        ];
    }

    async load(){
        let buffer;
        let metadata;
        if (typeof this.filePathOrBlob === 'string'){
            buffer = await readFile(this.filePathOrBlob);
            metadata = { source: this.filePathOrBlob };
        }
        
        return this.parse(buffer, metadata);
    }
}

async function PDFLoaderImports(){
    try{
        const { default: pdf } = await import('pdf-parse/lib/pdf-parse.js');
        return { pdf };
    } catch (e) {
        console.error(e);
        throw new Error(
            'Failed to load pdf-parse. Please install it with eg. `npm install pdf-parse`.'
        );
    }
}