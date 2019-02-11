<template>
  <div id="app">
    <header>
      <img alt="header" src="./assets/header.png">
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
@font-face {
    font-family: 'Fira Sans', sans-serif;
    src: url("https://fonts.googleapis.com/css?family=Fira+Sans:100,400,900");
}

#app {
    font-family: 'Fira Sans', sans-serif;
}

body {
    margin: 0;
    padding: 0;
    background-color: rgba(0,0,0,0.01);
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
