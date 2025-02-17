export const swiperCellBehavior = Behavior({
  data: {
    swiperCellQueue: [] //用来存储滑动单元格实例
  },
  methods: {
    //当用户打开滑块时触发
    swipeCellOpen(event) {
      // 获取滑动单元格实例
      const instance = this.selectComponent(`#${event.target.id}`)
      //将实例追加到数组中
      this.data.swiperCellQueue.push(instance)
    },
    //给页面绑定点击事件
    onSwipeCellPage() {
      this.onSwiperCellCommonClick()
    },
    //点击滑动单元格时触发的事件
    onSwipeCellClick() {
      this.onSwiperCellCommonClick()
    },
    //关掉滑块统一的逻辑
    onSwiperCellCommonClick() {
      // 需要对单元格实例数组进行遍历，遍历以后获取每一个实例，让每一个实例调用close方法
      this.data.swiperCellQueue.forEach((instance) => {
        instance.close()
      })
      //将滑动单元格数组重置为空
      this.data.swiperCellQueue = []
    }
  }
})
