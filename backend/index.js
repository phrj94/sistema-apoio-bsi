const fs = require('fs');
const pdfParse = require('pdf-parse');

const readPdf = async (uri) => {
    const buffer = fs.readFileSync(uri);
    try {
        const data = await pdfParse(buffer);

        // The content
        //console.log(data.text.split('\n')[15]);
        // console.log(data.text.split('\n').length)
        const breakpoint = /^[a-zA-Z]{3}[0-9]{4}.*(?:aprovado.*|reprovado.*|trancamento.*|matrícula.*|(?:\s+\S+){10}.*aprovado.*)$/gmi

        const splitted = [...data.text.match(breakpoint)]
        const arraySplitted = splitted.toString().split('\n');
        const disciplinas = [];
        arraySplitted.forEach((line,i) => {
            const regexDisciplina = new RegExp(/^[a-zA-Z]{3}[0-9]{4}/gmi);
            const regexSituacao = new RegExp(/(aprovado.*|reprovado.*|trancamento.*|matrícula.*)$/gmi)
            let disciplina = '';
            if(regexDisciplina.test(line) && regexSituacao.test(line)) {
                disciplina = line;
                disciplinas.push(disciplina);
                disciplina = '';
            }
            else {
                while(!regexSituacao.test(arraySplitted[i])){
                    disciplina += line;
                    i++;
                }
                disciplinas.push(disciplina);
                disciplina = '';
            }
        });

        console.log(disciplinas)
    } catch (err) {
        throw new Error(err);
    }
}

// Testing
const DUMMY_PDF = './historicoEscolarCRAprovados.pdf';
readPdf(DUMMY_PDF);