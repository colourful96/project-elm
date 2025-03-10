<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import Loading from './Loading.vue'
import RatingStar from './RatingStar.vue'
import useStore from '@/store/index.js'
import { shopList } from '@/service/getData.js'

const store = useStore()

const {
  geohash,
  restaurantCategoryId,
  restaurantCategoryIds,
  sortByType,
  confirmSelect,
  deliveryMode,
  supportIds,
} = defineProps([
  'geohash',
  'restaurantCategoryId',
  'restaurantCategoryIds',
  'sortByType',
  'confirmSelect',
  'deliveryMode',
  'supportIds',
])

const offset = ref(0)
const shopListArr = ref([])
const touchend = ref(false) // 是否还有更多数据
const showLoading = ref(true) // 显示加载动画
const imgBaseUrl = ref('https://elm.cangdu.org/img/')
const preventRepeatRequest = ref(false) // 到达底部重新加载，防止重复加载
const showBackStatus = ref(false) // 是否显示返回顶部按钮

const initData = async () => {
  const res = await shopList(store.latitude, store.longitude, offset.value, restaurantCategoryId)
  shopListArr.value = [...res]
  if (res.length < 20) {
    touchend.value = true
  }
  showLoading.value = false
}

const zhunshi = (supports) => {
  let status
  if (Array.isArray(supports) && supports.length) {
    supports.forEach((s) => {
      if (s.icon_name === '准') {
        status = true
      }
    })
  } else {
    status = false
  }
  return status
}

// 返回顶部
const backTop = () => {
  // animate(document.body, {scrollTop: '0'}, 400, 'ease-out');
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const loadMore = async () => {
  if (touchend.value || preventRepeatRequest.value) {
    return
  }
  showLoading.value = true
  preventRepeatRequest.value = true

  offset.value += 20
  const res = await shopList(store.latitude, store.longitude, offset.value, restaurantCategoryId)
  showLoading.value = false
  shopListArr.value = [...shopListArr.value, ...res]
  if (res.length < 20) {
    touchend.value = true
    return
  }
  preventRepeatRequest.value = false
}

const onScroll = () => {
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
    loadMore()
  }
  if (window.scrollY > 500) {
    showBackStatus.value = true
  } else {
    showBackStatus.value = false
  }
}
// props变化后重新获取数据
const listenPropChange = async () => {
  showLoading.value = true
  offset.value = 0
  const data = await shopList(
    store.latitude,
    store.longitude,
    offset.value,
    '',
    restaurantCategoryIds,
    sortByType,
    deliveryMode,
    supportIds,
  )
  showLoading.value = false
  shopListArr.value = [...data]
}

onMounted(() => {
  initData()
  window.addEventListener('scroll', onScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

watch(() => restaurantCategoryIds, () => {
  listenPropChange();
})
watch(() => sortByType, () => {
  listenPropChange();
})
watch(() => confirmSelect, () => {
  listenPropChange();
})
</script>

<template>
  <div class="shoplist_container">
    <ul v-if="shopListArr.length">
      <router-link
        :to="{ path: 'shop', query: { geohash, id: item.id } }"
        v-for="item in shopListArr"
        :key="item.id"
        tag="li"
        class="shop_li"
      >
        <section>
          <img :src="imgBaseUrl + item.image_path" class="shop_img" alt="" />
        </section>
        <hgroup class="shop_right">
          <header class="shop_detail_header">
            <h4 class="shop_title ellipsis" :class="item.is_premium ? 'premium' : ''">
              {{ item.name }}
            </h4>
            <ul class="shop_detail_ul">
              <li v-for="s in item.supports" :key="s.id" class="supports">{{ s.icon_name }}</li>
            </ul>
          </header>
          <h5 class="rating_order_num">
            <section class="rating_order_num_left">
              <section class="rating_section">
                <rating-star :rating="item.rating"></rating-star>
                <span class="rating_num">{{ item.rating }}</span>
              </section>
              <section class="order_section">月售{{ item.recent_order_num }}单</section>
            </section>
            <section class="rating_order_num_right">
              <span class="delivery_style delivery_left" v-if="item.delivery_mode">{{
                item.delivery_mode.text
              }}</span>
              <span class="delivery_style delivery_right" v-if="zhunshi(item.supports)"
                >准时达</span
              >
            </section>
          </h5>
          <h5 class="fee_distance">
            <p class="fee">
              ¥{{ item.float_minimum_order_amount }}起送
              <span class="segmentation">/</span>
              {{ item.piecewise_agent_fee.tips }}
            </p>
            <p class="distance_time">
              <span v-if="Number(item.distance)">
                {{
                  item.distance > 1000
                    ? (item.distance / 1000).toFixed(2) + 'km'
                    : item.distance + 'm'
                }}
                <span class="segmentation">/</span>
              </span>
              <span v-else>{{ item.distance }}</span>
              <span class="segmentation">/</span>
              <span class="order_time">{{ item.order_lead_time }}</span>
            </p>
          </h5>
        </hgroup>
      </router-link>
    </ul>
    <ul v-else class="animation_opactiy">
      <li class="list_back_li" v-for="i in 10" :key="i">
        <img src="@/assets/shopback.svg" class="list_back_svg" alt="" />
      </li>
    </ul>
    <p v-if="touchend" class="empty_data">没有更多了</p>
    <aside class="return_top" @click="backTop" v-if="showBackStatus">
      <svg class="back_top_svg">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#backtop"></use>
      </svg>
    </aside>
    <loading v-show="showLoading"></loading>
  </div>
</template>

<style scoped lang="scss">
@import '@/style/mixin';

.shoplist_container {
  background-color: #fff;
  margin-bottom: 2rem;
}

.shop_li {
  display: flex;
  border-bottom: 0.025rem solid #f1f1f1;
  padding: 0.7rem 0.4rem;
}

.shop_img {
  @include wh(2.7rem, 2.7rem);
  display: block;
  margin-right: 0.4rem;
}

.list_back_li {
  height: 4.85rem;

  .list_back_svg {
    @include wh(100%, 100%);
  }
}

.shop_right {
  flex: auto;

  .shop_detail_header {
    @include fj;
    align-items: center;

    .shop_title {
      width: 8.5rem;
      color: #333;
      padding-top: 0.01rem;
      @include font(0.65rem, 0.65rem, 'PingFangSC-Regular');
      font-weight: 700;
    }

    .premium::before {
      content: '品牌';
      display: inline-block;
      font-size: 0.5rem;
      line-height: 0.6rem;
      color: #333;
      background-color: #ffd930;
      padding: 0 0.1rem;
      border-radius: 0.1rem;
      margin-right: 0.2rem;
    }

    .shop_detail_ul {
      display: flex;
      transform: scale(0.8);
      margin-right: -0.3rem;

      .supports {
        @include sc(0.5rem, #999);
        border: 0.025rem solid #f1f1f1;
        padding: 0 0.04rem;
        border-radius: 0.08rem;
        margin-left: 0.05rem;
      }
    }
  }

  .rating_order_num {
    @include fj(space-between);
    height: 0.6rem;
    margin-top: 0.52rem;

    .rating_order_num_left {
      @include fj(flex-start);

      .rating_section {
        display: flex;

        .rating_num {
          @include sc(0.4rem, #ff6000);
          margin: 0 0.2rem;
        }
      }

      .order_section {
        transform: scale(0.8);
        margin-left: -0.2rem;
        @include sc(0.4rem, #666);
      }
    }

    .rating_order_num_right {
      display: flex;
      align-items: center;
      transform: scale(0.7);
      min-width: 5rem;
      justify-content: flex-end;
      margin-right: -0.8rem;

      .delivery_style {
        font-size: 0.4rem;
        padding: 0.04rem 0.08rem 0;
        border-radius: 0.08rem;
        margin-left: 0.08rem;
        border: 1px;
      }

      .delivery_left {
        color: #fff;
        background-color: $blue;
        border: 0.025rem solid $blue;
      }

      .delivery_right {
        color: $blue;
        border: 0.025rem solid $blue;
      }
    }
  }

  .fee_distance {
    margin-top: 0.52rem;
    @include fj;
    @include sc(0.5rem, #333);

    .fee {
      transform: scale(0.9);
      @include sc(0.5rem, #666);
    }

    .distance_time {
      transform: scale(0.9);

      span {
        color: #999;
      }

      .order_time {
        color: $blue;
      }

      .segmentation {
        color: #ccc;
      }
    }
  }
}

.loader_more {
  @include font(0.6rem, 3);
  text-align: center;
  color: #999;
}

.empty_data {
  @include sc(0.5rem, #666);
  text-align: center;
  line-height: 2rem;
}

.return_top {
  position: fixed;
  bottom: 3rem;
  right: 1rem;

  .back_top_svg {
    @include wh(2rem, 2rem);
  }
}

.loading-enter-active,
.loading-leave-active {
  transition: opacity 1s;
}

.loading-enter,
.loading-leave-active {
  opacity: 0;
}
</style>
