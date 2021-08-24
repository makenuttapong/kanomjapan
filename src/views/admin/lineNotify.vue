<template>
  <div>
    <b-card class="overflow-hidden">
      <h5 class="mb-4">
        <i class="fas fa-bell" color="#7367f0" /> Line Notification
      </h5>
      <div class="mb-3 mx-2">
        <b-row>
          <!-- Per Page -->
          <b-col
            cols="12"
            lg="3"
            md="6"
            class="d-flex align-items-center justify-content-start mb-1"
          >
            <label>แสดง</label>
            <b-select
              v-model="itemPerPage"
              :options="perPageOptions"
              :clearable="false"
              @change="changeItemPerPage"
              class="
                per-page-selector
                d-inline-block
                mx-50
                select-per-page
                ml-2
                mr-2
              "
            />
            <label>รายการ</label>
          </b-col>
        </b-row>
      </div>

      <div v-if="loading" class="p-5">
        <vcl-table> </vcl-table>
      </div>

      <div v-if="!loading">
        <b-card-body>
          <div class="text-mute mb-2" v-if="this.lineNotify.length != 0">
            แจ้งเตือนการชำระที่ {{ itemStart }} - {{ itemEnd }} จาก
            {{ totalDatas }}
          </div>
          <b-table
            :items="lineNotify"
            :fields="fields"
            :hover="true"
            responsive
            show-empty
            empty-text="ไม่พบข้อมูล"
            empty-filtered-text="ไม่พบข้อมูล"
            tbody-tr-class="tableHover"
          >
            <template #cell(user)="row">
              <div class="name-width">
                <b-avatar size="36" :src="row.item.image ? row.item.image : require(`@/assets/userDF.png`)" />
                <span> {{ row.item.name }}</span>
              </div>
            </template>

            <template #cell(orderID)="row">
              <div class="order-width text-primary link-detail">
                <span @click="gotoOrderDetail(row.item.orderID)">#{{ row.item.orderID ? row.item.orderID : "-" }}</span>
              </div>
            </template>
            <template #cell(slipPayment)="row">
              <div class="rating-width ml-3">
                <ExpandableImage :src="row.item.slip" class="xs-image" />
              </div>
            </template>
            <template #cell(payOn)="row">
              <div class="time-width text-small">
                {{ formatDate(row.item.payon) }}
              </div>
            </template>
            <template #cell(item-price)="row">
                <div class="priceItem-width">
                <div class="font-14">
                  จำนวนสินค้า : {{row.item.totalItem}} รายการ
              </div>
              <div class="font-14">
                 ราคาทั้งหมด : {{formatPrice(row.item.totalAll)}} บาท
              </div>
                </div>
            </template>
          </b-table>
        </b-card-body>
        <div class="mx-2" v-if="this.lineNotify.length != 0">
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
              <span class="text-mute total-data"
                >แจ้งเตือนการชำระที่ {{ itemStart }} - {{ itemEnd }} จาก
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
      </div>
    </b-card>
  </div>
</template>

<script>
import firebaseApp from "../../firebase/firebase_app";
import { VclTable } from "vue-content-loading";
import moment from "moment";
import Pagination from "../../components/pagination";
import ExpandableImage from "../../components/expandableImage.vue";

export default {
  name: "LineNotify",
  data() {
    return {
      loading: false,
      fields: [
        { key: "user", sortable: true },
        { key: "orderID" },
        { key: "item-price"},
        { key: "payOn", sortable: true  },
        { key: "slipPayment"},
      ],
      lineNotify: [],
      perPageOptions: ["25", "50", "75"],
      totalDatas: null,
      itemPerPage: 25,
      itemStart: null,
      itemEnd: null,
    };
  },
  components: {
    VclTable,
    Pagination,
    ExpandableImage,
  },
  created() {
    this.loadLineNoti();
  },
  methods: {
    loadLineNoti() {
      this.loading = true;
      let indexOf = this.itemPerPage * this.$store.state.currentP; //itemperPage = totalitem/limit
      const lineRef = firebaseApp.firestore().collection("oders").orderBy('payon','desc')
      return lineRef
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
            var queryRef = lineRef.startAt(last).limit(this.itemPerPage);
          } else {
            queryRef = lineRef.limit(this.itemPerPage);
          }

          return queryRef
            .get()
            .then((querySnapshot) => {
              var items = [];
           
              querySnapshot.forEach((doc) => {
                const setData = {
                  id: doc.id,
                  payon: doc.data().payon,
                  name: doc.data().name,
                  image : doc.data().image,
                  orderID: doc.data().orderID,
                  totalAll: doc.data().totalAll,
                  slip: doc.data().slip,
                  totalItem: doc.data().totalItem,
                };

                items.push(setData);
              });
            
        
              this.lineNotify = items;
              this.loading = false;
            })
            .catch((err) => {
              this.loading = false;
              console.log(err);
            });
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
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
    loadMore(page) {
      this.$store.dispatch("changePage", page);
      this.loadLineNoti();
    },
    changeItemPerPage(item) {
      this.itemPerPage = item;
      this.loadLineNoti();
    },
    gotoOrderDetail(orderID){
        var orderRef = firebaseApp.firestore().collection('orders')
        orderRef.where('orderID','==',orderID).get().then(querySnapshot =>{
            var orderRefID = querySnapshot.docs[0].id
            if(orderRefID){
                this.$router.push('/admin/order/' + orderRefID)
            }
            
        })
    }
  },
};
</script>

<style >
.name-width {
  width: 200px;
}
.priceItem-width{
    width: 160px;
}
</style>
