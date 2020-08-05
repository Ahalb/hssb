<template>
  <div id="app" class="h-100">
    <nav id="nav" class="navbar navbar-dark bg-secondary text-white">
      <div class='h-100 nav-form'>
        Welcome,
        <b-form-input :value="store.state.name" @input="updateName" placeholder="wait a minute...who are you?" class="d-inline form-control form-control-sm h-100 align-baseline" style="width: 200px" aria-label="name"/>
      </div>
    </nav>
    <div class="container pt-3">
      <button
        class="btn btn-primary d-inline btn-sm align-baseline mt-3 mt-sm-0 col-md"
        v-if="store.state.connectionState !== 'Connected'"
        @click="connect(false)"
      >Connect</button>
      <button
        class="btn btn-primary d-inline btn-sm align-baseline mt-2 col-md"
        v-if="store.state.connectionState !== 'Connected'"
        @click="connect(true)"
        v-b-tooltip.hover
        title="Connect as a host; the host can clear buzzes"
      >Connect as host</button>
      <button
        class="btn btn-primary d-inline btn-sm align-baseline col-md"
        v-else
        @click="store.dispatch('disconnect')"
      >Disconnect</button>
      <router-view class="mt-3" />
      <a class="sr-only" href="#footer">Skip alerts</a>
      <Alerts class="sticky-bottom mb-5 pb-5"/>
      <footer class="w-100 bg-secondary text-white p-2 fixed-bottom mt-3 row ml-0" id="footer">
        <span class="col-md-9 col-12">
          Built with Vue.js and TypeScript, styled with Bootstrap Vue, made in VSCode, and deployed on GitHub Pages. Uses a websocket server deployed on Heroku for peer-to-peer communication.
        </span>
        <div class="float-right col-12 col-md-3">
          <a href="https://hsscholarbowl.github.com/hssb" class="col">Code</a>
          <a href="https://hsscholarbowl.github.com/server" class="ml-2 col">Server</a>
        </div>
      </footer>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import store from '@/store';
import BootstrapVue from 'bootstrap-vue';
import Alerts from '@/views/Alerts.vue';

Vue.use(BootstrapVue);

@Component({
  components: {
    Alerts,
  }
})
export default class App extends Vue {
  mounted() {
    document.title = 'HS Scholar Bowl'
    store.dispatch('start')
  }

  get name() {
    return store.state.name
  }

  get store() {
    return store;
  }

  updateName(event: string) {
    store.commit('setName', event);
  }

  connect(host = false) {
    store.dispatch('connect', host);
  }
}
</script>
<style lang="scss">
@import '@/styles/global.scss';
</style>