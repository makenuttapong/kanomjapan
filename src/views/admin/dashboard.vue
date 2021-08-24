<template>
  <section id="dashboard-ecommerce">
    <b-row class="match-height">
      <b-col xl="4" md="6">
        <b-card class="mb-4">
          <h5>รายได้เดือนนี้</h5>
          <b-card-text class="font-small-3"> </b-card-text>
          <h3 class="mb-3 mt-2 pt-50">
            <span class="text-primary">{{ incomeData }} THB</span>
          </h3>
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            @click="inComePage"
          >
            ดูยอดขาย
          </b-button>
          <b-img
            :src="require('@/assets/images/illustration/badge.svg')"
            class="congratulation-medal"
            alt="Medal Pic"
          />
        </b-card>
      </b-col>

      <b-col xl="8" md="6">
        <b-card class="mb-4">
          <h5 class="mb-4">สถิติ</h5>

          <b-card-body class="statistics-body">
            <b-row>
              <b-col
                v-for="item in statisticsItems"
                :key="item.icon"
                lg="3"
                md="6"
                sm="6"
                class="mb-2 mb-md-0"
                :class="item.customClass"
              >
                <b-media no-body>
                  <b-media-aside class="mr-2">
                    <b-avatar size="50" :variant="item.color" class="font20">
                      <i :class="item.icon" />
                    </b-avatar>
                  </b-media-aside>
                  <b-media-body class="my-auto">
                    <h6 class="font-weight-bolder mb-0">
                      {{ item.title }}
                    </h6>
                    <b-card-text class="font-small-3 mb-0">
                      {{ item.subtitle }}
                    </b-card-text>
                  </b-media-body>
                </b-media>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

    <b-row class="match-height">
      <b-col lg="4">
        <b-row class="match-height">
          <b-col lg="6" md="3" cols="6">
            <b-card class="mb-4">
              <h6>รายได้วันนี้</h6>
              <div
                v-if="incomeToday != 0"
                class="text-center font-24 incomeToday mt-2"
              >
                +{{ formatPrice(incomeToday) }}
              </div>
              <div
                v-if="incomeToday == 0"
                class="text-center font-35 incomeTodayZero mt-2"
              >
                0
              </div>
              <div class="text-center mt-1">บาท</div>
            </b-card>
          </b-col>

          <b-col lg="6" md="3" cols="6">
            <b-card class="mb-4">
              <h6>ออเดอร์วันนี้</h6>
              <div class="text-center font-35 orderToday mt-2">
                {{ orderToday != 0 ? "+" : "" }}{{ orderToday }}
              </div>
              <div class="text-center mt-1">รายการ</div>
            </b-card>
          </b-col>

          <b-col lg="12" md="6">
            <b-card class="mb-4">
              <div class="d-flex d-between">
                <h6 class="mt-1">ออเดอร์ที่ได้รับ</h6>
                <span class="text-mute text-small mt-1">7 วันล่าสุด</span>
                <div class="link-detail text-small" @click="lastOrder">
                  <b-button size="sm" variant="outline-primary">
                    เพิ่มเติม
                  </b-button>
                </div>
              </div>
              <div v-if="loadingOrderWeek" class="p-2">
                <vcl-facebook></vcl-facebook>
              </div>
              <div v-if="!loadingOrderWeek">
                <vue-apex-charts
                  v-if="this.lineChartSimple.series[0].data != 0"
                  type="line"
                  height="180"
                  :options="lineChartSimple.chartOptions"
                  :series="lineChartSimple.series"
                />
              </div>
            </b-card>
          </b-col>
        </b-row>
      </b-col>

      <b-col lg="8">
        <b-card class="mb-4">
          <div class="d-flex d-between mb-3">
            <h5 class="mt-1">สินค้าขายดี</h5>
            <span class="text-mute mt-1">{{ thisMonth }}</span>
            <div class="link-detail text-small" @click="bestProductDetail">
              <b-button size="sm" variant="outline-primary">
                เพิ่มเติม
              </b-button>
            </div>
          </div>
          <div v-if="loadingBestSale" class="p-2">
            <vcl-facebook></vcl-facebook>
          </div>
          <div v-if="!loadingBestSale">
            <chartjs-component-bar-chart
              v-if="latestBarChart.data.labels.length != 0"
              :height="350"
              :data="latestBarChart.data"
              :options="latestBarChart.options"
            />
          </div>
        </b-card>
      </b-col>
    </b-row>

    <b-row class="match-height">
      <b-col lg="8">
        <b-card class="mb-4">
          <div class="d-flex d-between mb-3">
            <h5 class="mt-1">คอมเมนต์ล่าสุด</h5>
            <div class="link-detail text-small" @click="readMoreComment">
              <b-button size="sm" variant="outline-primary">
                อ่านเพิ่มเติม
              </b-button>
            </div>
          </div>

          <div v-if="loadingComment" class="p-2">
            <vcl-facebook></vcl-facebook>
          </div>
          <div v-if="!loadingComment">
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
                  <CalendarIcon size="16" class="mb-1 mr-1" />{{
                    comment.createAt
                  }}
                </div>
              </div>
              <hr v-if="index != comments.length - 1" />
            </div>
          </div>
        </b-card>
      </b-col>

      <b-col lg="4" md="6">
        <b-card class="mb-4">
          <h5>เข้าใช้งานด้วย</h5>
          <div v-if="loadingSignIn" class="p-2">
            <vcl-facebook></vcl-facebook>
          </div>
          <div v-if="!loadingSignIn">
            <chartjs-component-doughnut-chart
              v-if="doughnutChart.data.datasets[0].data.length != 0"
              :height="175"
              :data="doughnutChart.data"
              :options="doughnutChart.options"
              class="mb-3 mt-2"
            />
          </div>
          <div
            v-for="(sign, index) in signInData"
            :key="sign.platform"
            :class="index < signInData.length - 1 ? 'mb-1' : ''"
            class="d-flex justify-content-between"
          >
            <div class="d-flex align-items-center platform-icon">
              <i :class="sign.symbol" class="mr-1" :color="sign.color" />
              <span class="ml-75 mr-25">{{ sign.platform }}</span>
            </div>
            <div>
              <span class="text-small">{{ sign.count }}%</span>
            </div>
          </div>
        </b-card>
      </b-col>

      <b-col lg="4" md="6">
        <b-card class="mb-4">
          <div class="d-flex space-between">
            <h6 class="mt-1">บริษัทขนส่ง</h6>
            <div class="text-mute mt-1 text-small">{{ thisMonth }}</div>
            <div class="link-detail text-small" @click="logExpress">
              <b-button size="sm" variant="outline-primary">
                เพิ่มเติม
              </b-button>
            </div>
          </div>
          <div v-if="loadingCompany" class="p-2">
            <vcl-facebook></vcl-facebook>
          </div>
          <div v-if="!loadingCompany">
            <div class="express-div mt-3">
              <chartjs-component-horizontal-bar-chart
                v-if="horizontalBarChart.data.datasets[0].data.length != 0"
                :height="200"
                :data="horizontalBarChart.data"
                :options="horizontalBarChart.options"
              />
            </div>
          </div>
        </b-card>
      </b-col>

      <b-col lg="4" md="6">
        <b-card class="mb-4">
          <div class="d-flex space-between">
            <h6 class="mt-1">สินค้าที่มีคะแนนมากสุด</h6>
            <div class="link-detail text-small" @click="topRatePage">
              <b-button size="sm" variant="outline-primary">
                เพิ่มเติม
              </b-button>
            </div>
          </div>
          <div v-if="loadingTopRate" class="p-2">
            <vcl-facebook></vcl-facebook>
          </div>
          <div v-if="!loadingTopRate">
            <div v-if="topRate.name" class="mt-2">
              <div class="d-flex justify-content-center">
                <ExpandableImage :src="topRate.image" class="md-image" />
              </div>
              <div class="row">
                <div class="col">
                  <div>{{ topRate.name }}</div>
                  <div class="productid">{{ topRate.productID }}</div>
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
                            { 'fill-current': star <= topRate.ratingShow },
                            star <= topRate.ratingShow
                              ? 'text-warning'
                              : 'text-muted',
                          ]"
                        />
                      </li>
                      <span class="ml-2 mt-1 text-small"
                        >{{ topRate.ratingShow }}/5</span
                      >
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-card>
      </b-col>

      <b-col lg="4" md="6">
        <b-card class="mb-4">
          <div class="d-flex space-between">
            <h6 class="mt-1">Line Notification</h6>
            <div class="link-detail text-small" @click="lineNotifyPage">
              <b-button size="sm" variant="outline-primary">
                เพิ่มเติม
              </b-button>
            </div>
          </div>
          <div v-if="loadingLineNoti" class="p-2">
            <vcl-facebook></vcl-facebook>
          </div>

          <div v-if="!loadingLineNoti" class="mt-3">
            <div v-for="(mess,index) in lineMessage" :key="index" class="mb-3 border-message">
              <div class="text-center mb-2"> <i class="fas fa-bell" color="gold" /><span class="ml-1 mr-1 text-underline">มีการชำระออเดอร์เข้ามาใหม่</span> <b-badge class="status-cancle-style">new</b-badge></div>
              <div class="text-15"><span class="bold">จากคุณ : </span>{{mess.name}}</div>
              <div class="text-15"><span class="bold">หมายเลขออเดอร์ : </span> <span class="link-detail text-primary" @click="gotoOrderDetail(mess.orderID)">{{mess.orderID}}</span></div>
              <div class="text-15"><span class="bold">จำนวนสินค้า : </span> <span class="">{{mess.totalItem}} รายการ</span></div>
              <div class="text-15"><span class="bold">ราคาทั้งหมด : </span> <span class="">{{formatPrice(mess.totalAll)}} บาท</span></div>
              <div  class="text-15"><span class="bold">ยินยันการชำระเมื่อ : </span><CalendarIcon size="16" class="mb-1 mr-1"/>{{formatDate(mess.payon)}}</div>
            </div>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </section>
</template>

<script>
import Ripple from "vue-ripple-directive";
import firebaseApp from "../../firebase/firebase_app";
import moment from "moment";
import { CalendarIcon } from "vue-feather-icons";
import ExpandableImage from "../../components/expandableImage.vue";
import "../../assets/scss/style.scss";
import ChartjsComponentBarChart from "../../components/barChart.vue";
import ChartjsComponentHorizontalBarChart from "../../components/barHchart";
import ChartjsComponentDoughnutChart from "../../components/donutChart.vue";
import VueApexCharts from "vue-apexcharts";
import { VclFacebook } from "vue-content-loading";

const chartColors = {
  primaryColorShade: "#836AF9",
  yellowColor: "#93ff7d",
  successColorShade: "#28dac6",
  warningColorShade: "#ffe802",
  warningLightColor: "#FDAC34",
  infoColorShade: "#299AFF",
  greyColor: "#4F5D70",
  blueColor: "#2c9aff",
  blueLightColor: "#84D0FF",
  greyLightColor: "#EDF1F4",
  tooltipShadow: "rgba(0, 0, 0, 0.25)",
  lineChartPrimary: "#666ee8",
  lineChartDanger: "#ff4961",
  labelColor: "#6e6b7b",
  grid_line_color: "rgba(200, 200, 200, 0.2)",
};

export default {
  name: "dashboard",
  created() {
    this.loadInCome();
    this.loadInComeToday();
    this.loadStatistics();
    this.loadComment();
    this.loadBestSale();
    this.loadOrderWeek();
    this.loadSignInWith();
    this.loadOrderTruckCom();
    this.topRateProduct();
    this.loadLineMessage();
  },
  components: {
    CalendarIcon,
    ExpandableImage,
    ChartjsComponentBarChart,
    VueApexCharts,
    ChartjsComponentDoughnutChart,
    ChartjsComponentHorizontalBarChart,
    VclFacebook,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      loadingComment: false,
      loadingBestSale: false,
      loadingOrderWeek: false,
      loadingSignIn: false,
      loadingCompany: false,
      loadingTopRate: false,
      loadingLineNoti: false,
      incomeData: 0,
      lineMessage: [],
      statisticsItems: [
        {
          icon: "fa fa-truck-loading",
          color: "light-primary",
          title: "0",
          subtitle: "ออเดอร์",
          customClass: "mb-2 mb-xl-0",
        },
        {
          icon: "fa fa-cookie-bite",
          color: "light-info",
          title: "0",
          subtitle: "สินค้า",
          customClass: "mb-2 mb-xl-0",
        },
        {
          icon: "fa fa-newspaper",
          color: "light-danger",
          title: "0",
          subtitle: "รีวิวสินค้า",
          customClass: "mb-2 mb-sm-0",
        },
        {
          icon: "fa fa-users",
          color: "light-success",
          title: "0",
          subtitle: "ลูกค้า",
          customClass: "",
        },
      ],
      incomeToday: 0,
      orderToday: 0,
      thisMonth: "",
      comments: [],
      productExp: [],
      orderOver: [],
      topRate: {},
      signInData: [
        {
          platform: "Email",
          symbol: "fa fa-envelope",
          color: "#7367f0",
          percentage: 80,
          count: 0,
        },
        {
          platform: "Google",
          symbol: "fab fa-google",
          color: "#ea4335",
          percentage: 10,
          count: 0,
        },
        {
          platform: "Facebook",
          symbol: "fab fa-facebook-f",
          color: "#1877f2",
          percentage: 10,
          count: 0,
        },
      ],
      latestBarChart: {
        data: {
          labels: [],
          fullname: [],
          datasets: [
            {
              data: [],
              backgroundColor: chartColors.successColorShade,
              borderColor: "transparent",
            },
          ],
        },
        options: {
          elements: {
            rectangle: {
              borderWidth: 2,
              borderSkipped: "bottom",
            },
          },
          responsive: true,
          maintainAspectRatio: false,
          responsiveAnimationDuration: 500,
          legend: {
            display: false,
          },
          tooltips: {
            // // Updated default tooltip UI
            shadowOffsetX: 1,
            shadowOffsetY: 1,
            shadowBlur: 8,
            shadowColor: chartColors.tooltipShadow,
            backgroundColor: `#f8f8f8`,
            titleFontColor: `#111111`,
            bodyFontColor: `#111111`,
            callbacks: {
              title: function (tooltipItem, data) {
                return data["fullname"][tooltipItem[0]["index"]];
              },
              label: function (tooltipItem, data) {
                return (
                  "ยอดขาย " +
                  data["datasets"][0]["data"][tooltipItem["index"]] +
                  " ชิ้น"
                );
              },
            },
          },
          scales: {
            xAxes: [
              {
                display: true,
                gridLines: {
                  display: true,
                  color: chartColors.grid_line_color,
                  zeroLineColor: chartColors.grid_line_color,
                },
                scaleLabel: {
                  display: false,
                },
                ticks: {
                  fontColor: chartColors.labelColor,
                },
              },
            ],
            yAxes: [
              {
                display: true,
                gridLines: {
                  color: chartColors.grid_line_color,
                  zeroLineColor: chartColors.grid_line_color,
                },
                ticks: {
                  stepSize: 100,
                  min: 0,
                  max: 200,
                  fontColor: chartColors.labelColor,
                },
              },
            ],
          },
        },
      },
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
            categories: [
              moment().subtract(6, "day").format("DD-MM"),
              moment().subtract(5, "day").format("DD-MM"),
              moment().subtract(4, "day").format("DD-MM"),
              moment().subtract(3, "day").format("DD-MM"),
              moment().subtract(2, "day").format("DD-MM"),
              moment().subtract(1, "day").format("DD-MM"),
              moment().format("DD-MM"),
            ],
          },
          yaxis: {
            // opposite: isRtl,
          },
        },
      },
      doughnutChart: {
        options: {
          responsive: true,
          maintainAspectRatio: false,
          responsiveAnimationDuration: 500,
          cutoutPercentage: 60,
          legend: { display: false },

          tooltips: {
            callbacks: {
              label(tooltipItem, data) {
                const label = data.datasets[0].labels[tooltipItem.index] || "";
                const value = data.datasets[0].data[tooltipItem.index];
                const output = ` ${label} : ${value}`;
                return output;
              },
            },
            // Updated default tooltip UI
            shadowOffsetX: 1,
            shadowOffsetY: 1,
            shadowBlur: 8,
            shadowColor: chartColors.tooltipShadow,
            backgroundColor: "#f8f8f8",
            titleFontColor: chartColors.greyColor,
            bodyFontColor: chartColors.greyColor,
          },
        },

        data: {
          datasets: [
            {
              labels: [],
              data: [],
              backgroundColor: [
                "#948bf4",
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
              ],
              hoverOffset: 4,
              borderWidth: 4,

              hoverBorderColor: "#ffffff",
              pointStyle: "rectRounded",
            },
          ],
        },
      },
      horizontalBarChart: {
        options: {
          elements: {
            rectangle: {
              borderWidth: 2,
              borderSkipped: "top",
            },
          },
          tooltips: {
            // Updated default tooltip UI
            shadowOffsetX: 1,
            shadowOffsetY: 1,
            shadowBlur: 8,
            shadowColor: chartColors.tooltipShadow,
            backgroundColor: "#f8f8f8",
            titleFontColor: "#000000",
            bodyFontColor: "#000000",
          },
          responsive: true,
          maintainAspectRatio: false,
          responsiveAnimationDuration: 500,
          legend: {
            display: false,
          },
          scales: {
            xAxes: [
              {
                display: true,
                gridLines: {
                  zeroLineColor: chartColors.grid_line_color,
                  borderColor: "transparent",
                  color: chartColors.grid_line_color,
                  drawTicks: false,
                },
                scaleLabel: {
                  display: true,
                },
                ticks: {
                  min: 0,
                  fontColor: chartColors.labelColor,
                },
              },
            ],
            yAxes: [
              {
                display: true,
                gridLines: {
                  display: false,
                },
                scaleLabel: {
                  display: true,
                },
                ticks: {
                  fontColor: chartColors.labelColor,
                },
              },
            ],
          },
        },
        data: {
          labels: [
            "KerryExpress",
            "FlashExpress",
            "J&TExpress",
            "ThailandPost",
          ],
          datasets: [
            {
              data: [],
              backgroundColor: ["#ffad4f", "#E9FA00", "#ff4d61", "#7088ff"],
              borderColor: "transparent",
              barThickness: 15,
            },
          ],
        },
      },
    };
  },
  methods: {
    loadInCome() {
      var monthSelect = moment().startOf("months").format("YYYY-MM");
      var nextMonthSelect = moment(this.monthSelect)
        .add(1, "month")
        .format("YYYY-MM");

      var firstDayFomat = new Date(monthSelect);
      var lastDayFormat = new Date(nextMonthSelect);
      firebaseApp
        .firestore()
        .collection("incomes")
        .where("createAt", ">=", firstDayFomat)
        .where("createAt", "<", lastDayFormat)
        .get()
        .then((querySnapshot) => {
          var allCashInData = 0;

          querySnapshot.forEach((doc) => {
            if (doc.data().status == "cash-in") {
              allCashInData = allCashInData + doc.data().price;
            }
          });

          this.incomeData = this.formatPrice(allCashInData);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    loadInComeToday() {
      //รายได้วันนี้ทั้งหมด
      var incomeSize = firebaseApp.firestore().collection("incomes");

      var formatToday = moment().startOf("day").format("YYYY-MM-DD HH:mm");
      var formatToMor = moment()
        .add(1, "days")
        .startOf("day")
        .format("YYYY-MM-DD HH:mm");
      var today = new Date(formatToday);
      var tomor = new Date(formatToMor);
      incomeSize
        .where("createAt", ">=", today)
        .where("createAt", "<", tomor)
        .get()
        .then((querySnapshot) => {
          var incomCount = 0;
          querySnapshot.forEach((doc) => {
            if (doc.data().status == "cash-in") {
              incomCount = incomCount + doc.data().price;
            }
          });

          this.incomeToday = incomCount;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    loadStatistics() {
      //ออเดอร์วันนี้ทั้งหมด
      var orderSize = firebaseApp.firestore().collection("orders");

      var formatToday = moment().startOf("day").format("YYYY-MM-DD HH:mm");
      var formatToMor = moment()
        .add(1, "days")
        .startOf("day")
        .format("YYYY-MM-DD HH:mm");
      var today = new Date(formatToday);
      var tomor = new Date(formatToMor);
      orderSize
        .where("createAt", ">=", today)
        .where("createAt", "<", tomor)
        .get()
        .then((querySnapshot) => {
          this.orderToday = querySnapshot.size;
        })
        .catch((err) => {
          console.log(err);
        });

      // ORDER SIZE
      orderSize
        .get()
        .then((querySnapshot) => {
          this.statisticsItems[0].title = this.formatPrice(querySnapshot.size);
        })
        .catch((err) => {
          console.log(err);
        });

      // PRODUCT SIZE
      var productSize = firebaseApp.firestore().collection("products");
      productSize
        .get()
        .then((querySnapshot) => {
          this.statisticsItems[1].title = this.formatPrice(querySnapshot.size);
        })
        .catch((err) => {
          console.log(err);
        });

      // REVIEW-PRODUCT SIZE
      var reviewSize = firebaseApp.firestore().collection("productReview");
      reviewSize
        .get()
        .then((querySnapshot) => {
          this.statisticsItems[2].title = this.formatPrice(querySnapshot.size);
        })
        .catch((err) => {
          console.log(err);
        });

      // USERS SIZE
      var customerSize = firebaseApp.firestore().collection("users");
      customerSize
        .get()
        .then((querySnapshot) => {
          this.statisticsItems[3].title = this.formatPrice(querySnapshot.size);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    loadComment() {
      // 2 รายการล่าสุด
      this.loadingComment = true;
      const commentRef = firebaseApp
        .firestore()
        .collection("comments")
        .orderBy("createAt", "desc")
        .limit(2);
      return commentRef
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
    },
    loadOrderWeek() {
      this.loadingOrderWeek = true;
      var orderSize = firebaseApp.firestore().collection("orders");
      var toDay = moment().format("YYYY-MM-DD 23:59");
      var Last7Day = moment().subtract(7, "day").format("YYYY-MM-DD 00:00");

      var newDay = [
        moment().format("YYYY-MM-DD 00:00"),
        moment().subtract(1, "day").format("YYYY-MM-DD 00:00"),
        moment().subtract(2, "day").format("YYYY-MM-DD 00:00"),
        moment().subtract(3, "day").format("YYYY-MM-DD 00:00"),
        moment().subtract(4, "day").format("YYYY-MM-DD 00:00"),
        moment().subtract(5, "day").format("YYYY-MM-DD 00:00"),
        moment().subtract(6, "day").format("YYYY-MM-DD 00:00"),
      ];

      var toDayFomat = new Date(toDay);
      var last7DayFormat = new Date(Last7Day);
      orderSize
        .where("createAt", "<=", toDayFomat)
        .where("createAt", ">", last7DayFormat)
        .get()
        .then((querySnapshot) => {
          var totalData = [0, 0, 0, 0, 0, 0, 0];

          querySnapshot.forEach((doc) => {
            newDay.forEach((ele, index) => {
              if (this.checkDateYMD(doc.data().createAt) == ele) {
                totalData[index] = totalData[index] + 1;
              }
            });
          });
          totalData.reverse();
          this.lineChartSimple.series[0].data = totalData;
          this.loadingOrderWeek = false;
        })
        .catch((err) => {
          console.log(err);
          this.loadingOrderWeek = false;
        });
    },
    checkDateYMD(date) {
      var time = date.toDate();
      var formatTimeShow = moment(time).format("YYYY-MM-DD 00:00");
      return formatTimeShow;
    },
    loadBestSale() {
      //ออเดอร์ภายในเดือนนี้ สั่งซื้อแล้ว
      this.loadingBestSale = true;
      this.thisMonth = moment().startOf("months").format("MMMM YYYY");
      var orderSize = firebaseApp.firestore().collection("orders");
      var formatMonth = moment().startOf("months").format("YYYY-MM HH:mm");
      var formatNextMonth = moment()
        .add(1, "months")
        .startOf("day")
        .startOf("months")
        .format("YYYY-MM HH:mm");
      var toMonth = new Date(formatMonth);
      var nextMonth = new Date(formatNextMonth);
      orderSize
        .where("status", "in", [
          "เตรียมจัดส่ง",
          "อยู่ระหว่างการจัดส่ง",
          "จัดส่งแล้ว",
        ])
        .where("createAt", ">=", toMonth)
        .where("createAt", "<", nextMonth)
        .get()
        .then((querySnapshot) => {
          var items = [];
          querySnapshot.forEach((doc) => {
            doc.data().items.forEach((ele) => {
              items.push(ele);
            });
          });
          //ได้สินค้าที่ซื้อทุกรายการ ทุกออเดอร์รวมกัน
          var result = items.reduce((unique, o) => {
            if (
              !unique.some((obj) => {
                if (obj.id === o.id) {
                  obj.quantity = obj.quantity + o.quantity;
                  return obj.id === o.id;
                }
              })
            ) {
              unique.push(o);
            }
            return unique;
          }, []);
          result.sort(
            (a, b) => parseFloat(a.quantity) - parseFloat(b.quantity)
          );
          result.reverse();
          result = result.filter((month, idx) => idx < 10);

          var newLabel = [];
          var newValue = [];
          var fullProductName = [];

          for (var k = 0; k < 10; k++) {
            if (result[k]) {
              newLabel.push(result[k].productID);
              newValue.push(result[k].quantity);
              fullProductName.push(result[k].name);
            } else {
              newLabel.push("รหัสสินค้า");
              newValue.push(0);
            }
          }

          if (newValue[0] <= 10) {
            var newStep = 5;
          } else if (newValue[0] > 10 && newValue[0] <= 100) {
            newStep = 10;
          } else if (newValue[0] > 100 && newValue[0] <= 1000) {
            newStep = 100;
          }

          var setInt = parseInt(newValue[0] / 10, 10) + 1 * 10;
          this.latestBarChart.options.scales.yAxes[0].ticks.stepSize = newStep;
          this.latestBarChart.options.scales.yAxes[0].ticks.max = setInt;
          this.latestBarChart.data.labels = newLabel;
          this.latestBarChart.data.fullname = fullProductName;
          this.latestBarChart.data.datasets[0].data = newValue;
          this.loadingBestSale = false;
        })
        .catch((err) => {
          console.log(err);
          this.loadingBestSale = false;
        });
    },
    // checkProductExp() {
    //   //query 3เดือนข้างหน้า นับจากวันนี้ && สินค้าที่ยังมี stock
    //   this.loadingExp = true;
    //   const productRef = firebaseApp.firestore().collection("products");
    //   var formatNextMonth = moment()
    //     .add(3, "months")
    //     .endOf("months")
    //     .format("YYYY-MM-DD HH:mm");

    //   var nextThreeMonth = new Date(formatNextMonth);

    //   productRef
    //     .where("show", "==", true)
    //     .where("productEXP", "<=", nextThreeMonth)
    //     .get()
    //     .then((querySnapshot) => {
    //       var item = [];
    //       querySnapshot.forEach((ele) => {
    //         if (ele.data().stock != 0) {
    //           item.push(ele.data());
    //         }
    //       });

    //       this.productExp = item;
    //       this.loadingExp = false;
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       this.loadingExp = false;
    //     });
    // },
    loadSignInWith() {
      this.loadingSignIn = true;
      var setLabel = ["Email", "Google", "Facebook"];

      this.doughnutChart.data.datasets[0].labels = setLabel;

      var userSignInRef = firebaseApp
        .firestore()
        .doc("dashboard/yp6p65oDdQPdj4eiSYtS");
      userSignInRef
        .get()
        .then((querySnapshot) => {
          var plat = querySnapshot.data().signInWith;
          var allTotal = plat.email + plat.google + plat.facebook;
          this.doughnutChart.data.datasets[0].data[0] = plat.email;
          this.doughnutChart.data.datasets[0].data[1] = plat.google;
          this.doughnutChart.data.datasets[0].data[2] = plat.facebook;
          this.signInData.map((ele, index) => {
            ele.count = this.getPercen(
              this.doughnutChart.data.datasets[0].data[index],
              allTotal
            );
          });
          this.loadingSignIn = false;
        })
        .catch((err) => {
          console.log(err);
          this.loadingSignIn = false;
        });
    },
    loadOrderTruckCom() {
      //ออเดอร์ภายในเดือนนี้ สั่งซื้อแล้ว
      this.loadingCompany = true;
      var orderSize = firebaseApp.firestore().collection("orders");
      var formatMonth = moment().startOf("months").format("YYYY-MM HH:mm");
      var formatNextMonth = moment()
        .add(1, "months")
        .startOf("day")
        .startOf("months")
        .format("YYYY-MM HH:mm");
      var toMonth = new Date(formatMonth);
      var nextMonth = new Date(formatNextMonth);
      orderSize
        .where("status", "in", [
          "เตรียมจัดส่ง",
          "อยู่ระหว่างการจัดส่ง",
          "จัดส่งแล้ว",
        ])
        .where("createAt", ">=", toMonth)
        .where("createAt", "<", nextMonth)
        .get()
        .then((querySnapshot) => {
          var items = [];
          querySnapshot.forEach((doc) => {
            var setData = {
              company: doc.data().deliverCompany,
              companyCount: 1,
            };
            items.push(setData);
          });

          var result = items.reduce((unique, o) => {
            if (
              !unique.some((obj) => {
                if (obj.company === o.company) {
                  obj.companyCount = obj.companyCount + o.companyCount;
                  return obj.company === o.company;
                }
              })
            ) {
              unique.push(o);
            }
            return unique;
          }, []);

          var data = [0, 0, 0, 0];
          result.map((ele) => {
            if (ele.company == "KerryExpress") {
              data[0] = data[0] + ele.companyCount;
            } else if (ele.company == "FlashExpress") {
              data[1] = data[1] + ele.companyCount;
            } else if (ele.company == "J&TExpress") {
              data[2] = data[2] + ele.companyCount;
            } else if (ele.company == "ThailandPost") {
              data[3] = data[3] + ele.companyCount;
            }
          });

          this.horizontalBarChart.data.datasets[0].data = data;
          this.loadingCompany = false;
        })
        .catch((err) => {
          console.log(err);
          this.loadingCompany = false;
        });
    },
    topRateProduct() {
      this.loadingTopRate = true;
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
                productID: doc.data().productID,
                ratingShow: parseFloat(this.calStar(total, ratingC)),
              };
              ratingArr.push(ratingData);
            }
          });

          ratingArr.sort(
            (a, b) => parseFloat(a.ratingShow) - parseFloat(b.ratingShow)
          );
          ratingArr.reverse();
          ratingArr[0].ratingShow = ratingArr[0].ratingShow.toString();

          this.topRate = ratingArr[0];
          this.loadingTopRate = false;
        })
        .catch((err) => {
          console.log(err);
          this.loadingTopRate = false;
        });
    },
    calStar(total, ratingCount) {
      return (total / ratingCount).toFixed(1);
    },
    getPercen(partialValue, totalValue) {
      return ((100 * partialValue) / totalValue).toFixed(1);
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(0);
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
    // checkOutDate(date) {
    //   var time = date.toDate();
    //   var formatTimeShow = moment(time).format("DD-MM-YYYY");

    //   var today = moment().format("DD-MM-YYYY");

    //   var dayDiff = moment(formatTimeShow, "DD/MM/YYYY ").diff(
    //     moment(today, "DD/MM/YYYY "),
    //     "days"
    //   );

    //   if (dayDiff <= 0) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },
    // checkDate(date) {
    //   var time = date.toDate();
    //   var formatTimeShow = moment(time).format("DD-MM-YYYY");
    //   var today = moment().format("DD-MM-YYYY");

    //   var dayDiff = moment(formatTimeShow, "DD/MM/YYYY ").diff(
    //     moment(today, "DD/MM/YYYY "),
    //     "days"
    //   );

    //   if (dayDiff > 1 && dayDiff <= 100) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },
    loadLineMessage() {
      this.loadingLineNoti = true;
      const messageLineRef = firebaseApp.firestore().collection("oders");
      messageLineRef
        .orderBy("payon", "desc")
        .limit(1)
        .get()
        .then((querySnapshot) => {
          var item = [];
          querySnapshot.forEach((doc) => {
            item.push(doc.data());
          });

          this.lineMessage = item;
          this.loadingLineNoti = false;
        })
        .catch((err) => {
          console.log(err);
          this.loadingLineNoti = false;
        });
    },
    lineNotifyPage(){
       this.$router.push("lineNotify");
    },
    readMoreComment() {
      this.$router.push("comments");
    },
    inComePage() {
      this.$router.push("income");
    },
    bestProductDetail() {
      this.$router.push("best-sale");
    },
    lastOrder() {
      this.$router.push("last-order");
    },
    logExpress() {
      this.$router.push("best-delivery");
    },
    topRatePage() {
      this.$router.push("top-rate");
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

<style>
.font20 {
  font-size: 20px;
}
.sign-pie {
  margin-top: -40px;
  width: 100%;
  height: 180px;
}
.d-between {
  justify-content: space-between;
}
.font-35 {
  font-size: 35px;
}
.font-24 {
  font-size: 24px;
}
.pro-exp-card {
  padding: 10px;
  display: flex;
  border-radius: 0.5rem;
  background-color: #ffd36b;
}
.pro-out-card {
  padding: 10px;
  display: flex;
  border-radius: 0.5rem;
  background-color: #ffb4ad;
}
.platform-icon svg {
  width: 20px !important;
}
.express-div {
  margin-left: -15px;
}
.text-15{
  font-size: 14px;
}
.border-message{
  border-radius: 0.25rem;
  background-color:#fffdd5;
  padding: 0.75rem;
}
</style>