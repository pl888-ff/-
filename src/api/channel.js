//  获取全部频道列表的数据

import request from '@/utils/request'

// 获取用户列表数据
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: 'v1_0/channels'
  })
}

// 添加用户列表数据
export const addUserChannels = channel => {
  return request({
    method: 'PATCH',
    url: 'v1_0/user/channels',
    data: {
      channels: [channel]
    }
  })
}

// 删除用户列表数据
export const removeUserChannels = channel => {
  return request({
    method: 'DELETE',
    url: `v1_0/user/channels/${channel}`

  })
}
