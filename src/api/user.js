// 用户请求模块

import request from '@/utils/request'
// 导入store
// import store from '@/store'

// 单独封装一个文件，便于维护
export const login = data => {
  return request({
    method: 'POST',
    url: 'v1_0/authorizations',
    data
  })
}
// 发送验证码
export const sendSms = mobile => {
  return request({
    method: 'GET',
    url: `v1_0/sms/codes/${mobile}`

  })
}

// 获取用户信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: `v1_0/user`
    // 需要添加请求头，改接口需要授权才能使用，也解决了token失效的问题
    // headers: {
    //     Authorization: `Bearer ${store.state.user.token}`
    // }

  })
}

// 获取用户频道列表
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: `v1_0/user/channels`
  })
}

// 关注用户
export const addFollow = (target) => {
  return request({
    method: 'POST',
    url: `v1_0/user/followings`,
    data: {
      target
    }
  })
}

// 取消关注用户
export const deleteFollow = (target) => {
  return request({
    method: 'DELETE',
    url: `v1_0/user/followings/${target}`

  })
}

// 获取用户个人资料
export const getUserProfile = (target) => {
  return request({
    method: 'GET',
    url: `v1_0/user/profile`

  })
}

// 编辑用户个人资料
export const updateUserProfile = (data) => {
  return request({
    method: 'PATCH',
    url: `v1_0/user/profile`,
    data
  })
}
