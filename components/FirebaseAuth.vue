<template>
  <div id="firebaseui-auth-container" />
</template>

<script>
import * as firebaseui from 'firebaseui'
import { auth, authProviders } from '~/plugins/firebase'
export default {
  name: 'FirebaseAuth',
  mounted() {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        // const firebaseui = require('firebaseui')
        const ui =
          firebaseui.auth.AuthUI.getInstance() ||
          new firebaseui.auth.AuthUI(auth)

        const config = {
          signInOptions: [authProviders.Email, authProviders.Google],
          callbacks: {
            signInSuccessWithAuthResult: () => {
              window.location.href = '/'
              return false
            }
          },
          signInSuccessUrl: '/',
          signInFlow: 'popup'
        }

        ui.start('#firebaseui-auth-container', config)
      } else {
        this.$router.push('/')
      }
    })
  }
}
</script>
