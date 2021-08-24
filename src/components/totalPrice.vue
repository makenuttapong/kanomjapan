<template>
  <div class="checkout-options">
    <b-card class="priceDetail">
      <label class="section-label mb-1">รายละเอียดราคา</label>
      <hr />
      <div class="price-details">
        <h6 class="price-title"></h6>
        <ul class="list-unstyled">
            <li class="price-detail">
            <div class="detail-title">จำนวนสินค้า</div>
            <div class="detail-amt">{{$store.state.itemCartCount}} รายการ</div>
          </li>
          <li class="price-detail">
            <div class="detail-title">ราคาสินค้ารวม</div>
            <div class="detail-amt">{{formatPrice($store.state.totalPrice)}} บาท</div>
          </li>
          <li class="price-detail">
            <div class="detail-title">ค่าจัดส่ง</div>
            <div class="detail-amt discount-amt" v-if="$store.state.deliverCompany.price == null"> ยังไม่คำนวณ</div>
            <div class="detail-amt discount-amt-calc" v-if="$store.state.deliverCompany.price != null">
              <span v-if="$store.state.deliverCompany.price != 0">{{formatPrice($store.state.deliverCompany.price)}} บาท</span>
              <span v-if="$store.state.deliverCompany.price == 0">ฟรี</span>
              </div>
          </li>
        </ul>
        <hr />
        <ul class="list-unstyled">
          <li class="price-detail all">
            <div class="detail-title detail-total bold">ยอดรวม</div>
            <div class="detail-amt font-weight-bolder">{{formatPrice($store.state.totalPrice + $store.state.deliverCompany.price )}} บาท</div>
          </li>
        </ul>
      </div>
    </b-card>
  </div>
</template>
      

<script>
import "../assets/scss/style.scss";
export default {
  name: "totalPrice",
  methods:{
       formatPrice(value) {
        let val = (value/1).toFixed(0)
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    },
  }
};
</script>

<style>
.discount-amt{
    color: #989898;
}
.price-detail.all{
    padding: 10px 7px;
    background-color: #dedbfd;
    border-radius: 0.428rem;
}
.list-unstyled{
    margin-bottom: 0rem;
}
</style>