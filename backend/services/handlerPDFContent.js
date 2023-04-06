const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const regexDisciplina = new RegExp(/^[a-zA-Z]{3}[0-9]{4}/mi);
const regexSituacao = new RegExp(/(aprovado.*|reprovado.*|matrícula.*|trancamento.*)$/gmi);
const regexTrancamento = new RegExp(/(trancamento.*)$/gmi);

const criaVetorDisciplinas = (disciplinas) => {
   
    const vetorDisciplinas = disciplinas.map(disciplina => ({
        codigo: disciplina.match(regexDisciplina) && disciplina.match(regexDisciplina).toString(),
        situacao: disciplina.match(regexSituacao) && disciplina.match(regexSituacao).toString(),
        trancamento: disciplina.match(regexTrancamento) && disciplina.match(regexTrancamento).toString()
    }))
   
    return vetorDisciplinas;
}

const readPdf = async (uri) => {
    
    const buffer = fs.readFileSync(path.resolve(__dirname, "../" + uri));
    
    try {
        const data = await pdfParse(buffer);
        
        const splitted = data.text.split('\n')

        // console.log(splitted[20])
        let disciplinas = [];
        for (let i = 0; i < splitted.length; i++) {
            // console.log(splitted[i], i)
            if (regexTrancamento.test(splitted[i])) {
                continue;
            }
             
            if (regexDisciplina.test(splitted[i]) && regexSituacao.test(splitted[i])) {
               
                disciplinas.push(splitted[i]);
                continue;
            }

            if (regexDisciplina.test(splitted[i])) {
                let disciplina = '';
                let j = i;
                do {
                    disciplina += splitted[j];
                    j++;
                } while (!regexSituacao.test(splitted[j - 1]));
                disciplinas.push(disciplina);
            }
        }
       
        return criaVetorDisciplinas(disciplinas);
    } catch (err) {
        throw new Error(err);
    }
}

module.exports = readPdf;