import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name: '',
    alerts: [] as string[],
    connectionState: 'Disconnected',
    isHost: false,
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
    setHost(state, to) {
      state.isHost = to;
      if (to) {
        state.host = state.name;
      }
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
    addHost(state, user) {
      state.host = user;
      state.isHost = state.name === state.host;
    },
    updateHosts(state) {
      state.isHost = state.name === state.host;
    },
  },
  actions: {
    start({ commit }) {
      if (!localStorage) {
        alert("Your browser doesn't support local storage - that's an issue. Please use a modern browser that does");
        return;
      }
      let name: string;
      if (localStorage.hasName) {
        name = JSON.parse(localStorage.hasName);
      } else {
        name = prompt('What name would you like to use?')?.trim() || ''
      }
      commit('setName', name?.length ? name : 'Anonymous');
    },
    async connect({ commit, dispatch }, host = false) {
      commit('changeConnectionState', 'Connecting...')
      commit('setHost', host)
      commit('updateHosts')
      dispatch('join')
    },
    async disconnect({ commit, state }) {
      state.connection.close();
      commit('changeConnectionState', 'Disconnected')
    },
    buzz({ state, commit }) {
      if (state.activeBuzzer === null) {
        state.connection.send(`buzz ${state.name}`)
        commit('setBuzzer', state.name);
        commit('addAlert', 'You buzzed');
      } else commit('addAlert', `${state.activeBuzzer === state.name ? 'You have' : `${state.activeBuzzer} has`} already buzzed`);
    },
    clear({ state, commit }) {
      state.connection.send('clear')
      commit('setBuzzer', 'null');
      commit('addAlert', 'You cleared');
    },
    async join({ commit, dispatch, state }) {
      let connection = new WebSocket('wss://scholar-bowl-server.herokuapp.com', 'echo-protocol');
      connection.onopen = (e) => {
        commit('changeConnectionState', 'Connected')
        if (state.isHost) connection.send(`host ${state.name}`)
        commit('updateHosts')
      }
      connection.onclose = (e) => {
        commit('addAlert', `Connection ${e.wasClean ? '' : '(not cleanly) '}closed: ${e.reason}`)
      };
      connection.onmessage = (e) => {
        let msg = e.data as string;
        if (msg.startsWith('buzz')) {
          let from = msg.replace(/^buzz /, '')
          dispatch('onBuzz', from);
        } else if (msg.startsWith('clear')) {
          dispatch('onClear');
        } else if (msg.startsWith('names')) {
          connection.send(`name ${state.name}`);
        } else if (msg.startsWith('host')) {
          let host = msg.replace(/^host /, '');
          if (host === state.name) {
            commit('setHost', true);
            commit('addAlert', 'You are now the host')
          }
          commit('addHost', host);
          commit('updateHosts')
        } else if (msg.startsWith('online')) {
          let online = msg.replace(/^online /, '').split(',');
          commit('setOnline', online);
          commit('updateHosts')
          if (state.isHost) connection.send(`host ${state.name}`)
        } else {
          commit('addAlert', `Unknown message type: ${msg}`);
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
      state.connection.send(`host ${user}`);
      commit('addHost', user);
      commit('setHost', user === state.name)
      commit('updateHosts')
    },
    triggerOnline({ state }) {
      state.connection.send(`name ${state.name}`)
    }
  },
  modules: {
  },
})