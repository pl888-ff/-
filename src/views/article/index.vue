<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back()"
    >
    </van-nav-bar>

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>

          <follow-user
            class="followed-btn"
            :is-followed="article.is_followed"
            :user-id="article.aut_id"
            @update-is_followed="article.is_followed = $event"
          />
          <!-- <van-button
            v-if="article.is_followed"
            class="follow-btn"
            round
            size="small"
            @click="onFollow"
            :loading="followLoading"
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
            :loading="followLoading"
            >关注</van-button
          > -->
        </van-cell>

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 评论列表 -->
        <comment-list
          :source="article.art_id"
          @onload-success="countTotal = $event.total_count"
          :list="commentList"
        />
        <!-- /评论列表 -->

        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostShow = true"
            >写评论</van-button
          >
          <van-icon name="comment-o" :badge="countTotal" color="#777" />
          <Collect-article
            class="btn-item"
            v-model="article.is_collected"
            :article-id="article.art_id"
          />
          <!-- <van-icon color="#777" name="star-o" /> -->
          <like-article
            class="btn-item"
            v-model="article.attitude"
            :article-id="article.art_id"
          />
          <!-- <van-icon color="#777" name="good-job-o" /> -->
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- 弹出层 -->
        <van-popup v-model="isPostShow" position="bottom">
          <comment-post
            :target="article.art_id"
            @post-success="onPostSuccess"
          />
        </van-popup>
        <!-- /弹出层 -->
      </div>

      <!-- 加载失败：404 -->
      <div v-else-if="errStatus === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
// import JSONBig from 'json-bigint'
import { ImagePreview } from 'vant'

import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import likeArticle from '@/components/like-article'

import CommentList from './components/comment-list'
import CommentPost from './components/comment-post'

import { deleteFollow, addFollow } from '@/api/user'
export default {
  name: 'articleContainer',
  data () {
    return {
      article: {}, // 文章详情
      loading: true, // 加载中的loading状态
      errStatus: 0, // 失败的状态码
      followLoading: false,
      countTotal: 0,
      isPostShow: false, // 控制写评论的对话框的显示与影藏
      commentList: [] // 评论列表，子组件来的
    }
  },
  components: {
    FollowUser,
    CollectArticle,
    likeArticle,
    CommentList,
    CommentPost
  },
  // 使用组件props解耦
  props: {
    articleId: {
      // 双类型，因为直接从页面跳转到详情，传递的是数字，从导航栏进去的传递的是字符串
      type: [String, Number],
      required: true
    }
  },
  created () {
    this.loadArticle()
  },
  mounted () {},
  methods: {
    async loadArticle () {
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)

        // if (Math.random() > 0.5) {
        //   JSON.parse("wjeiocniew");
        // }

        // console.log(data);
        this.article = data.data

        // 获取所有的图片节点
        // this.$refs 可以操作dom元素
        // 因为数据驱动视图不是立即执行的，有延迟也就是异步，所以需要设置延时器
        setTimeout(() => {
          // 获取所有的dom元素
          // console.log();
          // 拿到所有的img节点
          this.previewImg()
        }, 0)
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
        console.log('获取失败')
      }
      // 加载完成关闭Loading,不管是成功还是失败
      this.loading = false
    },
    previewImg () {
      // 获取所有的dom元素
      const articleContent = this.$refs['article-content']
      // 通过webapi的选择器，选择所有的img
      const imags = articleContent.querySelectorAll('img')
      // console.log(imags);
      const imagsUrl = []

      // 遍历的到的imgs
      imags.forEach((img, index) => {
        // console.log(img.src);
        imagsUrl.push(img.src)
        img.onclick = () => {
          ImagePreview({
            // 预览图片的地址数组
            images: imagsUrl,
            // 起始位置，从0开始
            startPosition: index
          })
        }
      })
    },

    async onFollow () {
      this.followLoading = true
      try {
        if (this.article.is_followed) {
          // 关注   取消关注用户
          const { data } = await deleteFollow(this.article.aut_id)
          console.log(data)
        } else {
          // 没有关注   要关注
          const { data } = await addFollow(this.article.aut_id)
          console.log(data)
        }
        // 给这个状态取反
        this.article.is_followed = !this.article.is_followed

        this.followLoading = false
      } catch (err) {
        let message = '操作失败！请重试'
        if (err.response && err.response.status === 400) {
          message = '你不能关注你自己'
        }
        this.$toast(message)
      }
    },
    // 评论事件函数
    onPostSuccess (data) {
      // 关闭弹出层
      this.isPostShow = false
      // 放置最新的评论
      // 父组件操作子组件的数据，可以在vuex容器中操作，也可以在子组件中设置props将需要用到的数据传进来
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>

<style scoped lang="less">
@import "./github-markdown.css";
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/.van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
