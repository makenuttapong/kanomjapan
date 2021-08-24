<template>
  <div>
    <b-card class="overflow-hidden">
      <h5 class="mb-4">
        <i class="fas fa-dollar-sign" color="#7367f0" /> รายรับ-รายจ่าย
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

          <b-col cols="12" lg="3" md="6" class="d-none d-md-inline">
            <div class="d-flex align-items-center justify-content-end mb-1">
              <label>สถานะ</label>
              <b-select
                v-model="statusFilter"
                :options="filterStatus"
                :clearable="false"
                @change="changeStatus"
                class="per-page-selector d-inline-block mx-50 ml-2 mr-2"
              />
            </div>
          </b-col>

           <b-col cols="12" lg="6" md="6" class="d-md-none">
            <div class="mb-3  text-right custom-filters">
              <b-button size="sm" variant="outline-info" v-b-toggle="'collapse-filter'" class="collapse-icon">ฟิลเตอร์
              <div class="col-1 icon-coll d-inline">
                <i class="fa fa-chevron-up icon-coll-open-filter" />
              </div>
              </b-button>
            </div>

            <b-collapse id="collapse-filter">
                <div class="d-flex align-items-center justify-content-end mb-1">
              <label>สถานะ</label>
              <b-select
                v-model="statusFilter"
                :options="filterStatus"
                :clearable="false"
                @change="changeStatus"
                class="per-page-selector d-inline-block mx-50 ml-2 mr-2"
              />
            </div>
            </b-collapse>
          </b-col>
        </b-row>
      </div>

      <div v-if="loading" class="p-5">
        <vcl-table> </vcl-table>
      </div>

      <div v-if="!loading">
        <b-card-body>
          <div class="text-mute mb-2" v-if="this.incomes.length != 0">
            รายการที่ {{ itemStart }} - {{ itemEnd }} จาก {{ totalDatas }}
          </div>
          <b-table
            :items="incomes"
            :fields="fields"
            :hover="true"
            responsive
            show-empty
            empty-text="ไม่พบข้อมูล"
            empty-filtered-text="ไม่พบข้อมูล"
            tbody-tr-class="tableHover"
          >
            <template #cell(profile)="row">
              <div class="name-width">
                <b-avatar size="32" :src="row.item.userProfile.image ? row.item.userProfile.image :  require(`@/assets/userDF.png`)" />
                <span>
                  {{
                    row.item.userProfile.role != "admin"
                      ? row.item.userProfile.name ? row.item.userProfile.name : ''
                      : "ADMIN"
                  }}</span
                >
              </div>
            </template>

            <template #cell(orderID)="row">
              <div class="orderId-width color-primary">
                <HashIcon size="15" class="mb-1" />{{ row.item.orderID }}
              </div>
            </template>
            <template #cell(price)="row">
              <div
                class="priceIncome-width"
                :class="
                  row.item.status == 'cash-in'
                    ? 'cashIn-price'
                    : 'cashOut-price'
                "
              >
                {{ row.item.status == "cash-in" ? "+" : "-"
                }}{{ formatPrice(row.item.price) }} บาท
              </div>
            </template>
            <template #cell(createAt)="row">
              <div class="time-width text-small">
                {{ formatDate(row.item.createAt) }}
              </div>
            </template>
          </b-table>
        </b-card-body>
        <div class="mx-2" v-if="this.incomes.length != 0">
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
                >รายการที่ {{ itemStart }} - {{ itemEnd }} จาก
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
import Pagination from "../../components/pagination";
import moment from "moment";
import firebaseApp from "../../firebase/firebase_app";
import { VclTable } from "vue-content-loading";
import { HashIcon } from "vue-feather-icons";

export default {
  name: "IncomeList",
  components: {
    Pagination,
    VclTable,
    HashIcon,
  },
  data() {
    return {
      loading: false,
      incomes: [],
      itemss : [],
      fields: [
        { key: "profile", sortable: true },
        { key: "orderID", sortable: true },
        { key: "description", sortable: true },
        { key: "price", sortable: true },
        { key: "createAt", sortable: true },
      ],
      statusFilter: "ทั้งหมด",
      filterStatus: ["ทั้งหมด", "รายรับ", "รายจ่าย"],
      perPageOptions: ["25", "50", "75"],
      totalDatas: null,
      itemPerPage: 25,
      itemStart: null,
      itemEnd: null,
    };
  },
  created() {
    this.loadIncome();
  },
  methods: {
    loadIncome() {
      this.loading = true;
      let indexOf = this.itemPerPage * this.$store.state.currentP; //itemperPage = totalitem/limit
      const incomRef = firebaseApp.firestore().collection("incomes");
      var statusName;
      if (this.statusFilter != "ทั้งหมด") {
        if (this.statusFilter == "รายรับ") {
          statusName = incomRef
            .where("status", "==", "cash-in")
            .orderBy("createAt", "desc");
        } else if (this.statusFilter == "รายจ่าย") {
          statusName = incomRef
            .where("status", "==", "cash-out")
            .orderBy("createAt", "desc");
        }
      } else {
        statusName = incomRef.orderBy("createAt", "desc");
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
              var items = [];
              querySnapshot.forEach((doc) => {
                var setData = {
                  uid: doc.id,
                  createAt: doc.data().createAt,
                  description: doc.data().description,
                  orderID: doc.data().orderID,
                  price: doc.data().price,
                  status: doc.data().status,
                  userProfile : doc.data().userProfile
                };
    
              items.push(setData);
              });

              this.incomes = items;
              this.loading = false;
            })
            .catch((err) => {
              this.loading = false;
              console.error(err);
            });
        })
        .catch((err) => {
          this.loading = false;
          console.error(err);
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
      this.loadIncome();
    },
    changeItemPerPage(item) {
      this.itemPerPage = item;
      this.loadIncome();
    },
    changeStatus(status) {
      this.statusFilter = status;
      this.loadIncome();
    },
  },
};
</script>

<style scoped>
.orderId-width {
  width: 110px;
}
.priceIncome-width {
  width: 100px;
}
.cashIn-price {
  color: #3ecd3e;
}
.cashOut-price {
  color: #ff3939;
}
.name-width{
  width: 200px;
}
</style>