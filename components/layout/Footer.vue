<template lang="pug">
  v-footer(padless dark)
    v-card(flat class="grey lighten-1 white--text text-center" width="100%")
      v-card-text
        v-btn(class="mx-4 white-text" text href="https://forms.gle/ESE5z7PCY11PS8rg9")
          v-icon mdi-email
          |お問い合わせ
        v-btn(class="mx-4 white-text" text href="https://twitter.com/c6b8C1q7XD2zxrz")
          v-icon mdi-twitter
          |公式アカウント
        v-btn(class="mx-4 white-text" text)
          v-icon mdi-newspaper-variant
          |利用規約
      v-divider
      v-card-text
        |2020-ClassChat

</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
@Component
export default class extends Vue {}
</script>
