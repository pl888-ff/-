<template>
  <div class="article-list">
    <!-- 文章列表
 loading 和 finished 两个变量控制加载状态
 当组件滚动到底部时，会触发 load 事件并将 loading 设置成 true。
 此时可以发起异步操作并更新数据，数据更新完毕后，
 将 loading 设置成 false 即可。
 若数据已全部加载完毕，
 则直接将 finished 设置成 true 即可。

  -->

    <van-pull-refresh
      v-model="isreFreshLoading"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      :success-duration="1500"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <!-- <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        /> -->
        <article-item
          v-for="(item, index) in list"
          :key="index"
          :article="item"
        />
        <!-- <van-cell
          v-for="(item, index) in list"
          :key="index"
          :title="item.title"
        /> -->
      </van-list>

      <!-- /文章列表 -->
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item' // 默认导入不能写成按需导入
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中的loading状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 请求获取下一页的时间戳
      error: false, // 控制列表加载状态失败的提示状态
      isreFreshLoading: false, // 控制下拉刷新的loading状态
      refreshSuccessText: '刷新成功' // 下拉刷新成功提示文本
    }
  },
  created () {},
  mounted () {
    // console.log(ArticleItem);
  },
  methods: {
    async onLoad () {
      try {
        // 异步更新数据
        // setTimeout 仅做示例，真实场景中一般为 ajax 请求
        const { data } = await getArticles({
          //	频道ID  会根据组件的不同的id值进行不同的请求
          channel_id: this.channel.id,
          // timestamp    请求数据的页码
          // 请求第一页的数据：当前最新的时间戳
          // 用于请求之后数据的时间戳会在当前请求及结果中返回给你
          // this.timestamp有就用它，没有就用 Date.now(),
          timestamp: this.timestamp || Date.now(),
          // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
          with_top: 1
        })

        // if (Math.random() > 0.5) {
        //   // 模拟出错
        //   JSON.parse("dewnfwen");
        // }
        // console.log(data);
        //  2  吧请求结果数据放到list数组中
        const { results } = data.data
        // 不能采用直接赋值的写法，因为每次直接赋值会把上次的内容覆盖 this.list.push= results
        // 不能直接push results，因为results是对象，list是数组，push是元素
        this.list.push(...results)
        // 3 本次数据加载结束之后要把加载状态设置为结束
        this.loading = false
        // 4 判断数据是否全部加载完成 数据全部加载完成
        if (results.length) {
          // results.length不为0 说明还有数据，继续获取时间戳加载
          this.timestamp = data.data.pre_timestamp
        } else {
          // 加载完毕
          // 如果没有数据了，吧finished设置为true，之后不再触发加载
          this.finished = true
        }
      } catch (err) {
        // console.log(err);
        // 展示错误提示状态
        this.error = true

        // 请求失败了，loading也需要关闭

        this.loading = false
      }
    },
    // 初始化或滚动到底部的时候回触发调用onload
    // onLoad() {
    //   // 异步更新数据
    //   // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    //   setTimeout(() => {
    //     //  2  吧请求结果数据放到list数组中
    //     for (let i = 0; i < 10; i++) {
    //       this.list.push(this.list.length + 1);
    //     }

    //     //3 本次数据加载结束之后要把加载状态设置为结束
    //     //   loading 关闭以后才能触发下一次的加载更多
    //     this.loading = false;

    //     //4 判断数据是否全部加载完成 数据全部加载完成
    //     if (this.list.length >= 40) {
    //       // 如果没有数据了，吧finished设置为true，之后不再触发加载
    //       this.finished = true;
    //     }
    //   }, 1000);
    // },

    //
    // 下啦刷新
    async onRefresh () {
      try {
        // 异步更新数据
        // setTimeout 仅做示例，真实场景中一般为 ajax 请求
        const { data } = await getArticles({
          channel_id: this.channel.id, //	频道ID  会根据组件的不同的id值进行不同的请求
          timestamp: Date.now(), // 下拉刷新获取最新数据，每次传最新的时间戳
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })

        // 将数据追加到列表的顶部
        const { results } = data.data
        this.list.unshift(...results)

        // 关闭下拉刷新loadin状态
        this.isreFreshLoading = false

        // 更新下拉刷新成功提示的文本
        this.refreshSuccessText = `刷新成功，更新了${results.length}条`
      } catch (err) {
        // console.log(err);
        this.isreFreshLoading = false
        this.refreshSuccessText = `刷新失败`
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>
