import { userInfo, UserInfo } from 'os'
import { Mutation, Action, VuexModule, Module } from 'vuex-module-decorators'
import { auth, db } from '~/plugins/firebase'

export interface UserState {
  loggedIn: boolean
  token: string
  username: string
  uid: string
  photoURL: string
  takingCourses: { [key: string]: { [key: string]: Course } }
  status: number
  faculty: string
  university_name: string
  university: string
}

interface userInfo {
  status: number
  faculty: string
  university_name: string
  university: string
}
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

@Module({
  name: 'auth',
  namespaced: true,
  stateFactory: true
})
export default class User extends VuexModule implements UserState {
  loggedIn = false
  token = localStorage.getItem('token') || ''
  username = ''
  uid = ''
  photoURL = ''
  faculty = ''
  status = 1
  university_name = ''
  university = ''
  takingCourses = {
    '2020_spring': {},
    '2020_fall': {}
  }

  @Mutation
  public SET_USER(user: firebase.User) {
    this.loggedIn = true
    if (user.displayName != null) {
      this.username = user.displayName
    }
    if (user.photoURL != null) {
      this.photoURL = user.photoURL
    }
    this.uid = user.uid
  }

  @Mutation
  public SET_COURSES(course: { [key: string]: Course }) {
    this.takingCourses['2020_spring'] = {
      ...this.takingCourses['2020_spring'],
      ...course
    }
  }

  @Mutation
  public DELETE_COURSE(courseId: string) {
    const course = this.takingCourses['2020_spring']
    delete course[courseId]
    this.takingCourses['2020_spring'] = {
      ...course
    }
  }

  @Mutation
  public SET_USERINFO(userInfo: userInfo) {
    this.university = userInfo.university
    this.status = userInfo.status
    this.university_name = userInfo.university_name
    this.faculty = userInfo.faculty
  }

  @Mutation
  public LOGOUT() {
    this.loggedIn = false
    this.username = ''
  }

  @Action({})
  public getUser(user: firebase.User) {
    this.SET_USER(user)
  }

  @Action({ rawError: true })
  public getCourses() {
    db.collection('users')
      .doc(this.uid)
      .collection('2020_spring')
      .onSnapshot((snapshot) => {
        const courses = {}
        snapshot.docChanges().forEach((change) => {
          if (change.type == 'added') {
            const course = change.doc.data()
            courses[change.doc.id] = course
          }
        })
        this.context.commit('SET_COURSES', courses)
      })
  }

  @Action({})
  public logout() {
    auth.signOut().then(() => {
      this.LOGOUT()
    })
  }
}
