<template>
  <div class="row">
    <b-col lg="12">
      <b-card class="mb-4">
        <div v-if="loading" class="p-4">
          <b-row class="my-2">
            <b-col
              cols="12"
              md="6"
              class="
                d-flex
                align-items-center
                justify-content-center
                mb-4 mb-md-0
              "
            >
              <vcl-twitch> </vcl-twitch>
            </b-col>
            <b-col cols="12" md="6">
              <vcl-list></vcl-list>
            </b-col>
          </b-row>
        </div>

        <div v-if="!loading">
          <b-card-body>
            <b-row class="my-2">
              <!-- Left: Product Image Container -->
              <b-col
                cols="12"
                md="5"
                class="
                  d-flex
                  align-items-center
                  justify-content-center
                  mb-4 mb-md-0
                "
              >
                <b-row>
                  <b-col md="12">
                    <div
                      class="
                        d-flex
                        align-items-center
                        justify-content-center
                        p-3
                        itemType
                      "
                    >
                      <div
                        v-if="product.productType == 'สินค้าขายดี'"
                        class="img-badge good-sold"
                        :class="product.stock == 0 ? 'out' : ''"
                      >
                        {{ product.productType }}
                      </div>
                      <div
                        v-if="product.productType == 'สินค้าแนะนำ'"
                        class="img-badge recommend"
                        :class="product.stock == 0 ? 'out' : ''"
                      >
                        {{ product.productType }}
                      </div>
                      <ExpandableImage
                        :src="
                          product.image
                            ? product.image
                            : require('@/assets/NoImage.png')
                        "
                        :class="product.stock == 0 ? 'img-gray' : 'product-img'"
                        fluid
                      />
                    </div>
                  </b-col>
                  <b-col md="12" v-if="product.moreImage.length != 0">
                    <b-row class="mt-4 mb-4">
                      <b-col
                        md="4"
                        sm="4"
                        cols="4"
                        v-for="(item, index) in product.moreImage"
                        :key="index"
                      >
                        <ExpandableImage
                          :src="item ? item : require('@/assets/NoImage.png')"
                          :class="
                            product.stock == 0 ? 'img-gray' : 'product-img'
                          "
                          class="boder-1"
                        />
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
              </b-col>

              <!-- Right: Product Details -->
              <b-col cols="12" md="7">
                <!-- Product Name -->
                <h4>{{ product.name }}</h4>

                <!-- Price And Ratings -->
                <div class="ecommerce-details-price d-flex flex-wrap mt-1 mb-2">
                  <div v-if="product.discount">
                    <span class="font-dis-detail mr-3 mt-2 mb-2">
                      {{ formatPrice(product.price) }} THB
                    </span>
                    <span class="item-price mr-3 mt-2 mb-2 fontPrice">
                      {{ formatPrice(product.sale) }} THB
                    </span>
                  </div>
                  <div v-if="!product.discount">
                    <h4 class="item-price mr-3 mt-2 mb-2">
                      {{ formatPrice(product.price) }} THB
                    </h4>
                  </div>
                </div>

                <div>
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
                            'fill-current':
                              star <=
                              calStar(product.rating, product.ratingCount),
                          },
                          star <= calStar(product.rating, product.ratingCount)
                            ? 'text-warning'
                            : 'text-muted',
                        ]"
                      />
                    </li>
                    <span class="pl-2">
                      {{
                        product.rating != 0
                          ? calStar(product.rating, product.ratingCount) + "/5"
                          : ""
                      }}
                      ({{ product.ratingCount }} รีวิว)</span
                    >
                  </ul>
                </div>

                <!-- STOCK -->
                <div>
                  สินค้าคงเหลือ :
                  <span v-if="product.stock == 0" class="pro-stock"
                    ><b-badge variant="danger" pill>สินค้าหมด</b-badge></span
                  >
                  <span
                    v-if="product.stock < 10 && product.stock != 0"
                    class="text-warning"
                  >
                    {{ product.stock }} ชิ้น
                    <AlertTriangleIcon size="20" class="ml-1 mb-1"
                  /></span>
                  <span v-if="product.stock >= 10" class="text-success"
                    >{{ product.stock }} ชิ้น</span
                  >
                </div>

                <div class="mb-2">
                  ขายแล้ว :
                  <span class="text-mute">{{
                    product.sold ? formatPrice(product.sold) : 0
                  }}</span>
                  ชิ้น
                </div>

                <!-- Product Description -->
                <span class="bold">คำอธิบายสินค้า</span>
                <b-card-text>{{
                  product.detail ? product.detail : "-"
                }}</b-card-text>

                <hr />
                <div class="catagpry">
                  <span class="bold"> รหัสสินค้า : </span>
                  <span class="pro-id">{{ product.productID }} </span>
                </div>
                <div class="catagpry">
                  <span class="bold">หมวดหมู่สินค้า : </span
                  ><span>{{ product.catagory }}</span>
                </div>
                <div class="catagpry">
                  <span class="bold">ยี่ห้อ : </span
                  ><span>{{ product.brand ? product.brand : "-" }}</span>
                </div>
                <div class="weight">
                  <span class="bold">น้ำหนัก : </span>
                  <span>{{ formatPrice(product.weight) }} กรัม</span>
                </div>
                <div class="exp-date">
                  <span class="bold">วันหมดอายุ : </span
                  ><span
                    ><CalendarIcon size="18" class="mb-1 mr-1" />{{
                      product.productEXP
                    }}</span
                  >
                </div>
                
                <div class="item-options mt-4">
                  <b-button
                    v-if="checkItemInCart(product)"
                    variant="warning"
                    class="btn-cart"
                    @click="checkoutCart(product)"
                  >
                    <CreditCardIcon class="mr-1" width="18px" />
                    <span>ชำระสินค้า</span>
                  </b-button>

                  <b-button
                    v-if="!checkItemInCart(product)"
                    variant="primary"
                    :disabled="role == 'admin' || product.stock == 0"
                    v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                    class="btn-cart add-to-cart"
                    @click="addToCart(product)"
                  >
                    <ShoppingCartIcon class="mr-1" width="18px" />
                    <span>หยิบใส่รถเข็น</span>
                  </b-button>
                </div>
              </b-col>
            </b-row>
          </b-card-body>
        </div>
      </b-card>

      <b-card class="mb-4">
        <h6 class="mb-4">
          <i class="fas fa-comment" color="#7367f0" /> คอมเมนต์ / รีวิว ({{
            itemCount
          }})
        </h6>
        <div v-if="loadingComment" class="p-4">
          <vcl-facebook></vcl-facebook>
        </div>
        <div v-if="!loadingComment">
          <div v-if="comments.length == 0">
            <div class="text-center mt-4 mb-4">
              <span>ไม่พบคอมเมนต์</span>
            </div>
          </div>
          <div v-if="comments.length != 0">
            <div
              class="userList"
              v-for="(comment, index) in comments"
              :key="index"
            >
              <div class="user-avatar">
                <b-avatar
                  :src="
                    comment.userProfile.image ? comment.userProfile.image : require(`@/assets/userDF.png`)
                  "
                  width="40px"
                />
                <span class="comm-name">
                  {{
                    comment.userProfile.name
                  }}</span
                >
              </div>
              <div class="comment">
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
                          { 'fill-current': star <= comment.rating },
                          star <= comment.rating
                            ? 'text-warning'
                            : 'text-muted',
                        ]"
                      />
                    </li>
                  </ul>
                </div>
                <div class="comm pb-3" v-if="comment.comment">
                  {{ comment.comment }}
                </div>
                <div
                  class="comm-img d-flex pb-3"
                  v-if="comment.moreImages.length != 0"
                >
                  <div
                    v-for="(img, index) in comment.moreImages"
                    :key="index"
                    class="mr-2 border"
                  >
                    <ExpandableImage :src="img" class="md-image" />
                  </div>
                </div>
                <div class="text-small text-mute">
                  <CalendarIcon size="18" class="mb-1 mr-1" />{{
                    comment.createAt
                  }}
                </div>
              </div>

              <hr/>
            </div>

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
                @selectedPage="loadMoreComment"
                :currentPage="currentPage + 1"
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
    </b-col>
    <!-- <b-col lg="3">
      <b-card class="mb-4"> สินค้าแนะนำ </b-card>
    </b-col> -->
  </div>
</template>

<script>
import firebaseApp from "../firebase/firebase_app";
import "../assets/scss/style.scss";
import { VclTwitch, VclFacebook, VclList } from "vue-content-loading";
import moment from "moment";
import ExpandableImage from "../components/expandableImage.vue";
import { CalendarIcon } from "vue-feather-icons";
import Ripple from "vue-ripple-directive";
import Pagination from "../components/pagination";
import {
  ShoppingCartIcon,
  CreditCardIcon,
  AlertTriangleIcon,
} from "vue-feather-icons";

export default {
  name: "productListDetail",
   directives: {
    Ripple,
  },
  components: {
    VclTwitch,
    VclFacebook,
    VclList,
    ShoppingCartIcon,
    CreditCardIcon,
    AlertTriangleIcon,
    ExpandableImage,
    CalendarIcon,
    Pagination
  },
  data() {
    return {
      product: {},
      role: "",
      loading: false,
      loadingComment: false,
      itemComment: 5,
      idProduct: this.$route.params.id,
      itemCount: 0,
      totalDatas: null,
      itemPerPage: 5,
      itemStart: null,
      itemEnd: null,
      currentPage : 0,
      comments: [],
    };
  },
  created() {
    window.scrollTo(0, 0);
    const user = firebaseApp.auth().currentUser;
    if (user) {
      user.getIdTokenResult().then((idTokenResult) => {
        if (idTokenResult.claims.role) {
          this.role = idTokenResult.claims.role;
        } else {
          this.role = "user";
        }
      });
    }
    this.loadProductDetail();
  },
  watch: {
    $route(to) {
      this.idProduct = to.params.id;
      this.loadProductDetail();
    },
  },
  methods: {
    loadProductDetail() {
      this.loading = true;
      const productDetailRef = firebaseApp
        .firestore()
        .doc("products/" + this.idProduct);
      return productDetailRef
        .get()
        .then((doc) => {
          var setData = {
            id: doc.id,

            name: doc.data().name,
            price: doc.data().price,
            sale: doc.data().sale,
            discount: doc.data().discount,
            catagory: doc.data().catagory,
            productID: doc.data().productID,
            stock: doc.data().stock,
            productType: doc.data().productType,
            brand: doc.data().brand,
            image: doc.data().image,
            detail: doc.data().detail,
            productEXP: doc.data().productEXP,
            sold: doc.data().sold,
            rating: doc.data().rating,
            show : doc.data().show,
            ratingCount: doc.data().ratingCount,
            weight: doc.data().weight,
            createAt: doc.data().createAt,
            updateAt: doc.data().updateAt,
            moreImage: doc.data().moreImage,
          };
          this.loading = false;

          this.product = setData;
          this.checkItemInCart(this.product);
          this.loadComment(setData.id);
        })
        .catch((err) => {
          console.log(err);
          this.$router.replace("/error");
          this.loading = false;
        });
    },
    loadComment(productId) {
      this.loadingComment = true;
      let indexOf = this.itemPerPage * this.currentPage; //itemperPage = totalitem/limit
        
      const commentRef = firebaseApp
        .firestore()
        .collection("comments")
        .where("productIdRef", "==", productId)
        .orderBy("createAt", "desc");

      return commentRef
        .get()
        .then((document) => {
          this.itemCount = document.docs.length;

          let last = document.docs[indexOf];
          var itemCount = document.docs.length;
          var page = this.currentPage + 1;
          var start = page * this.itemPerPage - (this.itemPerPage - 1);
          var end = Math.min(start + this.itemPerPage - 1, itemCount);
          this.itemStart = start;
          this.itemEnd = end;
          this.totalDatas = itemCount;
          if (last) {
            var queryRef = commentRef.startAt(last).limit(this.itemPerPage);
          } else {
            queryRef = commentRef.limit(this.itemPerPage);
          }

          queryRef
            .get()
            .then((querySnapshot) => {
              var items = [];
              querySnapshot.forEach(async (doc) => {
         
                var setData = {
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

              this.comments = items;
              this.loadingComment = false;
              
            })
            .catch((err) => {
              console.log(err);
              this.loadingComment = false;
              
            });
        })
        .catch((err) => {
          console.log(err);
          this.loadingComment = false;
        
        });
    },
    loadMoreComment(page) {
      this.currentPage = page
      var productId = this.product.id;
      this.loadComment(productId);
    },
    formatNormalDate(date) {
      var time = date.toDate();
      var formatTimeShow = moment(time).format("DD-MM-YYYY");
      return formatTimeShow;
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
    addToCart(product) {
      this.$store.dispatch("addItemCart", product);
      this.$toast(`เพิ่มสินค้าลงรถเข็นแล้ว`, {
        position: "top-center",
        closeOnClick: true,
        hideProgressBar: true,
        timeout: 2000,
        icon: "fa fa-cart-plus",
      });
    },
    checkItemInCart(product) {
      var checked = false;
      this.$store.state.cartItems.find((item) => {
        if (item.id == product.id) {
          checked = true;
        }
        return checked;
      });
      return checked;
    },
    checkoutCart() {
      this.$router.push("/checkout");
    },
    calStar(total, ratingCount) {
      return (total / ratingCount).toFixed(1);
    },
    checkProductExpOut(date) {
      var today = moment().format("DD-MM-YYYY");

      var dayDiff = moment(date, "DD/MM/YYYY").diff(
        moment(today, "DD/MM/YYYY "),
        "days"
      );

      if (dayDiff <= 0) {
        return true;
      } else {
        return false;
      }
    },
     checkProductExp(date) {
     var today = moment().format("DD-MM-YYYY");

      var dayDiff = moment(date, "DD/MM/YYYY").diff(
        moment(today, "DD/MM/YYYY "),
        "days"
      );
   
      if (dayDiff > 0 && dayDiff <= 120) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style>
.loader-wheel {
  animation: spin 1s infinite linear;
  border: 2px solid rgb(115 103 240);
  border-left: 4px solid #fff;
  border-radius: 50%;
  height: 25px;
  margin-bottom: 10px;
  width: 25px;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.pro-id {
  color: #7367f0;
}
</style>