<template>
  <b-card>
    <div class="d-flex space-between mb-2">
      <h5 class="mb-3">
        <i class="fas fa-truck" color="#7367f0" /> ตัวเลือกบริษัทขนส่ง
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
    <div v-if="loading" class="p-4 row">
      <vcl-list width="600px"></vcl-list>
    </div>
    <div v-if="!loading">
      <div class="express-div ex-pad">
        <chartjs-component-horizontal-bar-chart
          v-if="horizontalBarChart.data.datasets[0].data.length != 0"
          :height="300"
          :data="horizontalBarChart.data"
          :options="horizontalBarChart.options"
        />
      </div>

      <div class="mt-4 pl-4 pr-4">
        <div class="mb-2 bold" v-if="bestDelivery.length != 0">
          อันดับบริษัทขนส่ง
        </div>
        <div class="allData ml-3">
          <div
            v-if="bestDelivery.length == 0"
            class="text-center p-4 text-mute"
          >
            ไม่พบรายการ
          </div>
          <div class="mb-3" v-for="(item, index) in bestDelivery" :key="index">
            <div class="row">
              <div class="d-flex">
                <div class="mr-2 numIndex">{{ index + 1 }}.</div>
                <div>
                  <img src="https://cms-tpq.theparq.com/wp-content/uploads/2020/07/Kerry-ORG-logo.png" class="sm-image border" v-if="item.company == 'KerryExpress'"/>
                  <img src="https://www.jobbkk.com/upload/employer/06/8D6/02B8D6/images/178390.jpg" class="sm-image border" v-if="item.company == 'FlashExpress'"/>
                  <img src="https://pbs.twimg.com/profile_images/1084741051141648384/7ay51YTQ.jpg" class="sm-image border" v-if="item.company == 'J&TExpress'"/>
                  <img src="https://static.thairath.co.th/media/dFQROr7oWzulq5FZUEwvPil4I1YxlMLE0xadqgV7lyEbUhb6tSbx0jW7xbv3O2oYWUU.jpg" class="sm-image border" v-if="item.company == 'ThailandPost'"/>
                </div>
              </div>
              <div class="col ml-3">
                   <div>{{ item.company }}</div>
                   
                <div>
                  <span class="bold">จำนวนที่เลือก : </span
                  ><span class="">{{ item.companyCount }} ครั้ง</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-card>
</template>

<script>
import ChartjsComponentHorizontalBarChart from "../../components/barHchart";
import firebaseApp from "../../firebase/firebase_app";
import moment from "moment";
import "../../assets/scss/style.scss";
import { VclList } from "vue-content-loading";

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
  name: "ExpressDelivery",

  components: {
    ChartjsComponentHorizontalBarChart,
    VclList,
  },
  data() {
    return {
      loading: false,
      thisMonth: "",
      monthSelect: "",
      bestDelivery: [],
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
  created() {
    this.monthSelect = moment().startOf("months").format("YYYY-MM");
    this.nextMonthSelect = moment(this.monthSelect)
      .add(1, "month")
      .format("YYYY-MM");
    this.loadOrderTruckCom();
  },
  methods: {
    selectMonth(data) {
      this.monthSelect = data;
      this.nextMonthSelect = moment(data).add(1, "month").format("YYYY-MM");
      this.loadOrderTruckCom();
    },
    loadOrderTruckCom() {
      this.loading = true;
      var orderSize = firebaseApp.firestore().collection("orders");
      var toMonth = new Date(this.monthSelect + " 00:00");
      var nextMonth = new Date(this.nextMonthSelect + " 00:00");

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
          result.sort(
            (a, b) => parseFloat(a.companyCount) - parseFloat(b.companyCount)
          );
          result.reverse();
          this.bestDelivery = result;
          this.horizontalBarChart.data.datasets[0].data = data;
          this.loading = false;
        });
    },
  },
};
</script>

<style>
.express-div {
  margin-left: -15px;
  
}
.ex-pad{
padding: 0rem 2rem;
}

</style>