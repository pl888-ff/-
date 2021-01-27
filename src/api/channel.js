//  获取全部频道列表的数据

import request from '@/utils/request'

export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: 'v1_0/channels'
  })
}
