<script setup>
import { ref, onMounted } from 'vue'
import HeadTop from '@/components/header/index.vue'
import RatingStar from '@/components/common/RatingStar.vue'
import { getStore, imgBaseUrl } from '@/utils/index.js'

const image_path = ref(null)
const description = ref(null)
const month_sales = ref(null)
const name = ref(null)
const rating = ref(null)
const rating_count = ref(null)
const satisfy_rate = ref(null)
const foods = ref(null)
const shopId = ref(null)

onMounted(() => {
  const foodDetail = JSON.parse(getStore('foodDetail'));
  image_path.value = foodDetail.image_path;
  description.value = foodDetail.description;
  rating.value = foodDetail.rating;
  month_sales.value = foodDetail.month_sales;
  name.value = foodDetail.name;
  rating_count.value = foodDetail.rating_count;
  satisfy_rate.value = foodDetail.satisfy_rate;
  foods.value = foodDetail;
  shopId.value = foodDetail.shop_id;
})

</script>

<template>
  <div class="rating_page">
    <head-top :head-title="name" :go-back="true"></head-top>
    <section class="header_img">
      <img :src="imgBaseUrl + image_path" class="food_img" alt="" />
      <div class="cover"></div>
    </section>
    <p class="description">{{ description }}</p>
    <section class="detail_container">
      <section class="detail_left">
        <p>{{ name }}</p>
        <div class="rating_sale">
          <span>评分</span>
          <rating-star :rating="rating"></rating-star>
          <span>{{ rating?.toFixed(1) }}</span>
        </div>
        <p>
          <span>月售 {{ month_sales }}单</span>
          <span>售价 ¥{{ foods?.specfoods[0].price }}</span>
          <span v-if="foods?.specfoods.length">起</span>
        </p>
        <p>
          <span>评论数 {{ rating_count }}</span>
          <span>好评率 {{ satisfy_rate }}%</span>
        </p>
      </section>
    </section>
  </div>
</template>

<style scoped lang="scss">
@import '@/style/mixin';

.rating_page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 12;
  padding-top: 1.95rem;

  p,
  span {
    font-family:
      Helvetica Neue,
      Tahoma,
      Arial;
  }
}

.header_img {
  position: relative;

  .food_img {
    width: 100%;
    display: block;
  }

  .cover {
    position: absolute;
    @include wh(100%, 100%);
    top: 0;
    left: 0;
  }
}

.description {
  @include sc(0.6rem, #666);
  margin-top: 0.5rem;
  line-height: 0.8rem;
  bottom: 0.2rem;
  padding: 0 0.4rem;
}

.detail_container {
  padding: 0.5rem;
  @include fj;
  align-items: center;

  .detail_left {
    p:nth-of-type(1) {
      @include sc(0.7rem, #333);
      margin-bottom: 0.2rem;
    }

    .rating_sale {
      display: flex;
      align-items: center;

      span:nth-of-type(1) {
        @include sc(0.6rem, #666);
        margin-right: 0.2rem;
      }

      span:nth-of-type(2) {
        @include sc(0.55rem, #f60);
        margin-left: 0.2rem;
      }

      span:nth-of-type(3) {
        @include sc(0.6rem, #666);
        margin-left: 0.4rem;
      }
    }

    p:nth-of-type(2) {
      font-size: 0;
      margin-top: 0.3rem;

      span:nth-of-type(1) {
        @include sc(0.6rem, #666);
        margin-right: 0.4rem;
      }

      span:nth-of-type(2),
      span:nth-of-type(3) {
        @include sc(0.6rem, #f60);
        margin-right: 0.2rem;
      }
    }

    p:nth-of-type(3) {
      span {
        @include sc(0.6rem, #666);
      }
    }
  }
}
</style>
