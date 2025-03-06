<script setup>
import { ref } from 'vue'
import {useRouter} from 'vue-router'
import HeadTop from '@/components/header/index.vue'
import AlterTip from '@/components/common/AlterTip.vue'
import useStore from '@/store/index.js'
import { regPhone } from '@/utils/index.js'
import {postAddAddress} from '@/service/getData.js'

const $router = useRouter()
const store = useStore()
const { addAddress, geohash, userInfo, add_removeList } = store

const verifyName = ref(false)
const name = ref('')
const verifyFoodAddress = ref(false)
const foodAddress = ref('')
const sendaddress = ref('')
const telenum = ref('')
const verifyTelenum = ref(false)
const telephone = ref('')
const verifySparePhone = ref(false)
const sparePhone = ref('')
const sparePhoneTip = ref('')
const alterText = ref('')
const showAlert = ref(false)

const inputName = () => {
  verifyName.value = !name.value
}

const inputFoodAddress = () => {
  verifyFoodAddress.value = true
  if (foodAddress.value.length === 0) {
    sendaddress.value = '请填写详细的送餐地址'
  } else if (foodAddress.value.length > 0 && foodAddress.value.length < 2) {
    sendaddress.value = '送餐地址太短了，不能辨识'
  } else {
    sendaddress.value = ''
    verifyFoodAddress.value = false
  }
}

const inputTelenum = () => {
  verifyTelenum.value = true
  if (regPhone.test(telenum.value)) {
    verifyTelenum.value = false
  } else if (telenum.value === '') {
    telephone.value = '手机号不能为空'
  } else {
    telephone.value = '手机号格式不正确'
  }
}

const inputSparePhone = () => {
  verifySparePhone.value = true
  if (!regPhone.test(sparePhone.value) || sparePhone.value === '') {
    sparePhoneTip.value = '请填写正确的手机号'
  } else {
    verifySparePhone.value = false
    sparePhoneTip.value = ''
  }
}

const submitThing = () => {
  if (!name.value || !addAddress.value || !foodAddress.value || !telenum.value) return;
  postAddAddress(userInfo.user_id, foodAddress.value, addAddress.value, geohash, name.value, telenum.value, sparePhone.value, 0, 1, '公司', 4).then(res => {
    if (res.message) {
      alterText.value = res.message;
      showAlert.value = true;
    } else {
      add_removeList({
        name: this.name,
        address: foodAddress.value,
        address_detail: addAddress.value,
        geohash: 'wtw37r7cxep4',
        phone: telenum.value,
        phone_bk: sparePhone.value,
        poi: addAddress.value,
        poi_type: 0,
      })
      $router.go(-1);
    }
  })
}

</script>

<template>
  <div class="rating_page">
    <head-top :head-title="'新增地址'" :go-back="true"></head-top>
    <section class="adddetail">
      <form action="" v-on:submit.prevent>
        <section class="ui-padding-block">
          <div class="input-new">
            <input
              type="text"
              placeholder="请填写您的姓名"
              :class="{ verifies: verifyName }"
              v-model="name"
              @input="inputName"
            />
            <p v-if="verifyName">提示：请填写您的姓名</p>
          </div>
          <router-link to="/profile/addaddressdetail" class="add-detail">
            <div class="input-new">
              <input
                type="text"
                placeholder="小区/写字楼/学校等"
                readonly="readonly"
                v-model="addAddress"
              />
            </div>
          </router-link>
          <div class="input-new">
            <input
              type="text"
              placeholder="请填写详细送餐地址"
              :class="{ verifies: verifyFoodAddress }"
              v-model="foodAddress"
              @input="inputFoodAddress"
            />
            <p v-if="verifyFoodAddress">{{ sendaddress }}</p>
          </div>
          <div class="input-new">
            <input
              type="text"
              placeholder="请填写您的手机号码"
              :class="{ verifies: verifyTelenum }"
              maxlength="11"
              @input="inputTelenum"
              v-model="telenum"
            />
            <p v-if="verifyTelenum">{{ telephone }}</p>
          </div>
          <div class="input-new">
            <input
              type="text"
              placeholder="备用联系电话（选填）"
              maxlength="11"
              @input="inputSparePhone"
              v-model="sparePhone"
            />
            <p v-if="verifySparePhone">{{ sparePhoneTip }}</p>
          </div>
        </section>
        <section class="addbutton">
          <button @click="submitThing">新增地址</button>
        </section>
      </form>
    </section>
    <AlterTip v-if="showAlert" :alter-text="alterText" @closeTip="showAlert = false"></AlterTip>
  </div>
</template>

<style scoped lang="scss">
@import '@/style/mixin';

.router-slid-enter-active,
.router-slid-leave-active {
  transition: all 0.4s;
}

.router-slid-enter,
.router-slid-leave-active {
  transform: translate3d(2rem, 0, 0);
  opacity: 0;
}

.rating_page {
  padding-top: 1.95rem;

  p,
  span {
    font-family:
      Helvetica Neue,
      Tahoma,
      Arial;
  }
}

.adddetail {
  margin-top: 0.4rem;
}

.ui-padding-block {
  background: #fff;
  padding-top: 0.4rem;

  .add-detail {
    display: block;
  }

  .input-new {
    padding-bottom: 0.4rem;

    input {
      display: block;
      width: 15rem;
      font-size: 0.6rem;
      margin: 0 auto;
      padding: 0.3rem;
      background: #f2f2f2;
      border: 1px solid #ddd;
      @include borderRadius(3px);
    }

    .verifies {
      border-color: #ea3106;
    }

    p {
      @include sc(0.4rem, #ea3106);
      padding-left: 0.5rem;
      margin-top: 0.2rem;
    }
  }
}

.addbutton {
  margin: 0.6rem auto;
  width: 15rem;
  background: #4cd964;
  @include borderRadius(3px);

  button {
    width: 100%;
    @include sc(0.6rem, #fff);
    line-height: 1.6rem;
    background: none;
    font-weight: 700;
    opacity: 0.6;
  }

  .butopacity {
    transition: all 0.4s;
    opacity: 1;
  }
}
</style>
