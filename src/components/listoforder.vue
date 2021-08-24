<template>
  <div>
    <div v-if="orderItem.length == 0" class="text-center p-4 h6">
      ไม่พบข้อมูล
    </div>
    <div v-if="orderItem.length != 0" class="text-mute">
      รายการที่ {{ start }} - {{ end }} จาก {{ totalItem }} รายการ
    </div>
    <div v-for="(item, index) in orderItem" :key="index">
      <b-card class="mt-2 card-border collapse-icon">
        <div class="content-order row">
          <div class="col-12 col-sm-6 col-md-3 col-lg-2">
            <small class="text-primary">หมายเลขคำสั่งซื้อ</small>
            <div>
              <FileTextIcon size="18" class="mb-1 mr-1" color="#7367f0" />{{
                item.orderID
              }}
            </div>
          </div>
          <div class="col-12 col-sm-6 col-md-3 col-lg-2">
            <small class="text-primary">วันที่สั่ง</small>
            <div class="createOrder">
              <CalendarIcon size="14" class="mb-1 mr-1" />{{ item.createAt }}
            </div>
          </div>
          <div class="col-12 col-sm-6 col-md-3 col-lg-2">
            <small class="text-primary">สถานะ</small>
            <div v-if="item.status == 'รอชำระ'">
              <b-badge pill class="status-wait-style font-14"
                ><i class="fa fa-clock" /> {{ item.status }}</b-badge
              >
            </div>
            <div v-if="item.status == 'รอการตรวจสอบ'">
              <b-badge pill class="status-checkSlip-style font-14"
                ><i class="fa fa-search-dollar" /> {{ item.status }}</b-badge
              >
            </div>
            <div v-if="item.status == 'เตรียมจัดส่ง'">
              <b-badge pill class="status-ready-style font-14"
                ><i class="fa fa-truck-loading" /> {{ item.status }}</b-badge
              >
            </div>
            <div v-if="item.status == 'อยู่ระหว่างการจัดส่ง'">
              <b-badge pill class="status-sent-style font-14"
                ><i class="fa fa-shipping-fast" /> {{ item.status }}</b-badge
              >
            </div>
            <div v-if="item.status == 'จัดส่งแล้ว'">
              <b-badge pill class="status-check-style font-14"
                ><i class="fa fa-check" /> {{ item.status }}</b-badge
              >
            </div>
            <div v-if="item.status == 'ยกเลิก'">
              <b-badge pill class="status-cancle-style font-14"
                ><i class="fa fa-times" /> {{ item.status }}</b-badge
              >
            </div>
          </div>

          <div class="col-12 col-sm-6 col-md-2 d-none d-lg-inline">
            <div
              v-if="
                item.status == 'อยู่ระหว่างการจัดส่ง' ||
                item.status == 'จัดส่งแล้ว'
              "
              class="col tackNum"
            >
              <small class="text-primary">หมายเลขพัสดุ</small>
              <div>{{ item.deliverNumber ? item.deliverNumber : "-" }}</div>
            </div>

            <div
              v-if="
                item.status != 'อยู่ระหว่างการจัดส่ง' &&
                item.status != 'จัดส่งแล้ว'
              "
              class="col slip"
            >
              <small class="text-primary">รายการสินค้า</small>
              <div>
                {{ item.orderItems.length != 0 ? item.orderItems.length : "0" }}
                รายการ
              </div>
            </div>
          </div>

          <div class="col-12 col-sm-6 col-md-2 d-none d-lg-inline">
            <div
              v-if="
                item.status == 'อยู่ระหว่างการจัดส่ง' ||
                item.status == 'จัดส่งแล้ว'
              "
              class="col tackCom"
            >
              <small class="text-primary">บริษัทขนส่ง</small>
              <div>{{ item.deliverCompany ? item.deliverCompany : "-" }}</div>
            </div>
            <div
              v-if="
                item.status != 'อยู่ระหว่างการจัดส่ง' &&
                item.status != 'จัดส่งแล้ว'
              "
              class="col all-price"
            >
              <small class="text-primary">ราคารวม</small>
              <div>
                {{ item.totalAll ? formatPrice(item.totalAll) : "-" }} บาท
              </div>
            </div>
          </div>

          <div class="col-12 col-sm-6 col-md-3 col-lg-2 icon-pay">
            <b-button
              v-if="item.status == 'รอชำระ'"
              variant="orange"
              :id="`pay-order-` + item.accId"
              @click="toPay(item.id)"
            >
              <CreditCardIcon size="20"
            /></b-button>
            <b-tooltip
              :target="`pay-order-` + item.accId"
              triggers="hover"
              v-if="item.status == 'รอชำระ'"
            >
              ชำระสินค้า
            </b-tooltip>

            <b-button
              v-if="item.status == 'จัดส่งแล้ว'"
              variant="yellow"
              :id="`pay-order-` + item.accId"
              @click="rating(item.id)"
              ><StarIcon size="20"
            /></b-button>
            <b-tooltip :target="`pay-order-` + item.accId" triggers="hover" v-if="item.status == 'จัดส่งแล้ว'">
              ให้คะแนนสินค้า
            </b-tooltip>

            <b-button
              v-if="item.status == 'อยู่ระหว่างการจัดส่ง'"
              variant="green"
              :id="`pay-order-` + item.accId"
              @click="toggleModal(item)"
              ><PackageIcon size="20"
            /></b-button>
            <b-tooltip :target="`pay-order-` + item.accId" triggers="hover"  v-if="item.status == 'อยู่ระหว่างการจัดส่ง'">
              ได้รับสินค้าแล้ว
            </b-tooltip>

            <b-button
              class="ml-2"
              variant="primary"
              :id="`detail-order-` + item.accId"
              @click="toDetail(item.id)"
              ><SearchIcon size="20"
            /></b-button>
            <b-tooltip :target="`detail-order-` + item.accId" triggers="hover">
              ดูรายละเอียด
            </b-tooltip>
          </div>

          <!-- <div class="col-12 col-sm-6 icon-coll"></div> -->
        </div>
      </b-card>
    </div>

    <b-modal id="modal-conf" hide-footer size="md" title="ยืนยันการรับสินค้า">
      <template>
        <div class="center">ยืนยันว่าคุณได้ตรวจสอบและรับสินค้าแล้ว</div>
        <div class="btn-delete text-center mt-2">
          <b-row>
            <b-col cols="12" class="mt-2 mb-2">
              <b-button @click="comfirmGet" variant="primary" class="mr-1"
                >ยืนยัน</b-button
              >
              <b-button @click="toggleModalConfirmGet" variant="outline-primary"
                >ยกเลิก</b-button
              >
            </b-col>
          </b-row>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import "../assets/scss/style.scss";
import {
  CreditCardIcon,
  SearchIcon,
  StarIcon,
  PackageIcon,
  FileTextIcon,
  CalendarIcon,
} from "vue-feather-icons";

export default {
  name: "ListofOrder",
  data() {
    return {
      idOrder: {},
    };
  },
  components: {
    CreditCardIcon,
    SearchIcon,
    StarIcon,
    PackageIcon,
    FileTextIcon,
    CalendarIcon,
  },
  props: ["orderItem", "start", "end", "totalItem"],
  methods: {
    toDetail(id) {
      this.$emit("toDetailPage", id);
    },
    toPay(id) {
      this.$emit("toPayPage", id);
    },
    rating(id) {
      this.$router.push("/rating/" + id);
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(0);
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    comfirmGet() {
      this.$bvModal.hide("modal-conf");
      this.$emit("confirmGetItem", this.idOrder);
    },
    toggleModal(item) {
      this.idOrder = item;
      this.$bvModal.show("modal-conf");
    },
    toggleModalConfirmGet() {
      this.$bvModal.hide("modal-conf");
    },
  },
};
</script>

<style>
</style>