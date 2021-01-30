<template>
  <van-button
    :icon="value ? 'star' : 'star-o'"
    :class="{
      collected: value,
    }"
    :loading="loading"
    @click="onCollect"
  />
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
  name: 'CollectArticle',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  created () {},
  mounted () {},
  methods: {
    async onCollect () {
      this.loading = true
      try {
        if (this.value) {
          // 收藏，要取消收藏
          await deleteCollect(this.articleId)
          // console.log(data);
        } else {
          // 未收藏，要收藏
          await addCollect(this.articleId)
          // console.log(data);
        }
        // 更新视图
        // 用到的input事件，跟父组件的v-model绑定，自动在父组件做好了处理逻辑
        this.$emit('input', !this.value)
        this.$toast(!this.value ? '收藏成功' : '取消收藏')
      } catch (err) {
        this.$toast('收藏失败')
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">
.collected {
  .van-icon {
    color: #ffa500;
  }
}
</style>
