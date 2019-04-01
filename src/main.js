import Vue from 'vue';
import App from './App.vue';
import Toasted from 'vue-toasted';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;

Vue.use(ElementUI);

new Vue({
  render: h => h(App)
}).$mount('#app');

Vue.use(Toasted, {
  iconPack : 'material' // set your iconPack, defaults to material. material|fontawesome|custom-class
});
