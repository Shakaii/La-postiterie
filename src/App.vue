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
}


#app {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}

body {
    margin: 0;
    padding: 0;
    background-color: var(--body-background);
}

.el-notification{
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif!important;
}
</style>

