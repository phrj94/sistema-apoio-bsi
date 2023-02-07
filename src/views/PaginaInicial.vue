<template>
    <div>
        <h1>Página inicial</h1>
        <CaixaDisciplina :disciplina="{ nome: 'Desenvolvimento de Servidores Web', sigla: 'DSW', codigo: 'TIN106' }" />
        <input type="file" ref="historicoArq" @change="lerPlanilhaDisciplinas" />
    </div>
</template>
<script>
import CaixaDisciplina from '../components/CaixaDisciplina.vue';
import { read, utils } from 'xlsx'

export default {
    name: "PaginaInicial",
    data: () => ({ historico: null }),
    methods: {
        async lerPlanilhaDisciplinas() {
            //Lê o arquivo enviado pelo usuário no input
            const arquivo = this.$refs.historicoArq.files[0];

            //Transforma o arquivo lido em um array           
            const arquivoArray = await arquivo.arrayBuffer();

            //Lê o arquivo em buffer e retorna um xlxs manipulável
            const arquivoXSLX = read(arquivoArray);

            // Transforma as planilhas em cada aba em um JSON.
            const historicoJSON = utils.sheet_to_json(arquivoXSLX.Sheets[arquivoXSLX.SheetNames[0]]);
            console.log(historicoJSON)
        }
    },
    components: { CaixaDisciplina }
}
</script>