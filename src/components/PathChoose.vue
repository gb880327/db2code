<template>
  <div>
    <span
      v-if="showLabel"
      :style="{lineHeigh:32+'px', width:labelWidth==0?'auto':labelWidth+'px', display:'inline-block', textAlign: 'right'}"
    >{{title}}：</span>
    <Input
      v-model="dataPath"
      class="chooseInput"
      :style="{width: width+'px'}"
      @on-change="changeHanlder"
      :readonly="readonly"
    ></Input>
    <Button class="chooseBtn" type="text" @click="selectPath">选择...</Button>
  </div>
</template>
<script>
const { dialog } = require("electron").remote;

export default {
  name: "PathChoose",
  props: {
    width: {
      type: Number,
      default: 200
    },
    labelWidth: {
      type: Number,
      default: 0
    },
    value: {
      type: String,
      default: ""
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: "系统配置保存路径"
    },
    file: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dataPath: this.value
    };
  },
  mounted() {
    this.$watch("value", (n, o) => {
      this.dataPath = n;
    });
  },
  model: {
    prop: "value",
    event: "update"
  },
  methods: {
    changeHanlder(event) {
      this.$emit("update", this.dataPath);
      this.$emit("change", this.dataPath);
    },
    selectPath() {
      let path = dialog.showOpenDialog({
        properties: [this.file ? "openFile" : "openDirectory"]
      });
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
.chooseInput {
  width: 300px;
}
.chooseBtn:focus {
  box-shadow: none;
}
</style>
