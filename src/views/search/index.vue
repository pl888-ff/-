<template>
  <div class="search-container">
    <!-- 搜索框 -->
    <!--
      search 事件在点击键盘上的搜索/回车按钮后触发
      cancel 事件在点击搜索框右侧取消按钮时触发。
       在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。
     -->
    <form action="/" class="search-form">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#2892ff"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>
    <!-- /搜索框 -->

    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :search-text="searchText" />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    />
    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->

    <search-history
      v-else
      :search-histories="searchHistories"
      @clear-search-histories="searchHistories = []"
      @search="onSearch"
    />
    <!-- /搜索历史记录 -->
  </div>
</template>

<script>
import searchHistory from './components/search-history'
import searchSuggestion from './components/search-suggestion'
import searchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'
export default {
  name: 'searchIndex',
  data () {
    return {
      searchText: '',
      isResultShow: false, // 控制搜索结果的展示
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || [] // 搜索历史记录  从本地拿数据，有数据就用数据，没有就初始化为空数组
    }
  },
  watch: {
    // watch函数中监听searchHistories数组的变化，不管是添加操作还是删除操作只要值发生变化就会触发这个函数
    /***
     * 原本的函数是  searchHistories:{
     *                  handele(){
     * }
                    }
     */
    searchHistories (value) {
      // console.log(value);
      setItem('TOUTIAO_SEARCH_HISTORIES', value)
    }
  },
  created () {},
  mounted () {},
  components: {
    searchHistory,
    searchSuggestion,
    searchResult
  },
  methods: {
    onSearch (val) {
      // Toast(val);
      // console.log(val);
      // 更新输入文本框的内容
      this.searchText = val
      // 存储搜索历史记录
      // 要求：数据不重复，最新的排在最前面
      const index = this.searchHistories.indexOf(val)
      //  不等于-1说明有这个数据，需要删除
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      //  追加进数组中
      this.searchHistories.unshift(val)

      // 渲染搜索结果
      this.isResultShow = true
    },
    onCancel () {
      // Toast('取消');
      console.log('onCancel')
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less">
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
