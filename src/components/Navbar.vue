<template>
  <div>
    <b-navbar toggleable="lg" variant="secondary" class="text-white">
      <b-navbar-brand><router-link to="/">Home</router-link></b-navbar-brand>
      <b-navbar-toggle class="bg-primary" target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item><router-link to="/about">How it works</router-link></b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            Welcome,<pre> </pre><b-form-input size="sm" class="mr-sm-2" :value="name" @input="updateName" placeholder="wait a minute...who are you?"></b-form-input>
          </b-nav-form>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import store from '@/store';
import debounce from 'lodash.debounce'

@Component
export default class Navbar extends Vue {
  get name() {
    return store.state.name
  }

  get store() {
    return store;
  }

  updateName(event: string) {
    store.commit('setName', event);
    if (!event.includes(',') && event.trim().length) this.debounceReconnect();
  }

  debounceReconnect = debounce(this.reconnect, 500);

  async reconnect() {
    let currentlyIsHost = store.state.name === store.state.host;
    await store.dispatch('disconnect');
    await store.dispatch('connect', currentlyIsHost);
  }

}
</script>