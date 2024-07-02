//创建WxRequest类
//通过类的方式进行封装，会让代码具有可复用性
//也可以方便添加新的属性和方法
class WxRequest {
  //定义实例属性 设置默认请求参数
  default = {
    baseURL: '',
    url: '',
    data: null,
    methods: 'GET',
    header: {
      'Content-type': 'application/json'
    },
    timeout: 60000
  }

  //定义实例属性 设置拦截器
  //需要包含请求拦截器和响应拦截器，方便在请求之前以及响应之后进行逻辑处理
  interceptors = {
    //请求拦截器
    //在请求发送之前对请求参数进行新增或修改
    request: (config) => config,
    //响应拦截器
    //在服务器响应数据以后，对服务器响应的数据进行逻辑处理
    response: (response) => response
  }
  //用于创建和初始化类的属性和方法
  //在实例化时传入的参数，会被 constructor 形参接收
  constructor(params = {}) {
    //通过Object.assign将默认参数和传入的参数合并
    //注意： 需要传入的参数，覆盖默认的参数，因此传入的参数需要放到最后
    this.default = Object.assign({}, this.default, params)
  }
  //request实例方法接收一个对象类型的参数
  //属性值和wx.request 方法调用时传递的参数保持一致
  request(options) {
    //注意： 先合并完整的请求地址（baseURL + url ）
    //需要使用Promise封装 wx.request 处理异步请求
    options.url = this.default.baseURL + options.url
    //合并请求参数
    options = { ...this.default, ...options }

    //在请求发送之前，调用请求拦截器，新增和修改请求参数
    options = this.interceptors.request(options)
    return new Promise((resolve, reject) => {
      wx.request({
        ...options,
        //当接口调用成功时触发
        success: (res) => {
          //不管是成功响应还是失败响应，都需要调用响应拦截器
          //响应拦截器需要接收服务器响应的数据，然后对数据进行逻辑处理，处理好以后进行返回
          //然后再通过resolve将返回数据抛出

          //再给响应拦截器传递参数时，需要将请求参数一起传递
          //方便进行代码的调试或者进行其他逻辑处理，需要先合并参数
          //然后将合并的参数传递给响应拦截器

          //不管是请求失败还是请求成功，都已经将响应的数据传递给了响应拦截器
          //这时候在合并参数的时候，追加一个属性 isSuccess
          //如果属性值为 true，说明执行了success回调函数
          //如果属性值为 false，说明执行了fail回调函数
          const mergeRes = Object.assign({}, res, { config: options, isSuccess: true })
          resolve(this.interceptors.response(mergeRes))
        },
        //当接口调用失败时触发
        fail: (err) => {
          //不管是成功响应还是失败响应，都需要调用响应拦截器
          const mergeErr = Object.assign({}, res, { config: options, isSuccess: false })
          resolve(this.interceptors.response(mergeErr))
        }
      })
    })
  }
  //封装get实例方法
  get(url, data = {}, config = {}) {
    //需要调用request请求方法发送请求，只需要组织好参数，传递给request请求方法即可
    //当调用get方法时，需要将 request 的返回值 return 出去
    return this.request(Object.assign({ url, data, methods: 'GET' }, config))
  }

  //封装delete实例方法
  delete(url, data = {}, config = {}) {
    return this.request(Object.assign({ url, data, methods: 'DELETE' }, config))
  }
  //封装post实例方法
  post(url, data = {}, config = {}) {
    return this.request(Object.assign({ url, data, methods: 'POST' }, config))
  }
  //封装put实例方法
  put(url, data = {}, config = {}) {
    return this.request(Object.assign({ url, data, methods: 'PUT' }, config))
  }
}

export default WxRequest
