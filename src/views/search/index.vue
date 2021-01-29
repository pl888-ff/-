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

    <search-history v-else />
    <!-- /搜索历史记录 -->
  </div>
</template>

<script>
import searchHistory from './components/search-history'
import searchSuggestion from './components/search-suggestion'
import searchResult from './components/search-result'
export default {
  name: 'searchIndex',
  data () {
    return {
      searchText: '',
      isResultShow: false // 控制搜索结果的展示
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
      this.searchText = val
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
