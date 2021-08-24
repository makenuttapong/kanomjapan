<template>
  <div>
    <b-row>
      <b-col md="12">
        <b-card class="mb-4">
          <div v-if="loading" class="p-4 row content-center">
            <vcl-twitch height="500px"> </vcl-twitch>
          </div>

          <div v-if="!loading" class="text-center p-4">
            <div><img :src="productReview.image" class="reviewSrc" height="400px"/></div>
            <div class="text-title mt-4 mb-2 text-center">
              {{ productReview.title }}
            </div>

            <div class="mt-2 mb-4 detail-rev">
              <span v-html="productReview.detail" class="size-text"/>
            </div>

            <div
              v-for="(detail, index) in productReview.moreDetail"
              :key="index"
            >
              <div class="pt-4" v-if="detail.image">
                <img :src="detail.image" class="reviewSrc" height="350px" />
              </div>
              <div class="mt-3 mb-4 detail-rev">
                <span v-html="detail.detail" class="size-text"/>
              </div>
            </div>

            <div class="text-center mt-4" v-if="productReview.productID != ''">
              <b-button variant="primary" @click="detailProduct"
                ><ShoppingCartIcon size="18" class="mb-1 mr-1"/>ซื้อสินค้าเลย</b-button>
            </div>
            
          </div>
          <div class="text-date pt-4">
              <CalendarIcon size="18" class="mb-1 mr-1" />{{ productReview.createAt }}
            </div>
        </b-card>
      </b-col>
      
    </b-row>
  </div>
</template>

<script>
import firebaseApp from "../firebase/firebase_app";
import { VclTwitch } from "vue-content-loading";
import "../assets/scss/style.scss";
import moment from "moment";
import { CalendarIcon ,ShoppingCartIcon} from "vue-feather-icons";

export default {
  name: "reviewDetail",
  data() {
    return {
      loading: false,
      uidProduct: "",
      productReview: [],
      idProductReview: this.$route.params.id,
    };
  },
  components: {
    VclTwitch,
    CalendarIcon,
    ShoppingCartIcon
  },
  created() {
    window.scrollTo(0, 0);
    this.loadData();
  },
  methods: {
    loadData() {
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
            moreDetail : doc.data().moreDetail
          };
          this.productReview = setData;
          this.loading = false;
          if (setData.productID != "") {
            this.loadUIDproducut(setData.productID);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$router.replace("/error");
          this.loading = false;
        });
    },
    formatDate(date) {
      var time = date.toDate();
      var formatTimeShow = moment(time).format("DD-MM-YYYY");
      return formatTimeShow;
    },
    loadUIDproducut(productID) {
      const productRef = firebaseApp
        .firestore()
        .collection("products")
        .where("productID", "==", productID);
      return productRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.uidProduct = doc.id;
        });
      });
    },
    detailProduct() {
      this.$router.push("/product-detail/" + this.uidProduct);
    },
  },
};
</script>

<style>
.reviewSrc {
  width: 100%;
  object-fit: contain;
}
.text-date {
  font-size: 13px;
  color: gray;
}
.content-center {
  justify-content: center;
}
.size-text{
  color : #2c3e50 !important;
  font-size: 17px;
}
.size-text p span{
 color : #2c3e50 !important;
}
</style>