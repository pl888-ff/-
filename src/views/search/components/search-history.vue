<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('clear-search-histories')">全部删除</span>
        &nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>

      <van-icon name="delete" @click="isDeleteShow = true" v-else />
    </van-cell>
    <van-cell
      :title="item"
      v-for="(item, index) in searchHistories"
      :key="index"
      @click="onSearchItemClick(item, index)"
    >
      <van-icon name="close" v-if="isDeleteShow" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'searchHistory',
  data () {
    return {
      isDeleteShow: false // 控制删除按钮的显示与影藏
    }
  },
  props: {
    // prop数据
    //  prop是受父组件数据的影响
    // 如果是普通数据（数字，字符串，布尔值）绝对不能修改
    // 即使该了也不会传到给父组件
    //  如果是引用数据类型（数组，对象）
    //  可以修改例如push等
    //  不能重新赋值   xxx =  []
    searchHistories: {
      type: Array,
      required: true
    }
  },
  created () {},
  mounted () {},
  methods: {
    onSearchItemClick (item, index) {
      if (this.isDeleteShow) {
        // 删除操作
        this.searchHistories.splice(index, 1)
      } else {
        // 非删除操作
        // 通过子组件向父组件传值触发搜索功能
        this.$emit('search', item)
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
