import Vue from 'vue';
import App from './App.vue';
import Toasted from 'vue-toasted';

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount('#app');

Vue.use(Toasted, {
  iconPack : 'material' // set your iconPack, defaults to material. material|fontawesome|custom-class
});
