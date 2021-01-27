<template>
  <div class="home-container">
    <!-- 导航栏开始 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        slot="title"
        icon="search"
        class="search-btn"
        type="info"
        size="small"
        round
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- 导航栏结束 -->

    <!-- 【频道；列表
    通过 animated 属性可以开启切换标签内容时的转场动画。
    通过 swipeable 属性可以开启滑动切换标签页。
    -->
    <van-tabs v-model="active" animated swipeable class="channel-tabs">
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <!-- 子组件插槽 -->
        <article-list :channel="channel" />
        <!-- /子组件插槽 -->
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div
        slot="nav-right"
        class="hamburger-btn"
        @click="isChennelEditShow = true"
      >
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- /【频道；列表 -->

    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="isChennelEditShow"
      closeable
      position="bottom"
      close-icon-position="top-left"
      :style="{ height: '100%' }"
    >
      <channel-edit
        :my-channels="channels"
        :active="active"
        @update-active="onUpdateActive"
      />
    </van-popup>
    <!-- /频道编辑弹出层 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
// 导入文章列表组件
import ArticleList from './compoent/article-list'

import ChannelEdit from './compoent/channel-edit'

export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 1,
      channels: [], // 频道列表
      isChennelEditShow: false // 更新频道的展示状态，为false就是关闭
    }
  },
  created () {
    this.loadChannels()
  },
  components: {
    // 注册组件
    ArticleList,
    ChannelEdit
  },
  methods: {
    async loadChannels () {
      try {
        const { data } = await getUserChannels()
        // console.log(data);
        this.channels = data.data.channels
      } catch (err) {
        this.$toast('失败')
      }
    },
    onUpdateActive (a, isChennelEditShow = true) {
      // console.log(a);
      // 更新激活的频道项
      this.active = a

      // 关闭编辑频道碳层
      this.isChennelEditShow = isChennelEditShow
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  margin-bottom: 100px;
  padding-top: 174px;
  // 深度选择器
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfd;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  /deep/ .channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      left: 0;
      right: 0;

      z-index: 1;

      height: 82px;
    }
    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: rgb(61, 48, 48);
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }
    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;
      i.toutiao {
        font-size: 33px;
      }
      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 58px;
        background-image: url(~@/assets/00b52180b048cff51cb2177713751d6.png);
        background-size: contain;
      }
    }
  }
}
</style>
