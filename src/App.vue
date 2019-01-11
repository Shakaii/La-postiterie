<template>
  <div id="app">
    <div class="header">
      <img class="logo" src="./assets/logo.png" alt="logo">
      <span>Bienvenue sur la postiterie</span>
      <span class="slogan">"Gagner du temps, c'est notre slogan"</span>
      <a class="link" target="_blank" href="http://postiterie.wordpress.com">En savoir plus</a>
    </div>
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
  font-family: "Coiny";
  src: url('https://fonts.googleapis.com/css?family=Coiny');
}

body{
  
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'Coiny', cursive;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

input, button, .form-submit-button{
  font-family: 'Coiny', cursive;
}

.slogan{
  font-style:italic;
  color: #595959;
}

.header{
  background-image: url("./assets/nav.jpg");
  height: 5em;
  display:flex;
  justify-content: space-evenly;
  align-items:center;
}

.logo{
  height: 100%;
}

.link{
  text-decoration:none;
  font-weight: 900;
  
  color: #1b6ab5;
}

.link:hover{
  color: #2080db;
}

body{
  background-image: url("./assets/texture.jpg");
}

@media only screen and (max-width: 800px) {
  .slogan, .link{
    display:none;
  }
}

</style>
