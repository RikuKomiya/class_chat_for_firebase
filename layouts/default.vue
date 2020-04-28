<template>
  <v-app dark>
    <Header />
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  components: {
    Header: () => import('~/components/layout/Header.vue')
  }
})
export default class extends Vue {}
</script>
