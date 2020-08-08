/* eslint-disable no-console */

import { register } from 'register-service-worker'
import store from '@/store';

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered () {
      console.log('Service worker has been registered.')
    },
    cached () {
      store.commit('addAlert', 'The site has been cached, so you can view it offline (hint: you\'ll need to add it to the home screen or install it as an app first)')
      console.log('Content has been cached for offline use.')
    },
    updatefound () {
      store.commit('addAlert', 'Downloading new content')
      console.log('New content is downloading.')
    },
    updated () {
      store.commit('addAlert', 'There\'s new content available! Please reload the page')
      console.log('New content is available; please refresh.')
    },
    offline () {
      store.commit('addAlert', 'No internet connection. You\'re running in offline mode. Although you can\'t connect and buzz, you can still click the buttons and change your name')
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      store.commit('addAlert', 'There was an error registering a server worker - don\'t worry, this just means the site won\'t load offline')
      console.error('Error during service worker registration:', error)
    },
  })
}
