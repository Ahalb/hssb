<template>
  <div>
    <ol class="list-group">
      <li>
        You connect to the server. You tell it your name and it tells you and others information about the connection.
        <details>
          <summary>Details</summary>
          When you connect, the server asks for you name by sending <code>NAME</code>.
          You respond by sending <code>NAME &lt;your_name&gt;</code> (if you're the host, it looks like <code>NAME &lt;your_name&gt; HOST</code>).
          If someone else is using that name, the server sends <code>NAME_IN_USE</code> and closes the connection.
          If the name is valid, the server send <code>SUCCESS</code>.
          It immediately sends a <code>HOST &lt;name_of_host&gt;</code> message to tell you who the host is.
          It also updates the online list and sends an <code>ONLINE &lt;name_one&gt;,&lt;name_two&gt;...</code> message to everyone to let them know the user list has updated.<br>
          Code:
          <pre><code>case 'NAME': // Client registration response
  // If any client has that name, send an error and close
  if (this.clients.some(e => e.name === params.replace(/ HOST$/, ''))) {
    client.sendMessage('NAME_IN_USE');
    client.connnection.close();
    break;
  }
  // Set their name as the name they gave
  client.name = params;
  // If the client name ends with HOST, make them a host and remove that from their name
  if (params.match(/ HOST$/)) { // If the client is joining as a host, they will send HOST at the end of their message
    this.clients.forEach(client => {
      // Set every client as not the host
      client.isHost = false
    });
    // Set the client that sent the message as the host
    client.isHost = true;
    // Make sure their name doesn't end with HOST
    client.name = params.replace(/ HOST$/, '');
  }
  // Inform the client it wored
  client.sendMessage('SUCCESS');
  // Tell them who the host is and update the online list
  client.sendMessage(`HOST ${this.getHost()?.name || ''}`);
  this.updateOnline();
  break;
</code></pre>
        </details>
      </li>
      <li>
        When you buzz or clear, the server receives the message and echoes it to everyone else
        <details>
          <summary>Details</summary>
          Buzz messages are sent as <code>BUZZ &lt;name_of_buzzer&gt;</code><br>
          Clear messages are sent as <code>CLEAR</code><br>
          The server relays these messages to everyone connected except you, to avoid infinite loops (those are never fun)
          <pre><code>// Echo buzz/clear messages
// this.broadcast sends the message to everyone except the sender
case 'BUZZ': this.broadcast(`BUZZ ${client.name}`, senderConnection); break;
case 'CLEAR': this.broadcast(`CLEAR`, senderConnection); break;</code></pre>
        </details>
      </li>
      <li>
        There are two ways users can be made host - either when they connect or when a host makes them the host
        <details>
          <summary>Details</summary>
          During connection, users can connect as a host by adding the <code>HOST</code> option the the <code>NAME</code> command
          Host messages are sent as <code>HOST &lt;new_host&gt;</code><br>
          The server sends this to everyone except you.
          <pre><code>case 'HOST':
  this.clients.forEach(client => client.isHost = false)
  // Makes sure everyone except the new host isn't a host
  this.clients.find(client => e.name === params).isHost = true;
  // Let everyone know
  this.broadcast(`HOST ${params}`, senderConnection);
  break;</code></pre>
        </details>
      </li>
      <li>
        When you disconnect, the server updates the online list
        <details>
          <summary>Details</summary>
          That's all there is - here's the code
          <pre><code>connection.on('close', (code, desc) => {
  // On close, update online list
  this.log('CLOSE', code, desc);
  // Remove clients that are disconnected from the list
  this.clients = this.clients.filter(client => client.connection.connected);
  // Send the updated list to everyone
  this.updateOnline();
});
          </code></pre>
        </details>
      </li>
    </ol>
    <br>
    <h4>See the full code</h4>
    <details>
      <summary>Server</summary>
      <pre><code>import { server as WebSocketServer, connection, request, IMessage } from 'websocket';
import { createServer, Server } from 'http';
import Client from './client';

export default class WSServer {
  server: Server;

  wsServer: WebSocketServer;

  clients: Client[];

  constructor() {
    this.server = createServer((request, response) => {
      this.log('RECEIVED REQUEST', 'FOR', request.url)
      // This isn't a web server - give a 404 if someone accesses it through the browser
      response.writeHead(404);
      response.end();
    });
    this.server.listen(process.env.PORT || 8080, () =>  this.log('LISTEN', `on port ${process.env.PORT || 8080}`));
    this.wsServer = new WebSocketServer({
      httpServer: this.server,
      autoAcceptConnections: false,
    })
    this.wsServer.on('request', (request) => this.onRequest(request))
    this.clients = [];
  }

 async onRequest(request: request) {
    if (this.originAllowed(request.origin)) {
      // request.reject();
      this.log('REJECT ORIGIN', request.origin);
      // return;
    }
    let connection = request.accept('echo-protocol', request.origin);
    this.log('ACCEPT CONNECTION');
    connection.on("message", (data: IMessage) => this.onMessage(data, connection));
    connection.on('close', (code, desc) => {
      // On close, update online list
      this.log('CLOSE', code, desc);
      this.clients = this.clients.filter(e => e.conn.connected);
      this.updateOnline();
    });
    let client = new Client();
    client.conn = connection;
    this.clients.push(client);
    // Initiate client registration
    client.sendMessage('NAME');
  }

  getClientWithConnection(connection: connection) {
    return this.clients.find(client => client.connection === connection);
  }

  getHost() {
    return this.clients.find(client => client.isHost);
  }

  async onMessage(message: IMessage, senderConnnection: connection) {
    this.log('RECEIVE', message.utf8Data)
    const msg = message.utf8Data;
    let client = this.getClientWithConnection(senderConnection);
    let command = msg.match(/^\S+/) ? msg.match(/^\S+/)![0] : null;
    let params = msg.match(/ (\S+\s)*(\S+)$/) ? msg.match(/ (\S+\s)*(\S+)$/)![0].slice(1) : '';
    switch (command) {
      case 'NAME': // Client registration response
        // If name in use, send an error and close
        if (this.clients.some(client => client.name === params.replace(/ HOST$/, ''))) {
          client.sendMessage('NAME_IN_USE');
          client.connection.close();
          break;
        }
        client.name = params;
        if (params.match(/ HOST$/)) { // If the client is joining as a host, they will send HOST at the end of their message
          this.clients.forEach(client => client.isHost = false)
          client.isHost = true;
          client.name = params.replace(/ HOST$/, '');
        }
        client.sendMessage('SUCCESS');
        // Tell them who the host is and update the online list
        client.sendMessage(`HOST ${this.getHost()?.name || ''}`);
        this.updateOnline();
        break;
      case 'HOST':
        this.clients.forEach(client => client.isHost = false)
        this.clients.find(client => client.name === params).isHost = true;
        this.broadcast(`HOST ${params}`, senderConnection);
        break;
      // Echo buzz/clear messages
      case 'BUZZ': this.broadcast(`BUZZ ${client.name}`, senderConnection); break;
      case 'CLEAR': this.broadcast(`CLEAR`, senderConnection); break;
      default: this.error(new Error(`UNKNOWN MESSAGE TYPE: ${msg}`)); break;
    }
  }

  async updateOnline() {
    let names = this.clients.map(client => client.name);
    this.broadcast(`ONLINE ${names.join(',')}`)
  }

  async broadcast(message: string, excluding: connection = null) {
    this.wsServer.connections.filter(connecttion => excluding === null || connection !== excluding).forEach(connection => {
      this.sendMessage(message, connection)
    })
  }

  async sendMessage(message: string, to: connection) {
    this.log('SEND', message);
    to.send(message);
  }

  async originAllowed(origin: string) {
    return true;
  }

  async error(err: Error) {
    console.error('[SERVER]', err);
  }

  async log(type: string, ...messages: string[] | any[]) {
    console.log('[SERVER]', type, ...messages);
  }
}

let s = new WSServer();</code></pre>
    </details>
    <details>
      <summary>Client logic</summary>
      Note that this is not the full code, just the part that communicates with the server
      <pre><code>import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name: '',
    alerts: [] as string[],
    connectionState: 'Disconnected',
    connection: new WebSocket('wss://scholar-bowl-server.herokuapp.com', 'echo-protocol'),
    activeBuzzer: null as string | null,
    onlineList: [] as string[],
    host: '',
  },
  mutations: {
    setName(state, name: string) {
      state.name = name;
      localStorage.hasName = JSON.stringify(name);
    },
    addAlert(state, name: string) {
      state.alerts.push(name);
    },
    removeAlert(state, name: string) {
      state.alerts = state.alerts.filter(e => e !== name);
    },
    changeConnectionState(state, to: string) {
      state.connectionState = to;
    },
    setConnection(state, connection) {
      state.connection = connection;
    },
    setBuzzer(state, to: string) {
      state.activeBuzzer = (to === 'null' ? null : to);
    },
    setOnline(state, to: string[]) {
      state.onlineList = to;
    },
    setHost(state, user) {
      state.host = user;
    },
  },
  actions: {
    start({ commit }) {
      if (!localStorage) {
        alert("Your browser doesn't support local storage - that's an issue. Please use a modern browser that does");
        return;
      }
      let name = '';
      if (localStorage.hasName) {
        name = JSON.parse(localStorage.hasName);
      } else {
        commit('addAlert', "I don't know who you are! Tell me in the upper left");
        commit('addAlert', "New here? Try adding me to the home screen or installing me as an app!");
      }
      commit('setName', name?.length ? name : 'Anonymous');
    },
    async connect({ commit, dispatch }, host = false) {
      commit('changeConnectionState', 'Connecting...')
      dispatch('join', host)
    },
    async disconnect({ commit, state }) {
      state.connection.close();
      commit('changeConnectionState', 'Disconnected')
    },
    buzz({ state, commit }) {
      if (state.activeBuzzer === null) {
        state.connection.send(`BUZZ ${state.name}`)
        commit('setBuzzer', state.name);
        commit('addAlert', 'You buzzed');
      } else commit('addAlert', `${state.activeBuzzer === state.name ? 'You have' : `${state.activeBuzzer} has`} already buzzed`);
    },
    clear({ state, commit }) {
      state.connection.send('CLEAR')
      commit('setBuzzer', 'null');
      commit('addAlert', 'You cleared');
    },
    async join({ commit, dispatch, state }, host = false) {
      let connection = new WebSocket('wss://scholar-bowl-server.herokuapp.com', 'echo-protocol');
      // let connection = new WebSocket('ws://localhost:8080', 'echo-protocol')
      connection.onopen = (e) => {
        commit('changeConnectionState', 'Connected')
      }
      connection.onclose = (e) => {
        commit('addAlert', `Connection ${e.wasClean ? '' : '(not cleanly) '}closed${e.reason.length ? `: ${e.reason}` : ''}`)
      };
      connection.onmessage = (e) => {
        let msg = e.data as string;
        let command = msg.match(/^\S+/) ? msg.match(/^\S+/)![0] : null;
        let params = msg.match(/ (\S+\s)*(\S+)$/) ? msg.match(/ (\S+\s)*(\S+)$/)![0].slice(1) : '';
        if (command === null) return;
        switch(command) {
          case 'BUZZ':
            dispatch('onBuzz', params);
            break;
          case 'CLEAR':
            dispatch('onClear');
            break;
          case 'NAME':
            if (host) {
              commit('setHost', state.name);
            }
            connection.send(`NAME ${state.name}${host ? ' HOST' : ''}`);
            break;
          case 'NAME_IN_USE':
            if (state.name.startsWith('Anonymous')) {
              let match = state.name.match(/\d+$/);
              let num = parseInt(match ? match[0] : '0', 10);
              commit('setName', `Anonymous${num + 1}`)
              this.dispatch('join', host)
            } else {
              commit('addAlert', 'Someone else is using that name. Please try a different one and reconnect');
              this.dispatch('disconnect')
            }
            break;
          case 'SUCCESS':
            commit('addAlert', 'Successfully connected');
            break;
          case 'HOST':
            if (params === state.name) {
              commit('addAlert', 'You are now the host')
            }
            commit('setHost', params);
            break;
          case 'ONLINE':
            commit('setOnline', params.trim().split(','));
            break;
          default:
            commit('addAlert', `Unknown message type: ${msg}`);
            break;
        }
      }
      connection.onerror = (e) => {
        commit('addAlert', `ERROR: ${e}`)
        console.error('error', e);
      }
      commit('setConnection', connection);
    },
    onBuzz({ commit }, from: string) {
      commit('addAlert', `${from} buzzed`)
      commit('setBuzzer', from);
    },
    onClear({ commit, state }) {
      commit('addAlert', `${state.host} cleared`)
      commit('setBuzzer', 'null');
    },
    host({ state, commit }, user: string) {
      state.connection.send(`HOST ${user}`);
      commit('setHost', user)
    },
  },
  modules: {
  },
})</code></pre>
    </details>
    <details>
      <summary>App code</summary>
      This is the code that controls what you see.
      <pre><code>&lt;template&gt;
  &lt;div id=&quot;app&quot; class=&quot;h-100&quot;&gt;
    &lt;router-link to=&quot;#main&quot; class=&quot;skiplink&quot; @click.native=&quot;scrollFix('#main')&quot;&gt;Skip to content&lt;/router-link&gt;
    &lt;Navbar /&gt;
    &lt;div class=&quot;container pt-3&quot;&gt;
      &lt;h2 v-if=&quot;showName&quot;&gt;{<!---->{ location }}&lt;/h2&gt;
      &lt;router-view  class=&quot;mb-5 pb-5&quot;/&gt;
      &lt;br class=&quot;d-block d-md-none&quot;&gt;
      &lt;br class=&quot;d-block d-sm-none&quot;&gt;
      &lt;br class=&quot;d-block d-sm-none&quot;&gt;
      &lt;Footer /&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;
&lt;script lang=&quot;ts&quot;&gt;
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
&lt;/script&gt;
&lt;style lang=&quot;scss&quot;&gt;
@import '@/styles/global.scss';
&lt;/style&gt;
&lt;style scoped lang=&quot;scss&quot;&gt;
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
&lt;/style&gt;</code></pre>
    </details>
    <details>
      <summary>Routing</summary>
      This controls what you see. It allows you to navigate pages without reloading
      <pre><code>import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import NProgress from 'nprogress';

Vue.use(VueRouter)

  const routes: Array&lt;RouteConfig&gt; = [
  {
    path: '/',
    name: 'Main',
    component: () => import('@/views/Main.vue'),
  },
  {
    path: '/about',
    name: 'How it Works',
    component: () => import('@/views/HowItWorks.vue'),
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
      // Start the route progress bar.
      NProgress.start()
  }
  next()
})

router.afterEach((to, from) => {
  // Complete the animation of the route progress bar.
  NProgress.done()
})

export default router
</code></pre>
    </details>
    <details>
      <summary>Main view</summary>
      This is the primary interface
      <pre><code>&lt;template&gt;
  &lt;main id=&quot;main&quot;&gt;
      &lt;button
        class=&quot;btn btn-primary d-inline btn-sm align-baseline mt-3 mt-sm-0 col-md&quot;
        v-if=&quot;store.state.connectionState !== 'Connected'&quot;
        @click=&quot;connect(false)&quot;
      &gt;Connect&lt;/button&gt;
      &lt;button
        class=&quot;btn btn-primary d-inline btn-sm align-baseline col-md&quot;
        v-else
        @click=&quot;store.dispatch('disconnect')&quot;
      &gt;Disconnect&lt;/button&gt;
      &lt;button
        class=&quot;btn btn-primary d-inline btn-sm align-baseline mt-2 col-md&quot;
        v-if=&quot;store.state.connectionState !== 'Connected'&quot;
        @click=&quot;connect(true)&quot;
        v-b-tooltip.hover
        title=&quot;Connect as a host; the host can clear buzzes&quot;
      &gt;Connect as host&lt;/button&gt;
      &lt;button
        class=&quot;btn btn-primary d-inline btn-sm align-baseline col-md mt-2&quot;
        v-else
        @click=&quot;reconnect&quot;
      &gt;Reconnect&lt;/button&gt;
    &lt;button @click=&quot;buzz&quot; class=&quot;btn btn-secondary btn-lg w-100 mb-3 mt-3&quot;&gt;Buzz&lt;/button&gt;
    &lt;button @click=&quot;clear&quot; class=&quot;btn btn-secondary btn-lg w-100 mb-3&quot; v-if=&quot;isHost&quot;&gt;Clear&lt;/button&gt;
    &lt;div v-if=&quot;onlineList.length&quot; class=&quot;mb-3&quot;&gt;
      &lt;h4&gt;Online&lt;/h4&gt;
      &lt;b-list-group&gt;
        &lt;b-list-group-item
          v-for=&quot;user in onlineList&quot;
          :key=&quot;user&quot;
          :active=&quot;activeBuzzer === user&quot;
        &gt;
          &lt;span class=&quot;align-middle&quot;&gt;
            &lt;span v-b-tooltip.hover :title=&quot;`${user} is the host`&quot;&gt;{<!---->{ host === user ? '◆' : ''}}&lt;/span&gt;
            {<!---->{ user }}
          &lt;/span&gt;
          &lt;b-button class=&quot;btn-sm float-right make-host&quot; v-if=&quot;host !== user &amp;&amp; isHost&quot; @click=&quot;makeHost(user)&quot;&gt;Make Host&lt;/b-button&gt;
        &lt;/b-list-group-item&gt;
      &lt;/b-list-group&gt;
    &lt;/div&gt;
    &lt;a class=&quot;sr-only&quot; href=&quot;#footer&quot;&gt;Skip alerts&lt;/a&gt;
    &lt;Alerts class=&quot;sticky-bottom mb-5 pb-5&quot;/&gt;
  &lt;/main&gt;
&lt;/template&gt;
&lt;script lang=&quot;ts&quot;&gt;
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
    if (!event.includes(',') &amp;&amp; event.trim().length) this.debounceReconnect();
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
&lt;/script&gt;</code></pre>
    </details>
    <details>
      <summary>Alerts</summary>
      <pre><code>&lt;template&gt;
  &lt;div&gt;
    &lt;b-alert
      v-for=&quot;(alert, index) in alerts&quot;
      :key=&quot;`${alert}${index}`&quot;
      show=5
      fade
      dismissible
    &gt;
    {<!---->{ alert }}
    &lt;/b-alert&gt;
  &lt;/div&gt;
&lt;/template&gt;
&lt;script lang=&quot;ts&quot;&gt;
import { Component, Vue } from 'vue-property-decorator';
import store from '@/store';

@Component
export default class Alerts extends Vue {
  get alerts() {
    return store.state.alerts;
  }
}
&lt;/script&gt;</code></pre>
    </details>
    <details>
      <summary>Footer</summary>
      <pre><code>&lt;template functional&gt;
  &lt;footer class=&quot;w-100 bg-secondary text-white p-2 fixed-bottom mt-3 row ml-0&quot; id=&quot;footer&quot;&gt;
    &lt;span class=&quot;col-md-9 col-12&quot;&gt;
      Built with Vue.js and TypeScript, styled with Bootstrap Vue, made in VSCode, and deployed on GitHub Pages. Uses a websocket server deployed on Heroku for peer-to-peer communication.
    &lt;/span&gt;
    &lt;div class=&quot;col-12 col-md-3&quot;&gt;
      &lt;a href=&quot;https://hsscholarbowl.github.com/hssb&quot; class=&quot;col&quot;&gt;Code&lt;/a&gt;
      &lt;a href=&quot;https://hsscholarbowl.github.com/server&quot; class=&quot;ml-2 col clearfix&quot; style=&quot;position: relative; right: 0px&quot;&gt;Server&lt;/a&gt;
    &lt;/div&gt;
  &lt;/footer&gt;
&lt;/template&gt;</code></pre>
    </details>
    <details>
      <summary>Navbar</summary>
      <pre><code>&lt;template&gt;
  &lt;div&gt;
    &lt;b-navbar toggleable=&quot;lg&quot; variant=&quot;secondary&quot; class=&quot;text-white&quot;&gt;
      &lt;b-navbar-brand&gt;&lt;router-link to=&quot;/&quot;&gt;Home&lt;/router-link&gt;&lt;/b-navbar-brand&gt;
      &lt;b-navbar-toggle class=&quot;bg-primary&quot; target=&quot;nav-collapse&quot;&gt;&lt;/b-navbar-toggle&gt;
      &lt;b-collapse id=&quot;nav-collapse&quot; is-nav&gt;
        &lt;b-navbar-nav&gt;
          &lt;b-nav-item&gt;&lt;router-link to=&quot;/about&quot;&gt;How it works&lt;/router-link&gt;&lt;/b-nav-item&gt;
        &lt;/b-navbar-nav&gt;
        &lt;b-navbar-nav class=&quot;ml-auto&quot;&gt;
          &lt;b-nav-form&gt;
            Welcome,&lt;pre&gt; &lt;/pre&gt;&lt;b-form-input size=&quot;sm&quot; class=&quot;mr-sm-2&quot; :value=&quot;name&quot; @input=&quot;updateName&quot; placeholder=&quot;wait a minute...who are you?&quot;&gt;&lt;/b-form-input&gt;
          &lt;/b-nav-form&gt;
        &lt;/b-navbar-nav&gt;
      &lt;/b-collapse&gt;
    &lt;/b-navbar&gt;
  &lt;/div&gt;
&lt;/template&gt;
&lt;script lang=&quot;ts&quot;&gt;
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
    if (!event.includes(',') &amp;&amp; event.trim().length) this.debounceReconnect();
  }

  debounceReconnect = debounce(this.reconnect, 500);

  async reconnect() {
    let currentlyIsHost = store.state.name === store.state.host;
    await store.dispatch('disconnect');
    await store.dispatch('connect', currentlyIsHost);
  }

}
&lt;/script&gt;</code></pre>
    </details>
    <details>
      <summary>Stylesheet</summary>
      <pre><code>html, body {
  height: 100%;
}

$primary: rgb(175, 175, 175);
$secondary: darkred;

.list-group-item.active {
  background-color: $secondary !important;
}

.list-group-item.active > .make-host {
  background-color: $primary !important;
  color: $secondary !important;
}

pre code {
  color: #e83e8c !important
}</code></pre>
    </details>
    <details>
      <summary>Deploy script</summary>
      <pre><code>/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-nocheck
const execa = require("execa");
const fs = require("fs");

(async () => {
  try {
    console.log('Creating branch...');
    await execa("git", ["checkout", "--orphan", "gh-pages"]);
    console.log("Building...");
    await execa("npm", ["run", "build"]);
    // Understand if it's dist or build folder
    console.log('Getting folder...');
    const folderName = fs.existsSync("dist") ? "dist" : "build";
    console.log('Adding changes...');
    await execa("git", ["--work-tree", folderName, "add", "--all"]);
    console.log('Committing changes...');
    await execa("git", ["--work-tree", folderName, "commit", "-m", "gh-pages"]);
    console.log("Pushing to gh-pages...");
    await execa("git", ["push", "origin", "HEAD:gh-pages", "--force"]);
    console.log('Deleting branch files...');
    await execa("rm", ["-r", folderName]);
    console.log('Checking out master...');
    await execa("git", ["checkout", "-f", "master"]);
    console.log('Removing branch..');
    await execa("git", ["branch", "-D", "gh-pages"]);
    console.log("Successfully deployed");
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
})();
</code></pre>
    </details>
    Still not enough code? See the full source for the website and server on <a class="text-secondary" href="https://github.com/hsscholarbowl">GitHub</a>
  </div>
</template>