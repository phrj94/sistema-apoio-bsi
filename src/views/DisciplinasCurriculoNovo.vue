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

                <v-row v-if="totalDisciplinasAluno.length" v-for="disciplina in totalDisciplinasAluno"
                    :key="disciplina.Codigo">
                    <CaixaDisciplina v-if="disciplina.PeriodoRecomendado === i" @click="disciplinaSelecionada = disciplina"
                        :disciplina="disciplina" class="mb-4" :cor="corPorStatus(disciplina.Situacao)" />
                </v-row>
                <v-row v-else v-for="(disciplina, index) in disciplinasObrigatoriasCurriculoNovo"
                    :key="disciplina.Codigo + 'index'">
                    <CaixaDisciplina v-if="disciplina.PeriodoRecomendado === i" @click="disciplinaSelecionada = disciplina"
                        :disciplina="disciplina" class="mb-4" cor="#F5F5F5" />
                </v-row>
            </v-col>
        </v-row>
        <v-row>
            <v-col v-for="i in periodos" :key="i" class="pa-6 borda-coluna">
                <div class="mb-8 borda-linha">{{ `${i}° período` }}</div>

                <v-row v-if="disciplinasCursadasCurriculoAntigo.length" v-for="disciplina in disciplinasCursadasCurriculoAntigo" :key="disciplina.Codigo">
                    <CaixaDisciplina v-if="disciplina.PeriodoRecomendado === i" @click="disciplinaSelecionada = disciplina"
                        :disciplina="disciplina" class="mb-4" :cor="corPorStatus(disciplina.Situacao)" />
                </v-row>
                <v-row v-else v-for="(disciplina, index) in disciplinasObrigatoriasCurriculoAntigo" :key="disciplina.Codigo + 'index'">
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
import dePara from '../assets/De - Para.json';
import CaixaDisciplina from '../components/CaixaDisciplina.vue';
import DetalhesDisciplina from '../components/DetalhesDisciplina.vue';

import instance from '../api/instance';

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
            disciplinasCursadasCurriculoNovo: [],
            periodos: 8,
            disciplinaSelecionada: null,
            disciplinasAlunoCurriculoAntigo: [],
            disciplinasAlunoCurriculoNovo: [],
            totalDisciplinasAluno: []

        }
    },
    methods: {
        async lerPlanilhaDisciplinas() {
            const arquivo = this.$refs.historico.files[0];
            const formData = new FormData();
            formData.append('file', arquivo);
            const jsonDisciplinasAluno = await instance.post("upload", formData, { headers: { 'Content-Type': 'multipart/form-data;boundary=boundary' } })
            this.disciplinasAlunoCurriculoAntigo = JSON.parse(JSON.stringify(jsonDisciplinasAluno.data.disciplinas));
            this.pegaDisciplinasCursadasCurriculoAntigo();
            this.converterDePara();
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

        corPorStatus(situacao) {
            if (!situacao) return '#F5F5F5';
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
        },

        converterDePara() {
            const disciplinasOptativasCursadas = [];
            const disciplinasEletivasCursadasAntigo = this.disciplinasCursadasCurriculoAntigo.filter(disciplina => disciplina.Tipo === "Eletiva" && disciplina.Situacao === "Aprovado");
            this.totalDisciplinasAluno = this.disciplinasObrigatoriasCurriculoNovo.map(disciplinaCurriculoNovo => {
                if (disciplinaCurriculoNovo.Tipo === "Optativa") {
                    const disciplinaMapeada = this.disciplinasDePara.find(dePara => this.disciplinasCursadasCurriculoAntigo.some(disciplinaAntiga => dePara.codigoCurriculoAntigo === disciplinaAntiga.Codigo && disciplinaAntiga.Tipo === "Optativa" && !disciplinasOptativasCursadas.some(opt => opt.codigoCurriculoNovo === dePara.codigoCurriculoNovo)) && dePara);
                    if (disciplinaMapeada) {
                        disciplinasOptativasCursadas.push(disciplinaMapeada);
                        return { ...this.disciplinasCursadasCurriculoAntigo.find(disciplina => disciplina.Codigo === disciplinaMapeada.codigoCurriculoAntigo), Codigo: disciplinaMapeada.codigoCurriculoNovo, PeriodoRecomendado: disciplinaCurriculoNovo.PeriodoRecomendado}
                    }
                    else return disciplinaCurriculoNovo;
                }

                if (disciplinaCurriculoNovo.Tipo === "Optativa/Eletiva") {
                    if (disciplinasEletivasCursadasAntigo.length) {
                        return {...disciplinasEletivasCursadasAntigo.shift(), PeriodoRecomendado: disciplinaCurriculoNovo.PeriodoRecomendado};
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
            })
            //console.log(this.disciplinasAlunoCurriculoAntigo)
            console.log(this.totalDisciplinasAluno)
            // this.disciplinasCursadasCurriculoAntigo.forEach(disciplina => {
            //     const disciplinaCorrespondente = this.disciplinasDePara.findLast(mapper => mapper.codigoCurriculoAntigo === disciplina.Codigo)

            //     if (disciplinaCorrespondente !== undefined) {
            //         let disciplinaCurriculoNovo = this.disciplinasObrigatoriasCurriculoNovo.findLast(novasDisciplinas => novasDisciplinas.Codigo === disciplinaCorrespondente.codigoCurriculoNovo)

            //         if (disciplinaCurriculoNovo == undefined) {
            //             disciplinaCurriculoNovo = this.disciplinasOptativasCurriculoNovo.findLast(novasDisciplinas => novasDisciplinas.Codigo === disciplinaCorrespondente.codigoCurriculoNovo)
            //         }


            //         if (disciplinaCurriculoNovo !== undefined) {
            //             this.disciplinasAlunoCurriculoNovo.push({
            //                 Codigo: disciplinaCurriculoNovo.Codigo,
            //                 Nome: disciplinaCurriculoNovo.Nome,
            //                 CargaHoraria: disciplinaCurriculoNovo.CargaHoraria,
            //                 Creditos: disciplinaCurriculoNovo.Creditos,
            //                 PeriodoRecomendado: disciplinaCurriculoNovo.PeriodoRecomendado,
            //                 Sigla: disciplinaCurriculoNovo.Sigla,
            //                 Situacao: disciplina.Situacao || disciplina.Trancamento,
            //                 Tipo: disciplinaCurriculoNovo.Tipo
            //             })
            //         }
            //         //  else {
            //         //     this.disciplinasAlunoCurriculoNovo.push({
            //         //         Codigo: disciplina.Codigo,
            //         //         Nome: disciplina.Nome,
            //         //         CargaHoraria: disciplina.CargaHoraria,
            //         //         Creditos: disciplina.Creditos,
            //         //         PeriodoRecomendado: disciplina.PeriodoRecomendado,
            //         //         Sigla: disciplina.Sigla,
            //         //         Situacao: disciplina.Situacao || disciplina.Trancamento,
            //         //     })
            //         // }
            //     } else {
            //         this.disciplinasAlunoCurriculoNovo.push({
            //             Codigo: disciplina.Codigo,
            //             Nome: disciplina.Nome,
            //             CargaHoraria: disciplina.CargaHoraria,
            //             Creditos: disciplina.Creditos,
            //             PeriodoRecomendado: disciplina.PeriodoRecomendado,
            //             Sigla: disciplina.Sigla,
            //             Situacao: disciplina.Situacao || disciplina.Trancamento,
            //             Tipo: "Eletiva"
            //         })
            //     }
            // })

            // this.totalDisciplinasAluno = this.disciplinasObrigatoriasCurriculoNovo.map(disciplinaNovo => {
            //     const disciplinaCursada = this.disciplinasAlunoCurriculoNovo.find(disciplinaAluno => disciplinaAluno.Codigo === disciplinaNovo.Codigo)

            //     return { ...disciplinaNovo, Situacao: disciplinaCursada?.Situacao ? disciplinaCursada.Situacao : "Matrícula" };
            // })




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