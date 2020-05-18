<template>
  <firebase-auth />
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
