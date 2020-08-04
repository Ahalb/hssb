<template>
  <div>
    <button @click="buzz" class="btn btn-primary btn-lg w-100 mb-3">Buzz</button>
    <button @click="clear" class="btn btn-primary btn-lg w-100 mb-3" v-if="isHost">Clear</button>
    <div v-if="onlineList.length">
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
          <b-button class="btn-sm float-right" v-if="host !== user && isHost" @click="makeHost(user)">Make Host</b-button>
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import store from '@/store';
@Component
export default class Main extends Vue {
  get name() {
    return store.state.name;
  }

  get isHost() {
    return store.state.isHost;
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
}
</script>