<template>
  <div class="comment-reply">
    <van-nav-bar
      :title="
        comment.reply_count > 0 ? `${comment.reply_count}条评论` : '暂无评论'
      "
    >
      <!-- 传递一个点击事件告诉父组件关闭弹框 -->
      <van-icon name="cross" slot="left" @click="$emit('close')" />
    </van-nav-bar>

    <div class="scroll-wrap">
      <!-- 当前回复的项 -->
      <!-- 复用item组件需要传递comment，刚好有拿到这个，所以直接传 -->
      <comment-item :comment="comment" />

      <!-- 回复列表 -->
      <van-cell title="全部回复" />
      <comment-list :source="comment.com_id" type="c" :list="commentList" />
      <!-- /回复列表 -->

      <!-- /当前回复的项 -->
    </div>

    <!-- 发布评论 -->
    <div class="post-wrap">
      <van-button class="post-btn" size="small" round @click="isPostShow = true"
        >写评论</van-button
      >
    </div>

    <!-- 发布评论 -->
    <van-popup position="bottom" v-model="isPostShow">
      <!-- :list表示的通过list绑定数据的方式，将commentList传给CommentList -->
      <comment-post :target="comment.com_id" @post-success="onPostSuccess" />
    </van-popup>

    <!-- /发布评论 -->
  </div>
</template>

<script>
// 得到当前评论项的，需要导入封装好的组件
import CommentItem from './comment-item'
import CommentList from './comment-list'

import CommentPost from './comment-post'

export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },

  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isPostShow: false,
      commentList: []
    }
  },
  created () {},
  mounted () {},
  methods: {
    onPostSuccess (data) {
      // 更新回复的数量
      this.comment.reply_count++
      // 关闭弹层
      this.isPostShow = false
      // 将最新的回复内容展示到列表的顶部
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>

<style scoped lang="less">
.scroll-wrap {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto;
}
.post-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  .post-btn {
    width: 60%;
  }
}
</style>
