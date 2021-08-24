<template>
  <div class="pb-4">
    <div class="d-flex space-between">
      <div class="mt-2">บทความรีวิวทั้งหมด</div>

      <div class="d-none d-sm-inline">
        <div class="d-flex align-items-center justify-content-end">
          <b-form @submit.prevent="searchReview">
            <b-input-group class="input-group-merge pr-2">
              <b-form-input
                v-model="searchQuery"
                class="d-inline-block"
                placeholder="ค้นหาบทความรีวิว"
              />
              <b-input-group-append
                is-text
                @click="searchReview"
                class="pointer"
              >
                <i class="fas fa-search" />
              </b-input-group-append>
            </b-input-group>
          </b-form>
        </div>
      </div>
    </div>

    <hr />

    <div v-if="loading" class="row p-3">
      <vue-content-loading :width="300" :height="80">
        <rect x="0" y="0" rx="0" ry="0" width="70" height="70" />
        <rect x="75" y="0" rx="0" ry="0" width="70" height="70" />
        <rect x="150" y="0" rx="0" ry="0" width="70" height="70" />
        <rect x="225" y="0" rx="0" ry="0" width="70" height="70" />
      </vue-content-loading>
    </div>
    <div v-if="!loading" class="card-loop-set">
      <b-row v-if="dataList.length != 0" class="match-height">
        <CardReview
          v-for="(data, index) in dataList"
          :key="index"
          :datas="data"
          @toDetailPage="detailPage"
        />
      </b-row>

      <div v-if="dataList.length == 0" class="text-center pt-4">
        <div class="pt-4 pb-4 h5">ไม่พบบทความรีวิวสินค้า</div>
        <div><img src="../assets/review-none.svg" width="300px" /></div>
      </div>

      <div v-if="dataList.length != 0" class="text-mute">
        บทความที่ {{ itemStart }} - {{ itemEnd }} จาก {{ totalDatas }}
      </div>
      <div v-if="dataList.length != 0">
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
  </div>
</template>

<script>
import firebaseApp from "../firebase/firebase_app";
import CardReview from "../components/cardReview";
import Pagination from "../components/pagination";
import { VueContentLoading } from "vue-content-loading";
import "../assets/scss/style.scss";
import moment from "moment";

export default {
  name: "reviews",
  computed: {
    currentP() {
      return this.$store.state.currentP;
    },
  },
  data() {
    return {
      dataList: [],
      loading: false,
      totalDatas: null,
      itemPerPage: 12,
      itemStart: null,
      itemEnd: null,
      searchQuery: "",
    };
  },
  components: {
    CardReview,
    VueContentLoading,
    Pagination,
  },
  created() {
    this.loadReviews();
  },
  methods: {
    loadReviews() {
      this.loading = true;
      let indexOf = this.itemPerPage * this.$store.state.currentP; //itemperPage = totalitem/limit

        var reviewQuery;

      if (this.searchQuery != "") {
        reviewQuery = firebaseApp
          .firestore()
          .collection("productReview")
          .where("status", "==", true)
          .where("title", ">=", this.searchQuery)
          .where("title", "<=", this.searchQuery + "\uf8ff");
      } else {
        reviewQuery = firebaseApp
          .firestore()
          .collection("productReview")
          .where("status", "==", true)
          .orderBy("createAt", "desc");
      }
      return reviewQuery
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
            var queryRef = reviewQuery.startAt(last).limit(this.itemPerPage);
          } else {
            queryRef = reviewQuery.limit(this.itemPerPage);
          }

          queryRef
            .get()
            .then((querySnapshot) => {
              var items = [];
              querySnapshot.forEach((doc) => {
                var setData = {
                  id: doc.id,
                  title: doc.data().title,
                  image: doc.data().image,
                  status: doc.data().status,
                  createAt: doc.data().createAt
                    ? this.formatDate(doc.data().createAt)
                    : "",
                };
                if (doc.data().status) {
                  items.push(setData);
                }
              });
              this.dataList = items;
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
    formatDate(date) {
      var time = date.toDate();
      var formatTimeShow = moment(time).format("DD-MM-YYYY");
      return formatTimeShow;
    },
    detailPage(data) {
      this.$router.push("/reviews-detail/" + data.id);
    },
    loadMore(page) {
      this.$store.dispatch("changePage", page);
      this.loadReviews();
    },
    searchReview() {
      this.loadReviews()
    },
  },
};
</script>
<style scoped>
.load {
  overflow: hidden;
}
</style>