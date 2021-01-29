<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(text, index) in Suggestions"
      :key="index"
      @click="$emit('search', text)"
    >
      <div slot="title" v-html="highlight(text)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestion } from '@/api/search'
import { debounce } from 'lodash'
export default {
  name: 'searchSuggestion',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      Suggestions: [], // 请求回来的搜索建议的数据
      htmlStr: ''
    }
  },
  created () {},
  mounted () {},
  watch: {
    searchText: {
      // 当searchText发生改变时就会调用handler函数
      // value是从父组件拿到的值   handler是固定写法
      handler: debounce(function (value) {
        // console.log(value);
        this.loadSearchSuggestions(value)
      }, 200),
      // handler(value) {
      //   // console.log(value);
      //   // 将输入框的数据value通过传参的形式传递给服务器
      //   // this.loadSearchSuggestions(value);
      // },
      // 该回调将会在侦听开始之后被立即调用
      immediate: true
    }
  },
  methods: {
    async loadSearchSuggestions (q) {
      try {
        // 服务器通过接受到的q，返回数据
        const { data } = await getSearchSuggestion(q)
        this.Suggestions = data.data.options
      } catch (err) {
        this.$toast('获取失败')
      }
    },

    highlight (text) {
      // console.log(text);
      // 定义高亮的字符串
      const highlightStr = `<span class='active'>${this.searchText}</span>`

      // 定义一个正则匹配函数
      // 如果单独在字符串的操作方法中定义正则，无法对正则匹配内容做判断，需要自定义正则表达式构造函数
      // RegExp 正则表达式构造函数
      //  参数1：匹配模式字符串，他会根据这个字符串创建正则对象
      //  参数2：匹配模式，要写到字符串中
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, highlightStr)
    }
  }
}
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>
