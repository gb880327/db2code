<template>
  <div>
    <span class="labelName" v-if="showLabel">系统配置保存路径：</span>
    <Input v-model="dataPath" :readonly="true">
      <Button type="primary" slot="append" @click="selectPath">选择</Button>
    </Input>
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
