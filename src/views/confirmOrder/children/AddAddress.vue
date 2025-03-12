<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import HeadTop from '@/components/header/index.vue'
import AlterTip from '@/components/common/AlterTip.vue'
import useStore from '@/store/index.js'
import { postAddAddress } from '@/service/getData.js'

const store = useStore()
const $router = useRouter()

const userInfo = computed(() => store.userInfo)
const searchAddress = computed(() => store.searchAddress)
const geohash = computed(() => store.geohash)

const tags = {
  家: 2,
  学校: 3,
  公司: 4,
}
const name = ref(null)
const sex = ref(1)
const phone = ref(null)
const anntherPhoneNumber = ref(null) // 备用电话
const address_detail = ref(null) // 详细地址
const phone_bk = ref(false) // 是否选择备注电话
const tag = ref('') // 备注
const showAlter = ref(false)
const alterText = ref('')
const tag_type = ref(1)

const chooseSex = (sex) => {
  sex.value = sex
}

const addAddress = async () => {
  if (!userInfo.value || !userInfo.value.user_id) {
    showAlter.value = true
    alterText.value = '请登录'
  } else if (!name.value) {
    showAlter.value = true
    alterText.value = '请输入名字'
  } else if (!phone.value) {
    showAlter.value = true
    alterText.value = '请输入手机号'
  } else if (!searchAddress.value) {
    showAlter.value = true
    alterText.value = '请选择地址'
  } else if (!address_detail.value) {
    showAlter.value = true
    alterText.value = '请选择详细地址'
  }
  tag_type.value = tags[tag.value] || 1
  const res = await postAddAddress(
    userInfo.value.user_id,
    searchAddress.value.name,
    address_detail.value,
    geohash.value,
    name.value,
    phone.value,
    anntherPhoneNumber.value,
    0,
    sex.value,
    tag.value,
    tag_type.value,
  )
  if (res.message) {
    showAlter.value = true
    alterText.value = res.message
  } else {
    store.confirm_address(1)
    $router.go(-1)
  }
}
</script>

<template>
  <div class="address_page">
    <head-top head-title="添加地址" :go-back="true"></head-top>
    <section class="page_text_container">
      <section class="section_list">
        <span class="section_left">联系人</span>
        <section class="section_right">
          <input
            type="text"
            name="name"
            placeholder="你的名字"
            v-model="name"
            class="input_style"
          />
          <div class="choose_sex">
            <span class="choose_option">
              <svg
                class="address_empty_right"
                @click="chooseSex(1)"
                :class="{ choosed: sex === 1 }"
              >
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
              </svg>
              <span>先生</span>
            </span>
            <span class="choose_option">
              <svg
                class="address_empty_right"
                @click="chooseSex(2)"
                :class="{ choosed: sex === 2 }"
              >
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
              </svg>
              <span>女士</span>
            </span>
          </div>
        </section>
      </section>
      <section class="section_list">
        <span class="section_left">联系电话</span>
        <section class="section_right">
          <div class="phone_add">
            <input
              type="number"
              name="phone"
              placeholder="你的手机号"
              v-model="phone"
              class="input_style"
            />
            <img
              src="../../../assets/add_phone.png"
              height="20"
              width="20"
              @click="phone_bk = true"
            />
          </div>
          <input
            v-if="phone_bk"
            type="number"
            name="anntherPhoneNumber"
            placeholder="备选电话"
            v-model="anntherPhoneNumber"
            class="input_style phone_bk"
          />
        </section>
      </section>
      <section class="section_list">
        <span class="section_left">送餐地址</span>
        <section class="section_right">
          <router-link to="/confirmOrder/searchAddress" tag="div" class="choose_address">
            {{ searchAddress ? searchAddress.name : '小区/写字楼/学校等' }}
          </router-link>
          <input
            type="text"
            name="address_detail"
            placeholder="详细地址（如门牌号等）"
            v-model="address_detail"
            class="input_style"
          />
        </section>
      </section>
      <section class="section_list">
        <span class="section_left">标签</span>
        <section class="section_right">
          <input
            type="text"
            name="tag"
            placeholder="无/家/学校/公司"
            v-model="tag"
            class="input_style"
          />
        </section>
      </section>
    </section>
    <div class="determine" @click="addAddress">确定</div>
    <alter-tip v-if="showAlter" @closeTip="showAlter = false" :alterText="alterText"></alter-tip>
  </div>
</template>

<style scoped lang="scss">
@import '@/style/mixin';

.address_page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f5f5;
  z-index: 204;
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

.page_text_container {
  background-color: #fff;
  padding: 0 0.7rem;
}

.section_list {
  display: flex;
  border-bottom: 0.025rem solid #f5f5f5;

  .section_left {
    @include sc(0.7rem, #333);
    flex: 2;
    line-height: 2.5rem;
  }

  .section_right {
    flex: 5;

    .input_style {
      width: 100%;
      height: 2.5rem;
      @include sc(0.7rem, #999);
    }

    .phone_bk {
      border-top: 0.025rem solid #f5f5f5;
    }

    .phone_add {
      @include fj;
      align-items: center;
    }

    .choose_sex {
      display: flex;
      line-height: 2.5rem;
      border-top: 0.025rem solid #f5f5f5;

      .choose_option {
        @include sc(0.7rem, #333);
        display: flex;
        align-items: center;
        margin-right: 0.8rem;

        svg {
          margin-right: 0.3rem;
          @include wh(0.8rem, 0.8rem);
          fill: #ccc;
        }

        .choosed {
          fill: #4cd964;
        }
      }
    }

    .choose_address {
      @include sc(0.7rem, #999);
      line-height: 2.5rem;
      border-bottom: 0.025rem solid #f5f5f5;
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
  margin-top: 0.6rem;
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
