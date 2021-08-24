(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-01b17619"],{"62c4":function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"auth-wrapper auth-v1 px-2"},[s("div",{staticClass:"auth-inner py-2"},[s("b-overlay",{staticClass:"setOverlay",attrs:{show:t.loading,rounded:"sm"}},[s("b-card",{staticClass:"mb-2"},[s("div",{staticClass:"brand-logo text-center"},[s("img",{attrs:{src:a("f12d"),width:"90px"},on:{click:t.goHomePage}})]),s("b-card-title",{staticClass:"mb-1 center"},[t._v(" สมัครสมาชิก ")]),s("validation-observer",{ref:"Rules"},[s("b-form",{staticClass:"auth-login-form mt-2",on:{submit:function(e){return e.preventDefault(),t.submit(e)}}},[s("b-form-group",{attrs:{"label-for":"name",label:"ชื่อ"}},[s("ValidationProvider",{attrs:{name:"Display Name",rules:"required"},scopedSlots:t._u([{key:"default",fn:function(e){var a=e.errors;return[s("b-form-input",{attrs:{id:"input-name",type:"text",placeholder:"กรอกชื่อ",state:!(a.length>0)&&null},model:{value:t.name,callback:function(e){t.name=e},expression:"name"}}),s("small",{staticClass:"text-danger"},[t._v(t._s(a[0]))])]}}])})],1),s("b-form-group",{attrs:{"label-for":"email",label:"อีเมล"}},[s("ValidationProvider",{attrs:{name:"Email",rules:"required|email"},scopedSlots:t._u([{key:"default",fn:function(e){var a=e.errors;return[s("b-form-input",{attrs:{id:"input-email",type:"email",placeholder:"กรอกอีเมล",state:!(a.length>0)&&null},model:{value:t.emailVaue,callback:function(e){t.emailVaue=e},expression:"emailVaue"}}),s("small",{staticClass:"text-danger"},[t._v(t._s(a[0]))])]}}])})],1),s("b-form-group",{attrs:{"label-for":"password",label:"รหัสผ่าน"}},[s("ValidationProvider",{attrs:{name:"Password",vid:"Password",rules:"required|min:8"},scopedSlots:t._u([{key:"default",fn:function(e){var a=e.errors;return[s("b-form-input",{attrs:{id:"input-password",type:"password",placeholder:"กรอกรหัสผ่าน",state:!(a.length>0)&&null},model:{value:t.password,callback:function(e){t.password=e},expression:"password"}}),s("small",{staticClass:"text-danger"},[t._v(t._s(a[0]))])]}}])})],1),s("b-form-group",{attrs:{"label-for":"password",label:"ยืนยันรหัสผ่าน"}},[s("ValidationProvider",{attrs:{name:"Confirm Password",rules:"required|confirmed:Password"},scopedSlots:t._u([{key:"default",fn:function(e){var a=e.errors;return[s("b-form-input",{attrs:{id:"input-password2",type:"password",placeholder:"กรอกรหัสผ่านอีกครั้ง",state:!(a.length>0)&&null},model:{value:t.password2,callback:function(e){t.password2=e},expression:"password2"}}),s("small",{staticClass:"text-danger"},[t._v(t._s(a[0]))])]}}])})],1),s("b-form-group",[s("b-form-checkbox",{staticClass:"checkPolicy",attrs:{id:"register-privacy-policy",name:"checkbox-1"},model:{value:t.status,callback:function(e){t.status=e},expression:"status"}},[s("span",[t._v("ยอมรับ")]),s("b-link",{on:{click:t.openRule}},[t._v(" ข้อตกลงการใช้งาน")])],1)],1),s("b-button",{attrs:{variant:"primary",block:"",type:"submit",disabled:!t.status||t.loading}},[t._v(" สมัครสมาชิก ")])],1)],1),s("b-card-text",{staticClass:"text-center mt-4"},[s("b-link",{on:{click:t.goToLogin}},[s("ChevronLeftIcon",{attrs:{size:"1.2x"}}),t._v("เข้าสู่ระบบ ")],1)],1)],1)],1)],1),s("b-modal",{attrs:{id:"modal-Rule","hide-footer":"",size:"lg",title:"ข้อตกลงการใช้งาน"}},[t._l(t.policyData,(function(e,a){return s("div",{key:a},[s("div",{staticClass:"bold"},[t._v(t._s(a+1)+". "+t._s(e.name))]),s("div",{staticClass:"pl-3 pr-3 pb-2"},[t._v(t._s(e.detail))])])}))],2)],1)},r=[],o=a("28f7"),i=a("0a35"),l=a("ae39"),n=a("7bb1"),c=(a("78a7"),{name:"login",data(){return{policyData:[],name:"",emailVaue:"",password:"",password2:"",status:!1,required:l["b"],email:l["a"],loading:!1,Showoverlay:!1}},components:{ValidationProvider:n["b"],ValidationObserver:n["a"],ChevronLeftIcon:i["d"]},created(){this.loadPolicy()},methods:{loadPolicy(){const t=o["a"].firestore().doc("policy/0XEEyC4PRY8p3i8bzMph");t.get().then(t=>{this.policyData=t.data().policys}).catch(t=>{console.log(t)})},submit(){this.$refs.Rules.validate().then(t=>{t&&(this.loading=!0,o["a"].auth().createUserWithEmailAndPassword(this.emailVaue,this.password).then(t=>{t.user.updateProfile({displayName:this.name}).then(()=>{var e=t.user.uid;const a=o["a"].firestore().collection("users");return a.doc(e).set({name:this.name,email:this.emailVaue,image:"",phone:"",role:"user",gender:"",birthdate:"",signinWith:"email",lineID:"",address:{name:"",phone:"",amphoe:"",district:"",houseNumber:"",province:"",road:"",soy:"",zipcode:""},createAt:new Date}).then(()=>{this.loading=!1,this.success()})}).catch(t=>{this.loading=!1,this.error(),console.log(t.message)})}).catch(t=>{this.loading=!1,this.error(),console.log(t.message)}))})},goToLogin(){this.$router.replace("/login")},goHomePage(){this.$router.replace("/")},openRule(){this.$bvModal.show("modal-Rule")},error(){this.$swal({title:"ผิดพลาด!",text:" อีเมลนี้ถูกใช้แล้ว",icon:"error",confirmButtonText:"ตกลง",width:"500px",customClass:{confirmButton:"btn btn-primary"},buttonsStyling:!1})},success(){this.$swal({title:"สำเร็จ!",text:" คุณสามารถเข้าสู่ระบบได้แล้วตอนนี้",icon:"success",confirmButtonText:"ตกลง",width:"500px",customClass:{confirmButton:"btn btn-primary"},buttonsStyling:!1}).then(()=>{this.goToLogin()})}}}),d=c,u=a("2877"),m=Object(u["a"])(d,s,r,!1,null,null,null);e["default"]=m.exports},f12d:function(t,e,a){t.exports=a.p+"img/logoW.5b232f51.svg"}}]);
//# sourceMappingURL=chunk-01b17619.39124a42.js.map