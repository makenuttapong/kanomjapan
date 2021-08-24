<template>
  <div>
    <b-card class="overflow-hidden">
      <h5 class="mb-4">
        <i class="fas fa-comment" color="#7367f0" /> คอมเมนต์
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
              <label>คะแนน</label>
              <b-select
                v-model="starFilter"
                :options="filterStar"
                :clearable="false"
                @change="changeStar"
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
              <label>คะแนน</label>
              <b-select
                v-model="starFilter"
                :options="filterStar"
                :clearable="false"
                @change="changeStar"
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
          <div class="text-mute mb-2" v-if="this.comments.length != 0">
            คอมเมนต์ที่ {{ itemStart }} - {{ itemEnd }} จาก {{ totalDatas }}
          </div>
          <b-table
            :items="comments"
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
                <b-avatar size="36" :src="row.item.userProfile.image ? row.item.userProfile.image : require(`@/assets/userDF.png`)" />
                <span> {{ row.item.userProfile.name }}</span>
              </div>
            </template>
            <template #cell(star)="row">
              <div class="pro-star" >
                <ul class="unstyled-list list-inline">
                  <li
                    v-for="star in 5"
                    :key="star"
                    class="ratings-list-item mr-25"
                  >
                    <i
                      class="fa fa-star"
                      :class="[
                        {
                          'fill-current': star <= row.item.rating,
                        },
                        star <= row.item.rating ? 'text-warning' : 'text-muted',
                      ]"
                    />
                  </li>
                </ul>
              </div>
            </template>
            <template #cell(comment)="row">
              <div class="comment-width">
                <span class="link-detail" @click="productRef(row.item.productIdRef)">{{ row.item.comment ? row.item.comment : "-" }}</span>
              </div>
            </template>
            <template #cell(image)="row">
              <div class="rating-width">
                <div
                  class="comm-img d-flex"
                  v-if="row.item.moreImages.length != 0"
                >
                  <div
                    v-for="(img, index) in row.item.moreImages"
                    :key="index"
                    class="mr-2 border"
                  >
                    <ExpandableImage :src="img" class="xs-image" />
                  </div>
                </div>
              </div>
            </template>
            <template #cell(createAt)="row">
              <div class="time-width text-small">{{ row.item.createAt }}</div>
            </template>
            <!-- <template #cell(ref)="row">
              <div class=""><EyeIcon size="18" @click="productRef(row.item.productIdRef)" class="link-detail"/></div>
            </template> -->
          </b-table>
        </b-card-body>
        <div class="mx-2" v-if="this.comments.length != 0">
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
                >คอมเมนต์ที่ {{ itemStart }} - {{ itemEnd }} จาก
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
// import { EyeIcon } from "vue-feather-icons";

export default {
  name: "Comments",
  data() {
    return {
      loading: false,
      starFilter: "ทั้งหมด",
      filterStar: ["ทั้งหมด", "5 ดาว", "4 ดาว", "3 ดาว", "2 ดาว", "1 ดาว"],
      fields: [
        { key: "user", sortable: true },
        { key: "star" },
        { key: "comment", sortable: true },
        { key: "image", sortable: true },
        { key: "createAt", sortable: true },
        // { key: "ref" },
      ],
      comments: [],
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
    // EyeIcon
  },
  created() {
    this.loadComments();
  },
  methods: {
    loadComments() {
      this.loading = true;
      let indexOf = this.itemPerPage * this.$store.state.currentP; //itemperPage = totalitem/limit
      const commentRef = firebaseApp.firestore().collection("comments");

      var filterRate;

      if (this.starFilter != "ทั้งหมด") {
        var formatNameFilter;
        if (this.starFilter == "5 ดาว") {
          formatNameFilter = 5;
        } else if (this.starFilter == "4 ดาว") {
          formatNameFilter = 4;
        } else if (this.starFilter == "3 ดาว") {
          formatNameFilter = 3;
        } else if (this.starFilter == "2 ดาว") {
          formatNameFilter = 2;
        } else if (this.starFilter == "1 ดาว") {
          formatNameFilter = 1;
        }
        filterRate = commentRef.where("rating", "==", formatNameFilter);
      } else {
        filterRate = commentRef.orderBy("createAt", "desc");
      }

      return filterRate
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
            var queryRef = filterRate.startAt(last).limit(this.itemPerPage);
          } else {
            queryRef = filterRate.limit(this.itemPerPage);
          }

          return queryRef
            .get()
            .then((querySnapshot) => {
              var items = [];
              querySnapshot.forEach((doc) => {
                const setData = {
                  id: doc.id,
                  comment: doc.data().comment,
                  createAt: doc.data().createAt
                    ? this.formatDate(doc.data().createAt)
                    : "",
                  moreImages: doc.data().moreImages,
                  orderIdRef: doc.data().orderIdRef,
                  productIdRef: doc.data().productIdRef,
                  rating: doc.data().rating,
                  userProfile : doc.data().userProfile
                };
               
                items.push(setData);
              });

          
              this.comments = items
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
    changeStar(star) {
      this.starFilter = star;
      this.loadComments();
    },
    loadMore(page) {
      this.$store.dispatch("changePage", page);
      this.loadComments();
    },
    changeItemPerPage(item) {
      this.itemPerPage = item;
      this.loadComments();
    },
    productRef(id){
      this.$router.push('/admin/product/' + id)
    }
  },
};
</script>

<style >
.comment-width {
  width: 180px;
}
.name-width{
  width: 200px;
}
</style>
