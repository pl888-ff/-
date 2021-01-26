<template>
  <div class="my-container">
    <!-- 已登录头部 -->
    <div class="header user-info" v-if="user">
      <!-- 上面部分 -->
      <div class="base-info">
        <!-- 左边部分 -->
        <div class="left">
          <van-image
            src="https://img.yzcdn.cn/vant/cat.jpeg"
            round
            class="avater"
            fit="cover"
          />
          <span class="name">{{ userinfo.name }}</span>
        </div>
        <!-- 右边部分 -->
        <div class="right">
          <van-button size="mini" round>编辑资料</van-button>
        </div>
      </div>
      <!-- 下面部分 -->
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{ userinfo.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userinfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userinfo.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userinfo.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- /已登录头部 -->
    <!-- 未登录头部 -->
    <div class="header not-login" v-else>
      <div class="login-btn" @click="$router.push('/login')">
        <img
          class="mobile-img"
          src="@/assets/cc43986e9122318ec75d6eef33d9ecb.png"
          alt=""
        />
        <span class="text">登录 / 注册</span>
      </div>
    </div>
    <!-- /未登录头部 -->

    <!-- 宫格导航 -->
    <van-grid :column-num="2" class="grid-nav" clickable>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- /宫格导航 -->

    <van-cell title="消息通知" is-link />
    <van-cell title="小智同学" is-link class="mb-9" />
    <van-cell
      v-if="user"
      title="退出登录"
      clickable
      class="logout-cell"
      @click="onLogout"
    />
  </div>
</template>

<script>
// 导入vuex中的user通过user判断有咩有登录
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'
export default {
  name: 'MyIndex',
  data () {
    return {
      // 获取到的用户数据
      userinfo: {}
    }
  },
  created () {
    if (this.user) {
      this.loadUserInfo()
    }
  },
  methods: {
    // 退出登录按钮的点击事件
    onLogout () {
      this.$dialog
        .confirm({
          title: '确认退出吗？'
        })
        .then(() => {
          // on confirm
          console.log('确认执行这里')
          // 确认退出，清楚登录状态（容器中的user+本地存储中的token）
          // 这里直接调用setUser这个函数，将里面的数据清空就做到了清楚容器中的
          // user，因为整个setUser是直接跟本地存储挂钩的，会执行本地清楚
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // on cancel
          console.log('取消执行这里')
        })
    },
    // 获取用户信息
    async loadUserInfo () {
      try {
        const { data } = await getUserInfo()
        // console.log(data);
        this.userinfo = data.data
      } catch (err) {
        // console.log(err);
        this.$toast('获取数据失败')
      }
    }
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style lang="less" scoped>
.my-container {
  .header {
    height: 361px;
    background: url("~@/assets/37bbc33828cacdcb7f50ad6484c866d.png"); //图片路径要加~
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .mobile-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }
  .user-info {
    .base-info {
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .avater {
          width: 132px;
          height: 132px;
          margin-right: 23px;
          border: 4px solid #fff;
        }
        .name {
          font-size: 30px;
          color: #fff;
        }
      }
    }
    .data-stats {
      display: flex;
      .data-item {
        height: 130px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }

  .grid-nav {
    margin-bottom: 10px;
    .grid-item {
      height: 141px;
      i.toutiao {
        font-size: 45px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      span.text {
        font-size: 28px;
      }
    }
  }

  .logout-cell {
    text-align: center;
    color: #d86262;
  }
  .mb-9 {
    margin-bottom: 9px;
  }
}
</style>
