<script setup>
import { ref, computed } from 'vue'
import useStore from '@/store/index.js'

const store = useStore()

const props = defineProps(['foods', 'shopId'])
const showMoveDot = ref([])

const cartList = computed(() => store.cartList)
const shopCart = computed(() => {
  if (cartList[props.shopId]) {
    return Object.assign({}, cartList[props.shopId])
  }
  return undefined
})
const foodNum = computed(() => {
  let category_id = props.foods.category_id
  let item_id = props.foods.item_id
  if (shopCart.value && shopCart.value[category_id] && shopCart.value[category_id][item_id]) {
    let num = 0
    Object.values(shopCart.value[category_id][item_id]).forEach((item) => {
      num += item.num
    })
    return num
  } else {
    return 0
  }
})

const showChooseList = (foods) => {
  this.$emit('showChooseList', foods);
}
const addToCart = (category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock, event) => {
  store.add_cart({
    shopid: props.shopId,
    category_id,
    item_id,
    food_id,
    name,
    price,
    specs,
    packing_fee,
    sku_id,
    stock
  });
  const elLeft = event.target.getBoundingClientRect().left;
  const elBottom = event.target.getBoundingClientRect().bottom;
  showMoveDot.value.push(true);
  this.$emit('showMoveDot', this.showMoveDot, elLeft, elBottom);
}

const removeOutCart = (category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock) => {
  if (foodNum.value > 0) {
    store.reduce_cart({shopid: props.shopId, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock});
  }
}
const showReduceTip = () => {
  this.$emit('showReduceTip')
}

</script>

<template>
  <section class="cart_module">
    <!--    直接加入购物车-->
    <section class="cart_button" v-if="!foods.specifications.length">
      <transition name="showReduce">
        <span
          v-if="foodNum"
          @click="
            removeOutCart(
              foods.category_id,
              foods.item_id,
              foods.specfoods[0].food_id,
              foods.specfoods[0].name,
              foods.specfoods[0].price,
              '',
              foods.specfoods[0].packing_fee,
              foods.specfoods[0].sku_id,
              foods.specfoods[0].stock,
            )
          "
        >
          <svg>
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-minus"></use>
          </svg>
        </span>
      </transition>
      <transition name="fade">
        <span class="cart_num" v-if="foodNum">{{ foodNum }}</span>
      </transition>
      <svg
        class="add_icon"
        @click="
          addToCart(
            foods.category_id,
            foods.item_id,
            foods.specfoods[0].food_id,
            foods.specfoods[0].name,
            foods.specfoods[0].price,
            '',
            foods.specfoods[0].packing_fee,
            foods.specfoods[0].sku_id,
            foods.specfoods[0].stock,
            $event,
          )
        "
      >
        >
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
      </svg>
    </section>
    <!--    选规格-->
    <section v-else class="choose_specification">
      <section class="choose_icon_container">
        <transition name="showReduce">
          <svg class="specs_reduce_icon" v-if="foodNum" @click.stop="showReduceTip">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-minus"></use>
          </svg>
        </transition>
        <transition name="fade">
          <span class="cart_num" v-if="foodNum">{{ foodNum }}</span>
        </transition>
        <span class="show_chooselist" @click.stop="showChooseList(foods)">选规格</span>
      </section>
    </section>
  </section>
</template>

<style scoped lang="scss">
@import '@/style/mixin';

.cart_module {
  .add_icon {
    position: relative;
    z-index: 9;
  }

  .cart_button {
    display: flex;
    align-items: center;
  }

  svg {
    @include wh(0.9rem, 0.9rem);
    fill: #3190e8;
  }

  .specs_reduce_icon {
    fill: #999;
  }

  .cart_num {
    @include sc(0.65rem, #666);
    min-width: 1rem;
    text-align: center;
    font-family:
      Helvetica Neue,
      Tahoma;
  }

  .choose_specification {
    .choose_icon_container {
      display: flex;
      align-items: center;

      .show_chooselist {
        display: block;
        @include sc(0.55rem, #fff);
        padding: 0.1rem 0.2rem;
        background-color: $blue;
        border-radius: 0.2rem;
        border: 1px solid $blue;
      }
    }
  }
}

.showReduce-enter-active,
.showReduce-leave-active {
  transition: all 0.3s ease-out;
}

.showReduce-enter,
.showReduce-leave-active {
  opacity: 0;
  transform: translateX(1rem);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.fadeBounce-enter-active,
.fadeBounce-leave-active {
  transition: all 0.3s;
}

.fadeBounce-enter,
.fadeBounce-leave-active {
  opacity: 0;
  transform: scale(0.7);
}
</style>
