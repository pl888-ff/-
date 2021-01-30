<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
  >
    <comment-item v-for="(item, index) in list" :key="index" :comment="item" />
    <!-- <van-cell
      v-for="(item, index) in list"
      :key="index"
      :title="item.content"
    /> -->
  </van-list>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'

export default {
  name: 'CommentList',
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      // vue中不允许直接默认赋值，要用到函数的方法调用空对象或者数组
      default: () => []
    }
  },
  data () {
    return {
      // 不会影响到原子组件的数据的使用，data中找不到数据会从props中找数据
      // list: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 10
    }
  },
  components: {
    CommentItem
  },
  created () {
    // 要想要页面一开始就加载评论总数
    // this.onLoad();
  },
  mounted () {},
  methods: {
    async onLoad () {
      try {
        //  请求获取数据
        const { data } = await getComments({
          type: 'a', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source, // 源id，文章id或评论id
          offset: this.offset, // 取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })
        // console.log(11);
        // console.log(data.data);
        // 将数据添加到列表中
        const { results } = data.data
        // 想父组件传数据
        this.$emit('onload-success', data.data)

        this.list.push(...results)
        // 将loading设置为false
        this.loading = false
        // 判断是否还有数据
        if (results.length) {
          //      有就更新获取下一页的数据页码
          this.offset = data.data.last_id
        } else {
          //      没有就将fininshed设置结束
          this.finished = true
        }
      } catch (err) {
        this.$toast('加载失败' + err)
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
