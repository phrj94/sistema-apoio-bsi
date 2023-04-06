<template>
    <v-card class="pa-2 largura-caixa" :color="cor">
        <v-card-title>{{ disciplina.Sigla }}</v-card-title>
        <v-card-subtitle>{{ disciplina.codigo }}</v-card-subtitle>
        <!-- <v-card-actions>
            <v-btn color="indigo" variant="flat">Disciplinas compatíveis</v-btn>
        </v-card-actions> -->
    </v-card>
</template>
<script>
export default {
    name: 'CaixaDisciplina',
    props: {
        disciplina: {
            type: Object,
            required: true,
            default: () => { }
        },
        cor: { type: String, default: () => '' }
    },
    computed: {
        corFundoCartao() {
            if (this.status === 'REP') return 'red';
            else if (this.status === 'APV') return 'green';
            else return ;
        }
    }
}
</script>
<style>
    .largura-caixa{
        width: 120px;
    }
</style>