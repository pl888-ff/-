import axios from 'axios'
import store from '@/store'

const request = axios.create({
  baseURL: 'http://toutiao-app.itheima.net/' // 基础路径

})

// 请求拦截器  目的就是当发起请求时判断是不是需要设置值请求头
// Add a request interceptor
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  // 请求发起会经过这里
  // config配置对象：本次请求的请求配置对象
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 注意：这里务必要返回 config 配置对象，否则请求就停在这里出不去了
  return config
}, function (error) {
  // Do something with request error
  // 如果请求出错（还没发出）会经过这里
  return Promise.reject(error)
})

// 响应拦截器

export default request
