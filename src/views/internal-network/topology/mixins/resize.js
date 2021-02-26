import { mapGetters } from 'vuex'

const { body } = document
export default {
  data() {
    return {
      // 页面的实际大小
      $_size: {
        width: '',
        height: ''
      },
      // svg画布的实际大小
      svgSize: {
        width: 0,
        height: 0
      }
    }
  },
  computed: {
    // 侧边栏展开情况
    ...mapGetters(['sidebar'])
  },
  watch: {
    sidebar: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          if (this.$_size) {
            this.svgSize = {
              width: val.opened ? this.$_size.width - 180 : this.$_size.width - 54,
              height: this.$_size.height - 84
            }
          }
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 获取页面的实际大小
      const rect = body.getBoundingClientRect()
      this.$_size = {
        width: rect.width,
        height: rect.height
      }
      // 计算出svg页面的实际大小
      this.svgSize = {
        width: this.sidebar.opened ? rect.width - 180 : rect.width - 54,
        height: rect.height - 84
      }
    })
    this.$_initResizeEvent()
  },
  /*
  * 移除浏览器窗口变化事件
  * */
  beforeDestroy() {
    this.$_destoryResizeEvent()
  },
  /*
  * 获取浏览器窗口大小
  * */
  activated() {
    const rect = body.getBoundingClientRect()
    this.$_size = {
      width: rect.width,
      height: rect.height
    }
    this.svgSize = {
      width: this.sidebar.opened ? rect.width - 180 : rect.width - 54,
      height: rect.height - 84
    }
    this.$_initResizeEvent()
  },
  /*
  * 移除浏览器窗口变化事件
  * */
  deactivated() {
    this.$_destoryResizeEvent()
  },
  methods: {
    /*
    * 注册浏览器窗口变化事件
    * 实时计算出svg画布的大小
    * */
    $_initResizeEvent() {
      window.addEventListener('resize', this.$_initSize)
    },
    /*
    * 移除浏览器窗口变化事件
    * */
    $_destoryResizeEvent() {
      window.removeEventListener('resize', this.$_initSize)
    },
    /*
    * 计算svg画布的实际大小
    * */
    $_initSize() {
      const rect = body.getBoundingClientRect()
      this.$_size.width = rect.width
      this.$_size.height = rect.height
      this.svgSize = {
        width: this.sidebar.opened ? rect.width - 180 : rect.width - 54,
        height: rect.height - 84
      }
    }
  }
}
