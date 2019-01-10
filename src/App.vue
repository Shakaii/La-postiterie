<template>
  <div id="app">
    <img alt="Vue logo" src="https://lh4.ggpht.com/er4T35JxjGnIFYL_p7HU9G0GFwNJ2eZzt1oGloPL9RC18f_MUU4h5_wwHI6IGGKWIuw=w315">
    <Postiterie msg="Bienvenue sur La Postiterie"/>
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
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
