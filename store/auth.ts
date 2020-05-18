import { Mutation, Action, VuexModule, Module } from 'vuex-module-decorators'
import { auth } from '~/plugins/firebase'

export interface UserState {
  loggedIn: boolean
  token: string
  username: string
  uid: string
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

  @Mutation
  public SET_USER(user: firebase.User) {
    this.loggedIn = true
    if (user.displayName != null) {
      this.username = user.displayName
    }
    this.uid = user.uid
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

  @Action({})
  public logout() {
    auth.signOut().then(() => {
      this.LOGOUT()
    })
  }
}
