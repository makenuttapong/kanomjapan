(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-31f58ba3"],{"8c54":function(e,t,a){e.exports=a.p+"img/google-icon.14137f89.svg"},dd7b:function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"auth-wrapper auth-v1 px-2"},[s("div",{staticClass:"auth-inner bg-auth py-2"},[s("b-overlay",{staticClass:"setOverlay",attrs:{show:e.loading,rounded:"sm"}},[s("b-card",{staticClass:"mb-0"},[s("div",{staticClass:"brand-logo text-center"},[s("img",{attrs:{src:a("f12d"),width:"90px"},on:{click:e.goHomePage}})]),s("b-card-title",{staticClass:"mb-1 center"},[e._v(" ยินดีต้อนรับ ")]),s("validation-observer",{ref:"Rules"},[s("b-form",{staticClass:"auth-login-form mt-2",on:{submit:function(t){return t.preventDefault(),e.submit(t)}}},[s("b-form-group",{attrs:{"label-for":"emailValue",label:"อีเมล"}},[s("ValidationProvider",{attrs:{name:"Email",rules:"required|email"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.errors;return[s("b-form-input",{attrs:{id:"input-email",type:"email",placeholder:"กรอกอีเมล",state:!(a.length>0)&&null},model:{value:e.emailVaue,callback:function(t){e.emailVaue=t},expression:"emailVaue"}}),s("small",{staticClass:"text-danger"},[e._v(e._s(a[0]))])]}}])})],1),s("b-form-group",{attrs:{"label-for":"password",label:"รหัสผ่าน"}},[s("ValidationProvider",{attrs:{name:"Password",rules:"required|min:8"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.errors;return[s("b-form-input",{attrs:{id:"input-password",type:"password",placeholder:"กรอกรหัสผ่าน",state:!(a.length>0)&&null},model:{value:e.password,callback:function(t){e.password=t},expression:"password"}}),s("small",{staticClass:"text-danger"},[e._v(e._s(a[0]))])]}}])}),s("div",{staticClass:"forget"},[s("b-link",{attrs:{to:{name:"forget"}}},[s("small",[e._v("ลืมรหัสผ่าน?")])])],1)],1),s("div",{staticClass:"center"},[s("b-button",{attrs:{variant:"primary",type:"submit",block:"",disabled:e.loading}},[s("span",[e._v("เข้าสู่ระบบ")])])],1)],1)],1),s("b-card-text",{staticClass:"text-center mt-2"},[s("span",[e._v("ถ้าคุณยังไม่ได้เป็นสมาชิก ")]),s("b-link",[s("span",{on:{click:e.signUp}},[e._v("สมัครสมาชิก")])])],1),s("div",{staticClass:"divider my-2 center"},[s("div",{staticClass:"divider-text"},[e._v("หรือ เข้าสู่ระบบด้วย")])]),s("div",{staticClass:"center row"},[s("div",{staticClass:"col mb-2"},[s("b-button",{directives:[{name:"ripple",rawName:"v-ripple.400",value:"rgba(113, 102, 240, 0.15)",expression:"'rgba(113, 102, 240, 0.15)'",modifiers:{400:!0}}],attrs:{variant:"outline-primary",block:""},on:{click:e.googleSignIn}},[s("img",{attrs:{src:a("8c54"),width:"18px",rel:"preload"}}),s("span",{staticClass:"ml-2"},[e._v("Google")])])],1),s("div",{staticClass:"col mb-2"},[s("b-button",{directives:[{name:"ripple",rawName:"v-ripple.400",value:"rgba(113, 102, 240, 0.15)",expression:"'rgba(113, 102, 240, 0.15)'",modifiers:{400:!0}}],attrs:{variant:"outline-primary",block:""},on:{click:e.facebookSignIn}},[s("img",{attrs:{src:a("e9ca"),width:"18px",rel:"preload"}}),s("span",{staticClass:"ml-2"},[e._v("Facebook")])])],1)])],1)],1)],1)])},i=[],r=a("28f7"),o=a("ae39"),n=a("e009"),l=a("7bb1"),c=(a("78a7"),function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("SmileIcon")}),u=[],d=a("0a35"),m={components:{SmileIcon:d["q"]}},p=m,g=a("2877"),h=Object(g["a"])(p,c,u,!1,null,null,null),b=h.exports,v={name:"login",data(){return{emailVaue:"",password:"",status:"",required:o["b"],email:o["a"],loading:!1}},components:{ValidationProvider:l["b"],ValidationObserver:l["a"]},directives:{Ripple:n["a"]},methods:{submit(){this.$refs.Rules.validate().then(e=>{e&&(this.loading=!0,r["a"].auth().signInWithEmailAndPassword(this.emailVaue,this.password).then(e=>{const t=e.user.uid;this.loginGetData(t)}).catch(e=>{this.loading=!1,this.error(),console.log(e.message)}))})},signUp(){this.$router.push("/register")},goHomePage(){this.$router.replace("/")},googleSignIn(){this.loading=!0,r["a"].auth().signInWithPopup(r["c"]).then(e=>{var t=e.user.uid,a={name:e.user.displayName,email:e.user.email,image:e.user.photoURL,phone:e.user.phoneNumber?e.user.phoneNumber:"",signinWith:"google",role:"user",createAt:new Date,gender:"",birthdate:"",lineID:"",address:{name:"",phone:"",amphoe:"",district:"",houseNumber:"",province:"",road:"",soy:"",zipcode:""}};const s=r["a"].firestore().collection("users").doc(t);s.get().then(e=>{e.exists?this.loginGetData(t):s.set(a).then(()=>{this.loginGetData(t)})})}).catch(e=>{this.loading=!1,console.log(e)})},facebookSignIn(){this.loading=!0,r["a"].auth().signInWithPopup(r["b"]).then(e=>{var t=e.user.uid,a={name:e.user.displayName,email:e.user.email,image:e.user.photoURL,phone:e.user.phoneNumber?e.user.phoneNumber:"",signinWith:"facebook",role:"user",createAt:new Date,gender:"",birthdate:"",lineID:"",address:{name:"",phone:"",amphoe:"",district:"",houseNumber:"",province:"",road:"",soy:"",zipcode:""}};const s=r["a"].firestore().collection("users").doc(t);s.get().then(e=>{e.exists?this.loginGetData(t):s.set(a).then(()=>{this.loginGetData(t)})})}).catch(e=>{this.loading=!1,console.log(e)})},loginGetData(e){const t=r["a"].firestore().doc("users/"+e);return t.get().then(e=>{this.loading=!1;const t=e.data();var a={name:t.name,role:t.role,image:t.image?t.image:""};this.$store.commit("setUser",a),window.localStorage.setItem("userData",JSON.stringify(a)),"admin"==t.role?(localStorage.setItem("userProfileImage",a.image),this.$router.replace("/admin").then(()=>{this.$toast("ยินดีต้อนรับ "+a.name,{position:"top-right",closeOnClick:!0,hideProgressBar:!0,timeout:3e3,icon:b})})):(localStorage.setItem("userProfileImage",a.image),this.$router.replace("/").then(()=>{this.$toast("ยินดีต้อนรับ "+a.name,{position:"top-right",closeOnClick:!0,hideProgressBar:!0,timeout:3e3,icon:b})}))}).catch(e=>{this.loading=!1,this.error(),console.log(e.message)})},error(){this.$swal({title:"ผิดพลาด!",text:" อีเมลหรือรหัสผ่านไม่ถูกต้อง",icon:"error",confirmButtonText:"ตกลง",width:"500px",customClass:{confirmButton:"btn btn-primary"},buttonsStyling:!1})}}},f=v,w=Object(g["a"])(f,s,i,!1,null,null,null);t["default"]=w.exports},e9ca:function(e,t,a){e.exports=a.p+"img/facebook-icon.1e80416a.svg"},f12d:function(e,t,a){e.exports=a.p+"img/logoW.5b232f51.svg"}}]);
//# sourceMappingURL=chunk-31f58ba3.3f2d93ec.js.map