<template>
  <div>
    <b-card class="overflow-hidden">
      <h5 class="mb-4">
        <i class="fa fa-id-card" color="#7367f0" /> รายละเอียดลูกค้า
      </h5>
      <b-tabs v-if="customerDetail" pills>
        <!-- Tab: Account -->
        <b-tab active>
          <template #title>
            <i class="fa fa-info-circle" />
            <span class="d-none d-sm-inline"> ข้อมูลทั่วไป</span>
          </template>

          <div v-if="loading" class="p-4">
            <vcl-facebook> </vcl-facebook>
          </div>

          <div v-if="!loading" class="mt-4 pt-2">
            <b-row>
              <b-col cols="12">
                <div class="mb-4">
                  <ExpandableImage
                    :src="
                      customerDetail.image
                        ? customerDetail.image
                        : require('@/assets/userDF.png')
                    "
                    class="img-profile"
                  />
                </div>
              </b-col>
              <b-col md="6" class="mt-2 mb-2">
                <span
                  ><span class="bold">ชื่อ : </span
                  >{{ customerDetail.name ? customerDetail.name : "-" }}</span
                >
              </b-col>
              <b-col md="6" class="mt-2 mb-2">
                <span
                  ><span class="bold">อีเมล : </span
                  >{{ customerDetail.email ? customerDetail.email : "-" }}</span
                >
              </b-col>
              <b-col md="6" class="mt-2 mb-2">
                <span
                  ><span class="bold">เบอร์โทรศัพท์ : </span
                  >{{ customerDetail.phone ? customerDetail.phone : "-" }}</span
                >
              </b-col>
              <b-col md="6" class="mt-2 mb-2">
                <span
                  ><span class="bold">เพศ : </span
                  >{{
                    customerDetail.gender ? customerDetail.gender : "-"
                  }}</span
                >
              </b-col>
              <b-col md="6" class="mt-2 mb-2">
                <span
                  ><span class="bold">วันเกิด : </span>
                  <CalendarIcon size="18" class="mb-1" />
                  {{
                    customerDetail.birthdate ? customerDetail.birthdate : "-"
                  }}</span
                >
              </b-col>

              <b-col md="6" class="mt-2 mb-2">
                <div>
                  <span class="bold">เข้าใช้งานด้วย : </span>
                  <span
                    class="facebook-color"
                    v-if="customerDetail.signInWith == 'facebook'"
                  >
                    <i class="fab fa-facebook-f" />
                    {{
                      customerDetail.signInWith
                        ? customerDetail.signInWith
                        : "-"
                    }}
                  </span>
                  <span
                    class="google-color"
                    v-if="customerDetail.signInWith == 'google'"
                  >
                    <i class="fab fa-google" />
                    {{
                      customerDetail.signInWith
                        ? customerDetail.signInWith
                        : "-"
                    }}
                  </span>
                  <span
                    class="email-color"
                    v-if="customerDetail.signInWith == 'email'"
                  >
                    <i class="fa fa-envelope" />
                    {{
                      customerDetail.signInWith
                        ? customerDetail.signInWith
                        : "-"
                    }}
                  </span>
                </div>
              </b-col>
              <b-col md="6" class="mt-2 mb-2">
                <span
                  ><span class="bold">Line ID : </span
                  >{{customerDetail.LineID ? customerDetail.LineID  : '-'}}</span
                >
              </b-col>
              <b-col md="6" class="mt-2 mb-2">
                <span
                  ><span class="bold">สมัครสมาชิกเมื่อ : </span
                  ><CalendarIcon size="18" class="mr-1 mb-1" />{{
                    customerDetail.createAt ? customerDetail.createAt : "-"
                  }}</span
                >
              </b-col>
            </b-row>
          </div>
        </b-tab>

        <b-tab>
          <template #title>
            <i class="fa fa-map-marker-alt" />
            <span class="d-none d-sm-inline"> ข้อมูลที่อยู่</span>
          </template>

          <div class="pl-3 mt-3 bold color-primary text-decoration-underline">ที่อยู่ในการจัดส่ง</div>
      
          <b-row class="p-3">
            <b-col md="6" class="mt-2 mb-2"
              ><div>
                <span class="bold">ชื่อ-สกุล (ผู้รับ) : </span
                >{{
                  customerDetail.address.name
                    ? customerDetail.address.name
                    : "-"
                }}
              </div></b-col
            >
            <b-col md="6" class="mt-2 mb-2"
              ><div>
                <span class="bold">เบอร์โทรศัพท์ : </span
                >{{
                  customerDetail.address.phone
                    ? customerDetail.address.phone
                    : "-"
                }}
              </div></b-col
            >
            <b-col md="6" class="mt-2 mb-2"
              ><div>
                <span class="bold">บ้านเลขที่ : </span
                >{{
                  customerDetail.address.houseNumber
                    ? customerDetail.address.houseNumber
                    : "-"
                }}
              </div></b-col
            >

            <b-col md="6" class="mt-2 mb-2"
              ><div>
                <span class="bold">ซอย : </span
                >{{
                  customerDetail.address.soy ? customerDetail.address.soy : "-"
                }}
              </div>
            </b-col>
            <b-col md="6" class="mt-2 mb-2">
              <div>
                <span class="bold">ถนน : </span
                >{{
                  customerDetail.address.road
                    ? customerDetail.address.road
                    : "-"
                }}
              </div></b-col
            >
            <b-col md="6" class="mt-2 mb-2">
              <div>
                <span class="bold">ตำบล/แขวง : </span
                >{{
                  customerDetail.address.district
                    ? customerDetail.address.district
                    : "-"
                }}
              </div></b-col
            >
            <b-col md="6" class="mt-2 mb-2"
              ><div>
                <span class="bold">อำเภอ/เขต : </span
                >{{
                  customerDetail.address.amphoe
                    ? customerDetail.address.amphoe
                    : "-"
                }}
              </div>
            </b-col>
            <b-col md="6" class="mt-2 mb-2"
              ><div>
                <span class="bold">จังหวัด : </span
                >{{
                  customerDetail.address.province
                    ? customerDetail.address.province
                    : "-"
                }}
              </div>
            </b-col>
            <b-col md="6" class="mt-2 mb-2">
              <div>
                <span class="bold">รหัสไปรษณี : </span
                >{{
                  customerDetail.address.zipcode
                    ? customerDetail.address.zipcode
                    : "-"
                }}
              </div></b-col
            >
          </b-row>
        </b-tab>

        <b-tab>
          <template #title>
            <i class="fa fa-history" />
            <span class="d-none d-sm-inline"> ประวัติการซื้อสินค้า</span>
          </template>
          <div class="mt-3 pt-2">
            <div class="pl-2">คำสั่งซื้อทั้งหมด : {{ orderItem.length }}</div>
            <div v-if="orderItem.length == 0" class="text-center p-4">
              <img :src="require('@/assets/Empty.svg')" width="400px">
            </div>
            <div v-for="(item, index) in orderItem" :key="index">
              <b-card
                class="mt-2 card-border collapse-icon"
                v-b-toggle="'accordion-' + item.accId"
              >
                <div class="content-order row">
                  <div class="col">
                    <small class="text-primary">หมายเลขคำสั่งซื้อ</small>
                    <div><FileTextIcon  size="18" class="mb-1 mr-1" color="#7367f0"/>{{ item.orderID }}</div>
                  </div>
                  <div class="col">
                    <small class="text-primary">วันที่สั่ง</small>
                    <div class="createOrder">
                     <CalendarIcon size="14" class="mb-1 mr-1" />{{item.createAt}}
                    </div>
                  </div>
                  <div class="col-3">
                    <small class="text-primary">สถานะ</small>
                    <div v-if="item.status == 'รอชำระ'">
                      <b-badge pill class="status-wait-style font-14"><i class="fa fa-clock" /> {{ item.status }}</b-badge >
                    </div>
                    <div v-if="item.status == 'รอการตรวจสอบ'">
                      <b-badge pill class="status-checkSlip-style font-14"><i class="fa fa-search-dollar" /> {{ item.status }}</b-badge >
                    </div>
                    <div v-if="item.status == 'เตรียมจัดส่ง'">
                      <b-badge pill class="status-ready-style font-14"><i class="fa fa-truck-loading" /> {{ item.status }}</b-badge >
                    </div>
                    <div v-if="item.status == 'อยู่ระหว่างการจัดส่ง'">
                      <b-badge pill class="status-sent-style font-14"><i class="fa fa-shipping-fast" /> {{ item.status }}</b-badge >
                    </div>
                    <div v-if="item.status == 'จัดส่งแล้ว'">
                      <b-badge pill class="status-check-style font-14"><i class="fa fa-check" /> {{ item.status }}</b-badge >
                    </div>
                    <div v-if="item.status == 'ยกเลิก'">
                      <b-badge pill class="status-cancle-style font-14"><i class="fa fa-times" /> {{ item.status }}</b-badge >
                    </div>
                  </div>

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
                    <div>{{item.orderItems.length != 0 ? item.orderItems.length : '0'}} รายการ</div>
                  </div>

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
                    <div>{{ item.totalAll ? item.totalAll : "-" }} บาท</div>
                  </div>

                  <div class="col-1 icon-coll">
                    <i class="fa fa-chevron-up icon-coll-open" />
                  </div>
                </div>
              </b-card>

              <b-collapse
                :id="'accordion-' + item.accId"
                accordion="my-accordion"
                role="tabpanel"
                class=""
              >
                <b-card-body>
                  <b-card-text>
                    <div class="mb-2">
                      <span class="bold">จำนวนสินค้า : </span>
                      {{ item.orderItems.length }} รายการ
                    </div>

                    <b-table
                      responsive="sm"
                      :items="item.orderItems"
                      :fields="fields"
                      show-empty
                      empty-text="ไม่พบข้อมูล"
                      empty-filtered-text="ไม่พบข้อมูล"
                      tbody-tr-class="tableHover"
                    >
                      <template #cell(image)="row">
                        <ExpandableImage
                          :src="row.item.image"
                          class="sm-image"
                        />
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
                          <div class="font-dis">
                            {{ row.item.fullprice }} บาท
                          </div>
                          <div>{{ row.item.price }} บาท</div>
                        </div>
                      </template>
                      <template #cell(quantity)="row">
                        <span> {{ row.item.quantity }} ชิ้น</span>
                      </template>
                      <template #cell(total)="row">
                        <span> {{ row.item.total }} บาท</span>
                      </template>
                    </b-table>
                    <div>
                      <span class="bold">ราคาสินค้ารวม : </span>
                      {{ formatPrice(item.totalPrice) }} บาท
                    </div>
                    <div>
                      <span class="bold">ค่าส่ง : </span>
                      {{
                        item.deliverPrice != 0
                          ? item.deliverPrice + " บาท"
                          : "ส่งฟรี"
                      }}
                    </div>
                    <div>
                      <span class="bold">รวมทั้งหมด : </span>
                      {{ formatPrice(item.totalAll) }} บาท
                    </div>
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </div>
          </div>

          <div class="mx-2" v-if="this.orderItem.length != 0">
            <b-row>
              <b-col
                cols="12"
                sm="6"
                class="
                  d-flex
                  align-items-center
                  justify-content-center justify-content-sm-start
                "
              >
                <span class="text-mute"
                  >ออเดอร์ที่ {{ itemStart }} - {{ itemEnd }} จาก
                  {{ totalDatas }}</span
                >
              </b-col>
              <b-col
                cols="12"
                sm="6"
                class="
                  d-flex
                  align-items-center
                  justify-content-center justify-content-sm-end
                "
              >
                <Pagination
                  @selectedPage="loadMore"
                  :currentPage="this.$store.state.currentP + 1"
                  :totalItem="totalDatas"
                  :itemPerPage="itemPerPage"
                  :start="itemStart"
                  :end="itemEnd"
                />
              </b-col>
            </b-row>
          </div>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import firebaseApp from "../../firebase/firebase_app";
import { VclFacebook } from "vue-content-loading";
import "../../assets/scss/style.scss";
import moment from "moment";
import { CalendarIcon ,FileTextIcon } from "vue-feather-icons";
import Pagination from "../../components/pagination";
import ExpandableImage from "../../components/expandableImage.vue";

export default {
  name: "customerDetail",
  components: {
    VclFacebook,
    CalendarIcon,
    Pagination,
    ExpandableImage,
    FileTextIcon
  },
  data() {
    return {
      loading: false,
      customerDetail: {
        uid: "",
        name: "",
        email: "",
        image: "",
        phone: "",
        point: 0,
        gender: "",
        createAt: "",
        birthdate: "",
        signinWith: "",
        address: {},
      },
      totalDatas: null,
      itemPerPage: 20,
      itemStart: null,
      itemEnd: null,
      customerOrders: [],
      idCustomer: this.$route.params.id,
      orderItem: [],
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
    this.loadCustomerDetail();
  },
  methods: {
    loadCustomerDetail() {
      this.loading = true;
      const customerDetailRef = firebaseApp
        .firestore()
        .doc("users/" + this.idCustomer);
      return customerDetailRef
        .get()
        .then((doc) => {
          this.loading = false;
          var detailData = {
            uid: doc.id,
            name: doc.data().name,
            email: doc.data().email,
            image: doc.data().image,
            phone: doc.data().phone,
            gender: doc.data().gender,
            createAt: this.formatDate(doc.data().createAt),
            lineID : doc.data().lineID,
            birthdate: doc.data().birthdate
              ? this.formatBD(doc.data().birthdate)
              : "-",
            signInWith: doc.data().signinWith,
            address: doc.data().address ? doc.data().address : {},
          };
          this.customerDetail = detailData;
          this.loadOrders();
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
          this.$router.replace("/error");
        });
    },
    loadOrders() {
      let indexOf = this.itemPerPage * this.$store.state.currentP; //itemperPage = totalitem/limit
      const oderDetailRef = firebaseApp
        .firestore()
        .collection("orders")
        .where("userID", "==", this.customerDetail.uid)
        .orderBy("createAt", "desc");
      oderDetailRef
        .get()
        .then((document) => {
          let last = document.docs[indexOf];
          var itemCount = document.docs.length;
          var page = this.$store.state.currentP + 1;
          var start = page * this.itemPerPage - (this.itemPerPage - 1);
          var end = Math.min(start + this.itemPerPage - 1, itemCount);
          this.itemStart = start;
          this.itemEnd = end;
          this.totalDatas = itemCount;
          if (last) {
            var queryRef = oderDetailRef.startAt(last).limit(this.itemPerPage);
          } else {
            queryRef = oderDetailRef.limit(this.itemPerPage);
          }

          queryRef
            .get()
            .then((querySnapshot) => {
              var data = [];
              var index = 1;
              querySnapshot.forEach((doc) => {
                var orderLists = [];
                var orderItems = doc.data().items;
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
                  accId: index,
                  orderID: doc.data().orderID,
                  orderItems: orderLists,
                  status: doc.data().status,
                  totalAll: doc.data().totalAll,
                  totalPrice: doc.data().totalPrice,
                  deliverPrice: doc.data().deliverPrice,
                  paywith: doc.data().paywith,
                  slipImage: doc.data().slipImage,
                  address: doc.data().address,
                  payon: doc.data().payon
                    ? this.formatDate(doc.data().payon)
                    : "",
                  deliverNumber: doc.data().deliverNumber,
                  deliverCompany: doc.data().deliverCompany,
                  createAt: doc.data().createAt
                    ? this.formatDate(doc.data().createAt)
                    : "",
                  updateAt: doc.data().updateAt
                    ? this.formatDate(doc.data().updateAt)
                    : "",
                };

                data.push(item);
                index = index + 1;
              });
              this.orderItem = data;
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    formatDate(date) {
      var time = date.toDate();
      var formatTimeShow = moment(time).format("DD-MM-YYYY HH:mm");
      return formatTimeShow;
    },
    formatBD(date) {
      var time = date.toDate();
      var formatTimeShow = moment(time).format("DD-MM-YYYY");
      return formatTimeShow;
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(0);
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    loadMore(page){
      this.$store.dispatch("changePage", page);
      this.loadOrders();
    }
  },
};
</script>

<style>
.img-object {
  object-fit: cover;
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
.text-decoration-underline{
  text-decoration: underline;
}
</style>