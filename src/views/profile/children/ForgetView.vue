<script setup>
import { ref, onBeforeMount } from 'vue'
import HeadTop from '@/components/header/index.vue'
import AlterTip from '@/components/common/AlterTip.vue'
import { getcaptchas, changePassword } from '@/service/getData.js'

const forgetModel = ref({
  account: null, // 账号
  oldPassword: null, // 旧密码
  newPassword: null, // 新密码
  confirmPassword: null, // 确认密码
  mobileCode: null // 验证码
})
const captchaCodeImg = ref(null)
const alterData = ref({
  showAlert: false,
  alterText: ''
})

const getCaptchaCode = () => {
  getcaptchas().then(res => {
    captchaCodeImg.value = res.code
  })
}

const closeTip = () => {
  alterData.value.showAlert = false
}

const resetButton = () => {
  if (!forgetModel.value.account) {
    alterData.value.showAlert = true
    alterData.value.alterText = '请输入账号'
    return
  } else if (!forgetModel.value.oldPassword) {
    alterData.value.showAlert = true
    alterData.value.alterText = '请输入旧密码'
    return
  } else if (!forgetModel.value.newPassword) {
    alterData.value.showAlert = true
    alterData.value.alterText = '请输入新密码'
    return
  } else if (!forgetModel.value.confirmPassword) {
    alterData.value.showAlert = true
    alterData.value.alterText = '请输入确认密码'
    return
  } else if (forgetModel.value.newPassword !== forgetModel.value.confirmPassword) {
    alterData.value.showAlert = true
    alterData.value.alterText = '新密码和确认密码不一致'
    return
  } else if (!forgetModel.value.mobileCode) {
    alterData.value.showAlert = true
    alterData.value.alterText = '请输入验证码'
    return
  }
  changePassword(forgetModel.value.account, forgetModel.value.oldPassword, forgetModel.value.newPassword, forgetModel.value.confirmPassword, forgetModel.value.mobileCode).then(res => {
    if (res.message) {
      alterData.value.showAlert = true
      alterData.value.alterText = res.message
      getCaptchaCode()
    } else {
      alterData.value.showAlert = true
      alterData.value.alterText = '密码修改成功'
    }
  })
}
onBeforeMount(() => {
  getCaptchaCode()
})
</script>

<template>
  <div class="restContainer">
    <head-top :head-title="'重制密码'" :go-back="true"></head-top>
    <form class="restForm">
      <section class="input_container phone_number">
        <input
          type="text"
          placeholder="账号"
          name="phone"
          maxlength="11"
          v-model="forgetModel.account"
        />
      </section>
      <section class="input_container">
        <input
          type="text"
          placeholder="旧密码"
          name="oldPassword"
          v-model="forgetModel.oldPassword"
        />
      </section>
      <section class="input_container">
        <input
          type="text"
          placeholder="新密码"
          name="newPassword"
          v-model="forgetModel.newPassword"
        />
      </section>
      <section class="input_container">
        <input
          type="text"
          placeholder="确认密码"
          name="confirmPassword"
          v-model="forgetModel.confirmPassword"
        />
      </section>
      <section class="input_container captcha_code_container">
        <input
          type="text"
          placeholder="验证码"
          name="mobileCode"
          v-model="forgetModel.mobileCode"
        />
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
    <div class="login_container" @click="resetButton">确认修改</div>
    <alter-tip
      v-if="alterData.showAlert"
      :alter-text="alterData.alterText"
      :show-alert="alterData.showAlert"
      @closeTip="closeTip"
    ></alter-tip>
  </div>
</template>

<style scoped lang="scss">
@import '@/style/mixin.scss';

.restContainer {
  padding-top: 1.95rem;
}

.restForm {
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

.login_container {
  margin: 1rem 0.5rem;
  @include sc(0.7rem, #fff);
  background-color: #4cd964;
  padding: 0.5rem 0;
  border: 1px;
  border-radius: 0.15rem;
  text-align: center;
}
</style>
