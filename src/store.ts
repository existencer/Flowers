import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const resources = [
  require('@/assets/hills_rt.jpg'),
  require('@/assets/hills_lf.jpg'),
  require('@/assets/hills_up.jpg'),
  require('@/assets/hills_dn.jpg'),
  require('@/assets/hills_bk.jpg'),
  require('@/assets/hills_ft.jpg')
]

export default new Vuex.Store({
  state: {
    complete: false as boolean,
    assets: [] as HTMLImageElement[]
  },
  mutations: {

  },
  actions: {
    loadResource({ state }): void {
      const promiseList: Array<Promise<undefined>> = []
      for (const url of resources) {
        const img = new Image()
        img.src = url
        promiseList.push(new Promise((resolve, _) => {
          img.onload = () => {resolve()}
        }))
        state.assets.push(img)
      }
      Promise.all(promiseList).then(() => {
        state.complete = true
      })
    }
  }
})
