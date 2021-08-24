<template>
  <b-card>
    <h5 class="mb-3">
      <i class="fas fa-star" color="#7367f0" /> สินค้าที่มีคะแนนมากสุด
    </h5>

    <div v-if="loading" class="p-4 row">
      <vcl-facebook></vcl-facebook>
    </div>

    <div v-if="!loading">
      <div v-if="topRate.length != 0" class="mt-4">
        <div class="row mb-3" v-for="(topR, index) in topRate" :key="index">
          <div class="ml-4">
            <div class="d-flex justify-content-center">
              <span class="mr-3">{{ index + 1 }}.</span
              ><ExpandableImage :src="topR.image" class="md-image border" />
            </div>
          </div>
          <div class="col">
            <div>{{ topR.name }}</div>
            <div class="productid">{{ topR.productID }}</div>
            <div class="star">
              <ul class="unstyled-list list-inline">
                <li
                  v-for="star in 5"
                  :key="star"
                  class="ratings-list-item mr-25"
                >
                  <i
                    class="fa fa-star"
                    :class="[
                      { 'fill-current': star <= topR.ratingShow },
                      star <= topR.ratingShow ? 'text-warning' : 'text-muted',
                    ]"
                  />
                </li>
                <span class="ml-2 mt-1 text-small"
                  >{{ topR.ratingShow }}/5</span
                >
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-card>
</template>

<script>
import firebaseApp from "../../firebase/firebase_app";
import ExpandableImage from "../../components/expandableImage.vue";
import "../../assets/scss/style.scss";
import { VclFacebook } from "vue-content-loading";

export default {
  name: "TopRate",

  data() {
    return {
      loading: false,
      topRate: [],
    };
  },
  components: {
    ExpandableImage,
    VclFacebook,
  },
  created() {
    this.topRateProduct();
  },
  methods: {
    topRateProduct() {
      this.loading = true;
      const productRef = firebaseApp.firestore().collection("products");
      productRef
        .orderBy("rating", "desc")
        .get()
        .then((querySnapshot) => {
          var ratingArr = [];
          querySnapshot.forEach((doc) => {
            var total = doc.data().rating;
            var ratingC = doc.data().ratingCount;
            if (total != 0) {
              var ratingData = {
                image: doc.data().image,
                name: doc.data().name,
                productID : doc.data().productID,
                ratingShow: parseFloat(this.calStar(total, ratingC)),
              };
              ratingArr.push(ratingData);
            }
          });

          
          ratingArr.sort(
            (a, b) => parseFloat(a.ratingShow) - parseFloat(b.ratingShow)
          );
          ratingArr.reverse();
          var size = 10;
          var newArr = ratingArr.slice(0, size).map((i) => {
            return i;
          });

          newArr.filter((ele) => {
            return (ele.ratingShow = ele.ratingShow.toString());
          });


          this.topRate = newArr;
          this.loading = false;
        });
    },
    calStar(total, ratingCount) {
      return (total / ratingCount).toFixed(1);
    },
  },
};
</script>