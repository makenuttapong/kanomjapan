<template>
  <div>
    <b-row class="match-height">
      <!-- ORDER ITEM -->
      <b-col lg="8" md="12">
        <b-card class="mb-4 overflow-hidden">
          <div v-if="loading" class="p-4">
            <vcl-list> </vcl-list>
          </div>
          <div v-if="!loading">
            <div class="mb-3 d-flex space-between">
              <h5>
                <FileTextIcon color="#7367f0" class="mb-1" /> หมายเลขคำสั่งซื้อ
                :
                <span>
                  {{ orderItem.orderID }}
                </span>
              </h5>
              <div v-if="orderItem.status == 'รอชำระ'" class="d-inline pl-3">
                <b-button
                  variant="outline-primary"
                  size="sm"
                  @click="toggleModal"
                  >ยกเลิกคำสั่งซื้อ</b-button
                >
              </div>
            </div>

            <div v-if="!loading" class="detail-user-order">
              <div class="mb-2">
                <span class="bold">จำนวนสินค้า : </span>
                {{ orderItem.orderList.length }} รายการ
              </div>
              <b-table
                responsive="sm"
                :items="orderItem.orderList"
                show-empty
                :fields="fields"
                empty-text="ไม่พบข้อมูล"
                empty-filtered-text="ไม่พบข้อมูล"
                tbody-tr-class="tableHover"
              >
                <template #cell(image)="row">
                  <ExpandableImage class="sm-image" :src="row.item.image" />
                </template>
                <template #cell(name)="row">
                  <div
                    class="pro-name-detail"
                    v-b-tooltip.hover
                    :title="row.item.name"
                  >
                    {{ row.item.name }}
                  </div>
                  <div class="color-primary font-14">
                    {{ row.item.productID }}
                  </div>
                </template>
                <template #cell(price)="row">
                  <div class="price-width" v-if="!row.item.discount">
                    <div>{{ row.item.price }} บาท</div>
                  </div>
                  <div class="price-width" v-if="row.item.discount">
                    <div class="font-dis">{{ row.item.fullprice }} บาท</div>
                    <div>{{ row.item.price }} บาท</div>
                  </div>
                </template>
                <template #cell(quantity)="row">
                  <span> {{ row.item.quantity }} ชิ้น</span>
                </template>
                <template #cell(total)="row">
                  <div class="total-detail">{{ row.item.total }} บาท</div>
                </template>
              </b-table>

              <div>
                <span class="bold">ราคาสินค้ารวม : </span>
                {{ formatPrice(orderItem.totalPrice) }} บาท
              </div>
              <div>
                <span class="bold">ค่าส่ง : </span>
                {{
                  orderItem.deliverPrice != 0
                    ? orderItem.deliverPrice + " บาท"
                    : "ส่งฟรี"
                }}
              </div>
              <div>
                <span class="bold">รวมทั้งหมด : </span>
                {{ formatPrice(orderItem.totalAll) }} บาท
              </div>
            </div>
          </div>
        </b-card>
      </b-col>

      <!-- STATUS -->
      <b-col lg="4" md="12">
        <b-row class="match-height order">
          <b-col lg="12" md="6">
            <b-card class="card-right mb-4">
              <div v-if="loading" class="p-2">
                <vcl-list></vcl-list>
              </div>

              <div v-if="!loading">
                <h5 class="mb-3">
                  <PackageIcon color="#7367f0" class="mb-1" /> สถานะคำสั่งซื้อ
                </h5>

                <div v-if="orderItem.status == 'รอชำระ'" class="d-inline">
                  <b-badge pill class="status-wait-style font-14"
                    ><i class="fa fa-clock" /> {{ orderItem.status }}</b-badge
                  >
                </div>
                <div v-if="orderItem.status == 'รอการตรวจสอบ'" class="d-inline">
                  <b-badge pill class="status-checkSlip-style font-14"
                    ><i class="fa fa-search-dollar" />
                    {{ orderItem.status }}</b-badge
                  >
                </div>
                <div v-if="orderItem.status == 'เตรียมจัดส่ง'" class="d-inline">
                  <b-badge pill class="status-ready-style font-14"
                    ><i class="fa fa-truck-loading" />
                    {{ orderItem.status }}</b-badge
                  >
                </div>
                <div
                  v-if="orderItem.status == 'อยู่ระหว่างการจัดส่ง'"
                  class="d-inline"
                >
                  <b-badge pill class="status-sent-style font-14">
                    <i class="fa fa-shipping-fast" />
                    {{ orderItem.status }}</b-badge
                  >
                </div>
                <div v-if="orderItem.status == 'จัดส่งแล้ว'" class="d-inline">
                  <b-badge pill class="status-check-style font-14"
                    ><i class="fa fa-check" /> {{ orderItem.status }}</b-badge
                  >
                </div>
                <div v-if="orderItem.status == 'ยกเลิก'" class="d-inline">
                  <b-badge pill class="status-cancle-style font-14"
                    ><i class="fa fa-times" /> {{ orderItem.status }}</b-badge
                  >
                </div>

                <div v-if="orderItem.status == 'รอชำระ'" class="d-inline pl-3">
                  <b-button variant="primary" size="sm" @click="confirmPage"
                    >ชำระสินค้า</b-button
                  >
                </div>

                <div class="mt-3">
                  <span class="bold"
                    >สั่งซื้อเมื่อ : <CalendarIcon size="18" class="mr-1 mb-1"
                  /></span>
                  <span class="font-14">{{
                    orderItem.createAt ? orderItem.createAt : "-"
                  }}</span>
                </div>
                <div class="">
                  <span class="bold"
                    >อัปเดตเมื่อ : <CalendarIcon size="18" class="mr-1 mb-1"
                  /></span>
                  <span class="font-14">{{
                    orderItem.updateAt ? orderItem.updateAt : "-"
                  }}</span>
                </div>
              </div>
            </b-card>
          </b-col>
          <b-col lg="12" md="6">
            <b-card class="mb-4">
              <div v-if="loading" class="p-2">
                <vcl-list></vcl-list>
              </div>
              <div v-if="!loading">
                <h5 class="mb-3">
                  <TruckIcon color="#7367f0" class="mb-1" /> หมายเลขติดตามพัสดุ
                </h5>
                <div class="mb-2">
                  <span class="bold">บริษัทขนส่ง : </span>
                  {{ orderItem.deliverCompany }}
                </div>
                <div class="d-inline">
                  <span class="bold">เลขพัสดุ : </span>
                  <span v-if="orderItem.deliverNumber"
                    v-clipboard:copy="orderItem.deliverNumber"
                    v-clipboard:success="onCopy"
                    class="link-detail"
                  >
                    {{
                      orderItem.deliverNumber
                    }}
                  </span>
                   <span v-if="!orderItem.deliverNumber"> - </span>
                </div>
                <div v-if="orderItem.deliverNumber" class="mt-3 text-center">
                  <b-button variant="primary" size="sm" @click="followTruck"
                    >ติดตามพัสดุ</b-button
                  >
                </div>
              </div>
            </b-card>
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <b-row class="match-height">
      <!-- ADDRESS -->
      <b-col lg="6" md="6">
        <b-card class="mb-4">
          <div v-if="loading" class="p-2">
            <vcl-list></vcl-list>
          </div>
          <div v-if="!loading">
            <h5 class="mb-3">
              <HomeIcon color="#7367f0" class="mb-1" /> ที่อยู่ในการจัดส่ง
            </h5>
            <div>
              <div>
                <span class="bold">ชื่อผู้รับ : </span>
                {{ orderItem.address.name }}
              </div>
              <div>
                <span class="bold">โทรศัพท์ : </span>
                {{ orderItem.address.phone }}
              </div>
              <div>
                <span class="bold">บ้านเลขที่ : </span>
                {{ orderItem.address.houseNumber }}
              </div>
              <div>
                <span class="bold">ซอย : </span>
                {{ orderItem.address.soy ? orderItem.address.soy : "-" }}
              </div>
              <div>
                <span class="bold">ถนน : </span>
                {{ orderItem.address.road ? orderItem.address.road : "-" }}
              </div>
              <div>
                <span class="bold">ตำบล/แขวง : </span>
                {{ orderItem.address.district }}
              </div>
              <div>
                <span class="bold">อำเภอ/เขต : </span>
                {{ orderItem.address.amphoe }}
              </div>
              <div>
                <span class="bold">จังหวัด : </span>
                {{ orderItem.address.province }}
              </div>
              <div>
                <span class="bold">รหัสไปรษณี : </span>
                {{ orderItem.address.zipcode }}
              </div>
            </div>
          </div>
        </b-card>
      </b-col>

      <!-- PAYMENT -->
      <b-col lg="6" md="6">
        <b-card class="mb-4">
          <div v-if="loading" class="p-2">
            <vcl-list></vcl-list>
          </div>
          <div v-if="!loading">
            <h5 class="mb-3">
              <PaperclipIcon color="#7367f0" class="mb-1" /> หลักฐานการชำระ
            </h5>
            <div>
              <span class="bold">สถานะ : </span>
              <b-badge
                pill
                class="status-check-style font-14"
                v-if="orderItem.payon"
              >
                ชำระแล้ว
              </b-badge>
              <b-badge
                pill
                class="status-cancle-style font-14"
                v-if="!orderItem.payon"
              >
                ยังไม่ได้ชำระ
              </b-badge>
            </div>
            <div>
              <span class="bold"
                >ยืนยันการชำระเมื่อ :
                <CalendarIcon size="18" class="mr-1 mb-1" /></span
              ><span class="font-14">{{
                orderItem.payon ? orderItem.payon : "-"
              }}</span>
            </div>
            <div>
              <span class="bold">โอนจากธนาคาร : </span
              >{{ orderItem.formBank ? orderItem.formBank : "-" }}
            </div>
            <div>
              <span class="bold"
                >วัน-เวลาที่โอน :
                <CalendarIcon size="18" class="mr-1 mb-1" /></span
              ><span class="font-14">{{ orderItem.slipDate }}</span>
            </div>
            <div class="mb-3">
              <span class="bold"
                >สลิปโอนเงิน : {{ orderItem.slipImage ? "" : "-" }}</span
              >
            </div>
            <div
              v-if="orderItem.slipImage"
              class="d-flex justify-content-center mb-3"
            >
              <ExpandableImage class="ex-image" :src="orderItem.slipImage" />
            </div>
          </div>
        </b-card>
      </b-col>
    </b-row>
    <b-modal id="modal-delete" hide-footer size="md" title="ยกเลิกออเดอร์">
      <template>
        <div class="center">แน่ใจหรือว่าต้องการยกเลิกออเดอร์นี้ ?</div>
        <div class="btn-delete text-center mt-2">
          <b-row>
            <b-col cols="12" class="mt-2 mb-2">
              <b-button @click="cancleOrder" variant="primary" class="mr-1"
                >ยืนยัน</b-button
              >
              <b-button @click="toggleModalDelete" variant="outline-primary"
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
import firebaseApp from "../../firebase/firebase_app";
import { VclList } from "vue-content-loading";
import ExpandableImage from "../../components/expandableImage.vue";
import moment from "moment";
import "../../assets/scss/style.scss";

import {
  FileTextIcon,
  CalendarIcon,
  HomeIcon,
  TruckIcon,
  PaperclipIcon,
  PackageIcon,
} from "vue-feather-icons";

export default {
  name: "OrderListDetail",
  components: {
    VclList,
    FileTextIcon,
    CalendarIcon,
    HomeIcon,
    TruckIcon,
    PaperclipIcon,
    PackageIcon,
    ExpandableImage,
  },
  data() {
    return {
      orderItem: [],
      loading: false,
      idOrder: this.$route.params.id,
      fields: [
        { key: "image" },
        { key: "name", sortable: true },
        { key: "price", sortable: true },
        { key: "quantity", sortable: true },
        { key: "total", sortable: true },
      ],
    };
  },
  created() {
    window.scrollTo(0, 0);
    this.loadorder();
  },
  methods: {
    loadorder() {
      this.loading = true;
      const oderDetailRef = firebaseApp
        .firestore()
        .doc("orders/" + this.idOrder);

      oderDetailRef
        .get()
        .then((doc) => {
          var orderItems = doc.data().items;
          var orderLists = [];

          orderItems.map((ele) => {
            var orderList = {
              image: ele.image,
              name: ele.name,
              productID: ele.productID,
              price: this.formatPrice(ele.price),
              fullprice: ele.fullprice,
              discount: ele.discount,
              quantity: ele.quantity,
              total: this.formatPrice(ele.price * ele.quantity),
            };
            orderLists.push(orderList);
          });

          var item = {
            id: doc.id,
            orderID: doc.data().orderID,
            status: doc.data().status,
            orderList: orderLists,
            totalPrice: doc.data().totalPrice,
            totalAll: doc.data().totalAll,
            deliverPrice: doc.data().deliverPrice,
            note: doc.data().note,
            paywith: doc.data().paywith,
            slipImage: doc.data().slipImage,
            slipDate: doc.data().slipDate,
            formBank: doc.data().formBank,
            address: doc.data().address,
            payon: doc.data().payon ? this.formatDate(doc.data().payon) : "",
            deliverNumber: doc.data().deliverNumber,
            deliverCompany: doc.data().deliverCompany,
            createAt: doc.data().createAt
              ? this.formatDate(doc.data().createAt)
              : "",
            updateAt: doc.data().updateAt
              ? this.formatDate(doc.data().updateAt)
              : "",
          };

          this.orderItem = item;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.$router.replace("/error");
          this.loading = false;
        });
    },
    confirmPage() {
      this.$router.push("/confirm-order/" + this.idOrder);
    },
    formatDate(date) {
      var time = date.toDate();
      var formatTimeShow = moment(time).format("DD-MM-YYYY HH:mm");
      return formatTimeShow;
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(0);
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    followTruck() {
      if (this.orderItem.deliverCompany == "KerryExpress") {
        window.open("https://th.kerryexpress.com/th/track/", "_blank");
      } else if (this.orderItem.deliverCompany == "ThailandPost") {
        window.open("https://track.thailandpost.co.th/", "_blank");
      } else if (this.orderItem.deliverCompany == "FlashExpress") {
        window.open("https://www.flashexpress.co.th/tracking/", "_blank");
      } else if (this.orderItem.deliverCompany == "J&TExpress") {
        window.open(
          "https://www.jtexpress.co.th/index/query/gzquery.html",
          "_blank"
        );
      }
    },
    toggleModal() {
      this.$bvModal.show("modal-delete");
    },
    toggleModalDelete() {
      this.$bvModal.hide("modal-delete");
    },
    cancleOrder() {
      //เปลี่ยนสถานะ
      this.loading = true;
      this.toggleModalDelete();
      var setsStatus = {
        status: "ยกเลิก",
        updateAt: new Date(),
      };
      const orderRef = firebaseApp
        .firestore()
        .doc("orders/" + this.orderItem.id);
      return orderRef
        .update(setsStatus)
        .then(() => {
          this.loading = false;
          this.loadorder();
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },
     onCopy: function (e) {
      console.log(e.text);
      this.$toast(`คัดลอกแล้ว`, {
        position: "top-center",
        closeOnClick: true,
        hideProgressBar: true,
        timeout: 1500,
        icon: "fas fa-copy",
      });
    },
  },
};
</script>

<style>
.font-dis {
  color: gray;
  font-size: 13px;
  text-decoration: line-through;
  text-decoration-color: gray;
}

.total-detail {
  width: 80px;
}
.price-width {
  width: 80px;
}
</style>