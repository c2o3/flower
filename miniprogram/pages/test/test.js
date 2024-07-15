import Schema from 'async-validator'

Page({
  data: {
    name: ''
  },
  onValidator() {
    const rules = {
      name: [
        { required: true, message: 'name不能为空' },
        { type: 'string', message: 'name不是字符串' },
        { min: 2, max: 2, message: '名字最少两个字，最多三个字' }
        // {pattern:'',message:''}
        // { validator: () => {} }
      ]
    }
    const validator = new Schema(rules)
    validator.validate(this.data, (errors, fields) => {
      if (errors) {
        console.log('验证失败')
        console.log(errors)
        console.log(fields)
      } else {
        console.log(fields)
      }
    })
  }
})
