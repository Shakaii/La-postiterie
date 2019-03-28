<template>
  <div id="app">
    <Header/>
    <Postiterie/>
  </div>
</template>

<script>
import Postiterie from './components/Postiterie.vue';
import Header from './components/Header.vue';
import tracking from 'tracking';
import gapi from './gapi.js';
import materialIcons from 'material-icons';

export default {
  name: 'app',
  components: {
    Postiterie,
    Header
  }
};
</script>

<style>

:root{
  --body-background: rgba(0,0,0,0.05); 

  --header-background: #478BF9;
  --header-color: rgba(0,0,0,0.6);

  --big-button-background : #478BF9;
  --big-button-color : rgba(0,0,0,0.7);
  --big-button-icon : rgba(0,0,0,0.55);
  --big-button-shadow : #656565;
  --big-button-active-shadow : #478BF9;
  
  --small-button-background : #6ED2D0;
  --small-button-color : rgba(0,0,0,0.7);
  --small-button-icon : rgba(0,0,0,0.55);
  --small-button-shadow : #656565;
  --small-button-active-shadow : #6ED2D0;

  --round-button-background : #FF6B81;
  --round-button-color : rgba(0,0,0,0.7);
  --round-button-icon : rgba(0,0,0,0.55);
  --round-button-shadow : #656565;
  --round-button-active-shadow : #FF6B81;


}

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
    background-color: var(--body-background);
}

.toasted-container{
  font-family: 'Fira Sans', sans-serif;
}
</style>

