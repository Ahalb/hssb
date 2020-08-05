<template>
  <div id="app" class="h-100">
    <router-link to="#main" class="skiplink" @click.native="scrollFix('#main')">Skip to content</router-link>
    <nav id="nav" class="navbar navbar-dark bg-secondary text-white">
      <div class='h-100 nav-form'>
        Welcome,
        <b-form-input :value="store.state.name" @input="updateName" placeholder="wait a minute...who are you?" class="d-inline form-control form-control-sm h-100 align-baseline" style="width: 200px" id="name"/>
        <label for="name" class="sr-only">name</label>
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
        <div class="col-12 col-md-3">
          <a href="https://hsscholarbowl.github.com/hssb" class="col">Code</a>
          <a href="https://hsscholarbowl.github.com/server" class="ml-2 col clearfix" style="position: relative; right: 0px">Server</a>
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
  scrollFix(hashbang: string) {
      window.location.hash = hashbang;
  }
}
</script>
<style lang="scss">
@import '@/styles/global.scss';
</style>
<style scoped lang="scss">
@import '@/styles/global.scss';
.skiplink {
  background-color: $primary;
  padding: 3px 6px;
  position: absolute;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  border: 0 none;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  white-space: nowrap;
  width: 1px;
  color: $secondary;
  box-shadow: 2px 2px 8px 0 rgba(0, 0, 0, 0.75);
  z-index: 2;
}
.skiplink:focus {
  clip: auto;
  height: auto;
  position: fixed;
  width: auto;
}
.skiplink:focus:hover {
  color: $dark;
}
</style>