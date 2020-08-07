<template>
  <main id="main">
      <button
        class="btn btn-primary d-inline btn-sm align-baseline mt-3 mt-sm-0 col-md"
        v-if="store.state.connectionState !== 'Connected'"
        @click="connect(false)"
      >Connect</button>
      <button
        class="btn btn-primary d-inline btn-sm align-baseline col-md"
        v-else
        @click="store.dispatch('disconnect')"
      >Disconnect</button>
      <button
        class="btn btn-primary d-inline btn-sm align-baseline mt-2 col-md"
        v-if="store.state.connectionState !== 'Connected'"
        @click="connect(true)"
        v-b-tooltip.hover
        title="Connect as a host; the host can clear buzzes"
      >Connect as host</button>
      <button
        class="btn btn-primary d-inline btn-sm align-baseline col-md mt-2"
        v-else
        @click="reconnect"
      >Reconnect</button>
    <button @click="buzz" class="btn btn-secondary btn-lg w-100 mb-3 mt-3">Buzz</button>
    <button @click="clear" class="btn btn-secondary btn-lg w-100 mb-3" v-if="isHost">Clear</button>
    <div v-if="onlineList.length" class="mb-3">
      <h4>Online</h4>
      <b-list-group>
        <b-list-group-item
          v-for="user in onlineList"
          :key="user"
          :active="activeBuzzer === user"
        >
          <span class="align-middle">
            <span v-b-tooltip.hover :title="`${user} is the host`">{{ host === user ? '◆' : ''}}</span>
            {{ user }}
          </span>
          <b-button class="btn-sm float-right make-host" v-if="host !== user && isHost" @click="makeHost(user)">Make Host</b-button>
        </b-list-group-item>
      </b-list-group>
    </div>
    <a class="sr-only" href="#footer">Skip alerts</a>
    <Alerts class="sticky-bottom mb-5 pb-5"/>
  </main>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import store from '@/store';
import Alerts from '@/views/Alerts.vue';
import debounce from 'lodash.debounce'
@Component({
  components: {
    Alerts,
  }
})
export default class Main extends Vue {
  get name() {
    return store.state.name;
  }

  get isHost() {
    return this.host === this.name;
  }

  get onlineList() {
    return store.state.onlineList;
  }

  get host() {
    return store.state.host;
  }

  get activeBuzzer() {
    return store.state.activeBuzzer;
  }

  makeHost(user: string) {
    store.dispatch('host', user);
    store.commit('addAlert', 'You are no longer the host')
  }

  buzz() {
    store.dispatch('buzz')
  }

  clear() {
    store.dispatch('clear')
  }

  get store() {
    return store;
  }

  updateName(event: string) {
    store.commit('setName', event);
    if (!event.includes(',') && event.trim().length) this.debounceReconnect();
  }

  debounceReconnect = debounce(this.reconnect, 500);

  connect(host = false) {
    store.dispatch('connect', host);
  }

  async reconnect() {
    let currentlyIsHost = store.state.name === store.state.host;
    await store.dispatch('disconnect');
    await store.dispatch('connect', currentlyIsHost);
  }
}
</script>