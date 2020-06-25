<template>
  <v-app dark>
    <div class="bg">
      <Header />
      <v-content>
        <v-container>
          <nuxt />
        </v-container>
      </v-content>
      <Footer />
    </div>
  </v-app>
</template>

<script>
export default {
  components: {
    Header: () => import('~/components/layout/Header.vue'),
    Footer: () => import('~/components/layout/Footer.vue')
  }
}
</script>

<style scoped>
.bg {
  height: 100%;
  width: 100vw;
  background-image: linear-gradient(to top, #fad0c4 0%, #ffd1ff 100%);
}
</style>
