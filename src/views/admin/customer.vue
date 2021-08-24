<template>
  <div class="customerPage">
    <b-card class="overflow-hidden">
      <b-card-text>
        <h5 class="mb-4">
          <i class="fa fa-users" color="#7367f0" /> รายชื่อลูกค้า
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
                class="per-page-selector d-inline-block mx-50 select-per-page ml-2 mr-2"
              />
              <label>รายการ</label>
            </b-col>

          <b-col cols="12" lg="4" md="6"  class="d-none d-md-inline">
            <div class="d-flex align-items-center justify-content-end mb-1">
              <label class="sign-width">เข้าใช้งานด้วย</label>
              <b-select
                v-model="signFilter"
                :options="filterSign"
                :clearable="false"
                @change="changeFilter"
                class="per-page-selector d-inline-block mx-50 ml-2 mr-2"
              />
            </div>
          </b-col>

            <!-- Search -->
            <b-col cols="12" lg="5" md="6"  class="d-none d-md-inline">
              <div class="d-flex align-items-center justify-content-end">
                <b-form @submit.prevent="searchCustomer">
                <b-input-group class="input-group-merge pr-2">
                <b-form-input
                  v-model="searchQuery"
                  class="d-inline-block"
                  placeholder="ค้นหารายชื่อ"
                />
                 <b-input-group-append
                    is-text
                    @click="searchCustomer"
                    class="pointer"
                  >
                    <i class="fas fa-search" />
                  </b-input-group-append>
                </b-input-group>
              </b-form>
              </div>
            </b-col>

             <b-col cols="12" lg="6" md="6" class="d-md-none">
            <div class="mb-3 text-right custom-filters">
              <b-button
                size="sm"
                variant="outline-info"
                v-b-toggle="'collapse-filter'"
                class="collapse-icon"
                >ฟิลเตอร์
                <div class="col-1 icon-coll d-inline">
                  <i class="fa fa-chevron-up icon-coll-open-filter" />
                </div>
              </b-button>
            </div>

            <b-collapse id="collapse-filter">
               <div class="d-flex align-items-center justify-content-end mb-1">
              <label class="sign-width">เข้าใช้งานด้วย</label>
              <b-select
                v-model="signFilter"
                :options="filterSign"
                :clearable="false"
                @change="changeFilter"
                class="per-page-selector d-inline-block mx-50 ml-2 mr-2"
              />
            </div>

             <div class="d-flex align-items-center justify-content-end">
                <b-form @submit.prevent="searchCustomer">
                <b-input-group class="input-group-merge pr-2">
                <b-form-input
                  v-model="searchQuery"
                  class="d-inline-block"
                  placeholder="ค้นหารายชื่อ"
                />
                 <b-input-group-append
                    is-text
                    @click="searchCustomer"
                    class="pointer"
                  >
                    <i class="fas fa-search" />
                  </b-input-group-append>
                </b-input-group>
              </b-form>
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
           <div class="text-mute mb-2" v-if="this.customerData.length != 0"
                  >รายชื่อที่ {{ itemStart }} - {{ itemEnd }} จาก
                  {{ totalDatas }}</div
                >
          <b-table
            :items="customerData"
            :fields="fields"
            :hover="true"
            responsive
            show-empty
            empty-text="ไม่พบข้อมูล"
            empty-filtered-text="ไม่พบข้อมูล"
            tbody-tr-class="tableHover"
          >
            <template #cell(actions)="row">
              <b-dropdown
                size="md"
                variant="link"
                right
                class="dropdown-right"
                no-caret
              >
                <template #button-content>
                  <i class="fa fa-ellipsis-v" color="#7367f0"/>
                </template>
                <b-dropdown-item @click="getDetail(row.item)"
                  ><i class="fa fa-search" /> รายละเอียด</b-dropdown-item
                >
              </b-dropdown>
            </template>

            <template v-slot:cell(name)="row">
              <div class="name-width">
              <b-avatar size="32" :src="row.item.image"/>
               <span  @click="getDetail(row.item)" class="link-detail"> {{ row.item.name }}</span>
              </div>
            </template>

             <template v-slot:cell(phone)="row">
              <div class="phone-width">
                {{row.item.phone}}
              </div>
            </template>


            <template v-slot:cell(signInWith)="row">
              <div class="signIn-width">
              <span class="facebook-color" v-if="row.item.signInWith == 'facebook'"><i class="fab fa-facebook-f mr-1"  />{{ row.item.signInWith }}</span>
              <span class="google-color" v-if="row.item.signInWith == 'google'"><i class="fab fa-google mr-1"  />{{ row.item.signInWith }}</span>
              <span class="email-color" v-if="row.item.signInWith == 'email'" ><i class="fa fa-envelope mr-1" />{{ row.item.signInWith }}</span>
               
              </div>
            </template>
          </b-table>
          </b-card-body>
          <div class="mx-2" v-if="this.customerData.length != 0">
            <b-row>
              <b-col
                cols="12"
                sm="6"
                class="d-flex align-items-center justify-content-center justify-content-sm-start"
              >
                <span class="text-mute total-data"
                  >รายชื่อที่ {{ itemStart }} - {{ itemEnd }} จาก
                  {{ totalDatas }}</span
                >
              </b-col>
              <b-col
                cols="12"
                sm="6"
                class="d-flex align-items-center justify-content-center justify-content-sm-end"
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
      </b-card-text>
    </b-card>
  </div>
</template>

<script>
import firebaseApp from "../../firebase/firebase_app";
import "../../assets/scss/style.scss";
import { VclTable } from "vue-content-loading";
import Pagination from "../../components/pagination";
import moment from 'moment';

export default {
  name: "customer",
  components: {
    VclTable,
    Pagination,
  },
  data() {
    return {
      customerData: [],
      loading: false,
      searchQuery: "",
      signFilter : "ทั้งหมด",
      filterSign: [
        "ทั้งหมด",
        "email",
        "google",
        "facebook",
      ],
      fields: [
        { key: "name", sortable: true },
        { key: "email", sortable: true },
        { key: "phone", sortable: true },
        { key: "gender", sortable: true },
        { key: "signInWith", sortable: true },
        { key: "actions" },
      ],
      perPageOptions: ["25", "50", "75"],
      totalDatas: null,
      itemPerPage: 25,
      itemStart: null,
      itemEnd: null,
    };
  },
  created() {
    this.loadCustomer();
  },
  methods: {
    loadCustomer() {
      this.loading = true;
      let indexOf = this.itemPerPage * this.$store.state.currentP; //itemperPage = totalitem/limit
      var userData 
    
    if(this.signFilter != 'ทั้งหมด'){
        if (this.searchQuery != "") {
          userData = firebaseApp
          .firestore()
          .collection("users")
          .where("role", "==", "user")
          .where("name", ">=", this.searchQuery)
          .where("name", "<=", this.searchQuery + "\uf8ff")
          .where("signinWith", "==" , this.signFilter)
        }else{
          userData = firebaseApp
          .firestore()
          .collection("users")
          .where("role", "==", "user")
          .where("signinWith", "==" , this.signFilter)
          .orderBy("createAt", "desc");
        }

    }else{
       if (this.searchQuery != "") {
        userData = firebaseApp
          .firestore()
          .collection("users")
          .where("role", "==", "user")
          .where("name", ">=", this.searchQuery)
          .where("name", "<=", this.searchQuery + "\uf8ff");
      } else {
        userData = firebaseApp
          .firestore()
          .collection("users")
          .where("role", "==", "user")
          .orderBy("createAt", "desc");
      }
    }
   
  
      return userData
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
            var queryRef = userData.startAt(last).limit(this.itemPerPage);
          } else {
            queryRef = userData.limit(this.itemPerPage);
          }

          queryRef
            .get()
            .then((querySnapshot) => {
              var customers = [];
              querySnapshot.forEach((doc) => {
                var setData = {
                  uid: doc.id,
                  name: doc.data().name,
                  email: doc.data().email,
                  image: doc.data().image ? doc.data().image : require("@/assets/userDF.png"),
                  phone: doc.data().phone ? doc.data().phone : '-',
                  signInWith: doc.data().signinWith,
                  birthdate: doc.data().birthdate ? this.formatDate(doc.data().birthdate) : '-',
                  gender: doc.data().gender ? doc.data().gender : '-',
                };
                customers.push(setData);
              });
              this.customerData = customers;
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
    loadMore(page) {
      this.$store.dispatch("changePage", page);
      this.loadCustomer();
    },
    changeItemPerPage(item) {
      this.itemPerPage = item;
      this.loadCustomer();
    },
    searchCustomer(){
      this.loadCustomer()
    },
    formatDate(date) {
      var time = date.toDate();
      var formatTimeShow = moment(time).format("DD-MM-YYYY");
      return formatTimeShow;
    },
    getDetail(row) {
      this.$router.push("/admin/customer/" + row.uid);
    },
    changeFilter(item){
      this.signFilter = item;
      this.loadCustomer();
    }
  },
};
</script>

<style>
.signIn-width{
  width: 90px;
}
.sign-width{
   width: 150px;
}
.phone-width{
   width: 130px;
}
</style>