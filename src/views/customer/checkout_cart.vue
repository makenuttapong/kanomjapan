<template>
  <div>
    <div
      class="list-view product-checkout"
      v-if="$store.state.cartItems.length != 0"
    >
      <!-- Products List -->
      <div class="product-list">
        <b-card
          v-for="(item, index) in $store.state.cartItems"
          :key="index"
          class="ecommerce-card-checkout mb-4"
          no-body
        >
          <!-- Product Image -->
          <div class="item-img text-center item">
            <div @click="toDetailPage(item.id)" class="itemType pointer">
              <div
                v-if="item.productType == 'สินค้าขายดี'"
                class="img-badge-mini good-sold"
                
              >
                {{ item.productType }}
              </div>
              <div
                v-if="item.productType == 'สินค้าแนะนำ'"
                class="img-badge-mini recommend"
               
              >
                {{ item.productType }}
              </div>
              <b-img fluid class="card-img-top" :src="item.image" />
            </div>
          </div>

          <!-- Product Details: Card Body -->
          <b-card-body class="info pl-2 pr-2">
            <h6 class="item-name">
              <b-link class="text-body" @click="toDetailPage(item.id)">
                <div class="item-name pro-name">
                  {{ item.name }}
                </div>
              </b-link>
            </h6>
            <div class="text-small pro-id">{{ item.productID }}</div>

            <div class="mb-1">คลัง : {{ item.stock }}</div>
            <div class="cart-item-qty">
              <span class="mr-2">จำนวน</span>
              <b-form-spinbutton
                v-model="item.qty"
                min="1"
                size="sm"
                :max="item.stock"
                @change="changeQTY(item.qty, index)"
                :class="item.qty == item.stock ? `max-qty` : `unmax-qty`"
              />
            </div>
          </b-card-body>

          <!-- Product Options/Actions -->
          <div class="item-options text-center">
            <div class="item-wrapper">
              <div class="item-cost">
                <div class="font-dis-detail" v-if="item.discount">
                  {{ formatPrice(item.fullprice * item.qty) }} THB
                </div>
                <h5 class="item-price">
                  {{ formatPrice(item.price * item.qty) }} THB
                </h5>
              </div>
            </div>
            <b-button
              variant="light"
              class="mt-1 remove"
              @click="removeItemFromCart(index)"
            >
              <i class="fa fa-times" />
              <span class="ml-2">ลบ</span>
            </b-button>
          </div>
        </b-card>

        <div class="text-right mb-4" v-if="role == 'user'">
          <b-button variant="primary" @click="nextStep()"
            >เลือกที่อยู่ <i class="fa fa-angle-right"
          /></b-button>
        </div>
        <div class="text-right mb-4" v-if="role == ''">
          <b-alert show variant="warning">
            <div class="bold">ยังไม่ได้เข้าสู่ระบบ</div>
            <div>กรุณาเข้าสู่ระบบเพื่อดําเนินการต่อ</div>
          </b-alert>
        </div>
      </div>

      <div v-if="$store.state.cartItems.length != 0">
        <TotalPrice />
      </div>
    </div>
  </div>
</template>

<script>
import TotalPrice from "../../components/totalPrice";
import "../../assets/scss/style.scss";
export default {
  name: "CheckoutCart",
  components: {
    TotalPrice,
  },
  props: ["role"],
  methods: {
    nextStep() {
      this.$emit("next-step");
      this.$emit("update-step", 2);
    },
    removeItemFromCart(index) {
      this.$store.dispatch("removeItemCart", index);
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(0);
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    changeQTY(qty, index) {
      var data = {
        qty: qty,
        index: index,
      };
      this.$store.dispatch("changeItemQty", data);
    },
    toDetailPage(id) {
      this.$router.push("/product-detail/" + id);
    },
    //  calStar(total,ratingCount){
    //   return (total/ratingCount).toFixed(1)
    // }
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
.list-view .product-checkout .non-cart {
  display: block;
}
.cart-item-qty {
  display: flex;
}
.cart-item-qty .b-form-spinbutton {
  width: 130px;
}
.cart-item-qty span {
  padding-top: 2px;
}
.pro-name:hover {
  cursor: pointer;
  color: #7367f0;
}
.pro-id {
  color: #7367f0;
}
</style>