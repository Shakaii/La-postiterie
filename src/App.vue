<template>
  <div id="app">
    <img alt="Vue logo" src="https://lh4.ggpht.com/er4T35JxjGnIFYL_p7HU9G0GFwNJ2eZzt1oGloPL9RC18f_MUU4h5_wwHI6IGGKWIuw=w315">
    <HelloWorld msg="Bienvenue sur La Postiterie"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    HelloWorld
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
