<script setup>
import { ref } from 'vue'
import {useRouter} from 'vue-router'
import HeadTop from '@/components/header/index.vue'
import useStore from '@/store/index.js'

const store = useStore()
const {reset_name} = store

const $router = useRouter()

const inputValue = ref('')
const earn = ref(true)
const borderColor = ref(false)
const opacityall = ref(false)

const inputThing = () => {
  if (inputValue.value.length < 5 || inputValue.value.length > 24) {
    earn.value = false;
    borderColor.value = true;
    opacityall.value = true;
    return false;
  } else {
    earn.value = true;
    borderColor.value = false;
    opacityall.value = false;
    return true;
  }
}

const resetName = () => {
  let checkResult = inputThing();
  if (!checkResult) return;
  reset_name(inputValue.value);
  $router.go(-1);
}

</script>

<template>
  <div class="rating_page">
    <HeadTop head-title="修改用户名" :go-back="true"></HeadTop>
    <section class="setname">
      <section class="setname-top">
        <input
          type="text"
          :class="{ 'setname-input': borderColor }"
          placeholder="请输入用户名"
          v-model="inputValue"
          @input="inputThing"
        />
        <div>
          <p v-if="earn">用户名只能修改一次（5-24字符之间）</p>
          <p class="unlikep" v-else>用户名长度在5到24位之间</p>
        </div>
      </section>
      <section class="reset">
        <button :class="{ fontopacity: opacityall }" @click="resetName">确认修改</button>
      </section>
    </section>
  </div>
</template>

<style scoped lang="scss">
@import '@/style/common.scss';

.rating_page {
  padding-top: 1.95rem;
}

.setname {
  width: 15.2rem;
  margin: 0 auto;

  .setname-top {
    padding-top: 0.4rem;

    input {
      background: none;
      width: 15.2rem;
      border: 1px solid #ddd;
      padding: 0.2rem 0.1rem;
      line-height: 1.2rem;
      font-size: 0.7rem;
      display: block;
    }

    .setname-input {
      border-color: #ea3106;
    }

    p {
      width: 100%;
      padding: 0.4rem 0 1rem;
    }

    .unlikep {
      padding-top: 0.1rem;
    }
  }

  .reset {
    width: 100%;
    background: #3199e8;

    button {
      display: block;
      width: 100%;
      background: none;
      line-height: 2rem;
      opacity: 0.6;
      transition: all 1s;
    }

    .fontopacity {
      transition: all 1s;
      opacity: 1;
    }
  }
}
</style>
