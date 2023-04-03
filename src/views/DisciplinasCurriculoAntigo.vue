<template>
    <v-container fluid>
        <!-- <ul>
        <li v-for="disciplina in disciplinas" :key="disciplina.Codigo">
            {{ disciplina.Nome + " - " + disciplina.Codigo }} | Pré-Requisito {{ disciplina.PreRequisitos && disciplina.PreRequisitos }}
        </li>
       </ul> -->
        <v-row>
            <v-col v-for="i in periodos" :key="i" class="pa-6 borda-coluna">
                <div class="mb-8 borda-linha">{{ "Período " + i }}</div>
                <v-row v-for="disciplina in disciplinas" :key="disciplina.Codigo">
                    <CaixaDisciplina v-if="disciplina.PeriodoRecomendado === i" @click="disciplinaSelecionada = disciplina"
                        :disciplina="disciplina" class="mb-4" />
                </v-row>
            </v-col>
        </v-row>
        <v-dialog v-model="disciplinaSelecionada">
            <DetalhesDisciplina :disciplina="disciplinaSelecionada" />
        </v-dialog>
    </v-container>
</template>
<script>
import curriculoAntigo from '../assets/Disciplinas Obrigatórias - Currículo antigo.json';
import CaixaDisciplina from '../components/CaixaDisciplina.vue';
import DetalhesDisciplina from '../components/DetalhesDisciplina.vue';
export default {
    name: "DisciplinasCurriculoAntigo",
    data() {
        return {
            disciplinas: curriculoAntigo.CurriculoAntigo,
            periodos: 8,
            disciplinaSelecionada: null
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