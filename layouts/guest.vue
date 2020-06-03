<template>
  <v-app dark>
    <div class="bg">
      <Header />
      <v-content>
        <v-container>
          <nuxt />
        </v-container>
      </v-content>
    </div>
  </v-app>
</template>

<script>
export default {
  components: {
    Header: () => import('~/components/layout/Header.vue')
  }
}
</script>

<style scoped>
.bg {
  height: 100vh;
  width: 100vw;
  background-image: linear-gradient(to top, #fad0c4 0%, #ffd1ff 100%);
}
</style>
