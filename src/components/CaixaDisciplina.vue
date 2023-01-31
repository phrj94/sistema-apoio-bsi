<template>
    <v-card class="pa-2 largura-caixa" :color="corFundoCartao">
        <v-card-title>{{ disciplina.sigla }}</v-card-title>
        <v-card-subtitle>{{ disciplina.codigo }}</v-card-subtitle>
        <v-card-actions>
            <v-btn color="indigo" variant="flat">Disciplinas compatíveis</v-btn>
        </v-card-actions>
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
        status: { type: String, default: () => '' }
    },
    computed: {
        corFundoCartao() {
            if (this.status === 'REP') return 'red';
            else if (this.status === 'APV') return 'green';
            else return '#F5F5F5';
        }
    },
    data: () => ({
        discplinas: []
    })
}
</script>
<style>
    .largura-caixa{
        width: 300px;
    }
</style>