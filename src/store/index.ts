import Vue from "vue";
import Vuex from "vuex";
import Data from "./modules/data";
import Options from "./modules/options";
import View from "./modules/view";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    data: {
      namespaced: true,
      ...Data,
    },
    options: {
      namespaced: true,
      ...Options,
    },
    view: {
      namespaced: true,
      ...View,
    },
  },
});

export default store;
