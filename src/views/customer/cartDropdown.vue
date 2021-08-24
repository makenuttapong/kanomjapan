<template>
  <b-nav-item-dropdown
    class="dropdown-cart mr-25"
    menu-class="dropdown-menu-media"
    right
    no-caret
    ref="dropdownCart"
  >
    <template #button-content>
      <b-badge
        v-if="$store.state.itemCartCount != 0"
        pill
        variant="light-primary"
        class="badge-cart"
      >
        {{ $store.state.itemCartCount }}
      </b-badge>
      <ShoppingCartIcon class="shopping-cart" />
    </template>

    <!-- Header -->
    <li class="dropdown-menu-header">
      <div class="dropdown-header d-flex">
        <h4 class="notification-title mb-0 mr-auto">รถเข็น</h4>
        <b-badge pill variant="light-primary">
          {{ $store.state.itemCartCount }} รายการ
        </b-badge>
      </div>
    </li>

    <!-- Cart Items -->
    <vue-perfect-scrollbar
      v-if="$store.state.cartItems.length"
      :settings="perfectScrollbarSettings"
      class="scrollable-container media-list scroll-area"
      tagname="li"
    >
      <b-media
        v-for="(item, index) in $store.state.cartItems"
        :key="index"
        class="custom-medie"
      >
        <template #aside>
          <b-img
            :src="item.image"
            :alt="item.name"
            rounded
            class="cart-drop-img mt-2"
          />
        </template>
        <div class="icon-x">
          <XIcon
            class="cart-item-remove"
            @click.stop="removeItemFromCart(index)"
          />
        </div>
        <div class="media-heading cart-text-name">
          <h6 class="cart-item-title">
            <b-link class="text-body cart-drop-name" @click="toDetail(item.id)">
              {{ item.name }}
            </b-link>
          </h6>
        </div>

        <b-row>
          <b-col md="6" sm="6">
            <div class="cart-item-qty ml-1">
              <b-form-spinbutton
                v-model="item.qty"
                min="1"
                size="sm"
                :max="item.stock"
                @change="changeQTY(item.qty, index)"
                :class="item.qty == item.stock ? `max-qty qty-btn` : `unmax-qty qty-btn`"
              />
            </div>
          </b-col>
          <b-col  md="6" sm="6" class="center-price">
            <div class="cart-item-price ml-1">
              {{formatPrice(item.price * item.qty)}} บาท</div>
          </b-col>
        </b-row>
        
      </b-media>
    </vue-perfect-scrollbar>

    <!-- Cart Footer -->
    <li v-if="$store.state.cartItems.length" class="dropdown-menu-footer">
      <div class="d-flex justify-content-between mb-3">
        <h6 class="font-weight-bolder mb-0 text-body">รวม</h6>
        <h6 class="text-primary font-weight-bolder mb-0">
          {{ formatPrice($store.state.totalPrice) }} บาท
        </h6>
      </div>
      <b-button
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        variant="primary"
        block
        @click="checkoutItem"
      >
        ชำระสินค้า
      </b-button>
    </li>

    <p v-if="!$store.state.cartItems.length" class="m-0 p-4 text-center">
      ไม่มีสินค้าในรถเข็น
    </p>
  </b-nav-item-dropdown>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import Ripple from "vue-ripple-directive";
import { XIcon, ShoppingCartIcon } from "vue-feather-icons";
import "../../assets/scss/style.scss";

export default {
  name: "CartDropdown",
  data() {
    return {
      perfectScrollbarSettings: {
        maxScrollbarLength: 60,
        wheelPropagation: false,
      },
    };
  },
  components: {
    VuePerfectScrollbar,
    XIcon,
    ShoppingCartIcon,
  },
  directives: {
    Ripple,
  },
  computed: {
    totalAmount() {
      let total = 0;
      this.items.forEach((i) => {
        total += i.price;
      });
      return total;
    },
  },
  methods: {
    formatPrice(value) {
        let val = (value/1).toFixed(0)
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    },
    checkoutItem() {
      this.$refs.dropdownCart.visible = false;
      this.$router.push("/checkout");
    },
    removeItemFromCart(index) {
      this.$store.dispatch("removeItemCart", index);
    },
    changeQTY(qty, index) {
      var data = {
        qty : qty,
        index : index
      }
      this.$store.dispatch("changeItemQty", data);
    },
    toDetail(id){
      this.$refs.dropdownCart.visible = false;
       this.$router.push("/product-detail/" + id)
    }
  },
};
</script>