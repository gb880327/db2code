<template>
  <Modal v-model="showModal" :width="800" title="数据类型配置" :mask-closable="false">
    <div style="margin:15px;padding-bottom:10px;">
      <div class="ace-editor" ref="ace" style="margin-top:10px;"></div>
      <br />
      <Button type="primary" @click="save" style="width:100%;">保存</Button>
    </div>
    <div slot="footer"></div>
  </Modal>
</template>
<script>
import { dataTypeList } from "@/libs/dataTypeMapping";
import { loadConfig, exists, saveToFile } from "@/libs/util";
import config from "@/libs/config";
import ace from "ace-builds";
import "ace-builds/webpack-resolver"; // 在 webpack 环境中使用必须要导入

export default {
  name: "editMapping",
  data() {
    return {
      showModal: false,
      aceEditor: null,
      themePath: "ace/theme/monokai",
      modePath: "ace/mode/json"
    };
  },
  created() {
    this.$nextTick(() => {
      this.aceEditor = ace.edit(this.$refs.ace, {
        maxLines: 20, // 最大行数，超过会自动出现滚动条
        minLines: 10, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
        fontSize: 14, // 编辑器内字体大小
        theme: this.themePath, // 默认设置的主题
        mode: this.modePath, // 默认设置的语言模式
        tabSize: 4 // 制表符设置为 4 个空格大小
      });
    });
  },
  methods: {
    show() {
      let data;
      if (!exists(config.dataType)) {
        data = dataTypeList;
      } else {
        data = loadConfig(config.dataType);
      }
      data = JSON.stringify(data, null, "\t");
      this.aceEditor.setValue(data, -1);
      this.showModal = true;
    },
    save() {
      let data = this.aceEditor.getValue();
      saveToFile(config.dataType, data, false).then(ret => {
        if (ret) {
          this.$success(this, "保存成功！");
          this.showModal = false;
        }
      });
    }
  }
};
</script>