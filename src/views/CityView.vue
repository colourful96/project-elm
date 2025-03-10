<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HeadTop from '@/components/header/index.vue'
import { currentcity, searchplace } from '@/service/getData.js'
import { getStore, removeStore, setStore } from '@/utils/index.js'

const $route = useRoute()
const $router = useRouter()

const cityname = ref('') // 当前城市名字
const inputValue = ref('') // 输入框的值
const cityid = ref('') // 当前城市id
const placeNone = ref(false) // 搜索无结果显示信息
const historytitle = ref(true) // 默认显示历史记录，点击搜索后隐藏
const placelist = ref([]) // 搜索结果
const placeHistory = ref([]) // 历史搜索记录

const initData = () => {
  const placeHistory = getStore('placeHistory')
  if (placeHistory) {
    placelist.value = JSON.parse(placeHistory)
  } else {
    placelist.value = []
  }
}

const postpois = () => {
  if (inputValue.value) {
    searchplace(cityid.value, inputValue.value).then((res) => {
      historytitle.value = false
      placelist.value = res
      placeNone.value = !res.length
    })
  }
}

const nextpage = (index, geohash) => {
  let history = getStore('placeHistory')
  let choosePlace = placelist.value[index]
  if (history) {
    let checkrepeat = false
    placeHistory.value = JSON.parse(history)
    placeHistory.value.forEach((item) => {
      if (item.geohash === geohash) {
        checkrepeat = true
      }
    })
    if (!checkrepeat) {
      placeHistory.value.push(choosePlace)
    }
  } else {
    placeHistory.value.push(choosePlace)
  }
  setStore('placeHistory', placeHistory.value)
  $router.push({ path: '/msite', query: { geohash } })
}
const clearAll = () => {
  removeStore('placeHistory')
  this.initData()
}

onMounted(() => {
  cityid.value = $route.params.cityid
  currentcity(cityid.value).then((res) => {
    cityname.value = res.name
  })
  initData()
})
</script>

<template>
  <div class="city_container">
    <head-top :head-title="cityname" :go-back="true">
      <template v-slot:changecity>
        <router-link class="change_city" to="/home">切换城市</router-link>
      </template>
    </head-top>
    <form class="city_form" v-on:submit.prevent>
      <div>
        <input
          type="search"
          name="city"
          placeholder="输入学校、商务楼、地址"
          class="city_input input_style"
          required
          v-model="inputValue"
        />
      </div>
      <div>
        <input
          type="submit"
          name="submit"
          value="提交"
          class="city_submit input_style"
          @click="postpois"
        />
      </div>
    </form>
    <header v-if="historytitle" class="pois_search_history">搜索历史</header>
    <ul class="getpois_ul">
      <li v-for="(item, index) in placelist" :key="index" @click="nextpage(index, item.geohash)">
        <h4 class="pois_name ellipsis">{{ item.name }}</h4>
        <p class="pois_address ellipsis">{{ item.address }}</p>
      </li>
    </ul>
    <footer class="clear_all_history" v-if="historytitle && placelist.length" @click="clearAll">
      清空所有
    </footer>
    <div class="search_none_place" v-if="placeNone">很抱歉！无搜索结果</div>
  </div>
</template>

<style scoped lang="scss">
@import '@/style/mixin.scss';

.city_container {
  padding-top: 2.35rem;
}

.change_city {
  right: 0.4rem;
  @include sc(0.6rem, #fff);
  @include ct;
}

.city_form {
  background-color: #fff;
  border-top: 1px solid $bc;
  border-bottom: 1px solid $bc;
  padding-top: 0.4rem;

  div {
    width: 90%;
    margin: 0 auto;
    text-align: center;

    .input_style {
      border-radius: 0.1rem;
      margin-bottom: 0.4rem;
      @include wh(100%, 1.4rem);
    }

    .city_input {
      border: 1px solid $bc;
      padding: 0 0.3rem;
      @include sc(0.65rem, #333);
    }

    .city_submit {
      background-color: $blue;
      @include sc(0.65rem, #fff);
    }
  }
}

.pois_search_history {
  border-top: 1px solid $bc;
  border-bottom: 1px solid $bc;
  padding-left: 0.5rem;
  @include font(0.475rem, 0.8rem);
}

.getpois_ul {
  background-color: #fff;
  border-top: 1px solid $bc;

  li {
    margin: 0 auto;
    padding-top: 0.65rem;
    border-bottom: 1px solid $bc;

    .pois_name {
      margin: 0 auto 0.35rem;
      width: 90%;
      @include sc(0.65rem, #333);
    }

    .pois_address {
      width: 90%;
      margin: 0 auto 0.55rem;
      @include sc(0.45rem, #999);
    }
  }
}

.search_none_place {
  margin: 0 auto;
  @include font(0.65rem, 1.75rem);
  color: #333;
  background-color: #fff;
  text-indent: 0.5rem;
}

.clear_all_history {
  @include sc(0.7rem, #666);
  text-align: center;
  line-height: 2rem;
  background-color: #fff;
}
</style>
