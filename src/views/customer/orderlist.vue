<template>
  <div>
    <b-card>
      <h5 class="mb-4">
        <i class="fa fa-history" color="#7367f0" /> ประวัติการสั่งซื้อ
      </h5>
      <b-tabs pills>
        <!-- Tab: ALL ORDER -->
        <b-tab active @click="changeStatus('all')">
          <template #title>
            <i class="fa fa-clipboard-check" />
            <span class="d-none d-sm-inline"> คำสั่งซื้อทั้งหมด</span>
          </template>
        </b-tab>

        <!--TAP: NOT YET -->
        <b-tab @click="changeStatus('to-pay')">
          <template #title>
            <i class="fa fa-credit-card" />
            <span class="d-none d-sm-inline"> ที่ต้องชำระ</span>
          </template>
        </b-tab>

        <b-tab @click="changeStatus('to-receive')">
          <template #title>
            <i class="fa fa-truck" />
            <span class="d-none d-sm-inline"> ที่ต้องได้รับ</span>
          </template>
        </b-tab>

        <!-- TAP SUCCESS -->
        <b-tab @click="changeStatus('to-success')">
          <template #title>
            <i class="fa fa-check" />
            <span class="d-none d-sm-inline"> ที่จัดส่งแล้ว</span>
          </template>
        </b-tab>

        <!-- TAP CANCEL -->
        <b-tab @click="changeStatus('to-cancle')">
          <template #title>
            <i class="fa fa-times" />
            <span class="d-none d-sm-inline"> ที่ถูกยกเลิก</span>
          </template>
        </b-tab>
      </b-tabs>

      <div v-if="loading" class="p-4">
        <vcl-list> </vcl-list>
      </div>
      <div v-if="!loading" class="mt-4 pt-2">
        <ListofOrder
          :orderItem="orderItem"
          @toDetailPage="detailPage"
          @toPayPage="paypage"
          @confirmGetItem="confirmGet"
          :start="itemStart"
          :end="itemEnd"
          :totalItem="totalDatas"
        />

        <div class="mt-3" v-if="orderItem.length != 0">
          <Pagination
            @selectedPage="loadMore"
            :currentPage="this.$store.state.currentP + 1"
            :totalItem="totalDatas"
            :itemPerPage="itemPerPage"
            :start="itemStart"
            :end="itemEnd"
          />
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
import firebaseApp from "../../firebase/firebase_app";
import "../../assets/scss/style.scss";
import { VclList } from "vue-content-loading";
import Pagination from "../../components/pagination";
import ListofOrder from "../../components/listoforder";
import moment from "moment";

export default {
  name: "OrderList",
  components: {
    VclList,
    ListofOrder,
    Pagination,
  },
  computed: {
    currentP() {
      return this.$store.state.currentP;
    },
  },
  data() {
    return {
      loading: false,
      statusOrder: "all",
      orderItem: [],
      totalDatas: null,
      itemPerPage: 20,
      itemStart: null,
      itemEnd: null,
    };
  },
  created() {
    window.scrollTo(0, 0);
    this.loadOrders();
  },
  methods: {
    changeStatus(status) {
      this.$store.dispatch("changePage", 0);
      this.statusOrder = status;
      this.loadOrders();
    },
    loadOrders() {
      this.loading = true;
      let indexOf = this.itemPerPage * this.$store.state.currentP; //itemperPage = totalitem/limit

      const oderDetailRef = firebaseApp.firestore().collection("orders");

      if (this.statusOrder == "to-pay") {
        var statusName = oderDetailRef
          .where("userID", "==", firebaseApp.auth().currentUser.uid)
          .where("status", "in", ["รอชำระ", "รอการตรวจสอบ"])
          .orderBy("createAt", "desc");
      } else if (this.statusOrder == "to-receive") {
        statusName = oderDetailRef
          .where("userID", "==", firebaseApp.auth().currentUser.uid)
          .where("status", "in", ["อยู่ระหว่างการจัดส่ง", "เตรียมจัดส่ง"])
          .orderBy("createAt", "desc");
      } else if (this.statusOrder == "to-success") {
        statusName = oderDetailRef
          .where("userID", "==", firebaseApp.auth().currentUser.uid)
          .where("status", "==", "จัดส่งแล้ว")
          .orderBy("createAt", "desc");
      } else if (this.statusOrder == "to-cancle") {
        statusName = oderDetailRef
          .where("userID", "==", firebaseApp.auth().currentUser.uid)
          .where("status", "==", "ยกเลิก")
          .orderBy("createAt", "desc");
      } else {
        statusName = oderDetailRef
          .where("userID", "==", firebaseApp.auth().currentUser.uid)
          .orderBy("createAt", "desc");
      }

      return statusName
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
            var queryRef = statusName.startAt(last).limit(this.itemPerPage);
          } else {
            queryRef = statusName.limit(this.itemPerPage);
          }

          queryRef
            .get()
            .then((querySnapshot) => {
              var data = [];
              var index = 1;
              querySnapshot.forEach((doc) => {
                var item = {
                  id: doc.id,
                  accId: index,
                  orderID: doc.data().orderID,
                  orderItems: doc.data().items,
                  status: doc.data().status,
                  totalAll: doc.data().totalAll,
                  items: doc.data().items.length,
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
              this.loading = false;
            })
            .catch((err) => {
              console.log(err);
              this.loading = false;
            });
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },
    detailPage(idOrder) {
      this.$router.push("/user-order/" + idOrder);
    },
    formatDate(date) {
      var time = date.toDate();
      var formatTimeShow = moment(time).format("DD-MM-YYYY HH:mm");
      return formatTimeShow;
    },
    paypage(idOrder) {
      this.$router.push("/confirm-order/" + idOrder);
    },
    toggleModalUpload() {
      console.log("upload");
    },
    loadMore(page) {
      this.$store.dispatch("changePage", page);
      this.loadOrders();
    },
    confirmGet(item) {
      var setData = {
        status: "จัดส่งแล้ว",
        updateAt: new Date(),
      };
      const updataData = firebaseApp.firestore().doc("orders/" + item.id);
      updataData
        .update(setData)
        .then(() => {
          const user = firebaseApp.auth().currentUser;
          firebaseApp
            .firestore()
            .doc("users/" + user.uid)
            .get()
            .then((document) => {
              const checkRef = firebaseApp.firestore().collection("incomes");
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
              this.loadOrders();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style>
</style>