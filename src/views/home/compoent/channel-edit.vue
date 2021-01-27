<template>
  <div class="channel-edit">
    <!-- 频道列表 -->
    <van-cell :border="false" class="my-grid">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        type="danger"
        plain
        round
        size="small"
        class="channel-btnedit"
        @click="isEdit = !isEdit"
        >{{ isEdit ? "完成" : "编辑" }}</van-button
      >
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        v-for="(channel, index) in myChannels"
        :key="index"
        class="grid-item"
        @click="onMyChannelClick(channel, index)"
      >
        <!-- v-bind:class语法
        一个对象，对象中的key表示要作用的css类名
                  对象汇总的查value要计算出布尔值
                  true，则作用该类名
       -->
        <!--fiexChannels.includes(channel.id)   不懂  -->
        <van-icon
          slot="icon"
          name="clear"
          v-show="isEdit && !fiexChannels.includes(channel.id)"
        ></van-icon>
        <span class="text" slot="text" :class="{ active: index === active }">{{
          channel.name
        }}</span>
      </van-grid-item>
    </van-grid>
    <!-- /频道列表 -->
    <!-- 频道推荐 -->
    <van-cell>
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10" class="recommed-grid">
      <van-grid-item
        v-for="(channels, index) in recommendChannels"
        :key="index"
        :text="channels.name"
        icon="plus"
        class="grid-item"
        @click="onAddChannel(channels)"
      />
    </van-grid>
    <!-- /频道推荐 -->
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channel'
export default {
  name: 'ChannelEdit',
  data () {
    return {
      allChannels: [], // 所有频道
      isEdit: false, // 控制编辑状态的展示
      fiexChannels: [0] // 固定频道，不允许删除
    }
  },
  computed: {
    recommendChannels () {
      // 简化写法
      // 数组的fiilter方法会遍历数组，然后返回符合条件的元素存储到新的数组中
      // fiilter方法内部会创建数组用于存储结果
      // return this.allChannels.filter((channell) => {
      // 数组的find方法，遍历数组，把符合条件的第一个元素返回
      // return !this.myChannels.find((myChannel) => {
      // return myChannel.id == channell.id;
      // });
      // });

      // 定义一个空数据用来存储最后得到的数据
      const channels = []
      // 遍历从服务器请求回来的数据
      this.allChannels.forEach((channell) => {
        // 从组建传过来的myChannels中找有咩有跟allChannels相等的数据
        // ret返回的是布尔值
        const ret = this.myChannels.find((myChannel) => {
          // 返回的是布尔值，有相等的就返回会遍历那一层
          return myChannel.id === channell.id
        })
        // 对收到的ret取反，代表不包含，就存储到数组中
        if (!ret) {
          channels.push(channell)
        }
        // console.log(channels);
      })
      // 把计算结果返回
      return channels
    }
  },
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  created () {
    this.loadAllChannels()
  },
  mounted () {},
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        console.log(data)
        this.allChannels = data.data.channels
      } catch (err) {
        console.log(err)
        this.$toast('请求失败')
      }
    },
    onAddChannel (channels) {
      console.log(channels)
      // push进myChannels，然后计算属性会自动监听数据的变化，动态渲染
      this.myChannels.push(channels)
    },
    onMyChannelClick (channel, index) {
      // console.log(channel, index);
      if (this.isEdit) {
        // 如果是固定频道则不删除
        if (this.fiexChannels.includes(channel.id)) {
          return
        }
        // 编辑状态，执行删除频道
        // 参数1 ： 要删除的元素的开始的id值
        // 参数2： 删除的个数，如果不指定，则从参数1开始删除
        if (index <= this.active) {
          // 让激活频道的索引-1，并传递给父元素
          // 传递true过去，父元素中根据true这个值判断是否关闭弹出层
          // this.active - 1 是为了让每次删除高亮停留在当前位置，同时这个值改变会动态
          // 同步到主页面的光标停留位置，组件把这个值传递了进来
          this.$emit('update-active', this.active - 1, true)
        }
        // 删除myChannels中的元素
        this.myChannels.splice(index, 1)
      } else {
        // 非编辑状态，执行切换频道
        // 子组件无法改变父组件的值，向父组件传值
        this.$emit('update-active', index)
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .channel-btnedit {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  .active {
    color: red !important;
  }
  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .grid-item {
    .van-icon-clear {
      position: absolute;
      right: -10px;
      top: -10px;
      font-size: 30px;
      color: #cacaca;
      z-index: 2;
    }
  }

  .recommed-grid {
    /deep/ .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
        .van-grid-item__text {
          margin-top: 0;
        }
      }
    }
  }
}
</style>
