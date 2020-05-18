import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import auth from '~/store/auth.ts'

/* eslint import/no-mutable-exports: 0 */
let userStore: auth

/* eslint @typescript-eslint/no-explicit-any: 0 */
function initialiseStores(store: Store<any>): void {
  userStore = getModule(auth, store)
}

export { initialiseStores, userStore }
