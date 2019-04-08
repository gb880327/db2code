<template>
  <div>
    <span v-if="showLabel" style="line-height: 32px;">{{title}}：</span>
    <Input v-model="dataPath" class="chooseInput"></Input>
    <Button class="chooseBtn" type="text" @click="selectPath">选择...</Button>
  </div>
</template>
<script>
const { dialog } = require("electron").remote;

export default {
  name: "PathChoose",
  props: {
    value: {
      type: String,
      default: ""
    },
    showLabel:{
        type: Boolean,
        default: true
    },
    title: {
      type: String,
      default: "系统配置保存路径"
    }
  },
  data() {
    return {
      dataPath: this.value
    };
  },
  mounted(){
      this.$watch("value",(n,o)=>{
          this.dataPath = n;
      });
  },
  model: {
    prop: "value",
    event: "update"
  },
  methods: {
    selectPath() {
      let path = dialog.showOpenDialog({ properties: ["openDirectory"] });
      if (path && path.length > 0) {
        this.dataPath = path[0];
        this.$emit("update", this.dataPath);
        this.$emit("change", this.dataPath);
      }
    }
  }
};
</script>
<style scoped>
.chooseInput{
  width: 300px;
}
.chooseBtn:focus{
  box-shadow: none;
}
</style>
