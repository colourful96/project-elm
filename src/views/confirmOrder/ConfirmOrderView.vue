<script setup>
import { ref, onBeforeMount, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HeadTop from '@/components/header/index.vue'
import Loading from '@/components/common/Loading.vue'
import AlterTip from '@/components/common/AlterTip.vue'
import { imgBaseUrl } from '@/utils/index.js'
import useStore from '@/store/index.js'
import { checkout, getAddressList, placeOrders } from '@/service/getData.js'

const $route = useRoute()
const $router = useRouter()
const store = useStore()

const cartList = computed(() => store.cartList)
const userInfo = computed(() => store.userInfo)
const chooseAddress = computed(() => store.chooseAddress)
const remarkText = computed(() => store.remarkText)
const inputText = computed(() => store.inputText)
const remarklist = computed(() => {
  if (!remarkText.value && !inputText.value) return '口味、偏好等'
  let str = new String()
  if (remarkText.value) {
    Object.values(remarkText.value).forEach((item) => {
      str += item[1] + '，'
    })
  }
  //是否有自定义备注，分开处理
  if (inputText.value) {
    return str + inputText.value
  } else {
    return str.substr(0, str.lastIndexOf('，'))
  }
})

const showLoading = ref(true)
const shopCard = ref(null) // 购物车数据
const geohash = ref('')
const shopId = ref(null)
const checkoutData = ref(null)
const showPayWay = ref(false)
const payWayId = ref(1) //付款方式
const showAlter = ref(false)
const alterText = ref(null)

onBeforeMount(() => {
  geohash.value = $route.query.geohash
  shopId.value = $route.query.shopId
  store.init_buyCard()
  store.save_shopId(shopId.value)
  shopCard.value = cartList[shopId.value]
})

const initData = async () => {
  const newArr = new Array()
  Object.values(shopCard.value).forEach((categoryItem) => {
    Object.values(categoryItem).forEach((itemValue) => {
      Object.values(itemValue).forEach((item) => {
        newArr.push({
          attrs: [],
          extra: {},
          id: item.id,
          name: item.name,
          packing_fee: item.packing_fee,
          price: item.price,
          quantity: item.num,
          sku_id: item.sku_id,
          specs: [item.specs],
          stock: item.stock,
        })
      })
    })
  })
  // 检验订单是否满足条件
  checkoutData.value = await checkout(geohash.value, [newArr], shopId.value)
  store.save_cart_id_sig({ cart_id: checkoutData.value.cart_id, sig: checkoutData.value.sig })
  initAddress()
  showLoading.value = false
}

// 获取收货地址
const initAddress = async () => {
  if (userInfo.value && userInfo.value.user_id && !chooseAddress.value) {
    const result = await getAddressList(userInfo.value.user_id)
    if (Array.isArray(result) && result.length) {
      store.choose_address({ address: result[0], index: 0 })
    }
  }
}

const iconColor = (name) => {
  switch (name) {
    case '公司':
      return '#4cd964'
    case '学校':
      return '#3190e8'
  }
}

// 显示付款方式
const showPayWayFun = () => {
  showPayWay.value = !showPayWay.value
}

//选择付款方式
const choosePayWay = (is_online_payment, id) => {
  if (is_online_payment) {
    showPayWay.value = !showPayWay.value
    payWayId.value = id
  }
}

// 确认订单
const confirmOrder = async () => {
  if (!userInfo.value || !userInfo.value.user_id) {
    showAlter.value = true
    alterText.value = '请登录'
  } else if (!chooseAddress.value) {
    showAlter.value = true
    alterText.value = '请选择收货地址'
  }
  store.save_order_param({
    user_id: userInfo.value.user_id,
    cart_id: checkoutData.value.cart.id,
    address_id: chooseAddress.value.id,
    description: remarklist.value,
    entities: checkoutData.value.cart.groups,
    geohash: geohash.value,
    sig: checkoutData.value.sig,
  })
  // 发送订单消息
  const orderRes = await placeOrders(
    userInfo.value.user_id,
    checkoutData.value.cart.id,
    chooseAddress.value.id,
    remarklist.value,
    checkoutData.value.cart.groups,
    geohash.value,
    checkoutData.value.sig,
  )
  console.log(orderRes, 'orderRes===')
  if (orderRes.status === 1) {
    store.order_success(orderRes)
    $router.push('/confirmOrder/payment')
  }
}

onMounted(() => {
  if (geohash.value) {
    initData()
  }
})

watch(
  () => userInfo.value,
  (value) => {
    if (value && value.user_id) {
      initAddress()
    }
  },
)
</script>

<template>
  <div class="confirmOrderContainer">
    <head-top head-title="确认订单" :go-back="true" signin-up="confirmOrder"></head-top>
    <section v-if="!showLoading">
      <router-link
        :to="{
          path: '/confirmOrder/chooseAddress',
          query: { id: checkoutData.cart.id, sig: checkoutData.sig },
        }"
        class="address_container"
      >
        <div class="address_empty_left">
          <svg class="location_icon">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#location"></use>
          </svg>
          <div class="add_address" v-if="!chooseAddress">请添加一个收货地址</div>
          <div v-else class="address_detail_container">
            <header>
              <span>{{ chooseAddress.name }}</span>
              <span>{{ chooseAddress.sex === 1 ? '先生' : '女士' }}</span>
              <span>{{ chooseAddress.phone }}</span>
            </header>
            <div class="address_detail">
              <span
                v-if="chooseAddress.tag"
                :style="{ backgroundColor: iconColor(chooseAddress.tag) }"
                >{{ chooseAddress.tag }}</span
              >
              <p>{{ chooseAddress.address_detail }}</p>
            </div>
          </div>
        </div>
        <svg class="address_empty_right">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
        </svg>
      </router-link>
      <section class="delivery_model container_style">
        <p class="deliver_text">送达时间</p>
        <section class="deliver_time">
          <p>尽快送达 | 预计 {{ checkoutData.delivery_reach_time }}</p>
          <p v-if="checkoutData.cart.is_deliver_by_fengniao">蜂鸟专送</p>
        </section>
      </section>
      <section class="pay_way container_style">
        <header class="header_style">
          <span>支付方式</span>
          <div class="more_type" @click.stop="showPayWayFun">
            <span>在线支付</span>
            <svg class="address_empty_right">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
            </svg>
          </div>
        </header>
        <section class="hongbo">
          <span>红包</span>
          <span>暂时只在饿了么 APP 中支持</span>
        </section>
      </section>
      <section class="food_list">
        <header v-if="checkoutData.cart.restaurant_info">
          <img :src="imgBaseUrl + checkoutData.cart.restaurant_info.image_path" />
          <span>{{ checkoutData.cart.restaurant_info.name }}</span>
        </header>
        <ul class="food_list_ul" v-if="checkoutData.cart.groups">
          <li v-for="item in checkoutData.cart.groups[0]" :key="item.id" class="food_item_style">
            <p class="food_name ellipsis">{{ item.name }}</p>
            <div class="num_price">
              <span>x {{ item.quantity }}</span>
              <span>¥{{ item.price }}</span>
            </div>
          </li>
        </ul>
        <div class="food_item_style" v-if="checkoutData.cart.extra">
          <p class="food_name ellipsis">{{ checkoutData.cart.extra[0].name }}</p>
          <div class="num_price">
            <span></span>
            <span>¥ {{ checkoutData.cart.extra[0].price }}</span>
          </div>
        </div>
        <div class="food_item_style">
          <p class="food_name ellipsis">配送费</p>
          <div class="num_price">
            <span></span>
            <span>¥ {{ checkoutData.cart.deliver_amount || 0 }}</span>
          </div>
        </div>
        <div class="food_item_style total_price">
          <p class="food_name ellipsis">订单 ¥{{ checkoutData.cart.total }}</p>
          <div class="num_price">
            <span>待支付 ¥{{ checkoutData.cart.total }}</span>
          </div>
        </div>
      </section>
      <section class="pay_way container_style">
        <router-link
          :to="{
            path: '/confirmOrder/remark',
            query: { id: checkoutData.cart.id, sig: checkoutData.sig },
          }"
          class="header_style"
        >
          <span>订单备注</span>
          <div class="more_type">
            <!--<span class="ellipsis">{{ remarkText || inputText ? remarklist : '口味、偏好等' }}</span>-->
            <span class="ellipsis">{{ remarklist }}</span>
            <svg class="address_empty_right">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
            </svg>
          </div>
        </router-link>
        <div class="hongbo" :class="{ support_is_available: checkoutData.invoice.is_available }">
          <span>发票抬头</span>
          <span
            >{{ checkoutData.invoice.status_text }}
            <svg class="address_empty_right">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
            </svg>
          </span>
        </div>
      </section>
      <section class="confrim_order">
        <p>待支付 ¥{{ checkoutData.cart.total }}</p>
        <p @click.stop="confirmOrder">确认下单</p>
      </section>
      <transition name="fade">
        <div class="cover" v-if="showPayWay" @click.stop="showPayWayFun"></div>
      </transition>
      <transition name="slid_up">
        <div class="choose_type_Container" v-if="showPayWay">
          <header>支付方式</header>
          <ul>
            <li
              v-for="item in checkoutData.payments"
              :key="item.id"
              :class="{ choose: payWayId === item.id }"
            >
              <span
                >{{ item.name
                }}<span v-if="!item.is_online_payment">{{ item.description }}</span></span
              >
              <svg
                class="address_empty_right"
                @click="choosePayWay(item.is_online_payment, item.id)"
              >
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
              </svg>
            </li>
          </ul>
        </div>
      </transition>
    </section>
    <loading v-show="showLoading" />
    <AlterTip v-if="showAlter" @closeTip="showAlter = false" :alterText="alterText"></AlterTip>
  </div>
</template>

<style scoped lang="scss">
@import '@/style/mixin';

.confirmOrderContainer {
  padding-top: 1.95rem;
  padding-bottom: 3rem;

  p,
  span {
    font-family:
      Helvetica Neue,
      Tahoma,
      Arial;
  }
}

.container_style {
  background-color: #fff;
  margin-top: 0.4rem;
  padding: 0 0.7rem;
}

.address_container {
  min-height: 3.5rem;
  @include fj;
  align-items: center;
  padding: 0 0.6rem;
  background: url(../../assets/address_bottom.png) left bottom repeat-x;
  background-color: #fff;
  background-size: auto 0.12rem;

  .address_empty_left {
    display: flex;
    align-items: center;

    .location_icon {
      @include wh(0.8rem, 0.8rem);
      fill: $blue;
      margin-right: 0.2rem;
    }

    .add_address {
      @include sc(0.7rem, #333);
    }

    .address_detail_container {
      margin-left: 0.2rem;

      header {
        @include sc(0.65rem, #333);

        span:nth-of-type(1) {
          font-size: 0.8rem;
          font-weight: bold;
        }
      }

      .address_detail {
        width: 100%;
        display: flex;
        align-items: center;

        span {
          @include sc(0.5rem, #fff);
          border-radius: 0.15rem;
          background-color: #ff5722;
          height: 0.6rem;
          line-height: 0.6rem;
          padding: 0 0.2rem;
          margin-right: 0.3rem;
        }

        p {
          @include sc(0.55rem, #777);
        }
      }
    }
  }
}

.address_empty_right {
  @include wh(0.6rem, 0.6rem);
  fill: #999;
}

.delivery_model {
  border-left: 0.2rem solid $blue;
  min-height: 4rem;
  @include fj;
  align-items: center;

  .deliver_text {
    @include sc(0.8rem, #333);
    font-weight: bold;
    padding-left: 0.3rem;
  }

  .deliver_time {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    p:nth-of-type(1) {
      @include sc(0.7rem, $blue);
    }

    p:nth-of-type(2) {
      @include sc(0.5rem, #fff);
      background-color: $blue;
      width: 2.4rem;
      margin-top: 0.5rem;
      text-align: center;
      border-radius: 0.12rem;
      padding: 0.1rem;
    }
  }
}

.pay_way {
  .header_style {
    @include fj;
    line-height: 2rem;

    span:nth-of-type(1) {
      @include sc(0.7rem, #666);
    }

    .more_type {
      span:nth-of-type(1) {
        @include sc(0.6rem, #aaa);
        width: 10rem;
        display: inline-block;
        text-align: right;
        vertical-align: middle;
      }

      svg {
        @include wh(0.5rem, 0.5rem);
        fill: #ccc;
      }
    }
  }

  .hongbo {
    @include fj;
    border-top: 0.025rem solid #f5f5f5;

    span {
      @include sc(0.6rem, #aaa);
      line-height: 2rem;

      svg {
        @include wh(0.5rem, 0.5rem);
        vertical-align: middle;
        fill: #ccc;
      }
    }

    span:nth-of-type(2) {
      color: #aaa;
    }
  }

  .support_is_available {
    span {
      color: #666;
    }
  }
}

.food_list {
  background-color: #fff;
  margin-top: 0.4rem;

  header {
    padding: 0.7rem;
    border-bottom: 0.025rem solid #f5f5f5;

    img {
      @include wh(1.2rem, 1.2rem);
      vertical-align: middle;
    }

    span {
      @include sc(0.8rem, #333);
    }
  }

  .food_list_ul {
    padding-top: 0.5rem;
  }

  .food_item_style {
    @include fj;
    line-height: 1.8rem;
    padding: 0 0.7rem;

    span,
    p {
      @include sc(0.65rem, #666);
    }

    .food_name {
      width: 11rem;
    }

    .num_price {
      flex: 1;
      @include fj;
      align-items: center;

      span:nth-of-type(1) {
        color: #f60;
      }
    }
  }

  .total_price {
    border-top: 0.025rem solid #f5f5f5;
  }
}

.confrim_order {
  display: flex;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 2rem;

  p {
    line-height: 2rem;
    @include sc(0.75rem, #fff);
  }

  p:nth-of-type(1) {
    background-color: #3c3c3c;
    flex: 5;
    padding-left: 0.7rem;
  }

  p:nth-of-type(2) {
    flex: 2;
    background-color: #56d176;
    text-align: center;
  }
}

.cover {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 203;
}

.choose_type_Container {
  min-height: 10rem;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 204;

  header {
    background-color: #fafafa;
    @include sc(0.7rem, #333);
    text-align: center;
    line-height: 2rem;
  }

  ul {
    li {
      @include fj;
      padding: 0 0.7rem;
      line-height: 2.5rem;
      align-items: center;

      span {
        @include sc(0.7rem, #ccc);
      }

      svg {
        @include wh(0.8rem, 0.8rem);
        fill: #eee;
      }
    }

    .choose {
      span {
        color: #333;
      }

      svg {
        fill: #4cd964;
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.slid_up-enter-active,
.slid_up-leave-active {
  transition: all 0.3s;
}

.slid_up-enter,
.slid_up-leave-active {
  transform: translate3d(0, 10rem, 0);
}

.router-slid-enter-active,
.router-slid-leave-active {
  transition: all 0.4s;
}

.router-slid-enter,
.router-slid-leave-active {
  transform: translate3d(2rem, 0, 0);
  opacity: 0;
}
</style>
