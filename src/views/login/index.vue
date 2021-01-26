<template>
  <div class="login-container">
    <!-- 导航栏开始 -->
    <van-nav-bar title="登录" class="page-nav-bar">
      <van-icon slot="left" name="cross" @click="$router.back()" />
    </van-nav-bar>
    <!-- 导航栏结束 -->

    <!-- 登录表单 -->
    <van-form @submit="onSubmit" ref="loginForm">
      <van-field
        name="mobile"
        placeholder="请输入手机号"
        v-model="user.mobile"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        name="code"
        placeholder="请输入验证码"
        v-model="user.code"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"> </i>
        <template #button>
          <van-count-down
            :time="1000 * 60"
            format="ss s"
            v-if="isCountDownShow"
            @finish="isCountDownShow = false"
          />
          <!-- 在表单中，除了提交按钮外，可能还有一些其他的功能性按钮，如发送验证码按钮。在使用这些按钮时，要注意将native-type设置为button，否则会触发表单提交。 -->
          <van-button
            v-else
            class="send-sms-btn"
            round
            size="small"
            native-type="button"
            type="default"
            @click="onSendSms"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>
    <!-- 登录表单结束 -->
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
export default {
  data () {
    return {
      user: {
        mobile: '', // 手机号
        code: '' // 验证码
      },
      // 当一个条件验证不通过，那么下面的验证规则就不会继续执行下去
      // 如果验整通过，会触发sunmit
      // 如果不验整通过，不会触发sunmit
      userFormRules: {
        mobile: [
          {
            required: true,
            message: '手机号不能为空'
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: '手机号格式错误'
          }
        ],
        code: [
          {
            required: true,
            message: '验证码不能为空'
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      },
      // 是否展示倒计时
      isCountDownShow: false
    }
  },
  methods: {
    async onSubmit () {
      // 1 获取表单数据
      const user = this.user
      // 2  表单验证

      // 在组件中必须通过this.$toast来调用TOast组件
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续时间，默认是2000，如果为0，则表示持续展示
      })
      // 3  提交表单请求登录
      try {
        const { data } = await login(user)
        // 将得到的token保存在user中
        this.$store.commit('setUser', data.data)
        // console.log("登录成功", res);
        this.$toast.success('登录成功')
        // 暂时用回退
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          // console.log("手机号或验证码错误");
          this.$toast.fail('手机号或验证码错误')
        } else {
          // console.log("登录失败。请稍后重试", err);
          this.$toast.fail('登录失败。请稍后重试')
        }
        // console.log(err);
      }
      //
    },
    // 发送验证码的点击按钮
    async onSendSms () {
      // 先校验手机号
      // validate方法会返回一个promise 需要用async awite简化
      try {
        await this.$refs.loginForm.validate('mobile')
        // console.log("验证通过");
      } catch (err) {
        return console.log(err)
      }
      // 验证通过，显示倒计时
      this.isCountDownShow = true
      // 请求发送验证码
      try {
        await sendSms(this.user.mobile)
        // console.log(res);
        this.$toast('发送成功')
      } catch (err) {
        console.log(err)
        // 发送失败，关闭倒计时
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后再试')
        } else {
          this.$toast('发送失败，请稍后再试')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }

  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: 0;
    }
  }
}
</style>
