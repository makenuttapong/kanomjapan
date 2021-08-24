<template>
  <div>
    <b-row>
      <b-col lg="8">
        <b-card class="mb-4">
          <h5 class="mb-4">
            <i class="fa fa-newspaper" color="#7367f0" /> รายละเอียดบทความรีวิว
          </h5>
          <div v-if="loading" class="p-4 row content-center">
            <vcl-twitch height="500px"> </vcl-twitch>
          </div>

          <div v-if="!loading" class="p-4 text-center">
            <div>
              <img :src="productReview.image" class="reviewSrc" height="400px"/>
            </div>
            <div class="text-title mt-4">{{ productReview.title }}</div>

            <div class="mt-3 mb-4">
              <span v-html="productReview.detail" class="size-text"/>
            </div>

            <div
              v-for="(detail, index) in productReview.moreDetail"
              :key="index"
            >
              <div class="" v-if="detail.image">
                <img :src="detail.image" class="reviewSrc" height="350px"/>
              </div>
              <div class="mt-3 mb-4">
                <span v-html="detail.detail" class="size-text"/>
              </div>
            </div>
          </div>
        </b-card>
      </b-col>
      <b-col lg="4">
        <b-card>
          <div v-if="loading" class="p-2">
            <vcl-list> </vcl-list>
          </div>
          <div v-if="!loading" class="p-2">
            <div class="mt-2 mb-2">
              <span class="bold">สถานะ : </span>
              <span v-if="productReview.status" class="badge-5"
                ><b-badge class="status-check-style" pill>แสดง</b-badge></span
              >
              <span v-if="!productReview.status" class="badge-5"
                ><b-badge class="status-cancle-style" pill
                  >ไม่แสดง</b-badge
                ></span
              >
            </div>
            <div class="mt-2 mb-2">
              <span class="bold">เขียนเนื้อหาขึ้นเมื่อ : </span
              ><span
                ><CalendarIcon size="18" class="mb-1 mr-1" />{{
                  productReview.createAt
                }}</span
              >
            </div>
            <div class="mt-2 mb-2">
              <span class="bold">อัพเดตเนื้อหาเมื่อ : </span
              ><span
                ><CalendarIcon size="18" class="mb-1 mr-1" />{{
                  productReview.updateAt
                }}</span
              >
            </div>

            <div class="mt-2 mb-2">
              <span class="bold">รหัสสินค้าอ้างอิง : </span
              ><span class="color-primary pointer" @click="detailProduct">{{
                productReview.productID ? productReview.productID : "-"
              }}</span>
            </div>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import firebaseApp from "../../firebase/firebase_app";
import { VclTwitch, VclList } from "vue-content-loading";
import "../../assets/scss/style.scss";
import moment from "moment";
import { CalendarIcon } from "vue-feather-icons";

export default {
  name: "reviewProductDetail",
  components: {
    VclTwitch,
    VclList,
    CalendarIcon,
  },
  data() {
    return {
      loading: false,
      productReview: [],
      uidProduct: "",
      idProductReview: this.$route.params.id,
    };
  },
  created() {
    window.scrollTo(0, 0);
    this.loadCustomerDetail();
  },
  methods: {
    loadCustomerDetail() {
      this.loading = true;
      const productReviewDetailRef = firebaseApp
        .firestore()
        .doc("productReview/" + this.idProductReview);
      return productReviewDetailRef
        .get()
        .then((doc) => {
          var setData = {
            uid: doc.id,
            image: doc.data().image,
            title: doc.data().title,
            detail: doc.data().detail,
            status: doc.data().status,
            productID: doc.data().productID,
            createAt: this.formatDate(doc.data().createAt),
            updateAt: this.formatDate(doc.data().updateAt),
            moreDetail: doc.data().moreDetail,
          };
          if (setData.productID != "") {
            this.loadUIDproducut(setData.productID);
          }
          this.productReview = setData;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
          this.$router.replace("/error");
        });
    },
    loadUIDproducut(productID) {
      const productRef = firebaseApp
        .firestore()
        .collection("products")
        .where("productID", "==", productID);
      return productRef
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.uidProduct = doc.id;
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    detailProduct() {
      this.$router.push("/admin/product/" + this.uidProduct);
    },
    formatDate(date) {
      var time = date.toDate();
      var formatTimeShow = moment(time).format("DD-MM-YYYY");
      return formatTimeShow;
    },
  },
};
</script>

<style>
.reviewSrc {
  width: 100%;
  object-fit: contain;
}
.content-center {
  justify-content: center;
}
.size-text{
 
  font-size: 16px;
}
.size-text p span{
 color : #2c3e50 !important;
}
</style>