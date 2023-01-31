<template>
    <div>
        <h1>Página inicial</h1>
        <CaixaDisciplina :disciplina="{ nome: 'Desenvolvimento de Servidores Web', sigla: 'DSW', codigo: 'TIN106' }" />
    </div>
</template>
<script>
import CaixaDisciplina from '../components/CaixaDisciplina.vue';


export default {
    name: "PaginaInicial",
    data: () => ({}),
    methods: {
        lerPlanilhaDisciplinas() { }
    },
    components: { CaixaDisciplina }
}
</script>