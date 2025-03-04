import { defineStore } from 'pinia'
import { getUser } from '@/service/getData.js'

const useStore = defineStore('store', {
  state: () => ({
    userInfo: null,
    login: false,
  }),
  getters: {},
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
  },
})
export default useStore
