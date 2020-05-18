import { Store } from 'vuex'
import { initialiseStores } from '~/utils/store-accessor'
/* eslint @typescript-eslint/no-explicit-any: 0 */
const initializer = (store: Store<any>) => initialiseStores(store)

export const plugins = [initializer]
export * from '~/utils/store-accessor'
