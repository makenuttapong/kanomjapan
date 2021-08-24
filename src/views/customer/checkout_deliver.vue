<template>
  <div class="list-view product-checkout">
    <div class="truck-select">
      <b-card class="mb-4">
        <div class="mb-2">ตัวเลือกการจัดส่ง</div>
        <div class="mb-2 text-small">จัดส่งปกติ <span class="text-muted text-small ">*ส่งฟรี (เมื่อซื้อครบ 1,000 บาท)</span></div>
        <div class="mb-3 text-center" v-if="showError">
          <b-alert show variant="warning">โปรดเลือกวิธีการจัดส่ง</b-alert>
        </div>
        <div class="all-company">
          <div
            v-for="(deliver, index) in $store.state.optionCompany"
            :key="index"
          >
            <div
              class="card-option border rounded h-100 p-3 mb-3"
              :class="active == deliver.name ? `card-active` : ``"
              @click="selectCompany(deliver)"
            >
              <div class="row align-items-center h-100">
                <div class="col-auto pr-0">
                  <span v-if="active == deliver.name">
                    <b-form-radio
                      v-model="$store.state.deliverCompany.name"
                      :value="$store.state.deliverCompany.name"
                    />
                  </span>
                  <span v-if="active != deliver.name">
                    <b-form-radio
                      v-model="$store.state.deliverCompany.name"
                      :value="!$store.state.deliverCompany.name"
                    />
                  </span>
                </div>
                <div class="col-auto px-2">
                  <img
                    v-if="deliver.image"
                    :src="deliver.image"
                    class="deliver-img"
                  />
                </div>
                <div
                  class="col pl-3 overflow-hidden"
                  :class="deliver.price ? 'border-left' : 'freeDeliver'"
                >
                  <div class="txt-black-85 text-ellipsis">
                    {{ deliver.price ? deliver.name : "ฟรี" }}
                    {{
                      deliver.price
                        ? " (1-3 วันทำการ)"
                        : " (เมื่อซื้อครบ 1,000 บาท)"
                    }}
                  </div>
                  <div>{{ deliver.price ? deliver.price + " บาท" : "" }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </b-card>
      <div class="text-between mb-4">
        <b-button variant="outline-primary" @click="prevTab"
          ><i class="fa fa-angle-left" /> ย้อนกลับ</b-button
        >
        <b-button variant="primary" @click="nextStep"
          >ชำระเงิน <i class="fa fa-angle-right"
        /></b-button>
      </div>
    </div>
    <TotalPrice />
  </div>
</template>

<script>
import TotalPrice from "../../components/totalPrice";

export default {
  name: "CheckoutTruck",
  components: {
    TotalPrice,
  },
  props: {},
  created() {
    if(this.$store.state.deliverCompany.name != ''){
        this.active = this.$store.state.deliverCompany.name
    }else{
      this.active = ""
    }
   
  },
  computed: {
    count() {
      return this.$store.getters.getDeliverCompany;
    },
  },
  watch: {
    count(newData) {
      if (newData.name != "") {
        this.active = newData.name;
      }else{
        this.active = ""
      }
    },
  },
  data() {
    return {
      active: "",
      showError: false,
    };
  },
  methods: {
    selectCompany(com) {
      this.active = com.name;
      this.showError = false;
      var setData = {
        price: com.price,
        name: com.name,
        image: com.image,
      };
      this.$store.dispatch("selectCompany", setData);
    },
    nextStep() {
      if (this.active != "") {
        this.$emit("next-step");
        this.$emit("update-step", 4);
      } else {
        this.showError = true;
      }
    },
    prevTab() {
      this.$emit("prev-step");
      this.$emit("update-step", 2);
    },
  },
};
</script>
<style lang="scss" scoped>
#cvv {
  width: auto;
}
</style>
