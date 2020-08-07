<template>
  <div id="app" class="h-100">
    <router-link to="#main" class="skiplink" @click.native="scrollFix('#main')">Skip to content</router-link>
    <Navbar />
    <div class="container pt-3">
      <h2 v-if="showName">{{ location}}</h2>
      <router-view  class="mb-5 pb-5"/>
      <br class="d-block d-md-none">
      <br class="d-block d-sm-none">
      <br class="d-block d-sm-none">
      <Footer />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import store from '@/store';
import BootstrapVue from 'bootstrap-vue';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import 'nprogress/nprogress.css'

Vue.use(BootstrapVue);

@Component({
  components: {
    Navbar,
    Footer,
  }
})
export default class App extends Vue {
  mounted() {
    document.title = 'HS Scholar Bowl'
    store.dispatch('start')
  }

  scrollFix(hashbang: string) {
      window.location.hash = hashbang;
  }

  get showName() {
    return !(['Main'].includes(this.location));
  }

  get location() {
    let { name } = this.$route;
    return name || '';
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