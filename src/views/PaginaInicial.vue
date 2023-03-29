<template>
    <div>
        <h1>Página inicial</h1>
        <CaixaDisciplina :disciplina="{ nome: 'Desenvolvimento de Servidores Web', sigla: 'DSW', codigo: 'TIN106' }" />
        <input type="file" ref="historicoArq" @change="lerPlanilhaDisciplinas" />
    </div>
</template>
<script>
import CaixaDisciplina from '../components/CaixaDisciplina.vue';
import instance from '../api/instance';

export default {
    name: "PaginaInicial",
    data: () => ({ historico: null }),
    methods: {
        async lerPlanilhaDisciplinas() {
            const arquivo = this.$refs.historicoArq.files[0];
            const formData = new FormData();
            formData.append('file', arquivo);
            const res = await instance.post("upload", formData, { headers: { 'Content-Type': 'multipart/form-data;boundary=boundary' } })
            //Lidar com as disciplinas na response HTTP.
        }
    },
    components: { CaixaDisciplina }
}
</script>