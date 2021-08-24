<template>
  <div :class="itemView" no-body>
    <b-card
      v-for="(product, index) in datas"
      :key="index"
      class="ecommerce-card mb-4"
    >
      <div class="item-img text-center item itemType-card">
        <b-link @click="toDetailPage(product)">
            <div
                  v-if="product.productType == 'สินค้าขายดี'"
                  class="img-badge-card good-sold"
                  :class="product.stock == 0 ? 'out' : ''"
                >
                  {{ product.productType }}
                </div>
                <div
                  v-if="product.productType == 'สินค้าแนะนำ'"
                  class="img-badge-card recommend"
                  :class="product.stock == 0 ? 'out' : ''"
                >
                  {{ product.productType }}
                </div>
          <b-img fluid class="card-img-top" :src="product.image"  :class="product.stock == 0 ? 'img-gray' : 'product-img'"/>
        </b-link>
      </div>

      <!-- Product Details -->
      <b-card-body class="info pl-2 pr-2">
        <h6 class="item-name">
          <b-link class="text-body" @click="toDetailPage(product)">
            <div class="item-name pro-name">
              {{ product.name }}
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
                  { 'fill-current': star <=  calStar(product.rating, product.ratingCount) },
                  star <=  calStar(product.rating, product.ratingCount) ? 'text-warning' : 'text-muted',
                ]"
              />
            </li>
          </ul>
        </div>
        <div class="productDesc">{{ product.detail }}</div>
      </b-card-body>

      <!-- Product Actions -->
      <div class="action-prodct">
        <div class="pl-2 pr-2">
           <div class="item-cost text-right mb-1" v-if="!product.discount">
                <span class="item-price font-price-card">{{ formatPrice(product.price) }} THB</span>
          </div>
          <div class="item-cost text-right mb-1" v-if="product.discount">
            <span class="font-dis-card">{{ formatPrice(product.price) }} THB</span>
            <span class="item-price font-price-card">{{ formatPrice(product.sale) }} THB</span>
          </div>
        </div>
        <div class="item-options text-center">
          <b-button
            v-if="checkItemInCart(product)"
            variant="warning"
         
            class="btn-cart"
            @click="checkoutCart(product)"
          >
            <CreditCardIcon  class="mr-1"  width="18px"/>
            <span>ชำระสินค้า</span>
          </b-button>

          <b-button
            v-if="!checkItemInCart(product)"
            variant="primary"
            :disabled="role == 'admin' || product.stock == 0"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            class="btn-cart add-to-cart"
            @click="addToCart(product)"
          >
            <ShoppingCartIcon class="mr-1" width="18px" />
            <span>หยิบใส่รถเข็น</span>
            
          </b-button>
        </div>
      </div>
    </b-card>

  </div>
</template>


<script>
import "../assets/scss/style.scss";
import Ripple from "vue-ripple-directive";
import { ShoppingCartIcon, CreditCardIcon } from "vue-feather-icons";

export default {
  name: "cardProduct",
  props: ["datas", "itemView","role"],
  components: {
    ShoppingCartIcon,
    CreditCardIcon,

  },
  directives: {
    Ripple,
  },
  methods: {
    toDetailPage(product) {
      this.$emit("toDetailPage", product);
    },
    addToCart(product) {
      this.$store.dispatch("addItemCart", product);
       this.$toast(`เพิ่มสินค้าลงรถเข็นแล้ว`, {
                    position: "top-center",
                    closeOnClick: true,
                    hideProgressBar: true,
                    timeout: 2000,
                    icon: "fa fa-cart-plus",
                  });
    },
    checkoutCart(){
      this.$router.push("/checkout");
    },
    checkItemInCart(product) {
      var checked = false;
      this.$store.state.cartItems.find((item) => {
      
        if (item.id == product.id) {
          checked = true;
        }
        return checked;
      });
      return checked;
    },
     formatPrice(value) {
        let val = (value/1).toFixed(0)
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    },
    calStar(total, ratingCount) {
      return (total / ratingCount).toFixed(1);
    },
  },
};
</script>

<style>
.ratings-list-item svg {
  font-size: 13px;
}
.pro-name:hover{
 color: #7367f0;
}
</style>