<template lang="pug">
  v-dialog(v-model="dialog")
    v-card(style="height:90vh;")
      v-card-title.headline {{day}}曜日 {{period}}限目
      v-card-text
        v-text-field(v-model="name" append-icon="mdi-magnify" label="授業名/教授名"  hide-details outlined)
        v-row(align="center")
          //- v-col(class="d-flex" cols="6" sm="4")
          //-   v-select(:items="items" label="年度" outlined hide-details)
          v-col(class="d-flex" cols="5")
            v-select(:items="items" label="キャンパス" outlined hide-details)
          //- v-col(class="d-flex" cols="6" sm="4")
          //-   v-select(:items="items" label="学期" outlined hide-details)
          v-col(class="d-flex" cols="5")
            v-select(:items="items" label="学部" outlined hide-details)
          v-col(class="d-flex" cols="2")
            v-btn(@click="search()" class="primary") 検索
        v-divider
      v-card-text(v-show="courses.length !== 0").scrollable
        v-list(two-line)
          v-list-item-group(multple actve-class="pink--text")
            template(v-for="course in courses")
              v-list-item(:key="course.roomId" @click="handleClick(course)")
                template(v-slot:default="{active,toggle}")
                  v-list-item-content
                    v-list-item-subtitle.mb-2 {{course.campus}}/{{course.faculty}}
                    v-list-item-title(v-text="course.name")
                    v-list-item-subtitle(v-text="professors(course)")
              v-divider
      v-card-text(v-show="courses.length === 0")
        .text-center
          p 検索してください
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { userStore } from '../store'
import { db } from '~/plugins/firebase'
import client from '~/plugins/algolia'
interface Course {
  roomId: string
  name: string
  professor: string[]
  day: string
  period: string
  sem: string
  campus: string
  faculty: string
}
const index = client.initIndex('rikkyo_2020')
@Component
export default class Search extends Vue {
  dialog = false
  day = ''
  period = ''
  sum = ''
  year = ''
  items = []
  name = ''
  courses: Array<Course> = []

  professors(course: Course) {
    return course.professor.join(',')
  }

  handleClick(course: Course) {
    db.collection('users')
      .doc(userStore.uid)
      .collection('2020_spring')
      .doc(course.day + '_' + course.period)
      .set({
        roomId: course.roomId,
        name: course.name,
        professor: course.professor,
        day: course.day,
        period: course.period,
        sem: course.sem,
        campus: course.campus,
        faculty: course.faculty
      })
      .then(() => {
        console.log('success')
      })
    this.dialog = false
  }

  async search() {
    await index
      .search(this.name, {
        filters: `period:${this.period} AND day:${this.day}`
      })
      .then((res) => {
        this.courses = []
        res.hits.forEach((data) => {
          this.courses.push({
            roomId: data.objectID,
            name: data.name,
            professor: data.professor,
            day: data.day,
            period: data.period,
            sem: data.sem,
            campus: data.campus,
            faculty: data.facluty
          })
        })
      })
  }
}
</script>

<style scoped>
.scrollable {
  overflow: auto;
  height: 65%;
}
</style>
