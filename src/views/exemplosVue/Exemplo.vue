<template>
    <v-container>
        <v-card>
            <HelloWorld msg="You did it!" />
        </v-card>
        <h1>{{ titulo }}</h1>
        <span>{{ subtitulo }}</span>
        <v-btn @click="mudarTexto">Mudar texto</v-btn>
    </v-container>
</template>
<script>
import HelloWorld from '../../components/exemplos/HelloWorld.vue'
/**
 * Exemplo de component utilizando OPTIONS API
 * Cria-se o template (que será nosso código HTML), envolvemos toda a lógica do nosso componente/página
 * dentro da tag "script" que é exportada por padrão (sintaxe ES6) como um objeto contendo o estado (data)
 * do componente/página, métodos do ciclo de vida (neste caso só usei o "created") - ver ciclo de vida VUE - e demais opções, como os métodos
 * que desejo criar pra lidar com a reatividade do componente/página.
 * Abaixo tem o código css pra estilizar a página. Esse tá bem básico, mas tudo que for CSS tem que ficar dentro
 * da tag "style";
 * 
 */
export default {
    name: 'Exemplo',
    data: () => ({
        titulo: '',
        subtitulo: 'TCC Jonhatan e PH'
    }),
    created(){
        this.titulo = 'Olá, mundo!'
    },
    methods: {
        mudarTexto() {
            this.subtitulo = 'Texto trocado.'
        }
    },
    components: {
        HelloWorld
    }

}
</script>
<style>
h1 {
    color: red;
}
</style>