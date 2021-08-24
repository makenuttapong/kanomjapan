<template>
  <div>
    <b-row class="match-height">
      <b-col lg="8" md="12">
        <b-card class="mb-4 card-left overflow-hidden">
          <div v-if="loading" class="p-4">
            <vcl-list></vcl-list>
          </div>

          <div v-if="!loading">
            <div class="mb-3">
              <h5>
                <FileTextIcon color="#7367f0" class="mb-1" /> หมายเลขคำสั่งซื้อ
                :
                <span>{{ order.orderID }}</span>
              </h5>
            </div>

            <div class="mb-2">
              <span class="bold">จำนวนสินค้า : </span>
              {{ order.orderList.length }} รายการ
            </div>

            <b-table
              responsive="sm"
              :items="order.orderList"
              :fields="fields"
              show-empty
              empty-text="ไม่พบข้อมูล"
              empty-filtered-text="ไม่พบข้อมูล"
            >
              <template #cell(image)="row">
                <ExpandableImage :src="row.item.image" class="sm-image" />
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
              {{ formatPrice(order.totalPrice) }} บาท
            </div>
            <div>
              <span class="bold">ค่าส่ง : </span>
              {{
                order.deliverPrice != 0 ? order.deliverPrice + " บาท" : "ส่งฟรี"
              }}
            </div>
            <div>
              <span class="bold">รวมทั้งหมด : </span>
              {{ formatPrice(order.totalAll) }} บาท
            </div>
          </div>
        </b-card>
      </b-col>
      <b-col lg="4" md="12">
        <b-row class="match-height">
          <b-col lg="12" md="6">
            <b-card class="card-right mb-4">
              <div v-if="loading" class="p-2">
                <vcl-list></vcl-list>
              </div>

              <div v-if="!loading">
                <h5 class="mb-3">
                  <PackageIcon color="#7367f0" class="mb-1" /> สถานะคำสั่งซื้อ
                </h5>

                <div
                  v-if="order.status == 'รอชำระ' && !editStatus"
                  class="d-inline"
                >
                  <b-badge pill class="status-wait-style font-14"
                    ><i class="fa fa-clock" /> {{ order.status }}</b-badge
                  >
                </div>
                <div
                  v-if="order.status == 'รอการตรวจสอบ' && !editStatus"
                  class="d-inline"
                >
                  <b-badge pill class="status-checkSlip-style font-14"
                    ><i class="fa fa-search-dollar" />
                    {{ order.status }}</b-badge
                  >
                </div>
                <div
                  v-if="order.status == 'เตรียมจัดส่ง' && !editStatus"
                  class="d-inline"
                >
                  <b-badge pill class="status-ready-style font-14"
                    ><i class="fa fa-truck-loading" />
                    {{ order.status }}</b-badge
                  >
                </div>
                <div
                  v-if="order.status == 'อยู่ระหว่างการจัดส่ง' && !editStatus"
                  class="d-inline"
                >
                  <b-badge pill class="status-sent-style font-14">
                    <i class="fa fa-shipping-fast" />
                    {{ order.status }}</b-badge
                  >
                </div>

                <div
                  v-if="order.status == 'จัดส่งแล้ว' && !editStatus"
                  class="d-inline"
                >
                  <b-badge pill class="status-check-style font-14"
                    ><i class="fa fa-check" /> {{ order.status }}</b-badge
                  >
                </div>
                <div
                  v-if="order.status == 'ยกเลิก' && !editStatus"
                  class="d-inline"
                >
                  <b-badge pill class="status-cancle-style font-14"
                    ><i class="fa fa-times" /> {{ order.status }}</b-badge
                  >
                </div>

                <b-select
                  v-if="editStatus"
                  :options="optionStatus"
                  v-model="form.status"
                  class="custom-select-status mb-1"
                />
                <b-button
                  size="sm"
                  class="ml-3"
                  @click="submit"
                  variant="primary"
                  v-if="editStatus"
                  >บันทึก</b-button
                >
                <b-button
                  size="sm"
                  class="ml-1"
                  variant="outline-primary"
                  v-if="editStatus"
                  @click="cancleEdit"
                  >ยกเลิก</b-button
                >

                <b-button
                  size="sm"
                  class="ml-3"
                  variant="primary"
                  v-if="!editStatus"
                  @click="edit"
                  >แก้ไข</b-button
                >

                <div class="mt-3">
                  <span class="bold">สั่งซื้อเมื่อ : </span
                  ><CalendarIcon size="18" class="mr-1 mb-1" />
                  <span class="font-14">{{
                    order.createAt ? order.createAt : "-"
                  }}</span>
                </div>
                <div class="">
                  <span class="bold">อัปเดตเมื่อ : </span
                  ><CalendarIcon size="18" class="mr-1 mb-1" />
                  <span class="font-14">{{
                    order.updateAt ? order.updateAt : "-"
                  }}</span>
                </div>
              </div>
            </b-card>
          </b-col>
          <b-col lg="12" md="6">
            <b-card class="mb-4">
              <div v-if="loadUser" class="p-2">
                <vcl-facebook></vcl-facebook>
              </div>

              <div v-if="!loadUser">
                <h5 class="mb-3">
                  <UserIcon color="#7367f0" class="mb-1" /> ข้อมูลผู้ซื้อ
                </h5>
                <div class="text-center">
                  <img
                    :src="customerDetail.image"
                    width="120px"
                    class="mb-3 rounded-circle"
                  />
                </div>
                <div>
                  <span class="bold">ชื่อ : </span>{{ customerDetail.name }}
                </div>
                <div>
                  <span class="bold">อีเมล : </span>{{ customerDetail.email }}
                </div>
                <div>
                  <span class="bold">เบอร์โทรศัพท์ : </span
                  >{{ customerDetail.phone ? customerDetail.phone : "-" }}
                </div>
                <div>
                  <span class="bold">Line ID : </span
                  >{{ customerDetail.lineID ? customerDetail.lineID : "-" }}
                </div>
                <div>
                  <span class="bold">เพศ : </span
                  >{{ customerDetail.gender ? customerDetail.gender : "-" }}
                </div>
              </div>
            </b-card>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row class="match-height">
      <b-col lg="6" md="12">
        <b-row class="match-height order">
          <b-col lg="12" md="6">
            <b-card class="mb-4">
              <div v-if="loading" class="p-2">
                <vcl-list></vcl-list>
              </div>
              <div v-if="!loading">
                <h5 class="mb-3">
                  <HomeIcon color="#7367f0" class="mb-1" /> ที่อยู่ในการจัดส่ง
                </h5>
                <div>
                  <b-row>
                    <b-col lg="6" md="12">
                      <div>
                        <span class="bold">ชื่อผู้รับ : </span>
                        {{ order.address.name }}
                      </div>
                    </b-col>
                    <b-col lg="6" md="12">
                      <div>
                        <span class="bold">โทรศัพท์ : </span>
                        {{ order.address.phone }}
                      </div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col lg="12">
                      <div>
                        <span class="bold">บ้านเลขที่ : </span>
                        {{ order.address.houseNumber }}
                      </div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col lg="6" md="12">
                      <div>
                        <span class="bold">ซอย : </span>
                        {{ order.address.soy ? order.address.soy : "-" }}
                      </div>
                    </b-col>
                    <b-col lg="6" md="12">
                      <div>
                        <span class="bold">ถนน : </span>
                        {{ order.address.road ? order.address.road : "-" }}
                      </div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col lg="6" md="12">
                      <div>
                        <span class="bold">ตำบล/แขวง : </span>
                        {{ order.address.district }}
                      </div>
                    </b-col>
                    <b-col lg="6" md="12">
                      <div>
                        <span class="bold">อำเภอ/เขต : </span>
                        {{ order.address.amphoe }}
                      </div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col lg="6" md="12">
                      <div>
                        <span class="bold">จังหวัด : </span>
                        {{ order.address.province }}
                      </div>
                    </b-col>
                    <b-col lg="6" md="12">
                      <div>
                        <span class="bold">รหัสไปรษณี : </span>
                        {{ order.address.zipcode }}
                      </div>
                    </b-col>
                  </b-row>
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
                <div class="d-flex space-between">
                  <h5 class="mb-3">
                    <TruckIcon color="#7367f0" class="mb-1" />
                    หมายเลขติดตามพัสดุ
                  </h5>
                  <div>
                    <b-button
                      variant="outline-primary"
                      class="ml-3"
                      v-if="order.deliverNumber"
                      size="sm"
                      @click="followTruck"
                      >ติดตามพัสดุ</b-button
                    >
                  </div>
                </div>
                <div class="mb-2">
                  <span class="bold">บริษัทขนส่ง : </span>
                  {{
                    order.deliverCompany != "ฟรี"
                      ? order.deliverCompany
                      : "kerry"
                  }}
                </div>
                <div class="d-inline" v-if="!editNum">
                  <span class="bold">เลขพัสดุ : </span>
                  <span
                    v-if="order.deliverNumber"
                    v-clipboard:copy="order.deliverNumber"
                    v-clipboard:success="onCopy"
                    class="link-detail"
                  >
                    {{ order.deliverNumber }}
                  </span>
                  <span v-if="!order.deliverNumber"> - </span>
                </div>

                <b-input
                  v-if="editNum"
                  class="truck-number"
                  autocomplete="off"
                  v-model="form.deliverNumber"
                />
                <b-button
                  size="sm"
                  class="ml-3"
                  @click="submitNumber"
                  variant="primary"
                  v-if="editNum"
                  >บันทึก</b-button
                >
                <b-button
                  size="sm"
                  class="ml-1"
                  variant="outline-primary"
                  v-if="editNum"
                  @click="cancleEditNumber"
                  >ยกเลิก</b-button
                >

                <b-button
                  size="sm"
                  class="ml-3"
                  variant="primary"
                  v-if="!editNum"
                  @click="editNumber"
                  ><span v-if="order.deliverNumber != ''">แก้ไข</span>
                  <span v-if="order.deliverNumber == ''">เพิ่ม</span></b-button
                >
              </div>
            </b-card>
          </b-col>
        </b-row>
      </b-col>

      <b-col lg="6" md="12">
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
                v-if="order.payon"
              >
                ชำระแล้ว
              </b-badge>
              <b-badge
                pill
                class="status-cancle-style font-14"
                v-if="!order.payon"
              >
                ยังไม่ได้ชำระ
              </b-badge>
            </div>
            <div>
              <span class="bold">ชำระเมื่อ : </span
              ><CalendarIcon size="18" class="mr-1 mb-1" /><span
                class="font-14"
                >{{ order.payon ? order.payon : "-" }}</span
              >
            </div>
            <div>
              <span class="bold">โอนจากธนาคาร : </span
              >{{ order.formBank ? order.formBank : "-" }}
            </div>
            <div>
              <span class="bold"
                >วัน-เวลาที่โอน :
                <CalendarIcon size="18" class="mr-1 mb-1" /></span
              ><span class="font-14">{{ order.slipDate }}</span>
            </div>

            <div class="" v-if="order.note">
              <span class="bold">หมายเหตุ: </span>
              {{ order.note }}
            </div>
            <div class="mb-3">
              <span class="bold"
                >สลิปโอนเงิน : {{ order.slipImage ? "" : "-" }}</span
              >
            </div>
            <div
              v-if="order.slipImage"
              class="d-flex justify-content-center mb-3"
            >
              <ExpandableImage :src="order.slipImage" class="ex-image" />
            </div>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import firebaseApp from "../../firebase/firebase_app";
import { VclList, VclFacebook } from "vue-content-loading";
import moment from "moment";
import "../../assets/scss/style.scss";
import ExpandableImage from "../../components/expandableImage.vue";

import {
  FileTextIcon,
  CalendarIcon,
  HomeIcon,
  TruckIcon,
  UserIcon,
  PaperclipIcon,
  PackageIcon,
} from "vue-feather-icons";

export default {
  name: "orderDetail",
  components: {
    VclList,
    VclFacebook,
    FileTextIcon,
    CalendarIcon,
    HomeIcon,
    TruckIcon,
    UserIcon,
    PaperclipIcon,
    PackageIcon,
    ExpandableImage,
  },
  data() {
    return {
      loading: false,
      loadUser: false,
      order: {},
      form: {
        status: "",
        deliverNumber: "",
      },
      customerDetail: {},
      optionStatus: [
        "รอชำระ",
        "รอการตรวจสอบ",
        "เตรียมจัดส่ง",
        "อยู่ระหว่างการจัดส่ง",
        "จัดส่งแล้ว",
        "ยกเลิก",
      ],
      editStatus: false,
      editNum: false,
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
    this.loadOrderDetail();
  },
  methods: {
    loadOrderDetail() {
      this.loading = true;
      this.loadUser = true;
      const orderDetailRef = firebaseApp
        .firestore()
        .doc("orders/" + this.idOrder);
      return orderDetailRef
        .get()
        .then((doc) => {
          var orderLists = [];

          this.loadCustomer(doc.data().userID);
          var orderItems = doc.data().items;
          orderItems.map((ele) => {
            var orderList = {
              id: ele.id,
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

          var setData = {
            id: doc.id,
            orderID: doc.data().orderID,
            status: doc.data().status,
            orderList: orderLists,
            totalPrice: doc.data().totalPrice,
            totalAll: doc.data().totalAll,
            note: doc.data().note,
            deliverPrice: doc.data().deliverPrice,
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
          this.order = setData;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
          this.$router.replace("/error");
        });
    },
    loadCustomer(userID) {
      const customerDetailRef = firebaseApp.firestore().doc("users/" + userID);
      return customerDetailRef
        .get()
        .then((doc) => {
          var detailData = {
            uid: doc.id,
            name: doc.data().name,
            email: doc.data().email,
            image: doc.data().image
              ? doc.data().image
              : require("@/assets/userDF.png"),
            phone: doc.data().phone,
            lineID: doc.data().lineID,
            gender: doc.data().gender,
          };
          this.customerDetail = detailData;
          this.loadUser = false;
        })
        .catch((err) => {
          console.log(err);
          this.loadUser = false;
        });
    },
    submit() {
      if (this.order.status != this.form.status) {
        this.loading = true;
        this.loadUser = true;
        this.editStatus = false;

        if (this.form.status == "เตรียมจัดส่ง") {
          this.checkRemoveStock(this.order.orderID);
        } else if (this.form.status == "จัดส่งแล้ว") {
          this.checkIncome(this.order);
        }

        var setData = {
          status: this.form.status,
          updateAt: new Date(),
        };

        const updataData = firebaseApp
          .firestore()
          .doc("orders/" + this.order.id);
        updataData
          .update(setData)
          .then(() => {
            this.loading = false;
            this.loadOrderDetail();
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.editStatus = false;
      }
    },
    formatDate(date) {
      var time = date.toDate();
      var formatTimeShow = moment(time).format("DD-MM-YYYY HH:mm");
      return formatTimeShow;
    },
    submitNumber() {
      if (this.order.deliverNumber != this.form.deliverNumber) {
        this.loading = true;
        this.loadUser = true;
        this.editNum = false;
        var setData = {
          deliverNumber: this.form.deliverNumber,
        };
        const updataData = firebaseApp
          .firestore()
          .doc("orders/" + this.order.id);
        updataData
          .update(setData)
          .then(() => {
            this.loading = false;
            this.loadOrderDetail();
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.editNum = false;
      }
    },
    edit() {
      this.form.status = this.order.status;
      this.editStatus = true;
    },
    editNumber() {
      this.form.deliverNumber = this.order.deliverNumber;
      this.editNum = true;
    },
    cancleEdit() {
      this.form.status = "";
      this.editStatus = false;
    },
    cancleEditNumber() {
      this.form.deliverNumber = "";
      this.editNum = false;
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(0);
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    checkRemoveStock(orderID) {
      var logRef = firebaseApp.firestore().collection("logRemoveStock");
      logRef
        .where("orderID", "==", orderID)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.size == 0) {
            // เพิ่ม Data
            var countItemRemove = [];
            this.order.orderList.map((ele) => {
              var dataRemove = {
                productIDRef: ele.id,
                quantity: ele.quantity,
              };
              countItemRemove.push(dataRemove);
            });

            var setData = {
              itemRemove: countItemRemove,
              orderID: orderID,
              createAt: new Date(),
            };

            logRef.add(setData);
            this.removeItemStock();
          }
        });
    },
    removeItemStock() {
      this.order.orderList.map(async (ele) => {
        var productIDRef = ele.id;
        var qtyRef = ele.quantity;
        await this.updateProductStock(productIDRef, qtyRef);
      });
    },
    checkIncome(item) {
      firebaseApp
        .firestore()
        .doc("users/" + this.customerDetail.uid)
        .get()
        .then((document) => {
          const checkRef = firebaseApp.firestore().collection("incomes");
          return checkRef
            .where("orderID", "==", item.orderID)
            .get()
            .then((querySnapshot) => {
              var size = querySnapshot.size;
              if (size == 0) {
                var setNewData = {
                  createAt: new Date(),
                  description: "ได้รับเงินจากการซื้อสินค้า",
                  orderID: item.orderID,
                  status: "cash-in",
                  price: item.totalAll,
                  userProfile: {
                    image: document.data().image,
                    email: document.data().email,
                    name: document.data().name,
                    role: document.data().role,
                    userID: document.id,
                  },
                };
                checkRef.add(setNewData);
              }
            });
        });
    },
    updateProductStock(id, qty) {
      const productRef = firebaseApp.firestore().doc("products/" + id);
      return productRef.get().then((ele) => {
        var stockPro = ele.data().stock;
        var soldPro = ele.data().sold;

        var newStock = stockPro - qty;
        var newSold = soldPro + qty;
        var setData = {
          stock: newStock,
          sold: newSold,
        };

        return productRef.update(setData).then(() => {});
      });
    },
    followTruck() {
      if (this.order.deliverCompany == "KerryExpress") {
        window.open("https://th.kerryexpress.com/th/track/", "_blank");
      } else if (this.order.deliverCompany == "ThailandPost") {
        window.open("https://track.thailandpost.co.th/", "_blank");
      } else if (this.order.deliverCompany == "FlashExpress") {
        window.open("https://www.flashexpress.co.th/tracking/", "_blank");
      } else if (this.order.deliverCompany == "J&TExpress") {
        window.open(
          "https://www.jtexpress.co.th/index/query/gzquery.html",
          "_blank"
        );
      }
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

<style scoped>
.custom-select-status {
  width: 180px;
}
.truck-number {
  display: inline;
  width: 180px;
}
.price-width {
  width: 80px;
}
.font-dis {
  color: gray;
  font-size: 13px;
  text-decoration: line-through;
  text-decoration-color: gray;
}
.total-detail {
  width: 80px;
}
</style>