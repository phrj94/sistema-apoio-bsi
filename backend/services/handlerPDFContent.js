const fs = require( 'fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const readPdf = async (uri) => {
    const buffer = fs.readFileSync(path.resolve(__dirname, "../"+uri));
    try {
        const data = await pdfParse(buffer);

        const splitted = data.text.split('\n')
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
       return disciplinas;
    } catch (err) {
        throw new Error(err);
    }
}

module.exports = readPdf;