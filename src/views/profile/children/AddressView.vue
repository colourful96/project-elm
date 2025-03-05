<script setup>
import { ref } from 'vue'
import HeadTop from '@/components/header/index.vue'

const deletesite = ref(false) // 是否是编辑状态
const editText = ref('编辑')
</script>

<template>
  <div class="rating_page">
    <head-top :head-title="'编辑地址'" :go-back="true">
      <span slot="edit" class="edit" @click="editThing">{{ editText }}</span>
    </head-top>
    <section class="address">
      <ul class="addresslist">
        <li v-for="(item, index) in removeAddress" :key="index">
          <div>
            <p>{{ item.address }}</p>
            <p>
              <span>{{ item.phone }}</span
              ><span v-if="item.phonepk">、{{ item.phonepk }}</span>
            </p>
          </div>
          <div class="deletesite" v-if="deletesite">
            <span @click="deleteSite(index, item)">x</span>
          </div>
        </li>
      </ul>
      <router-link to="/profile/addaddress">
        <div class="addsite">
          <span>新增地址</span>
          <span class="addsvg">
            <svg fill="#d8d8d8">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
            </svg>
          </span>
        </div>
      </router-link>
    </section>
  </div>
</template>

<style scoped lang="scss">
@import 'src/style/mixin';

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

.edit {
  right: 0.4rem;
  @include sc(0.7rem, #fff);
  @include ct;
}

.address {
  width: 100%;
  margin-top: 0.4rem;
  border-top: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;

  .addresslist {
    background: #fff;

    li {
      border-bottom: 1px solid #d9d9d9;
      padding: 0.4rem;
      @include fj(space-between);

      p {
        line-height: 0.9rem;
        @include sc(0.6rem, #333);

        span {
          display: inline-block;
          @include sc(0.6rem, #333);
        }
      }

      .deletesite {
        display: flex;
        align-items: center;

        span {
          display: block;
          @include sc(0.8rem, #999);
        }
      }
    }

    li:nth-of-type(1) {
      background: #fff8c3;
    }
  }

  .addsite {
    margin-top: 0.4rem;
    background: #fff;
    padding: 0.2rem 0.4rem;
    border-top: 1px solid #d9d9d9;
    @include fj(space-between);

    span {
      display: block;
      @include sc(0.7rem, #333);
      line-height: 1.4rem;
    }

    .addsvg {
      @include wh(0.66667rem, 1.4rem);

      svg {
        @include wh(100%, 100%);
      }
    }
  }
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
