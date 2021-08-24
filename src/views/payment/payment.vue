<template>
  <div>
    <div>
      <PayPal
        :amount="price"
        currency="THB"
        :client="credentials"
        env="sandbox"
        :items="myItems"
        v-on:payment-authorized="paymentAuthorized"
        v-on:payment-completed="paymentCompleted"
        v-on:payment-cancelled="paymentCancelled"
      >
      </PayPal>
    </div>
  </div>
</template>

<script>
import "../../assets/scss/style.scss";
import firebase from "../../firebase/firebase_app";
import PayPal from "vue-paypal-checkout";
export default {
  data() {
    return {
      allOrders: [],
      orderSelect: {},
      price : "",
      idOrder: this.$route.params.orderID,
      credentials: {
        sandbox:
          "ATWGeMNs5F59u9oGOR1Qqgz6wdy7am8Z9Pm_khiGsEMwezyHNXerYMFnQomdFKaAbeA9EMjkygSa-Ci1",
        production:
          "AWRC-ML6HmEf5eNQBNmdqo5WfL3uUP3RepOHCdzEPSuy0qNkgtRyywO_5NXbSZ-MVXV4Rv7ZOz021OyS",
      },
    };
  },
  created() {
    this.loadOrder();
  },
  components: {
    PayPal,
  },
  methods: {
    loadOrder() {
      const data = firebase
        .firestore()
        .doc("orders/" + this.idOrder)
      return data.get().then((doc) => {
          var totalPrice = 0;
          var findPrice = doc.data().items;
          findPrice.forEach((element) => {
            totalPrice = totalPrice + element.price;
          });

          var setData = {
            uid: doc.data().uid,
            orderId: doc.id,
            items: doc.data().items,
            
          };
    this.price =totalPrice.toString()
        this.orderSelect = setData;
      });
    },
    paymentAuthorized: function (data) {
      console.log(data);
    },
    paymentCompleted: function (data) {
      console.log(data);
    },
    paymentCancelled: function (data) {
      console.log(data);
    },
  },
};
</script>
<style scoped>
</style>