<template>
  <div>
    <b-row class="match-height">
      <b-col lg="8">
        <b-row>
          <b-col lg="12">
            <b-card class="md-mb-4">
              <div class="d-flex space-between mb-2">
                <h5><i class="fas fa-wallet" color="#7367f0" /> รายได้</h5>
                <div>
                  <b-dropdown
                    v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                    :text="sortBy.text"
                    right
                    variant="outline-primary"
                    class="margin20"
                  >
                    <b-dropdown-item
                      v-for="sortOption in sortByOptions"
                      :key="sortOption.value"
                      @click="changeType(sortOption)"
                    >
                      {{ sortOption.text }}
                    </b-dropdown-item>
                  </b-dropdown>

                  <div class="mx-50 select-month ml-2 mr-2 d-inline-block">
                    <date-picker
                      v-model="monthSelect"
                      valueType="format"
                      type="month"
                      format="YYYY-MM"
                      @change="selectMonth"
                      v-if="sortBy.text == 'รายเดือน'"
                    ></date-picker>
                    <date-picker
                      v-model="yearSelect"
                      valueType="format"
                      type="year"
                      format="YYYY"
                      @change="selectYear"
                      v-if="sortBy.text == 'รายปี'"
                    ></date-picker>
                  </div>
                </div>
              </div>
              <b-row class="match-height">
                <b-col lg="4" md="4" sm="4">
                  <div class="card card-show in">
                    <b-row>
                      <b-col lg="4">
                        <div class="circle-white mb-1">
                          <img
                            :src="require('@/assets/salary.png')"
                            width="30px"
                          />
                        </div>
                      </b-col>
                      <b-col lg="8" class="all-center-price">
                        <div class="text-right font17">รายรับ</div>
                      </b-col>
                    </b-row>
                    <div class="text-right text-priceIncom mt-2">
                      {{ formatPrice(allCashIn) }} THB
                    </div>
                  </div>
                </b-col>
                <b-col lg="4" md="4" sm="4">
                  <div class="card card-show out">
                    <b-row>
                      <b-col lg="4">
                        <div class="circle-white mb-1">
                          <img
                            :src="require('@/assets/pay.png')"
                            width="30px"
                          /></div
                      ></b-col>
                      <b-col lg="8" class="all-center-price">
                        <div class="text-right font17">รายจ่าย</div>
                      </b-col>
                    </b-row>
                    <div class="text-right text-priceIncom mt-2">
                      {{ formatPrice(allCashOut) }} THB
                    </div>
                  </div>
                </b-col>
                <b-col lg="4" md="4" sm="4">
                  <div class="card card-show diff">
                    <b-row>
                      <b-col lg="4">
                        <div class="circle-white mb-1">
                          <img
                            :src="require('@/assets/profits.png')"
                            width="30px"
                          /></div
                      ></b-col>
                      <b-col lg="8" class="all-center-price">
                        <div class="text-right font17">กำไร</div>
                      </b-col>
                    </b-row>
                    <div class="text-right text-priceIncom mt-2">
                      {{ formatPrice(profit) }} THB
                    </div>
                  </div>
                </b-col>
              </b-row>

              <div class="mt-1">
                <div class="d-flex space-between">
                  <h6>
                    <CalendarIcon size="18" class="mr-1 mb-1" />รายได้{{
                      mode == "month" ? "เดือน" : "ปี"
                    }}นี้
                  </h6>
                  <div></div>
                </div>

                <div v-if="loadingAll" class="p-4 row">
                  <vcl-twitch width="600px"></vcl-twitch>
                </div>
                <div v-if="!loadingAll">
                  <vue-apex-charts
                    v-if="this.lineChartSimple.series[0].data != 0"
                    type="line"
                    height="320"
                    :options="lineChartSimple.chartOptions"
                    :series="lineChartSimple.series"
                  />
                </div>
              </div>
            </b-card>
          </b-col>
        </b-row>
      </b-col>
      <b-col lg="4">
        <b-card>
          <div class="d-flex space-between mb-3">
            <span class="mt-1">รายการล่าสุด</span>
            <b-button variant="outline-primary" size="sm" @click="moreIncome"
              >เพิ่มเติม</b-button
            >
          </div>

          <div v-if="loading" class="p-2">
            <vcl-facebook></vcl-facebook>
          </div>

          <div v-if="!loading">
            <div v-if="incomes.length == 0" class="text-center p-4 text-mute">
              ไม่พบรายการ
            </div>
            <div v-for="(item, index) in incomes" :key="index" class="mb-3">
              <div :class="item.status == 'cash-in' ? 'cashIn' : 'cashOut'">
                <b-row>
                  <b-col lg="8" md="8" cols="8">
                    <b-row>
                      <b-col lg="12">
                        <b-avatar
                          :src="item.userProfile.image ? item.userProfile.image : require(`@/assets/userDF.png`)"
                          class="avatar-income"
                        />
                        <span class="ml-1 text-small oneline">{{
                          item.userProfile.role != "admin"
                            ? item.userProfile.name
                            : "ADMIN"
                        }}</span>
                      </b-col>
             
                      <b-col lg="12">
                        <div class="text-small mt-2 mb-1">
                          <span class="bold">orderID : </span>{{ item.orderID }}
                        </div>
                      </b-col>
                      <b-col lg="12">
                        <div class="text-mute date-income">
                          <CalendarIcon size="13" class="mb-1 mr-1" />{{
                            formatDate(item.createAt)
                          }}
                        </div>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col lg="4" md="4" cols="4" class="all-center-price">
                    <div class="price-cash">
                      <span
                        :class="
                          item.status == 'cash-in'
                            ? 'cashIn-price'
                            : 'cashOut-price'
                        "
                        >{{ item.status == "cash-out" ? "-" : "+"
                        }}{{ formatPrice(item.price) }}</span
                      >
                    </div>
                  </b-col>
                </b-row>
              </div>
            </div>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import firebaseApp from "../../firebase/firebase_app";
import "../../assets/scss/style.scss";
import { VclFacebook, VclTwitch } from "vue-content-loading";
import moment from "moment";
import { CalendarIcon } from "vue-feather-icons";
import Ripple from "vue-ripple-directive";
import VueApexCharts from "vue-apexcharts";

export default {
  name: "IncomePage",
  directives: {
    Ripple,
  },
  components: {
    VclFacebook,
    VclTwitch,
    CalendarIcon,
    VueApexCharts,
  },
  data() {
    return {
      loading: false,
      loadingAll: false,
      incomes: [],
      itemcount: 0,
      monthSelect: "",

      mode: "month",
      yearSelect: "",
      allCashIn: 0,
      allCashOut: 0,
      profit: 0,
      sortBy: { text: "รายเดือน", value: "รายเดือน" },
      sortByOptions: [
        { text: "รายเดือน", value: "รายเดือน" },
        { text: "รายปี", value: "รายปี" },
      ],
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
            colors: ["#576dff"],
          },
          colors: ["#576dff"],
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
              } บาท</span></div>`;
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

  created() {
    this.monthSelect = moment().startOf("months").format("YYYY-MM");
    this.nextMonthSelect = moment(this.monthSelect)
      .add(1, "month")
      .format("YYYY-MM");
    this.loadAllIn(this.monthSelect);
    this.loadIncome();
  },
  methods: {
    selectMonth(data) {
      this.monthSelect = data;
      this.loadAllIn(data);
    },
    loadAllIn(mountSelect) {
      this.loadingAll = true;
      this.mode = "month";
      var incomesSize = firebaseApp.firestore().collection("incomes");
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

      incomesSize
        .where("createAt", ">=", firstDayFomat)
        .where("createAt", "<", lastDayFormat)
        .get()
        .then((querySnapshot) => {
          this.itemcount = querySnapshot.size;
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

          var allCashInData = 0;
          var allCashOutData = 0;
          querySnapshot.forEach((doc) => {
            if (doc.data().status == "cash-in") {
              allCashInData = allCashInData + doc.data().price;
              dayArray.forEach((ele, index) => {
                if (this.checkDateYMD(doc.data().createAt) == ele) {
                  totalData[index] = totalData[index] + doc.data().price;
                }
              });
            } else if (doc.data().status == "cash-out") {
              allCashOutData = allCashOutData + doc.data().price;
            }
          });

          this.allCashIn = allCashInData;
          this.allCashOut = allCashOutData;
          this.profit = allCashInData - allCashOutData;
          this.lineChartSimple.series[0].data = totalData;
          this.lineChartSimple.chartOptions.xaxis.categories = [];
          this.loadingAll = false;
        });
    },
    checkDateYMD(date) {
      var time = date.toDate();
      var formatTimeShow = moment(time).format("YYYY-MM-DD 00:00");
      return formatTimeShow;
    },
    loadIncome() {
      this.loading = true;
      const incomRef = firebaseApp
        .firestore()
        .collection("incomes")
        .orderBy("createAt", "desc");
      return incomRef
        .limit(4)
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
              userProfile  : doc.data().userProfile
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
    moreIncome() {
      this.$router.push("income-list");
    },
    changeType(type) {
      this.sortBy = type;
      if (type.value == "รายเดือน") {
        this.monthSelect = moment().startOf("months").format("YYYY-MM");
        this.loadAllIn(this.monthSelect);
      } else {
        this.yearSelect = moment().startOf("months").format("YYYY");
        this.loadAllYear(this.yearSelect);
      }
    },
    selectYear(data) {
      this.yearSelect = data;
      this.loadAllYear(data);
    },
    loadAllYear(year) {
      console.log(year);
      this.loadingAll = true;
      this.mode = "year";
      var incomesSize = firebaseApp.firestore().collection("incomes");
      var start_date_of_year = moment().format(year + "-01 00:00");
      var end_date_of_year = moment(year)
        .add(1, "year")
        .format("YYYY-MM 00:00");
      var monthArray = [];

      while (start_date_of_year <= end_date_of_year) {
        monthArray.push(start_date_of_year);

        start_date_of_year = moment(start_date_of_year)
          .add(1, "month")
          .format("YYYY-MM 00:00");
      }

      var firstMonthFomat = new Date(monthArray[0]);
      var lastMonthFormat = new Date(monthArray[monthArray.length - 1]);

      incomesSize
        .where("createAt", ">=", firstMonthFomat)
        .where("createAt", "<", lastMonthFormat)
        .get()
        .then((querySnapshot) => {
          this.itemcount = querySnapshot.size;
          var totalData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

          var allCashInData = 0;
          var allCashOutData = 0;

          querySnapshot.forEach((doc) => {
            if (doc.data().status == "cash-in") {
              allCashInData = allCashInData + doc.data().price;
              monthArray.forEach((ele, index) => {
                if (this.checkDateYM(doc.data().createAt) == ele) {
                  totalData[index] = totalData[index] + doc.data().price;
                }
              });
            } else if (doc.data().status == "cash-out") {
              allCashOutData = allCashOutData + doc.data().price;
            }
          });

          this.allCashIn = allCashInData;
          this.allCashOut = allCashOutData;
          this.profit = allCashInData - allCashOutData;
          this.lineChartSimple.series[0].data = totalData;
          this.lineChartSimple.chartOptions.xaxis.categories = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "June",
            "July",
            "Aug",
            "Sept",
            "Oct",
            "Nov",
            "Dec",
          ];
          this.loadingAll = false;
        });
    },
    checkDateYM(date) {
      var time = date.toDate();
      var formatTimeShow = moment(time).format("YYYY-MM 00:00");
      return formatTimeShow;
    },
  },
};
</script>

<style>
.card.card-show {
  box-shadow: unset !important;
}
.card-show {
  padding: 0.7rem 1.2rem;
  margin-bottom: 1rem;
  border-radius: 0.25rem;
}
.card-show.in {
  background: #a9fda9;
}
.card-show.out {
  background: #ffbbbb;
}
.card-show.diff {
  background: #c2e1ff;
}
.cashIn {
  border: 1px solid #9cf49c;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  background-color: #f3fff3;
}
.cashIn-price {
  color: #3ecd3e;
}
.cashOut {
  border: 1px solid #f9b8b8;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  background-color: #fff3f3;
}
.cashOut-price {
  color: #ff3939;
}
.price-cash {
  font-size: 18px;
  font-weight: 600;
}

.date-income {
  font-size: 12px;
}
.avatar-income {
  width: 40px;
  height: 40px;
}
.margin20 {
  margin-bottom: 0.2rem;
}
.text-priceIncom {
  font-size: 19px;
  font-weight: 600;
}
.circle-white {
  display: flex;
  background-color: white;
  width: 50px;
  height: 50px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}
.font17 {
  font-size: 17px;
}
</style>