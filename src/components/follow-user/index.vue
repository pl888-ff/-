<template>
  <van-button
    v-if="isFollowed"
    class="follow-btn"
    round
    size="small"
    @click="onFollow"
    :loading="loading"
    >已关注</van-button
  >
  <van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    @click="onFollow"
    :loading="loading"
    >关注</van-button
  >
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'
export default {
  name: 'FollowUser',
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
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
    async onFollow () {
      this.loading = true
      try {
        if (this.isFollowed) {
          // 关注   取消关注用户
          await deleteFollow(this.userId)
          // console.log(data);
        } else {
          // 没有关注   要关注
          await addFollow(this.userId)
          // console.log(data);
        }
        // 给这个状态取反
        // this.article.is_followed = !this.article.is_followed;
        this.$emit('update-is_followed', !this.isFollowed)

        this.loading = false
      } catch (err) {
        let message = '操作失败！请重试'
        if (err.response && err.response.status === 400) {
          message = '你不能关注你自己'
        }
        this.$toast(message)
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
