<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <v-file-input label="Carregar histórico" variant="solo" ref="historico"
                    @change="lerPlanilhaDisciplinas"></v-file-input>
            </v-col>
        </v-row>
        <v-row>
            <v-col v-for="i in periodos" :key="i" class="pa-6 borda-coluna">
                <div class="mb-8 borda-linha">{{ `${i}° período` }}</div>

                <v-row v-if="disciplinasCursadas.length" v-for="disciplina in disciplinasCursadas" :key="disciplina.Codigo">
                    <CaixaDisciplina v-if="disciplina.PeriodoRecomendado === i" @click="disciplinaSelecionada = disciplina"
                        :disciplina="disciplina" class="mb-4" :cor="corPorStatus(disciplina.Situcao)" />
                </v-row>
                <v-row v-else v-for="disciplina in disciplinasObrigatoriasCurriculoAntigo" :key="disciplina.Codigo + 'index'">
                    <CaixaDisciplina v-if="disciplina.PeriodoRecomendado === i" @click="disciplinaSelecionada = disciplina"
                        :disciplina="disciplina" class="mb-4" cor="#F5F5F5" />
                </v-row>
            </v-col>
        </v-row>
        <v-dialog v-model="disciplinaSelecionada">
            <DetalhesDisciplina :disciplina="disciplinaSelecionada" />
        </v-dialog>
    </v-container>
</template>
<script>
import curriculoAntigoObrigatorias from '../assets/Disciplinas Obrigatórias - Currículo antigo.json';
import curriculoAntigoOptativas from '../assets/Disciplinas Optativas - Curriculo Antigo.json';
import curriculoNovoObrigatorias from '../assets/Disciplinas Obrigatórias - Currículo novo.json';
import curriculoNovoOptativas from '../assets/Disciplinas Optativas - Curriculo Novo.json';
import CaixaDisciplina from '../components/CaixaDisciplina.vue';
import DetalhesDisciplina from '../components/DetalhesDisciplina.vue';

import instance from '../api/instance';

export default {
    name: "DisciplinasCurriculoAntigo",
    data() {
        return {
            disciplinasObrigatoriasCurriculoAntigo: curriculoAntigoObrigatorias.CurriculoAntigo,
            disciplinasOptativasCurriculoAntigo: curriculoAntigoOptativas.CurriculoAntigoOptativas,
            disciplinasObrigatoriasCurriculoNovo: curriculoNovoObrigatorias.CurriculoNovo,
            disciplinasOptativasCurriculoNovo: curriculoNovoOptativas.CurriculoNovoOptativas,
            disciplinasCursadas: [],
            periodos: 8,
            disciplinaSelecionada: null,
            disciplinasAluno: []
        }
    },
    methods: {
        async lerPlanilhaDisciplinas() {
            const arquivo = this.$refs.historico.files[0];
            const formData = new FormData();
            formData.append('file', arquivo);
            const jsonDisciplinasAluno = await instance.post("upload", formData, { headers: { 'Content-Type': 'multipart/form-data;boundary=boundary' } })
            this.disciplinasAluno = JSON.parse(JSON.stringify(jsonDisciplinasAluno.data.disciplinas));
            //this.checaDisciplinasOptativasCurriculoAntigodisciplinasOptativasCurriculoAntigo();
            this.pegaDisciplinasCursadas();
        },

        checaDisciplinasObrigatoriasCurriculoAntigo(disciplina) {

            const parseDisciplina = JSON.parse(JSON.stringify(disciplina));
            if (!this.disciplinasAluno.length) return this.corPorStatus("")

            const disciplinaCursada = this.disciplinasAluno.findLast(disciplinaAluno => disciplinaAluno.codigo === parseDisciplina.Codigo);

            if (disciplinaCursada !== undefined) {
                return disciplinaCursada.trancamento ? "trancada" : this.corPorStatus(disciplinaCursada.situacao)
            }
            else return this.corPorStatus("Não cursada")
        },

        pegaDisciplinasOptativasCurriculoAntigodisciplinasOptativasCurriculoAntigo() {
            const parseDisciplinasOptativasCurriculoAntigodisciplinasOptativasCurriculoAntigo = JSON.parse(JSON.stringify(this.disciplinasOptativasCurriculoAntigo));
            const optativasAluno = [];

            this.disciplinasAluno.forEach(disciplinaAluno => {
                const cursada = parseDisciplinasOptativasCurriculoAntigodisciplinasOptativasCurriculoAntigo.findLast(disciplinaOptativa => disciplinaOptativa.Codigo === disciplinaAluno.codigo ? JSON.parse(JSON.stringify(disciplinaOptativa)) : undefined)

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

        pegaDisciplinasCursadas() {
            const disciplinas = JSON.parse(JSON.stringify(this.disciplinasObrigatoriasCurriculoAntigo))
            const optativas = this.pegaDisciplinasOptativasCurriculoAntigodisciplinasOptativasCurriculoAntigo();
            const disciplinasCursadas = []
            disciplinas.forEach(disciplina => {
                const disciplinaCursada = this.disciplinasAluno.findLast(disciplinaAluno => disciplinaAluno.codigo === disciplina.Codigo);
                if (disciplinaCursada !== undefined) {
                    disciplinasCursadas.push({ ...disciplina, Situacao: disciplinaCursada.situacao })
                }
                else if (disciplina.Tipo === 'Eletiva') {
                    disciplinasCursadas.push({ ...disciplina, Situacao: "Matricula" })
                }
                else if (disciplina.Tipo === 'Obrigatoria') disciplinasCursadas.push(disciplina)
            })
           
            let totalDisciplinas = [...disciplinasCursadas, ...optativas];
            const eletivas = this.disciplinasAluno.filter(disciplina => {
                if (!totalDisciplinas.findLast(td => td.Codigo === disciplina.codigo) && disciplina.situacao === "Aprovado") return {
                    Nome: disciplina.name,
                    Codigo: disciplina.codigo,
                    Situacao: "Aprovado"
                }
            })
            
            eletivas.forEach(eletiva => {
                const iEletiva = totalDisciplinas.findIndex(disciplina => disciplina.Tipo === "Eletiva" && disciplina.Situacao === "Matricula");
                const stringifyEletiva = JSON.parse(JSON.stringify(eletiva))
                totalDisciplinas[iEletiva] = { ...totalDisciplinas[iEletiva], Codigo: stringifyEletiva.codigo, Situacao: stringifyEletiva.situacao, Nome: stringifyEletiva.Nome }
            })

            
            this.disciplinasCursadas = totalDisciplinas;
            
        },

        corPorStatus(situacao) {
            switch (situacao.toLowerCase()) {
                case "aprovado":

                    return "green";
                case "reprovado sem nota":

                    return "orange";
                case "reprovado por falta":

                    return "red";
                case "aprovado sem nota":

                    return "green";
                case "matrícula":

                    return '#F5F5F5';

                default:
                    return '#F5F5F5';
            }
        }
    },
    components: { CaixaDisciplina, DetalhesDisciplina }
}
</script>

<style lang="css" scoped>
.borda-coluna {
    border-right: 1px solid #BDBDBD;
}

.borda-linha {
    border-bottom: 1px solid #BDBDBD;
}
</style>