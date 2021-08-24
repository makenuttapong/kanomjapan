<template>
  <b-card>
    <div class="d-flex space-between mb-4">
      <h5 class="mb-3"><i class="fas fa-medal" color="#7367f0"/> สินค้าขายดี</h5>
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
      <vcl-twitch width="600px"></vcl-twitch>
    </div>

    <div v-if="!loading">
      <chartjs-component-bar-chart
        v-if="latestBarChart.data.labels.length != 0"
        :height="400"
        :data="latestBarChart.data"
        :options="latestBarChart.options"
      />

      <div class="mt-4 ">
        <div class="mb-2 bold" v-if="bestData.length != 0">
          อันดับสินค้าขายดี
        </div>
        <div class="allData ml-3">
          <div v-if="bestData.length == 0" class="text-center p-4 text-mute">
            ไม่พบรายการสินค้า
          </div>
          <div class="mb-3" v-for="(item, index) in bestData" :key="index">
            <div class="row">
              <div class="d-flex">
                <div class="mr-2 numIndex">{{ index + 1 }}.</div>
                <div>
                  <ExpandableImage :src="item.image" class="sm-image border" />
                </div>
              </div>
              <div class="col ml-3">
                <div>{{ item.name }}</div>
                <div>
                  <span class="productid">{{ item.productID }}</span>
                </div>
                <div>
                  <span class="bold">ยอดขาย : </span
                  ><span class="">{{ item.quantity }} ชิ้น</span>
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
import firebaseApp from "../../firebase/firebase_app";
import moment from "moment";
import ChartjsComponentBarChart from "../../components/barChart.vue";
import "../../assets/scss/style.scss";
import ExpandableImage from "../../components/expandableImage.vue";
import { VclTwitch } from "vue-content-loading";

const chartColors = {
  primaryColorShade: "#836AF9",
  yellowColor: "#ffe800",
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
  name: "BestSale",
  components: {
    ChartjsComponentBarChart,
    ExpandableImage,
    VclTwitch,
  },
  data() {
    return {
      loading: false,
      monthSelect: "",
      bestData: [],
      latestBarChart: {
        data: {
          labels: [],
          fullname : [],
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
            // Updated default tooltip UI
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
                return 'ยอดขาย ' + data["datasets"][0]["data"][tooltipItem["index"]] + ' ชิ้น'
              }
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
    };
  },
  created() {
    this.monthSelect = moment().startOf("months").format("YYYY-MM");
    this.nextMonthSelect = moment(this.monthSelect)
      .add(1, "month")
      .format("YYYY-MM");
    this.loadBestSale();
  },
  methods: {
    loadBestSale() {
      //ออเดอร์ภายในเดือนนี้ สั่งซื้อแล้ว
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
          var fullProductName = []
          this.bestData = result;
       
            for(var k = 0 ; k < 10 ; k++){
            if(result[k]){
              newLabel.push(result[k].productID);
              newValue.push(result[k].quantity);
              fullProductName.push(result[k].name)
            }else{
              newLabel.push('รหัสสินค้า')
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
          this.latestBarChart.data.fullname = fullProductName
          this.latestBarChart.data.datasets[0].data = newValue;
          this.latestBarChart.data.datasets[0].backgroundColor = chartColors.successColorShade;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },
    selectMonth(data) {
      this.monthSelect = data;
      this.nextMonthSelect = moment(data).add(1, "month").format("YYYY-MM");
      this.loadBestSale();
    },
  },
};
</script>

<style >
.numIndex {
  width: 25px;
  display: inline-block;
}
</style>