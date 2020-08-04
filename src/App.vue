<template>
  <div id="app" class="h-100">
    <nav id="nav" class="navbar navbar-dark bg-secondary text-white">
      <span class='h-100 nav-form'>
        Welcome,
        <b-form-input :value="store.state.name" @input="updateName" placeholder="wait a minute...who are you?" class="d-inline form-control form-control-sm h-100 align-baseline" style="width: 200px"/>
      </span>
      <span class="float-right">
        {{ store.state.connectionState }}
        <button
          class="btn btn-primary d-inline btn-sm ml-1 align-baseline"
          v-if="store.state.connectionState === 'Disconnected'"
          @click="connect(false)"
        >
          Connect
        </button>
        <button
          class="btn btn-primary d-inline btn-sm ml-1 align-baseline"
          v-if="store.state.connectionState === 'Disconnected'"
          @click="connect(true)"
        >
          Connect as host
        </button>
        <button
          class="btn btn-primary d-inline btn-sm ml-1 align-baseline"
          v-else-if="store.state.connectionState === 'Connected'"
          @click="store.dispatch('disconnect')"
        >
          Disconnect
        </button>
      </span>
    </nav>
    <div class="container pt-3">
      <router-view/>
      <Alerts class="fixed-bottom pr-3 pl-3 mb-5 pb-5"/>
      <div class="w-100 bg-secondary text-white p-2 fixed-bottom mt-3">
        <span>Built with Vue.js and TypeScript, styled with Bootstrap Vue, made in VSCode, and deployed on GitHub Pages. Uses a websocket server deployed on Heroku for peer-to-peer communication.</span><br>
        <a href="hsscholarbowl.github.com/hssb">Website code</a>
        <a href="hsscholarbowl.github.com/server" class="ml-2">Server code</a>
      </div>
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