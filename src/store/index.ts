import Vue from 'vue'
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
})