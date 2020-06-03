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

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  components: {
    Header: () => import('~/components/layout/Header.vue')
  },
  middleware: ['auth']
})
export default class extends Vue {}
</script>

<style scoped>
.bg {
  height: 100%;
  width: 100vw;
  background-image: linear-gradient(to top, #fad0c4 0%, #ffd1ff 100%);
}
</style>
