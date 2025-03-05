import { defineStore } from 'pinia'
import { getUser } from '@/service/getData.js'
import {setStore} from '@/utils/index.js'

const useStore = defineStore('store', {
  state: () => ({
    userInfo: null,
    login: false,
  }),
  getters: {
    getterUserInfo: state => state.userInfo

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
    record_userinfo(info){
      this.userInfo = info;
      this.login = true;
      setStore('user_id', info.user_id);
    },
    reset_name(username) {
      this.userInfo = Object.assign({}, this.userInfo, {username});
    },
  },
})
export default useStore
