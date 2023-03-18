const fs = require('fs');
const pdfParse = require('pdf-parse');

const readPdf = async (uri) => {
    const buffer = fs.readFileSync(uri);
    try {
        const data = await pdfParse(buffer);

        // The content
        //console.log(data.text.split('\n')[15]);
        // console.log(data.text.split('\n').length)
        const breakpoint = /^[a-zA-Z]{3}[0-9]{4}.*(?:aprovado.*|reprovado.*|matrícula.*|(?:\s+\S+){10}.*aprovado.*)$/gmi

        const splitted = data.text.split('\n')//[...data.text.match(breakpoint)]
        const regexDisciplina = new RegExp(/^[a-zA-Z]{3}[0-9]{4}/mi);
        const regexSituacao = new RegExp(/(aprovado.*|reprovado.*|matrícula.*|trancamento.*)$/gmi);
        const regexTrancamento = new RegExp(/(trancamento.*)$/gmi);
       
        let disciplinas = [];
        for (let i = 0; i < splitted.length; i++) {
            if(regexTrancamento.test(splitted[i])){
                continue;
            }
            if(regexDisciplina.test(splitted[i]) && regexSituacao.test(splitted[i])){
                disciplinas.push(splitted[i]);
                continue;
            }
            
            if(regexDisciplina.test(splitted[i])){
                let disciplina = '';
                
                do {
                    disciplina += splitted[i];
                    i++;
                } while (!regexSituacao.test(splitted[i-1]));
                disciplinas.push(disciplina);
            }
        }
        console.log(disciplinas);
    } catch (err) {
        throw new Error(err);
    }
}

// Testing
const DUMMY_PDF = './historicoEscolarCRAprovados.pdf';
readPdf(DUMMY_PDF);