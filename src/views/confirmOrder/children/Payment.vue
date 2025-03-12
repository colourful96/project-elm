<script setup>
import { ref, onMounted, computed } from 'vue'
import {useRouter} from 'vue-router'
import HeadTop from '@/components/header/index.vue'
import AlterTip from '@/components/common/AlterTip.vue'
import useStore from '@/store/index.js'

const store = useStore()
const $router = useRouter()

const showAlter = ref(false)
const alterText = ref(null)
const payDetail = ref(null)
const gotoOrders = ref(false)
const countNum = ref(900)
const payWay = ref(1) //付款方式
let timer = null

const remaining = computed(() => {
  let minute = parseInt(countNum.value / 60);
  if (minute < 10) {
    minute = '0' + minute;
  }
  let second = parseInt(countNum.value % 60);
  if (second < 10) {
    second = '0' + second;
  }
  return '00' + ':' + minute + ':' + second;
})
const orderMessage = computed(() => store.orderMessage)
const userInfo = computed(() => store.userInfo)

const remainingTime = () => {
  clearInterval(timer);
  timer = setInterval(() => {
    countNum.value--;
    if (countNum.value === 0) {
      clearInterval(timer);
      showAlter.value = true;
      alterText.value = '支付超时';
    }
  }, 1000)
}

const closeTipFun = () => {
  showAlter.value = false;
  if (gotoOrders.value) {
    $router.push('/order');
  }
}

const confirmPay = () => {
  showAlter.value = true;
  alterText.value = '当前环境无法支付，请打开官方APP进行付款';
  gotoOrders.value = true;
}

onMounted(() => {
  remainingTime()
})
</script>

<template>
  <div class="rating_page">
    <head-top head-title="在线支付" :go-back="true"></head-top>
    <section class="show_time_amount">
      <section>
        <header class="time_last">支付剩余时间</header>
        <p class="time">{{ remaining }}</p>
        <footer class="order_detail" v-if="payDetail?.resultData">
          <span>详情</span>
          <span
            >¥
            {{
              (cartPrice && cartPrice.toFixed(2)) ||
              (payDetail.resultData.orderInfo.orderAmount &&
                (payDetail.resultData.orderInfo.orderAmount / 100).toFixed(2))
            }}</span
          >
        </footer>
      </section>
    </section>
    <div class="pay_way">选择支付方式</div>
    <section class="pay_way_list">
      <section class="pay_item">
        <div class="pay_icon_contaienr">
          <div class="zhifubao"></div>
          <span>支付宝</span>
        </div>
        <svg class="choose_icon" @click="payWay = 1" :class="{ choosed_way: payWay === 1 }">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
        </svg>
      </section>
      <section class="pay_item">
        <div class="pay_icon_contaienr">
          <svg>
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#weixin"></use>
          </svg>
          <span>微信</span>
        </div>
        <svg class="choose_icon" @click="payWay = 2" :class="{ choosed_way: payWay === 2 }">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
        </svg>
      </section>
    </section>
    <p class="determine" @click="confirmPay">确认支付</p>
    <alter-tip v-if="showAlter" @closeTip="closeTipFun" :alertText="alterText"></alter-tip>
  </div>
</template>

<style scoped lang="scss">
@import '@/style/mixin';

.rating_page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f5f5;
  z-index: 204;
  padding-top: 1.95rem;

  p,
  span {
    font-family:
      Helvetica Neue,
      Tahoma,
      Arial;
  }
}

.show_time_amount {
  background-color: #fff;
  padding: 0.7rem;
  text-align: center;

  .time_last {
    @include sc(0.6rem, #666);
    margin-top: 1rem;
  }

  .time {
    @include sc(1.5rem, #333);
    margin: 0.3rem 0 1rem;
  }

  .order_detail {
    @include fj;

    span {
      @include sc(0.65rem, #666);
    }

    span:nth-of-type(2) {
      color: #ff6000;
      font-weight: bold;
    }
  }
}

.pay_way {
  background-color: #f1f1f1;
  padding: 0 0.7rem;
  @include sc(0.7rem, #666);
  line-height: 1.8rem;
}

.pay_way_list {
  background-color: #fff;

  .pay_item {
    padding: 0.4rem 0.7rem;
    @include fj;
    align-items: center;
    line-height: 2.6rem;
    border-bottom: 0.025rem solid #f5f5f5;

    .pay_icon_contaienr {
      @include fj;
      align-items: center;

      .zhifubao {
        @include wh(2rem, 2rem);
        background: url(../../../assets/zhifubao.png) no-repeat;
        background-size: 100% 100%;
        margin-right: 0.2rem;
      }

      svg {
        @include wh(2rem, 2rem);
        margin-right: 0.3rem;
      }

      span {
        @include sc(0.7rem, #666);
      }
    }

    .choose_icon {
      @include wh(1rem, 1rem);
      fill: #ccc;
    }

    .choosed_way {
      fill: #4cd964;
    }
  }
}

.determine {
  background-color: #4cd964;
  @include sc(0.7rem, #fff);
  text-align: center;
  margin: 0 0.7rem;
  line-height: 1.8rem;
  border-radius: 0.2rem;
  margin-top: 0.5rem;
  font-weight: bold;
}
</style>
