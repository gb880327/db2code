<template>
  <div :style="{height: getHeight+'px'}">
    <div class="left">
      <left ref="leftTree"></left>
    </div>
    <div class="right">
      <div>
        <span>分类：</span>
        <Select v-model="group" style="width:160px">
          <Option v-for="item in templateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
        <a class="add-group" href="javascript:void(0);" @click="$refs.type.show()">新增分类</a>&nbsp;
        <span>模板名称：</span>
        <Input v-model="name" placeholder="请输入模板名称..." style="width: 198px" />&nbsp;&nbsp;
        <Button type="primary" class="btn" @click="save">保存</Button>

        <a href="https://ejs.co/#docs" target="_blank">
          <Icon
            type="ios-help-circle-outline"
            size="24"
            style="margin-left:5px;cursor: pointer;color: #2d8cf0;"
          />
        </a>&nbsp;&nbsp;
        <helpTips></helpTips>
        &nbsp;&nbsp;
        <a href="javascript:void(0);" @click="importDemo">导入模板示例代码</a>
      </div>
      <div class="ace-editor" ref="ace" style="margin-top:10px;"></div>
    </div>
    <type ref="type" @success="onsuccess"></type>
  </div>
</template>
<script>
import left from "./left";
import helpTips from "@/components/HelpTips";
import config from "@/libs/config";
import ace from "ace-builds";
import "ace-builds/webpack-resolver"; // 在 webpack 环境中使用必须要导入
import type from "./type";
import Service from "@/libs/service";
const path = require("path");

export default {
  components: {
    left,
    type,
    helpTips
  },
  data() {
    return {
      service: new Service(),
      current: {
        id: "",
        name: "",
        group: "",
        fileName: ""
      },
      name: "",
      group: "",
      modal: false,
      aceEditor: null,
      themePath: "ace/theme/monokai",
      modePath: "ace/mode/java",
      height: 0,
      templateList: []
    };
  },
  created() {
    this.$nextTick(() => {
      this.onsuccess();
      this.height = this.$parent.$el.clientHeight;
      this.aceEditor = ace.edit(this.$refs.ace, {
        maxLines: 30, // 最大行数，超过会自动出现滚动条
        minLines: 30, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
        fontSize: 14, // 编辑器内字体大小
        theme: this.themePath, // 默认设置的主题
        mode: this.modePath, // 默认设置的语言模式
        tabSize: 4 // 制表符设置为 4 个空格大小
      });
    });
  },
  computed: {
    getHeight() {
      return this.height;
    }
  },
  methods: {
    save() {
      if (this.group == "") {
        this.$error("请填选择分类！");
        return;
      }
      if (this.name === "") {
        this.$error("请填写模板名称！");
        return;
      }
      if (this.aceEditor.getValue() === "") {
        this.$error("请填写模板内容！");
        return;
      }
      let id = this.current.id;
      if (this.current.id == "") {
        id = this.$genId();
      }
      this.service
        .saveTemplate(
          id.replace(/-/g, ""),
          this.aceEditor.getValue()
        )
        .then(data => {
          if (data) {
            let index = this.templateList.findIndex(it => it.id === this.group);
            if (this.current.id == "") {
              this.templateList[index].template.push({
                id: id,
                name: this.name,
                fileName: id.replace(/-/g, "")
              });
            } else {
              let oIndex = this.templateList.findIndex(
                it => it.id === this.current.group
              );
              let oTemp = this.templateList[oIndex].template.findIndex(
                it => it.id === this.current.id
              );
              let item = this.templateList[oIndex].template[oTemp];
              this.templateList[oIndex].template.splice(oTemp, 1);
              item["name"] = this.name;
              this.templateList[index].template.push(item);
            }
            this.$saveData(this.$TEMPLATE, this.templateList);
            this.$success("保存成功！");
            this.onsuccess();
            this.clean();
          } else {
            this.$error("保存失败！");
          }
        });
    },
    onsuccess() {
      this.templateList = this.$getDataForObj(this.$TEMPLATE);
      this.templateList = this.templateList == null ? [] : this.templateList;
      this.$refs.leftTree.load();
    },
    importDemo(){
      let isDevelopment = process.env.NODE_ENV !== 'production';
      let url = isDevelopment ? "build/template/" : path.resolve(__dirname, '..') + "/template/";
      this.$readForFile(url + 'template.ejs').then((data)=>{
        if(data){
          this.aceEditor.setValue(data, -1);
        }
      });
    },
    clean() {
      this.current = { id: "", name: "", group: "", path: "" };
      this.group = "";
      this.name = "";
      this.aceEditor.setValue("", -1);
    },
    edit(data) {
      this.current = data;
      this.name = data.name;
      this.group = data.group;
      this.service.readTemplate(data.fileName).then(data=>{
        if(data){
          this.aceEditor.setValue(data, -1);
        }
      });
    }
  }
};
</script>
<style scoped>
.left {
  height: 100%;
  padding: 0 10px;
  display: inline-block;
  border-right: 1px solid #dcdee2;
  width: 240px;
}
.right {
  width: calc(100% - 260px);
  display: inline-block;
  margin: 10px 10px;
  vertical-align: top;
  height: 100%;
  overflow-y: scroll;
}
.add-group {
  margin: 0 5px;
}
</style>
