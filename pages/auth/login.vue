<template lang="pug">
div(style="height: 70vh;")
  firebase-auth.mt-12
</template>

<script>
import FirebaseAuth from '@/components/FirebaseAuth'

export default {
  layout: 'guest',
  name: 'Login',
  components: {
    FirebaseAuth
  }
}
</script>
