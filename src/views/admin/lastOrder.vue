<template>
  <b-card>
    <div class="d-flex space-between mb-2">
      <h5 class="mb-3">
        <i class="fas fa-inbox" color="#7367f0" /> ออเดอร์ที่ได้รับ 
        {{ mode == "month" ? "(เดือน" : "(ปี" }}นี้)
      </h5>
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
    <div v-if="loading" class="p-4 row">
      <vcl-twitch width="600px"></vcl-twitch>
    </div>
    <div v-if="!loading">
      <div class="text-small pl-4 ml-2">
        <b>ทั้งหมด : </b>{{ itemcount }} รายการ
      </div>
      <vue-apex-charts
        v-if="this.lineChartSimple.series[0].data != 0"
        type="line"
        height="400"
        :options="lineChartSimple.chartOptions"
        :series="lineChartSimple.series"
      />
    </div>
  </b-card>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import firebaseApp from "../../firebase/firebase_app";
import moment from "moment";
import "../../assets/scss/style.scss";
import { VclTwitch } from "vue-content-loading";
import Ripple from "vue-ripple-directive";

export default {
  name: "LastOrder",
  components: {
    VueApexCharts,
    VclTwitch,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      loading: false,
      itemcount: 0,
      monthSelect: "",
      yearSelect: "",
      mode: "month",
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
  created() {
    this.monthSelect = moment().startOf("months").format("YYYY-MM");
    this.loadOrderMonth(this.monthSelect);
  },
  methods: {
    selectMonth(data) {
      this.monthSelect = data;
      this.loadOrderMonth(data);
    },
    loadOrderMonth(mountSelect) {
      this.loading = true;
       this.mode = "month";
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

          querySnapshot.forEach((doc) => {
            dayArray.forEach((ele, index) => {
              if (this.checkDateYMD(doc.data().createAt) == ele) {
                totalData[index] = totalData[index] + 1;
              }
            });
          });

          this.lineChartSimple.series[0].data = totalData;
           this.lineChartSimple.chartOptions.xaxis.categories = [];
          this.loading = false;
        });
    },
    checkDateYMD(date) {
      var time = date.toDate();
      var formatTimeShow = moment(time).format("YYYY-MM-DD 00:00");
      return formatTimeShow;
    },
    changeType(type) {
      this.sortBy = type;
      if (type.value == "รายเดือน") {
        this.monthSelect = moment().startOf("months").format("YYYY-MM");
        this.loadOrderMonth(this.monthSelect);
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
      this.loading = true;
      this.mode = "year";
      var incomesSize = firebaseApp.firestore().collection("orders");
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
          querySnapshot.forEach((doc) => {
          
              monthArray.forEach((ele, index) => {
                if (this.checkDateYM(doc.data().createAt) == ele) {
                  totalData[index] = totalData[index] + 1;
                }
              });

          });
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
          this.loading = false;
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