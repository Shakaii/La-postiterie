<template>
  <div id="app">
    <Header/>
    <Postiterie/>
  </div>
</template>

<script>
import Postiterie from './components/Postiterie.vue'
import Header from './components/Header.vue'
import tracking from 'tracking'
import gapi from './gapi.js'
import materialIcons from 'material-icons'

export default {
  name: 'app',
  components: {
    Postiterie,
    Header
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
    background-color: rgba(0,0,0,0.05);
}

</style>

