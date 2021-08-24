<template>
  <div>
    <b-card class="mb-4">
      <h5 class="mb-4">
        <i class="fa fa-cookie-bite" color="#7367f0" /> รายละเอียดสินค้า
      </h5>
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
                        :class="product.stock == 0 ? 'img-gray' : 'product-img'"
                        :src="item ? item : require('@/assets/NoImage.png')"
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
                  <span class="pl-2 rating-text">
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
                  ><b-badge class="status-cancle-style" pill
                    >สินค้าหมด</b-badge
                  ></span
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
              <div>
                <span class="bold">สถานะ : </span>
                <span v-if="product.show" class="badge-5"
                  ><b-badge class="status-check-style" pill>แสดง</b-badge>
                </span>
                <span v-if="!product.show" class="badge-5"
                  ><b-badge class="status-cancle-style" pill>ไม่แสดง</b-badge>
                </span>
              </div>
            </b-col>
          </b-row>
        </b-card-body>
      </div>
    </b-card>

    <b-card class="mb-4">
      <div class="d-flex space-between mb-2">
        <h5 class="mb-3">
          <i class="fas fa-chart-line" color="#7367f0" /> ยอดขายทั้งหมด
        </h5>

        <div class="mx-50 select-month ml-2 mr-2">
          <date-picker
            v-model="monthSelect"
            valueType="format"
            type="month"
            format="YYYY-MM"
            @change="selectMonth"
          ></date-picker>
        </div>
      </div>
      <div v-if="loadingChart" class="p-4 row">
        <vcl-twitch width="600px"></vcl-twitch>
      </div>
      <div v-if="!loadingChart">
        <div class="text-small pl-4 ml-2">
          <b>ทั้งหมด : </b>{{ item_chart_count }} รายการ
        </div>
        <vue-apex-charts
          v-if="this.lineChartSimple.series[0].data != 0"
          type="line"
          height="350"
          :options="lineChartSimple.chartOptions"
          :series="lineChartSimple.series"
        />
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
                  comment.userProfile.image
                    ? comment.userProfile.image
                    : require(`@/assets/userDF.png`)
                "
                width="40px"
              />
              <span class="comm-name"> {{ comment.userProfile.name }}</span>
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
                        star <= comment.rating ? 'text-warning' : 'text-muted',
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

            <hr />
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
  </div>
</template>

<script>
import firebaseApp from "../../firebase/firebase_app";
import "../../assets/scss/style.scss";
import { VclTwitch, VclFacebook, VclList } from "vue-content-loading";
import moment from "moment";
import { AlertTriangleIcon, CalendarIcon } from "vue-feather-icons";
import ExpandableImage from "../../components/expandableImage.vue";
import VueApexCharts from "vue-apexcharts";
import Pagination from "../../components/pagination";

export default {
  name: "productDetail",
  data() {
    return {
      product: {},
      loading: false,
      loadingChart: false,
      loadingComment: false,
     
      idProduct: this.$route.params.id,
      itemCount: 0,
      item_chart_count: 0,
      comments: [],
      monthSelect: "",
      totalDatas: null,
      itemPerPage: 5,
      itemStart: null,
      itemEnd: null,
      currentPage : 0,

      lineChartSimple: {
        series: [
          {
            data: [],
          },
        ],
        chartOptions: {
          chart: {
            zoom: {
              enabled: false,
            },
            toolbar: {
              show: false,
            },
          },
          markers: {
            strokeWidth: 7,
            strokeOpacity: 1,
            strokeColors: ["#f8f8f8"],
            colors: ["#faa152"],
          },
          colors: ["#faa152"],
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: "straight",
          },
          grid: {
            xaxis: {
              lines: {
                show: true,
              },
            },
          },
          tooltip: {
            custom(data) {
              return `${'<div class="px-1 py-50"><span>'}${
                data.series[data.seriesIndex][data.dataPointIndex]
              } รายการ</span></div>`;
            },
          },
          xaxis: {
            categories: [],
          },
          yaxis: {
            // opposite: isRtl,
          },
        },
      },
    };
  },
  components: {
    VclTwitch,
    VclFacebook,
    VclList,
    Pagination,
    AlertTriangleIcon,
    CalendarIcon,
    ExpandableImage,
    VueApexCharts,
  },
  created() {
    window.scrollTo(0, 0);

    this.loadProductDetail();
    this.monthSelect = moment().startOf("months").format("YYYY-MM");
    this.loadOrderMonth(this.monthSelect);
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
            uid: doc.id,
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
            show: doc.data().show,
            productEXP: doc.data().productEXP,
            sold: doc.data().sold,
            rating: doc.data().rating,
            ratingCount: doc.data().ratingCount,
            weight: doc.data().weight,
            createAt: doc.data().createAt,
            updateAt: doc.data().updateAt,
            moreImage: doc.data().moreImage,
          };
          this.loading = false;

          this.product = setData;
          this.loadComment(setData.uid);
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
          this.$router.replace("/error");
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

          this.itemCount = document.docs.length;

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
                  userProfile: doc.data().userProfile,
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
      var productId = this.product.uid;
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
    calStar(total, ratingCount) {
      return (total / ratingCount).toFixed(1);
    },
    loadOrderMonth(mountSelect) {
      this.loadingChart = true;
      var orderSize = firebaseApp.firestore().collection("orders");

      var start_date_of_month = moment().format(mountSelect + "-01 00:00");
      var end_date_of_month = moment(mountSelect)
        .add(1, "month")
        .format("YYYY-MM-DD 00:00");
      var dayArray = [];

      while (start_date_of_month <= end_date_of_month) {
        dayArray.push(start_date_of_month);

        start_date_of_month = moment(start_date_of_month)
          .add(1, "day")
          .format("YYYY-MM-DD 00:00");
      }

      var firstDayFomat = new Date(dayArray[0]);
      var lastDayFormat = new Date(dayArray[dayArray.length - 1]);

      orderSize
        .where("createAt", ">=", firstDayFomat)
        .where("createAt", "<", lastDayFormat)
        .get()
        .then((querySnapshot) => {
          var monthOnly = moment(mountSelect).endOf("month").format("DD");
          var totalData = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
          ];

          if (monthOnly == "30") {
            totalData.pop();
          } else if (monthOnly == "29") {
            totalData.pop();
            totalData.pop();
          } else if (monthOnly == "28") {
            totalData.pop();
            totalData.pop();
            totalData.pop();
          }

          querySnapshot.forEach((doc) => {
            var countItem = 0;
            doc.data().items.forEach((ele) => {
              if (ele.id == this.idProduct) {
                countItem = countItem + ele.quantity;
              }
            });

            dayArray.forEach((ele, index) => {
              if (this.checkDateYMD(doc.data().createAt) == ele) {
                totalData[index] = totalData[index] + countItem;
              }
            });
          });

          var count = 0;

          for (var i = 0; i < totalData.length; i++) {
            count = count + totalData[i];
          }

          this.item_chart_count = count;
          this.lineChartSimple.series[0].data = totalData;
          this.loadingChart = false;
        });
    },
    selectMonth(data) {
      this.monthSelect = data;
      this.loadOrderMonth(data);
    },
    checkDateYMD(date) {
      var time = date.toDate();
      var formatTimeShow = moment(time).format("YYYY-MM-DD 00:00");
      return formatTimeShow;
    },
    checkExpDate(){

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

<style scoped>
.pro-id {
  color: #7367f0;
}
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
</style>