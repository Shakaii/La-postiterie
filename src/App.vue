<template>
  <div id="app">
    <header>
    <img src="./assets/header.png">
    </header>
    <Postiterie/>
  </div>
</template>

<script>
import Postiterie from './components/Postiterie.vue'
import tracking from 'tracking'

export default {
  name: 'app',
  components: {
    Postiterie
  }
}
</script>

<style>
#app {
    font-family: 'Coiny', cursive;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

body {
    margin: 0;
    padding: 0;
    background-color: #efefde;
}


@font-face {
    font-family: "Coiny";
    src: url('https://fonts.googleapis.com/css?family=Coiny');
}
</style>

<style scoped>
header{
    text-align: center;
}

header img{
    width: calc(100% - 2em);
    height: auto;
    margin: 1em;
    margin-bottom: -3em;
    max-width: 300px;
}


</style>
