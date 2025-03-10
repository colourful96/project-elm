import { defineStore } from 'pinia'
import { getUser, getAddressList } from '@/service/getData.js'
import { setStore } from '@/utils/index.js'

const useStore = defineStore('store', {
  state: () => ({
    userInfo: null,
    login: false,
    removeAddress: [],
    geohash: '31.22299,121.36025', // 地址geohash
    addAddress: '', // 新增地址
    latitude: '', // 当前位置纬度
    longitude: '', // 当前位置经度
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
  },
})
export default useStore
