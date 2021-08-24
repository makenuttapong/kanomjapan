<template>
<div class="show-view">
  <b-card class="ecommerce-card-show mb-4">
    <div class="item-img text-center item">
      <b-link @click="toDetailPage(datas)" class="img-hover-zoom-show">
        <div
          v-if="datas.productType == 'สินค้าขายดี'"
          class="img-badge-card good-sold"
          :class="datas.stock == 0 ? 'out' : ''"
        >
          {{ datas.productType }}
        </div>
        <div
          v-if="datas.productType == 'สินค้าแนะนำ'"
          class="img-badge-card recommend"
          :class="datas.stock == 0 ? 'out' : ''"
        >
          {{ datas.productType }}
        </div>
        <b-img :src="datas.image" fluid class="card-img-top full-imge" />
      </b-link>
    </div>

    <b-card-body class="info pl-3 pr-3">
      <h6 class="item-name">
        <b-link class="text-body" @click="toDetailPage(datas)">
          <div class="item-name pro-name link-detail">
            <span class="show-name">{{ datas.name }}</span>
          </div>
        </b-link>
      </h6>
      <div class="item-rating">
        <ul class="unstyled-list list-inline mb-0">
          <li
            v-for="star in 5"
            :key="star"
            class="ratings-list-item pb-1"
            :class="{ 'ml-25': star - 1 }"
          >
            <i
              class="fa fa-star"
              :class="[
                {
                  'fill-current':
                    star <= calStar(datas.rating, datas.ratingCount),
                },
                star <= calStar(datas.rating, datas.ratingCount)
                  ? 'text-warning'
                  : 'text-muted',
              ]"
            />
          </li>
        </ul>
      </div>
    </b-card-body>
    <div class="action-prodct">
      <div class="pl-3 pr-3">
        <div class="item-cost text-right mb-3" v-if="!datas.discount">
          <span class="item-price font-price-card"
            >{{ formatPrice(datas.price) }} THB</span
          >
        </div>
        <div class="item-cost text-right mb-3" v-if="datas.discount">
          <span class="font-dis-card">{{ formatPrice(datas.price) }} THB</span>
          <span class="item-price font-price-card"
            >{{ formatPrice(datas.sale) }} THB</span
          >
        </div>
      </div>
    </div>
  </b-card>
</div>
</template>

<script>
export default {
  name: "cardShowProduct",
  props: ["datas"],
  methods: {
    calStar(total, ratingCount) {
      return (total / ratingCount).toFixed(1);
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(0);
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    toDetailPage(product) {
      this.$emit("toDetailPage", product);
    },
  },
};
</script>
<style scoped>
.full-imge {
  cursor: pointer;
  width: 100%;

}
.ratings-list-item svg {
  font-size: 13px;
}
</style>