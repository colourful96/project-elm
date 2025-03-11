import { defineStore } from 'pinia'
import { getUser, getAddressList } from '@/service/getData.js'
import { setStore } from '@/utils/index.js'

const useStore = defineStore('store', {
  state: () => ({
    userInfo: null,
    login: false,
    geohash: '31.22299,121.36025', // 地址geohash
    addAddress: '', // 新增地址
    latitude: '', // 当前位置纬度
    longitude: '', // 当前位置经度
    removeAddress: [],
    cartList: {}, // 加入购物车的商品列表
    shopDetail: null, // 商铺详情
    shopId: null, // 商铺ID
    cartId: null, //购物车id
    sig: null, //购物车sig
    chooseAddress: null, //选择地址
    addressIndex: null, // 选择地址的索引值
    searchAddress: null, // 选择搜索的地址
    newAddress: [], //确认订单页新的地址
    remarkText: null, //可选备注内容
    inputText: '', //输入备注内容
    orderParam: null, //订单的参数
    cartPrice: null, //会员卡价格
    orderMessage: null, // 订单返回值
    orderDetail: null, // 订单详情
  }),
  getters: {
    getterUserInfo: (state) => state.userInfo,
  },
  actions: {
    async getUserInfo() {
      const user = await getUser()
      if (this.userInfo && this.userInfo.username === user?.username) return
      if (!user.message) {
        this.userInfo = user
        this.login = true
      } else {
        this.userInfo = null
        this.login = false
      }
    },
    record_userinfo(info) {
      this.userInfo = info
      this.login = true
      setStore('user_id', info.user_id)
    },
    reset_name(username) {
      this.userInfo = Object.assign({}, this.userInfo, { username })
    },
    async saveAddress() {
      if (this.removeAddress.length > 0) return
      const address = await getAddressList(this.userInfo.user_id)
      this.removeAddress = address
    },
    add_removeList(addressObj) {
      this.removeAddress = [addressObj, ...this.removeAddress]
    },
    setState(payload) {
      const keys = Object.keys(payload)
      keys.forEach((key) => {
        this[key] = payload[key]
      })
    },
    // 加入购物车
    add_cart({
      shopid,
      category_id,
      item_id,
      food_id,
      name,
      price,
      specs,
      packing_fee,
      sku_id,
      stock,
    }) {
      let cart = this.cartList
      let shop = (cart[shopid] = cart[shopid] || {})
      let category = (shop[category_id] = shop[category_id] || {})
      let item = (category[item_id] = category[item_id] || {})
      if (item[food_id]) {
        item[food_id]['num']++
      } else {
        item[food_id] = {
          num: 1,
          id: food_id,
          name: name,
          price: price,
          specs: specs,
          packing_fee: packing_fee,
          sku_id: sku_id,
          stock: stock,
        }
      }
      this.cartList = { ...cart }
      //存入localStorage
      setStore('buyCart', this.cartList)
    },
    // 移出购物车
    reduce_cart({ shopid, category_id, item_id, food_id }) {
      let cart = this.cartList
      let shop = cart[shopid] || {}
      let category = shop[category_id] || {}
      let item = category[item_id] || {}
      if (item && item[food_id]) {
        if (item[food_id]['num'] > 0) {
          item[food_id]['num']--
          this.cartList = { ...cart }
          //存入localStorage
          setStore('buyCart', this.cartList)
        } else {
          //商品数量为0，则清空当前商品的信息
          item[food_id] = null
        }
      }
    },
    record_shopDetail(detail) {
      this.shopDetail = detail;
    },
  },
})
export default useStore
