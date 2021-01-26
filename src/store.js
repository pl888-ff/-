// import { from } from 'core-js/fn/array'
import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from './utils/storage'

Vue.use(Vuex)

const TOKEN_KEY = 'TOUTIAO_USER'
export default new Vuex.Store({
  state: {
    // user是用来存储当前登录用户的信息数据，是一个对象，比如token ,
    // 这里读到的数据是字符串，需要转换为对象格式
    user: getItem(TOKEN_KEY)
    // user: null
  },
  mutations: {
    setUser (state, data) {
      state.user = data
      // 为了防止浏览器刷新数据丢失，需要将获取的数据存储到本地
      // 存储到本地的数据只能以字符串存储，需要转换
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(state.user))
      setItem(TOKEN_KEY, state.user)
    }
  },
  actions: {

  }
})
