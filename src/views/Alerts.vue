<template>
  <div>
    <b-alert
      v-for="alert in alerts"
      :key="alert"
      show=5
      fade
      dismissible
    >
    {{ alert }}
    </b-alert>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import store from '@/store';

@Component
export default class Alerts extends Vue {
  get alerts() {
    return store.state.alerts;
  }
}
</script>