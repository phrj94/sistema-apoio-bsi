<template>
    <v-row>
        <v-col cols="12" class="d-flex align-center">
            <v-card-title>Currículo atual</v-card-title>
            <v-spacer></v-spacer>
            <v-icon :icon="manipulaOlho" @click="ver = !ver"/>
        </v-col>
        <v-col v-show="ver" v-for="i in periodos" :key="i" class="pa-6" :class="{ 'borda-coluna': i < 8 }">
            <div class="mb-8 borda-linha">{{ `${i}° período` }}</div>

            <v-row v-if="disciplinasCursadas.length" v-for="disciplina in disciplinasCursadas" :key="disciplina.Codigo">
                <CaixaDisciplina v-if="disciplina.PeriodoRecomendado === i" @click="disciplinaSelecionada = disciplina"
                    :disciplina="disciplina" class="mb-4" :cor="corPorStatus(disciplina.Situacao)" />
            </v-row>
            <v-row v-else v-for="disciplina in disciplinasObrigatorias" :key="disciplina.Codigo + 'index'">
                <CaixaDisciplina v-if="disciplina.PeriodoRecomendado === i" @click="disciplinaSelecionada = disciplina"
                    :disciplina="disciplina" class="mb-4" cor="#F5F5F5" />
            </v-row>

        </v-col>
        <v-dialog v-if="disciplinaSelecionada !== null" v-model="disciplinaSelecionada">
            <DetalhesDisciplina :disciplina="disciplinaSelecionada" />
        </v-dialog>
    </v-row>
</template>
<script>
import curriculoAntigoObrigatorias from '../assets/Disciplinas Obrigatórias - Currículo antigo.json';
import CaixaDisciplina from './CaixaDisciplina.vue';
import DetalhesDisciplina from './DetalhesDisciplina.vue';
export default {
    name: "curriculo-atual",
    props: {
        disciplinasCursadas: {
            required: true,
            type: Array,
            default: () => []
        }
    },
    data: () => ({ 
        disciplinasObrigatorias: curriculoAntigoObrigatorias.CurriculoAntigo,
        disciplinaSelecionada: null,
        periodos: 8,
        ver: true
    }),
    computed: {
        manipulaOlho(){
            return this.ver ? "$eye" : "$offEye"
        }
    },
    methods: {
        corPorStatus(situacao) {
            if (!situacao) return '#F5F5F5';
            switch (situacao.toLowerCase()) {
                case "aprovado": return "green";
                case "reprovado sem nota": return "orange";
                case "reprovado por falta": return "red";
                case "aprovado sem nota": return "green";
                case "matrícula": return '#F5F5F5';
                default: return '#F5F5F5';
            }
        },
    },
    components: { DetalhesDisciplina, CaixaDisciplina }
}
</script>