<template>
    <v-container fluid class="historico">
        <v-row>
            <v-col cols="12">
                <v-file-input label="Carregar histórico" variant="solo" ref="historico"
                    @change="lerPlanilhaDisciplinas"></v-file-input>
            </v-col>
        </v-row>
        <CurriculoAtual :disciplinas-cursadas="disciplinasCursadasCurriculoAntigo" />

        <CurriculoNovo :disciplinas-cursadas="totalDisciplinasAluno" />
    </v-container>
</template>
<script>
import curriculoAntigoObrigatorias from '../assets/Disciplinas Obrigatórias - Currículo antigo.json';
import curriculoAntigoOptativas from '../assets/Disciplinas Optativas - Curriculo Antigo.json';
import curriculoNovoObrigatorias from '../assets/Disciplinas Obrigatórias - Currículo novo.json';
import curriculoNovoOptativas from '../assets/Disciplinas Optativas - Curriculo Novo.json';
import dePara from '../assets/De - Para.json';
import CaixaDisciplina from '../components/CaixaDisciplina.vue';
import DetalhesDisciplina from '../components/DetalhesDisciplina.vue';

import instance from '../api/instance';
import CurriculoNovo from '../components/CurriculoNovo.vue';
import CurriculoAtual from '../components/CurriculoAtual.vue';

export default {
    name: "disciplinasCurriculoNovo",
    data() {
        return {
            disciplinasObrigatoriasCurriculoAntigo: curriculoAntigoObrigatorias.CurriculoAntigo,
            disciplinasOptativasCurriculoAntigo: curriculoAntigoOptativas.CurriculoAntigoOptativas,
            disciplinasObrigatoriasCurriculoNovo: curriculoNovoObrigatorias.CurriculoNovo,
            disciplinasOptativasCurriculoNovo: curriculoNovoOptativas.CurriculoNovoOptativas,
            disciplinasDePara: JSON.parse(JSON.stringify(dePara['De-Para'])),

            disciplinasCursadasCurriculoAntigo: [],
            periodos: 8,
            disciplinaSelecionada: null,
            disciplinasAlunoCurriculoAntigo: [],
            disciplinasAlunoCurriculoNovo: [],
            totalDisciplinasAluno: [],
        }
    },
    methods: {
        async lerPlanilhaDisciplinas() {
            const arquivo = this.$refs.historico.files[0];
            const formData = new FormData();
            formData.append('file', arquivo);
            try {
                const jsonDisciplinasAluno = await instance.post("upload", formData, { headers: { 'Content-Type': 'multipart/form-data;boundary=boundary' } })
                this.disciplinasAlunoCurriculoAntigo = JSON.parse(JSON.stringify(jsonDisciplinasAluno.data.disciplinas));
                this.pegaDisciplinasCursadasCurriculoAntigo();
                this.converterDePara();
            } catch (error) {
                console.error(error)
                this.disciplinasAlunoCurriculoAntigo = [];
                this.disciplinasCursadasCurriculoAntigo = [],
                this.disciplinasAlunoCurriculoAntigo = []
                this.disciplinasAlunoCurriculoNovo = []
                this.totalDisciplinasAluno = [] 
            }

        },

        checaDisciplinasObrigatorias(disciplina) {

            const parseDisciplina = JSON.parse(JSON.stringify(disciplina));
            if (!this.disciplinasAlunoCurriculoNovo.length) return this.corPorStatus("")

            const disciplinaCursada = this.disciplinasAlunoCurriculoNovo.findLast(disciplinaAluno => disciplinaAluno.codigo === parseDisciplina.Codigo);

            if (disciplinaCursada !== undefined) {
                return disciplinaCursada.Trancamento ? "trancada" : this.corPorStatus(disciplinaCursada.Situacao)
            }
            else return this.corPorStatus("Não cursada")
        },

        pegaDisciplinasOptativasCurriculoAntigo() {
            const parseDisciplinasOptativasCurriculoAntigo = JSON.parse(JSON.stringify(this.disciplinasOptativasCurriculoAntigo));
            const optativasAluno = [];

            this.disciplinasAlunoCurriculoAntigo.forEach(disciplinaAluno => {
                const cursada = parseDisciplinasOptativasCurriculoAntigo.findLast(disciplinaOptativa => disciplinaOptativa.Codigo === disciplinaAluno.codigo ? JSON.parse(JSON.stringify(disciplinaOptativa)) : undefined)

                if (cursada !== undefined && JSON.parse(JSON.stringify(disciplinaAluno)).situacao.includes("Aprovado")) {
                    optativasAluno.push({
                        Codigo: cursada.Codigo,
                        Nome: cursada.Nome,
                        CargaHoraria: cursada.CargaHoraria,
                        Creditos: cursada.Creditos,
                        PeriodoRecomendado: cursada.PeriodoRecomendado,
                        Sigla: cursada.Sigla,
                        Situacao: disciplinaAluno.situacao || disciplinaAluno.trancamento,
                        Tipo: 'Optativa'
                    });
                }

            })

            const novoArrayOptativas = [];

            for (let i = 0; i < 8; i++) {
                if (optativasAluno[i]?.Codigo) {
                    novoArrayOptativas.push({
                        ...optativasAluno[i],
                        PeriodoRecomendado: i === 0 || i === 1 ? 6 : i <= 4 ? 7 : 8
                    })
                }
                else novoArrayOptativas.push({
                    Codigo: `OPT000${i}`,
                    Nome: `Disciplina Optativa V${i}`,
                    CargaHoraria: null,
                    Creditos: null,
                    PeriodoRecomendado: i === 0 || i === 1 ? 6 : i <= 4 ? 7 : 8,
                    Sigla: `OPT V${i}`,
                    Tipo: 'Optativa'
                })

            }

            return JSON.parse(JSON.stringify(novoArrayOptativas));
        },

        pegaDisciplinasCursadasCurriculoAntigo() {
            const disciplinas = JSON.parse(JSON.stringify(this.disciplinasObrigatoriasCurriculoAntigo))
            const optativas = this.pegaDisciplinasOptativasCurriculoAntigo();
            const disciplinasCursadasCurriculoAntigo = []
            disciplinas.forEach(disciplina => {
                const disciplinaCursada = this.disciplinasAlunoCurriculoAntigo.findLast(disciplinaAluno => disciplinaAluno.codigo === disciplina.Codigo);
                if (disciplinaCursada !== undefined) {
                    disciplinasCursadasCurriculoAntigo.push({ ...disciplina, Situacao: disciplinaCursada.situacao })
                }
                else if (disciplina.Tipo === 'Eletiva') {
                    disciplinasCursadasCurriculoAntigo.push({ ...disciplina, Situacao: "Matricula" })
                }
                else if (disciplina.Tipo === 'Obrigatoria') disciplinasCursadasCurriculoAntigo.push(disciplina)
            })

            let totalDisciplinas = [...disciplinasCursadasCurriculoAntigo, ...optativas];
            const eletivas = this.disciplinasAlunoCurriculoAntigo.filter(disciplina => {
                if (!totalDisciplinas.findLast(td => td.Codigo === disciplina.codigo) && disciplina.situacao === "Aprovado") return {
                    Nome: disciplina.nome,
                    Codigo: disciplina.codigo,
                    Situacao: "Aprovado"
                }
            })

            eletivas.forEach(eletiva => {
                const iEletiva = totalDisciplinas.findIndex(disciplina => disciplina.Tipo === "Eletiva" && disciplina.Situacao === "Matricula");
                const stringifyEletiva = JSON.parse(JSON.stringify(eletiva))
                totalDisciplinas[iEletiva] = { ...totalDisciplinas[iEletiva], Codigo: stringifyEletiva.codigo, Situacao: stringifyEletiva.situacao, Nome: stringifyEletiva.nome }
            })

            this.disciplinasCursadasCurriculoAntigo = totalDisciplinas;

        },

        converterDePara() {
            const disciplinasOptativasCursadas = [];
            const disciplinasEletivasCursadasAntigo = this.disciplinasCursadasCurriculoAntigo.filter(disciplina => disciplina.Tipo === "Eletiva" && disciplina.Situacao === "Aprovado");
            this.totalDisciplinasAluno = JSON.parse(JSON.stringify(this.disciplinasObrigatoriasCurriculoNovo.map(disciplinaCurriculoNovo => {
                if (disciplinaCurriculoNovo.Tipo === "Optativa") {
                    const disciplinaMapeada = this.disciplinasDePara.find(dePara => this.disciplinasCursadasCurriculoAntigo.some(disciplinaAntiga => dePara.codigoCurriculoAntigo === disciplinaAntiga.Codigo && disciplinaAntiga.Tipo === "Optativa" && !disciplinasOptativasCursadas.some(opt => opt.codigoCurriculoNovo === dePara.codigoCurriculoNovo)) && dePara);
                    if (disciplinaMapeada) {
                        disciplinasOptativasCursadas.push(disciplinaMapeada);
                        return { ...this.disciplinasCursadasCurriculoAntigo.find(disciplina => disciplina.Codigo === disciplinaMapeada.codigoCurriculoAntigo), Codigo: disciplinaMapeada.codigoCurriculoNovo, PeriodoRecomendado: disciplinaCurriculoNovo.PeriodoRecomendado }
                    }
                    else return disciplinaCurriculoNovo;
                }

                if (disciplinaCurriculoNovo.Tipo === "Optativa/Eletiva") {
                    if (disciplinasEletivasCursadasAntigo.length) {
                        return { ...disciplinasEletivasCursadasAntigo.shift(), PeriodoRecomendado: disciplinaCurriculoNovo.PeriodoRecomendado };
                    } else {
                        const disciplinaMapeada = this.disciplinasDePara.find(dePara => this.disciplinasCursadasCurriculoAntigo.some(disciplinaAntiga => dePara.codigoCurriculoAntigo === disciplinaAntiga.Codigo && disciplinaAntiga.Tipo === "Optativa" && !disciplinasOptativasCursadas.some(opt => opt.codigoCurriculoNovo === dePara.codigoCurriculoNovo)) && dePara);
                        if (disciplinaMapeada) {
                            disciplinasOptativasCursadas.push(disciplinaMapeada);
                            return { ...this.disciplinasCursadasCurriculoAntigo.find(disciplina => disciplina.codigo === disciplinaMapeada.codigoCurriculoAntigo), Codigo: disciplinaMapeada.codigoCurriculoNovo, PeriodoRecomendado: disciplinaCurriculoNovo.PeriodoRecomendado }
                        } else return disciplinaCurriculoNovo
                    }
                }

                const disciplinaNova = this.disciplinasDePara.find(dePara => dePara.codigoCurriculoNovo === disciplinaCurriculoNovo.Codigo);
                if (!disciplinaNova) return { ...disciplinaCurriculoNovo, Situacao: "Matrícula" }

                const disciplinaMapeada = this.disciplinasCursadasCurriculoAntigo.findLast(disciplinaAntiga => disciplinaAntiga.Codigo === disciplinaNova.codigoCurriculoAntigo);
                if (disciplinaMapeada) return { ...disciplinaCurriculoNovo, Situacao: disciplinaMapeada.Situacao ? disciplinaMapeada.Situacao : "Matrícula" }
                else return disciplinaCurriculoNovo
            })))

            //console.log(JSON.parse(JSON.stringify(this.totalDisciplinasAluno)))
        },

    },
    components: { CaixaDisciplina, DetalhesDisciplina, CurriculoNovo, CurriculoAtual }
}
</script>

<style lang="css" scoped>
.historico {
    min-width: 80vw;
}

.borda-coluna {
    border-right: 1px solid #BDBDBD;
}

.borda-linha {
    border-bottom: 1px solid #BDBDBD;
}
</style>