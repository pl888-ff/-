//  文章列表的获取

import request from '@/utils/request'

/**
 * 获取频道的文章列表
 */

export const getArticles = params => {
  return request({
    method: 'GET',
    url: 'v1_1/articles',
    params
  })
}

/**
 * 获取文章
 */

export const getArticleById = (articleId) => {
  return request({
    method: 'GET',
    url: `v1_0/articles/${articleId}`

  })
}
