(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-148fd3b8"],{"24d9":function(t,e,r){},"68ee":function(t,e,r){!function(e,r){t.exports=r()}("undefined"!=typeof self&&self,(function(){return function(t){function e(n){if(r[n])return r[n].exports;var a=r[n]={i:n,l:!1,exports:{}};return t[n].call(a.exports,a,a.exports,e),a.l=!0,a.exports}var r={};return e.m=t,e.c=r,e.d=function(t,r,n){e.o(t,r)||Object.defineProperty(t,r,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(r,"a",r),r},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=11)}([function(t,e){t.exports=function(t,e,r,n,a,i){var s,o=t=t||{},c=typeof t.default;"object"!==c&&"function"!==c||(s=t,o=t.default);var u,l="function"==typeof o?o.options:o;if(e&&(l.render=e.render,l.staticRenderFns=e.staticRenderFns,l._compiled=!0),r&&(l.functional=!0),a&&(l._scopeId=a),i?(u=function(t){t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,t||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),n&&n.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(i)},l._ssrRegister=u):n&&(u=n),u){var d=l.functional,h=d?l.render:l.beforeCreate;d?(l._injectStyles=u,l.render=function(t,e){return u.call(e),h(t,e)}):l.beforeCreate=h?[].concat(h,u):[u]}return{esModule:s,exports:o,options:l}}},function(t,e,r){"use strict";var n=r(2),a=r(12),i=r(0),s=i(n.a,a.a,!1,null,null,null);e.a=s.exports},function(t,e,r){"use strict";var n=function(t){return/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(t)};e.a={name:"VueContentLoading",props:{rtl:{default:!1,type:Boolean},speed:{default:2,type:Number},width:{default:400,type:Number},height:{default:130,type:Number},primary:{type:String,default:"#f0f0f0",validator:n},secondary:{type:String,default:"#e0e0e0",validator:n}},computed:{viewbox:function(){return"0 0 "+this.width+" "+this.height},formatedSpeed:function(){return this.speed+"s"},gradientId:function(){return"gradient-"+this._uid},clipPathId:function(){return"clipPath-"+this._uid},svg:function(){if(this.rtl)return{transform:"rotateY(180deg)"}},rect:function(){return{style:{fill:"url(#"+this.gradientId+")"},clipPath:"url(#"+this.clipPathId+")"}}}}},function(t,e,r){"use strict";var n=r(1);e.a={components:{VueContentLoading:n.a}}},function(t,e,r){"use strict";var n=r(1);e.a={components:{VueContentLoading:n.a}}},function(t,e,r){"use strict";var n=r(1);e.a={components:{VueContentLoading:n.a}}},function(t,e,r){"use strict";var n=r(1);e.a={components:{VueContentLoading:n.a}}},function(t,e,r){"use strict";var n=r(1);e.a={components:{VueContentLoading:n.a}}},function(t,e,r){"use strict";var n=r(1);e.a={components:{VueContentLoading:n.a},props:{rows:{default:5,type:Number}},computed:{height:function(){return 21*this.rows}},methods:{getYPos:function(t,e){return e+22*(t-1)}}}},function(t,e,r){"use strict";var n=r(1);e.a={components:{VueContentLoading:n.a},props:{header:{default:!0,type:Boolean},rows:{default:5,type:Number},columns:{default:4,type:Number}},computed:{height:function(){return 30*this.rows-20},width:function(){return 20*(this.columns-1)+10+100*this.columns}},methods:{getXPos:function(t){return 5+100*(t-1)+20*(t-1)},getYPos:function(t){return 30*(t-1)}}}},,function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=r(1),a=r(13),i=r(15),s=r(17),o=r(19),c=r(21),u=r(23),l=r(25);r.d(e,"VclCode",(function(){return a.a})),r.d(e,"VclList",(function(){return i.a})),r.d(e,"VclTwitch",(function(){return s.a})),r.d(e,"VclFacebook",(function(){return o.a})),r.d(e,"VclInstagram",(function(){return c.a})),r.d(e,"VclBulletList",(function(){return u.a})),r.d(e,"VclTable",(function(){return l.a})),r.d(e,"VueContentLoading",(function(){return n.a})),e.default=n.a},function(t,e,r){"use strict";var n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("svg",{style:t.svg,attrs:{viewBox:t.viewbox,preserveAspectRatio:"xMidYMid meet"}},[r("rect",{style:t.rect.style,attrs:{"clip-path":t.rect.clipPath,x:"0",y:"0",width:t.width,height:t.height}}),t._v(" "),r("defs",[r("clipPath",{attrs:{id:t.clipPathId}},[t._t("default",[r("rect",{attrs:{x:"0",y:"0",rx:"5",ry:"5",width:"70",height:"70"}}),t._v(" "),r("rect",{attrs:{x:"80",y:"17",rx:"4",ry:"4",width:"300",height:"13"}}),t._v(" "),r("rect",{attrs:{x:"80",y:"40",rx:"3",ry:"3",width:"250",height:"10"}}),t._v(" "),r("rect",{attrs:{x:"0",y:"80",rx:"3",ry:"3",width:"350",height:"10"}}),t._v(" "),r("rect",{attrs:{x:"0",y:"100",rx:"3",ry:"3",width:"400",height:"10"}}),t._v(" "),r("rect",{attrs:{x:"0",y:"120",rx:"3",ry:"3",width:"360",height:"10"}})])],2),t._v(" "),r("linearGradient",{attrs:{id:t.gradientId}},[r("stop",{attrs:{offset:"0%","stop-color":t.primary}},[r("animate",{attrs:{attributeName:"offset",values:"-2; 1",dur:t.formatedSpeed,repeatCount:"indefinite"}})]),t._v(" "),r("stop",{attrs:{offset:"50%","stop-color":t.secondary}},[r("animate",{attrs:{attributeName:"offset",values:"-1.5; 1.5",dur:t.formatedSpeed,repeatCount:"indefinite"}})]),t._v(" "),r("stop",{attrs:{offset:"100%","stop-color":t.primary}},[r("animate",{attrs:{attributeName:"offset",values:"-1; 2",dur:t.formatedSpeed,repeatCount:"indefinite"}})])],1)],1)])},a=[],i={render:n,staticRenderFns:a};e.a=i},function(t,e,r){"use strict";var n=r(3),a=r(14),i=r(0),s=i(n.a,a.a,!1,null,null,null);e.a=s.exports},function(t,e,r){"use strict";var n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("vue-content-loading",t._b({attrs:{width:300,height:80}},"vue-content-loading",t.$attrs,!1),[r("rect",{attrs:{x:"0",y:"0",rx:"3",ry:"3",width:"70",height:"10"}}),t._v(" "),r("rect",{attrs:{x:"80",y:"0",rx:"3",ry:"3",width:"100",height:"10"}}),t._v(" "),r("rect",{attrs:{x:"190",y:"0",rx:"3",ry:"3",width:"10",height:"10"}}),t._v(" "),r("rect",{attrs:{x:"15",y:"20",rx:"3",ry:"3",width:"130",height:"10"}}),t._v(" "),r("rect",{attrs:{x:"155",y:"20",rx:"3",ry:"3",width:"130",height:"10"}}),t._v(" "),r("rect",{attrs:{x:"15",y:"40",rx:"3",ry:"3",width:"90",height:"10"}}),t._v(" "),r("rect",{attrs:{x:"115",y:"40",rx:"3",ry:"3",width:"60",height:"10"}}),t._v(" "),r("rect",{attrs:{x:"185",y:"40",rx:"3",ry:"3",width:"60",height:"10"}}),t._v(" "),r("rect",{attrs:{x:"0",y:"60",rx:"3",ry:"3",width:"30",height:"10"}})])},a=[],i={render:n,staticRenderFns:a};e.a=i},function(t,e,r){"use strict";var n=r(4),a=r(16),i=r(0),s=i(n.a,a.a,!1,null,null,null);e.a=s.exports},function(t,e,r){"use strict";var n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("vue-content-loading",t._b({attrs:{width:300,height:120}},"vue-content-loading",t.$attrs,!1),[r("rect",{attrs:{x:"0",y:"0",rx:"3",ry:"3",width:"250",height:"10"}}),t._v(" "),r("rect",{attrs:{x:"20",y:"20",rx:"3",ry:"3",width:"220",height:"10"}}),t._v(" "),r("rect",{attrs:{x:"20",y:"40",rx:"3",ry:"3",width:"170",height:"10"}}),t._v(" "),r("rect",{attrs:{x:"0",y:"60",rx:"3",ry:"3",width:"250",height:"10"}}),t._v(" "),r("rect",{attrs:{x:"20",y:"80",rx:"3",ry:"3",width:"200",height:"10"}}),t._v(" "),r("rect",{attrs:{x:"20",y:"100",rx:"3",ry:"3",width:"80",height:"10"}})])},a=[],i={render:n,staticRenderFns:a};e.a=i},function(t,e,r){"use strict";var n=r(5),a=r(18),i=r(0),s=i(n.a,a.a,!1,null,null,null);e.a=s.exports},function(t,e,r){"use strict";var n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("vue-content-loading",t._b({attrs:{width:300,height:225}},"vue-content-loading",t.$attrs,!1),[r("rect",{attrs:{x:"0",y:"0",rx:"3",ry:"3",width:"300",height:"170"}}),t._v(" "),r("rect",{attrs:{x:"0",y:"180",rx:"2",ry:"2",width:"35",height:"45"}}),t._v(" "),r("rect",{attrs:{x:"45",y:"180",rx:"2",ry:"2",width:"150",height:"15"}}),t._v(" "),r("rect",{attrs:{x:"45",y:"203",rx:"2",ry:"2",width:"100",height:"10"}})])},a=[],i={render:n,staticRenderFns:a};e.a=i},function(t,e,r){"use strict";var n=r(6),a=r(20),i=r(0),s=i(n.a,a.a,!1,null,null,null);e.a=s.exports},function(t,e,r){"use strict";var n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("vue-content-loading",t._b({},"vue-content-loading",t.$attrs,!1),[r("rect",{attrs:{x:"0",y:"0",rx:"5",ry:"5",width:"70",height:"70"}}),t._v(" "),r("rect",{attrs:{x:"80",y:"17",rx:"4",ry:"4",width:"300",height:"13"}}),t._v(" "),r("rect",{attrs:{x:"80",y:"40",rx:"3",ry:"3",width:"250",height:"10"}}),t._v(" "),r("rect",{attrs:{x:"0",y:"80",rx:"3",ry:"3",width:"350",height:"10"}}),t._v(" "),r("rect",{attrs:{x:"0",y:"100",rx:"3",ry:"3",width:"400",height:"10"}}),t._v(" "),r("rect",{attrs:{x:"0",y:"120",rx:"3",ry:"3",width:"360",height:"10"}})])},a=[],i={render:n,staticRenderFns:a};e.a=i},function(t,e,r){"use strict";var n=r(7),a=r(22),i=r(0),s=i(n.a,a.a,!1,null,null,null);e.a=s.exports},function(t,e,r){"use strict";var n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("vue-content-loading",t._b({attrs:{height:480}},"vue-content-loading",t.$attrs,!1),[r("circle",{attrs:{cx:"30",cy:"30",r:"30"}}),t._v(" "),r("rect",{attrs:{x:"75",y:"13",rx:"4",ry:"4",width:"100",height:"13"}}),t._v(" "),r("rect",{attrs:{x:"75",y:"37",rx:"4",ry:"4",width:"50",height:"8"}}),t._v(" "),r("rect",{attrs:{x:"0",y:"70",rx:"5",ry:"5",width:"400",height:"400"}})])},a=[],i={render:n,staticRenderFns:a};e.a=i},function(t,e,r){"use strict";var n=r(8),a=r(24),i=r(0),s=i(n.a,a.a,!1,null,null,null);e.a=s.exports},function(t,e,r){"use strict";var n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("vue-content-loading",t._b({attrs:{width:230,height:t.height}},"vue-content-loading",t.$attrs,!1),[t._l(t.rows,(function(e){return[r("circle",{key:e+"_c",attrs:{cx:"8",cy:t.getYPos(e,8),r:"8"}}),t._v(" "),r("rect",{key:e+"_r",attrs:{x:"22",y:t.getYPos(e,3),rx:"3",ry:"3",width:"200",height:"9"}})]}))],2)},a=[],i={render:n,staticRenderFns:a};e.a=i},function(t,e,r){"use strict";var n=r(9),a=r(26),i=r(0),s=i(n.a,a.a,!1,null,null,null);e.a=s.exports},function(t,e,r){"use strict";var n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("vue-content-loading",t._b({attrs:{width:t.width,height:t.height}},"vue-content-loading",t.$attrs,!1),[t._l(t.rows,(function(e){return[t._l(t.columns,(function(n){return[r("rect",{key:e+"_"+n,attrs:{x:t.getXPos(n),y:t.getYPos(e),rx:"3",ry:"3",width:100,height:"10"}})]})),t._v(" "),e<t.rows?r("rect",{key:e+"_l",attrs:{x:"0",y:t.getYPos(e)+20,width:t.width,height:"1"}}):t._e()]}))],2)},a=[],i={render:n,staticRenderFns:a};e.a=i}])}))},"7a4f":function(t,e,r){"use strict";var n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"expandable-image",class:{expanded:t.expanded},on:{click:function(e){t.expanded=!0}}},[t.expanded?r("i",{staticClass:"close-button",on:{click:function(e){t.expanded=!1}}},[r("svg",{staticStyle:{width:"24px",height:"24px"},attrs:{viewBox:"0 0 24 24"}},[r("path",{attrs:{fill:"#666666",d:"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}})])]):r("i",{staticClass:"expand-button"},[r("svg",{staticStyle:{width:"24px",height:"24px"},attrs:{viewBox:"0 0 24 24"}},[r("path",{attrs:{fill:"#000000",d:"M10,21V19H6.41L10.91,14.5L9.5,13.09L5,17.59V14H3V21H10M14.5,10.91L19,6.41V10H21V3H14V5H17.59L13.09,9.5L14.5,10.91Z"}})])]),r("img",t._b({},"img",t.$attrs,!1))])},a=[],i={inheritAttrs:!1,name:"ExpandableImage",data(){return{expanded:!1}},methods:{closeImage(t){this.expanded=!1,t.stopPropagation()},freezeVp(t){t.preventDefault()}},watch:{expanded(t){this.$nextTick(()=>{t?(this.cloned=this.$el.cloneNode(!0),this.closeButtonRef=this.cloned.querySelector(".close-button"),this.closeButtonRef.addEventListener("click",this.closeImage),document.body.appendChild(this.cloned),document.body.style.overflow="hidden",setTimeout(()=>{this.cloned.style.opacity=1},0)):(this.cloned.style.opacity=0,setTimeout(()=>{this.closeButtonRef.removeEventListener("click",this.closeImage),this.cloned.remove(),this.cloned=null,this.closeButtonRef=null,document.body.style.overflow="auto"},250))})}}},s=i,o=(r("8b40"),r("2877")),c=Object(o["a"])(s,n,a,!1,null,null,null);e["a"]=c.exports},"8b40":function(t,e,r){"use strict";r("24d9")},edb5:function(t,e,r){"use strict";r.r(e);var n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("b-card",[r("h5",{staticClass:"mb-3"},[r("i",{staticClass:"fas fa-star",attrs:{color:"#7367f0"}}),t._v(" สินค้าที่มีคะแนนมากสุด ")]),t.loading?r("div",{staticClass:"p-4 row"},[r("vcl-facebook")],1):t._e(),t.loading?t._e():r("div",[0!=t.topRate.length?r("div",{staticClass:"mt-4"},t._l(t.topRate,(function(e,n){return r("div",{key:n,staticClass:"row mb-3"},[r("div",{staticClass:"ml-4"},[r("div",{staticClass:"d-flex justify-content-center"},[r("span",{staticClass:"mr-3"},[t._v(t._s(n+1)+".")]),r("ExpandableImage",{staticClass:"md-image border",attrs:{src:e.image}})],1)]),r("div",{staticClass:"col"},[r("div",[t._v(t._s(e.name))]),r("div",{staticClass:"productid"},[t._v(t._s(e.productID))]),r("div",{staticClass:"star"},[r("ul",{staticClass:"unstyled-list list-inline"},[t._l(5,(function(t){return r("li",{key:t,staticClass:"ratings-list-item mr-25"},[r("i",{staticClass:"fa fa-star",class:[{"fill-current":t<=e.ratingShow},t<=e.ratingShow?"text-warning":"text-muted"]})])})),r("span",{staticClass:"ml-2 mt-1 text-small"},[t._v(t._s(e.ratingShow)+"/5")])],2)])])])})),0):t._e()])])},a=[],i=r("28f7"),s=r("7a4f"),o=(r("78a7"),r("68ee")),c={name:"TopRate",data(){return{loading:!1,topRate:[]}},components:{ExpandableImage:s["a"],VclFacebook:o["VclFacebook"]},created(){this.topRateProduct()},methods:{topRateProduct(){this.loading=!0;const t=i["a"].firestore().collection("products");t.orderBy("rating","desc").get().then(t=>{var e=[];t.forEach(t=>{var r=t.data().rating,n=t.data().ratingCount;if(0!=r){var a={image:t.data().image,name:t.data().name,productID:t.data().productID,ratingShow:parseFloat(this.calStar(r,n))};e.push(a)}}),e.sort((t,e)=>parseFloat(t.ratingShow)-parseFloat(e.ratingShow)),e.reverse();var r=10,n=e.slice(0,r).map(t=>t);n.filter(t=>t.ratingShow=t.ratingShow.toString()),this.topRate=n,this.loading=!1})},calStar(t,e){return(t/e).toFixed(1)}}},u=c,l=r("2877"),d=Object(l["a"])(u,n,a,!1,null,null,null);e["default"]=d.exports}}]);
//# sourceMappingURL=chunk-148fd3b8.10618488.js.map