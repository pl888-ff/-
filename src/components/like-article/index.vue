<template>
  <van-button
    :icon="value === 1 ? 'good-job' : 'good-job-o'"
    :class="{
      liked: value === 1,
    }"
    :loading="loading"
    @click="onCollect"
  />
</template>

<script>
import { addLike, deleteLike } from '@/api/article'
export default {
  name: 'likeArticle',
  data () {
    return {
      loading: false
    }
  },
  props: {
    value: {
      type: Number,
      required: true
    },
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  created () {},
  mounted () {},
  methods: {
    async onCollect () {
      this.loading = true
      try {
        let status = -1
        if (this.value === 1) {
          //  点赞了，要取消点赞
          await deleteLike(this.articleId)
        } else {
          //  没点赞，要点赞
          await addLike(this.articleId)
          status = 1
        }
        this.$emit('input', status)
        this.$toast(status === 1 ? '点赞成功' : '取消点赞')
      } catch (err) {
        this.$toast.fail('点赞失败')
      }

      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">
.liked {
  .van-icon {
    color: #e5645f;
  }
}
</style>
