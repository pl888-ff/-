<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
    >
      <van-cell
        v-for="(article, index) in list"
        :key="index"
        :title="article.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'searchIndex',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 20,
      error: false // 控制列表加载状态失败的提示状态
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      try {
        // 1 请求获取数据
        const { data } = await getSearchResult({
          page: this.page, // 页数
          per_page: this.perPage, // 每页数量
          q: this.searchText //	搜索关键词
        })
        const { results } = data.data
        // console.log(data);
        // 2  将数据添加到列表中
        this.list.push(...results)
        // 将本次加载中的loading关闭
        this.loading = false
        // 4  判断是否还有数据
        if (results.length) {
          // 有数据，则更新获取下一页的页码
          this.page++
        } else {
          // 没有，则将加载状态结束
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
        this.$toast('获取数据失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
