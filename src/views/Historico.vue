<template>
    <v-container>
        <!--<h1 color="indigo">Histórico aluno</h1>
        <CaixaDisciplina :disciplina="{ nome: 'Desenvolvimento de Servidores Web', sigla: 'DSW', codigo: 'TIN106' }" status="APV" />
        <CaixaDisciplina :disciplina="{ nome: 'Matemática Básica', sigla: 'MB', codigo: 'TIN106' }" status="APV"/>
        <CaixaDisciplina :disciplina="{ nome: 'Fundamentos de Sistemas de Informação', sigla: 'FSI', codigo: 'TIN106' }" status="REP"/>
        <CaixaDisciplina :disciplina="{ nome: 'Organicação de Computadores', sigla: 'OC', codigo: 'TIN106' }" /> -->
    </v-container>
</template>
<script>
import CaixaDisciplina from '../components/CaixaDisciplina.vue';


export default {
    name: "Historico",
    data: () => ({}),
    methods: {
        lerPlanilhaDisciplinas() { }
    },
    components: { CaixaDisciplina }
}
</script>