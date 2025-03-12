<script setup>
import { ref, computed, onMounted } from 'vue'
import AlterTip from '@/components/common/AlterTip.vue'

const props = defineProps(['time'])
const emit = defineEmits(['closeTip'])

const showAlert = ref(false)
const alertText = ref(null)
const countNum = ref(900)

let timer = null

const remaining = computed(() => {
  let minute = parseInt(countNum.value / 60)
  let second = parseInt(countNum.value % 60)
  if (minute < 10) {
    minute = '0' + minute
  }
  if (second < 10) {
    second = '0' + second
  }
  return '去支付(还剩' + minute + '分' + second + '秒)'
})

const numTime = computed(() => {
  if (this.time.toString().indexOf('分钟') !== -1) {
    return parseInt(props.time) * 60
  } else {
    return parseInt(props.time)
  }
})

const closeTip = () => {
  showAlert.value = false
  emit('closeTip')
}
const remainingTime = () => {
  clearInterval(timer)
  timer = setInterval(() => {
    countNum.value--
    if (countNum.value === 0) {
      clearInterval(timer)
      showAlert.value = true
      alertText.value = '支付超时'
    }
  }, 1000)
}
const gotoPay = () => {
  showAlert.value = true
  alertText.value = '暂不开放支付接口'
}

onMounted(() => {
  countNum.value -= numTime.value
  remainingTime()
})
</script>

<template>
  <div class="page">
    <span
      class="rem_time"
      style="color: orange; border-width: 1px; border-style: solid; border-color: orange"
      @click="gotoPay"
    >
      {{ remaining }}
    </span>
    <AlterTip v-if="showAlert" @closeTip="closeTip" :alertText="alertText"></AlterTip>
  </div>
</template>

<style scoped lang="scss">
@import 'src/style/mixin';

.page {
  display: inline-block;

  .rem_time {
    @include sc(0.55rem, orange);
    padding: 0.1rem 0.2rem;
    border-radius: 0.15rem;
  }
}
</style>
