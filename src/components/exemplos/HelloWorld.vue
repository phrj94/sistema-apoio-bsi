<script setup>
/**
 * Diferente da abordagem que utiliza Options API, este componente utiliza o padrão Composite API;
 * É uma forma diferente de representar as mesmas coisas que o padrão Options API faz, mas você não exporta
 * um componente em si, você o constrói e pode utilizar os hooks e propriedades que o VUE oferece como "data"
 * pra gerenciar o estado do componente, os métodos do ciclo de vida (created, mounted, etc.), hooks (computed, watch, etc)...
 * Enfim, tudo que um faz o outro faz, mas de forma diferente. Neste caso aqui, o componente recebe a propriedade 'msg'
 * declaradas dentro do bloco "defineProps";
 */
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      You’ve successfully created a project with
      <a href="https://vitejs.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>.
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
