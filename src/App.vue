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
  --default-font: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",Arial,sans-serif;
}

#app {
    font-family: var(--default-font);
}

body {
    margin: 0;
    padding: 0;
    background-color: var(--body-background);
}

.el-notification{
  font-family: var(--default-font)!important;
}
</style>

