<template lang="pug">
div
  v-card
    v-app-bar(color="white" flat)
      v-tabs
        v-tab 春学期
        v-tab 秋学期
      v-spacer
        v-tooltip(bottom)
          template(v-slot:activator="{on}")
            v-btn(dark fab v-on="on" @click="onEdit()")
              v-icon mdi-pencil
          span 時間割を編集
    v-divider
    v-card-text
      table
        tr(height="5vh")
          th(width="10%") 時間
          th(width="15%" v-for="day in days") {{day}}
        tr.text-center(v-for="period in periods")
          td {{period}}
          td(v-for="day in days")
            v-hover(v-slot:default="{ hover }" :disabled="!edit" v-if="!!courses[`${day}_${period}`]")
              v-card(color="red" height="12.5vh" :elevation="hover ? 16 : 2")
                v-card-text
                  p.white--text.font-weight-black {{courses[`${day}_${period}`].name}}
                v-overlay(absolute :value="hover")
                  v-btn(outlined fab @click="deleteCourse(`${day}_${period}`)")
                    v-icon mdi-close
            v-hover(v-slot:default="{ hover }" v-else v-show="edit")
              v-card(@click="handleEdit(period, day)" height="12.5vh" :elevation="hover ? 16 : 2").edit
                v-card-text
                  v-icon(x-large) mdi-plus
  search(ref="search")
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { userStore } from '~/store'
import { db } from '~/plugins/firebase'
@Component({
  components: {
    Search: () => import('~/components/search.vue')
  }
})
export default class extends Vue {
  edit = false
  dialog = false
  selectedPeriod = ''
  selectedDay = ''
  periods = ['１', '２', '３', '４', '５', '６']
  days = ['月', '火', '水', '木', '金', '土']

  get courses() {
    return userStore.takingCourses['2020_spring']
  }

  onEdit() {
    this.edit = !this.edit
  }

  handleEdit(period, day) {
    this.$refs.search.dialog = true
    this.$refs.search.period = period
    this.$refs.search.day = day
    this.$refs.search.search()
  }

  deleteCourse(id: string) {
    db.collection('users')
      .doc(userStore.uid)
      .collection('2020_spring')
      .doc(id)
      .delete()
      .then(() => {
        userStore.DELETE_COURSE(id)
      })
  }
}
</script>

<style scoped>
table {
  width: 100%;
  height: 80vh;
  border-collapse: separate;
  border-spacing: 5px;
  margin: 0 auto;
}

tr.text-center td {
  height: 12.5vh;
}

.edit {
  display: flex;
  justify-content: center;
  align-items: center;
}

@media screen and (max-width: 768px) {
  p {
    font-size: 0.5em;
  }
  td .v-card .v-card__text {
    padding: 0 1px;
  }
  td .v-card {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
