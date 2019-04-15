<template>
  <div :style="{height: getHeight+'px'}">
    <div class="moduleTitle">模板管理</div>
    <Split v-model="split" :style="{height: getHeight+'px'}">
      <div slot="left" class="split-left">
        <div class="left-opt">
          <Button type="text" style="width:100%;font-weight: bold;" @click="addItem">新增</Button>
        </div>
        <div class="left-list" :style="{height: (getHeight - 38)+'px'}">
          <ul class="itemList">
            <li v-for="item in templateList" :key="item.name" :id="item.name" @click="itemClick(item)">
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div slot="right" class="pane split-right" :style="{height:getHeight+'px'}">
        <div class="row">
          <span class="labelName">模板名称：</span>
          <Input v-model="name" placeholder="请输入模板名称..." style="width: 198px"/>&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" class="btn" @click="save">保存</Button>
          <Button type="error" class="btn" v-if="showDelete" @click="delItem">删除</Button>
          <a href="https://ejs.co/#docs" target="_blank">
          <Icon type="ios-help-circle-outline" size="24" style="margin-left:5px;cursor: pointer;color: #2d8cf0;" />
          </a>
        </div>
        <div class="ace-editor" ref="ace"></div>
      </div>
    </Split>
  </div>
</template>
<script>
import config from "@/libs/config";
import ace from "ace-builds";
import "ace-builds/webpack-resolver"; // 在 webpack 环境中使用必须要导入
import Service from "@/libs/service";

export default {
  data() {
    return {
      service: new Service(),
      aceEditor: null,
      themePath: "ace/theme/monokai",
      modePath: "ace/mode/java",
      split: 0.2,
      height: 0,
      templateList: [],
      current: {},
      name: ""
    };
  },
  mounted() {
    this.loadData();
    this.$nextTick(() => {
      this.height = this.$parent.$el.clientHeight;
      this.aceEditor = ace.edit(this.$refs.ace, {
        maxLines: 40, // 最大行数，超过会自动出现滚动条
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
      return this.height - 32;
    },
    showDelete() {
      return this.templateList.findIndex(item => item.name === this.name) >= 0;
    }
  },
  methods: {
    loadData() {
      this.templateList.splice(0, this.templateList.length);
      this.service.listTemplate().then(data=>{
        this.templateList = data;
      });
    },
    itemClick(item) {
      let list = document
        .getElementsByClassName("itemList")[0]
        .getElementsByTagName("li");
      for (let it of list) {
        if (parseInt(it.getAttribute("id")) == item.name) {
          it.className = "selected";
        } else {
          it.className = "";
        }
      }
      this.current = item;
      this.service.getInfo(this.$path.join(config.template, item.fileName), false).then(data=>{
        if(data){
          this.name = item.name;
          this.aceEditor.setValue(data, -1);
        }
      });
    },
    addItem() {
      if (this.name == "") {
        return;
      }
      this.name = "";
      this.current = {};
      this.aceEditor.setValue("", -1);
      let list = document
        .getElementsByClassName("itemList")[0]
        .getElementsByTagName("li");
      for (let it of list) {
        it.className = "";
      }
    },
    save() {
      if (this.name === "") {
        this.$error("请填写模板名称！");
        return;
      }
      if (this.aceEditor.getValue() === "") {
        this.$error("请填写模板内容！");
        return;
      }
      this.service.saveProject(this.current.name, {name: this.name, data: this.aceEditor.getValue()}, 1).then(data => {
        if (data) {
          this.$success("保存成功！");
          this.addItem();
          this.loadData();
        } else {
          this.$error("保存失败！");
        }
      });
    },
    delItem() {
      this.service
        .delProject(this.current.name, this.$path.join(config.template, this.current.fileName), 1)
        .then(data => {
          if (data) {
            this.$success("删除成功！");
            this.addItem();
            this.loadData();
          } else {
            this.$error("删除失败！");
          }
        });
    }
  }
};
</script>
