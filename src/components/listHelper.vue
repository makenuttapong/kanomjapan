<template>
  <b-card v-if="options">
    <div class="d-flex align-items-center mb-4">
      <b-avatar rounded size="42"  class="mr-1" :style="`background-color:` + bgColor[index]">
        <i :class="options.icon" size="20" :color="colors[index]"/>
      </b-avatar>
      <div>
        <h4 class="mb-0 ml-1">
         {{ options.name }}
        </h4>
      </div>
    </div>

    <div>
      <div>{{ options.detail }}</div>
    </div>
  </b-card>
</template>

<script>
export default {
  name: "ListHelper",
  data(){
    return{
      colors:['#ff9233','#6bc9ff','#ff69b7','#24c74b','#7666ff','#fcc214','#fa5074'],
      bgColor:['#fff3e7','#effaff','#ffe6f3','#eaffef','##f1efff','#fff6e7','#ffecf0']
    }
  },
  props: {
    options: {
      type: Object,
      default: () => {},
    },
    index : {
      type : Number
    }
  },
};
</script>
