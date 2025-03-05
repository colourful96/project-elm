<script setup>
import { ref, onBeforeMount } from 'vue'
import HeadTop from '@/components/header/index.vue'
import AlterTip from '@/components/common/AlterTip.vue'
import { useRouter } from 'vue-router'
import useStore from '@/store/index.js'
import { getcaptchas, accountLogin } from '@/service/getData.js'

const store = useStore()
const $router = useRouter()
const { login, record_userinfo } = store

const loginWay = ref(false) // 登录方式，默认为密码登录
const showPassword = ref(false) // 是否显示密码
const captchaCodeImg = ref('') // 验证码图片
const userinfo = ref(null) // 用户信息
const formData = ref({
  userAccount: null, // 用户名
  password: null, // 密码
  codeNumber: null, // 验证码
})
const alterData = ref({
  alterText: '',
  showAlert: false,
})

const getCaptchaCode = async () => {
  const res = await getcaptchas()
  captchaCodeImg.value = res.code
}

const changePasswordType = () => {
  showPassword.value = !showPassword.value
}

/**
 * 测试账号
 * adminelm
 * adminelm123456
 * user_id 80165
 * @returns {Promise<void>}
 */
const mobileLogin = async () => {
  if (loginWay.value) {
    // 手机号登录
  } else {
    // 密码登录
    if (!formData.value.userAccount) {
      alterData.value.showAlert = true
      alterData.value.alterText = '请输入手机号/邮箱/用户名'
      return
    } else if (!formData.value.password) {
      alterData.value.showAlert = true
      alterData.value.alterText = '请输入密码'
      return
    } else if (!formData.value.codeNumber) {
      alterData.value.showAlert = true
      alterData.value.alterText = '请输入验证码'
      return
    }
    userinfo.value = await accountLogin(
      formData.value.userAccount,
      formData.value.password,
      formData.value.codeNumber,
    )
  }
  if (!userinfo.value.user_id) {
    alterData.value.showAlert = true
    alterData.value.alterText = userinfo.value.message
    if (!loginWay.value) {
      formData.value = { ...formData.value, codeNumber: null }
      getCaptchaCode()
    }
  } else {
    record_userinfo(userinfo.value)
    $router.go(-1)
  }
}

const closeTip = () => {
  alterData.value.showAlert = false
  alterData.value.alterText = ''
}

onBeforeMount(() => {
  getCaptchaCode()
  if (login) {
    $router.back()
  }
})
</script>

<template>
  <div class="loginContainer">
    <head-top :head-title="loginWay ? '登录' : '密码登录'" :go-back="true"></head-top>
    <form class="loginForm" v-if="loginWay">短信登录</form>
    <form class="loginForm" v-else>
      <section class="input_container">
        <input type="text" placeholder="账号" v-model.lazy="formData.userAccount" />
      </section>
      <section class="input_container">
        <input
          v-if="!showPassword"
          type="password"
          placeholder="密码"
          v-model="formData.password"
        />
        <input v-else type="text" placeholder="密码" v-model="formData.password" />
        <div class="button_switch" :class="{ change_to_text: showPassword }">
          <div
            class="circle_button"
            :class="{ trans_to_right: showPassword }"
            @click="changePasswordType"
          ></div>
          <span>abc</span>
          <span>...</span>
        </div>
      </section>
      <section class="input_container captcha_code_container">
        <input type="text" placeholder="验证码" maxlength="4" v-model="formData.codeNumber" />
        <div class="img_change_img">
          <img v-show="captchaCodeImg" :src="captchaCodeImg" alt="" />

          <!--          <div v-html="captchaCodeImg"></div>-->
          <div class="change_img" @click="getCaptchaCode">
            <p>看不清</p>
            <p>换一张</p>
          </div>
        </div>
      </section>
    </form>
    <p class="login_tips">温馨提示：未注册过的账号，登录时将自动注册</p>
    <p class="login_tips">注册过的用户可凭账号密码登录</p>
    <div class="login_container" @click="mobileLogin">登录</div>
    <router-link to="/profile/forget" class="to_forget">重置密码</router-link>
    <AlterTip v-if="alterData.showAlert" :alter-text="alterData.alterText" @closeTip="closeTip"></AlterTip>
  </div>
</template>

<style scoped lang="scss">
@import '../style/mixin.scss';

.loginContainer {
  padding-top: 1.95rem;

  p,
  span,
  input {
    font-family:
      Helvetica Neue,
      Tahoma,
      Arial;
  }
}

.change_login {
  position: absolute;
  @include ct;
  right: 0.75rem;
  @include sc(0.7rem, #fff);
}

.loginForm {
  background-color: #fff;
  margin-top: 0.6rem;

  .input_container {
    display: flex;
    justify-content: space-between;
    padding: 0.6rem 0.8rem;
    border-bottom: 1px solid #f1f1f1;

    input {
      @include sc(0.7rem, #666);
    }

    button {
      @include sc(0.65rem, #fff);
      font-family:
        Helvetica Neue,
        Tahoma,
        Arial;
      padding: 0.28rem 0.4rem;
      border: 1px;
      border-radius: 0.15rem;
    }

    .right_phone_number {
      background-color: #4cd964;
    }
  }

  .phone_number {
    padding: 0.3rem 0.8rem;
  }

  .captcha_code_container {
    height: 2.2rem;

    .img_change_img {
      display: flex;
      align-items: center;

      img {
        @include wh(3.5rem, 1.5rem);
        margin-right: 0.2rem;
      }

      .change_img {
        display: flex;
        flex-direction: 'column';
        flex-wrap: wrap;
        width: 2rem;
        justify-content: center;

        p {
          @include sc(0.55rem, #666);
        }

        p:nth-of-type(2) {
          color: #3b95e9;
          margin-top: 0.2rem;
        }
      }
    }
  }
}

.login_tips {
  @include sc(0.5rem, red);
  padding: 0.4rem 0.6rem;
  line-height: 0.5rem;

  a {
    color: #3b95e9;
  }
}

.login_container {
  margin: 0 0.5rem 1rem;
  @include sc(0.7rem, #fff);
  background-color: #4cd964;
  padding: 0.5rem 0;
  border: 1px;
  border-radius: 0.15rem;
  text-align: center;
}

.button_switch {
  background-color: #ccc;
  display: flex;
  justify-content: center;
  @include wh(2rem, 0.7rem);
  padding: 0 0.2rem;
  border: 1px;
  border-radius: 0.5rem;
  position: relative;

  .circle_button {
    transition: all 0.3s;
    position: absolute;
    top: -0.2rem;
    z-index: 1;
    left: -0.3rem;
    @include wh(1.2rem, 1.2rem);
    box-shadow: 0 0.026667rem 0.053333rem 0 rgba(0, 0, 0, 0.1);
    background-color: #f1f1f1;
    border-radius: 50%;
  }

  .trans_to_right {
    transform: translateX(1.3rem);
  }

  span {
    @include sc(0.45rem, #fff);
    transform: translateY(0.05rem);
    line-height: 0.6rem;
  }

  span:nth-of-type(2) {
    transform: translateY(-0.08rem);
  }
}

.change_to_text {
  background-color: #4cd964;
}

.to_forget {
  float: right;
  @include sc(0.6rem, #3b95e9);
  margin-right: 0.3rem;
}
</style>
