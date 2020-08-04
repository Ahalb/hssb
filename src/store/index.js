import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        name: '',
        alerts: [],
        connectionState: 'Disconnected',
        isHost: false,
        connection: new WebSocket('ws://scholar-bowl-server.herokuapp.com', 'echo-protocol'),
        activeBuzzer: null,
        onlineList: [],
    },
    mutations: {
        setName(state, name) {
            state.name = name;
            localStorage.hasName = name;
        },
        addAlert(state, name) {
            state.alerts.push(name);
        },
        removeAlert(state, name) {
            state.alerts = state.alerts.filter(e => e !== name);
        },
        changeConnectionState(state, to) {
            state.connectionState = to;
        },
        setHost(state, to) {
            state.isHost = to;
        },
        setConnection(state, connection) {
            state.connection = connection;
        },
        setBuzzer(state, to) {
            state.activeBuzzer = (to === 'null' ? null : to);
        },
        setOnline(state, to) {
            state.onlineList = to;
        }
    },
    actions: {
        start({ commit }) {
            if (!localStorage) {
                alert("Your browser doesn't support local storage - that's an issue. Please use a modern browser that does");
                return;
            }
            if (localStorage.hasName) {
                commit('setName', localStorage.hasName);
            }
            else {
                commit('setName', prompt('What name would you like to use?'));
            }
        },
        async connect({ commit, dispatch }, host = false) {
            commit('changeConnectionState', 'Connecting...');
            dispatch('join');
            commit('setHost', host);
        },
        async disconnect({ commit, state }) {
            state.connection.close();
            commit('changeConnectionState', 'Disconnected');
        },
        buzz({ state, commit }) {
            if (state.activeBuzzer === null) {
                state.connection.send(`buzz ${state.name}`);
                commit('setBuzzer', state.name);
                commit('addAlert', 'You buzzed');
            }
            else
                commit('addAlert', `${state.activeBuzzer === state.name ? 'You have' : `${state.activeBuzzer} has`} already buzzed`);
        },
        clear({ state, commit }) {
            state.connection.send('clear');
            commit('setBuzzer', 'null');
            commit('addAlert', 'You cleared');
        },
        async join({ commit, dispatch, state }) {
            let connection = new WebSocket('ws://scholar-bowl-server.herokuapp.com', 'echo-protocol');
            connection.onopen = (e) => {
                commit('changeConnectionState', 'Connected');
            };
            connection.onclose = (e) => {
                commit('addAlert', `Connection ${e.wasClean ? '' : '(not cleanly) '}closed: ${e.reason}`);
            };
            connection.onmessage = (e) => {
                let msg = e.data;
                if (msg.startsWith('buzz')) {
                    let from = msg.replace(/^buzz /, '');
                    dispatch('onBuzz', from);
                }
                else if (msg.startsWith('clear')) {
                    dispatch('onClear');
                }
                else if (msg.startsWith('names')) {
                    connection.send(`name ${state.name}`);
                }
                else if (msg.startsWith('host')) {
                    let host = msg.replace(/^host /, '');
                    if (host === state.name) {
                        this.commit('setHost', true);
                    }
                }
                else if (msg.startsWith('online')) {
                    let online = msg.replace(/^online /, '').split(',');
                    this.commit('setOnline', online);
                }
                else {
                    commit('addAlert', `Unknown message type: ${msg}`);
                }
            };
            connection.onerror = (e) => {
                commit('addAlert', `ERROR: ${e}`);
                console.error('error', e);
            };
            commit('setConnection', connection);
        },
        onBuzz({ commit }, from) {
            commit('addAlert', `${from} buzzed`);
            commit('setBuzzer', from);
        },
        onClear({ commit }) {
            commit('addAlert', `Clear`);
            commit('setBuzzer', 'null');
        }
    },
    modules: {},
});
//# sourceMappingURL=index.js.map