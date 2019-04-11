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
            <li v-for="item in templateList" :key="item.id" :id="item.id" @click="itemClick(item)">
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
          <Button type="error" class="btn" v-if="currentId>0" @click="delItem">删除</Button>
        </div>
        <div class="ace-editor" ref="ace"></div>
      </div>
    </Split>
  </div>
</template>
<script>
import config from "@/libs/config";
const fs = require("fs");
const buffer = require("buffer").Buffer;
import ace from "ace-builds";
import "ace-builds/webpack-resolver"; // 在 webpack 环境中使用必须要导入
import swal from "sweetalert2";


export default {
  data() {
    return {
      aceEditor: null,
      themePath: "ace/theme/monokai",
      modePath: "ace/mode/java",
      split: 0.2,
      height: 0,
      currentId: 0,
      templateList: [],
      tempPath: "",
      name: ""
    };
  },
  mounted() {
    let list = localStorage.getItem(config.templateList);
    this.templateList =
      list && list != null && list != "" ? JSON.parse(list) : [];

    this.tempPath = config.getTemplatePath();
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
    }
  },
  methods: {
    itemClick(item) {
      this.currentId = item.id;
      let list = document
        .getElementsByClassName("itemList")[0]
        .getElementsByTagName("li");
      for (let it of list) {
        if (parseInt(it.getAttribute("id")) == item.id) {
          it.className = "selected";
        } else {
          it.className = "";
        }
      }
      this.name = item.name;
      if (!fs.existsSync(item.filePath)) {
        this.$error("模板文件：" + item.filePath + "不存在！");
      } else {
        fs.readFile(item.filePath, (err, data) => {
          this.aceEditor.setValue(buffer.from(data).toString(), -1);
        });
      }
    },
    addItem() {
      if (this.currentId == 0) {
        return;
      }
      this.name = "";
      this.currentId = 0;
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
      let item = {};
      let index = 0;
      if (this.currentId > 0) {
        index = this.templateList.findIndex(item => item.id == this.currentId);
        item = this.templateList[index];
      } else {
        item = {
          name: "",
          fileName: "",
          filePath: ""
        };
      }
      const _this = this;
      (async function getText() {
        const { value: text } = await swal.fire({
          input: "text",
          inputValue: item.fileName,
          inputPlaceholder: "请输入文件名...",
          showCancelButton: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputValidator: value => {
            if (!value) {
              return "请输入文件名!";
            }
          }
        });
        if (text && text != "") {
          item.fileName = text;
          item.filePath = config.getTemplatePath() + "/" + text;
          item.name = _this.name;
          if (_this.currentId == 0) {
            item.id = new Date().getTime();
            _this.currentId = item.id;
            _this.templateList.push(item);
          } else {
            _this.templateList[index] = item;
          }

          if (fs.existsSync(config.getTemplatePath() + "/" + text)) {
            _this.$confirm("文件 " + text + " 已存在，是否覆盖！", () => {
              _this.writeFile(item);
            });
          } else {
            _this.writeFile(item);
          }
        }
      })();
    },
    writeFile(item) {
      fs.writeFile(item.filePath, this.aceEditor.getValue(), err => {
        if (err) {
          location.reload();
          this.$error(err);
          console.log(err);
        } else {
          this.$saveData(config.templateList, this.templateList);
          this.$success("保存成功！");
        }
      });
    },
    delItem() {
      let index = this.templateList.findIndex(it => it.id == this.currentId);
      if (index >= 0) {
        this.$confirm("确认删除该模板？", () => {
          if (fs.existsSync(this.templateList[index].filePath)) {
            fs.unlink(this.templateList[index].filePath, err => {
              if (err) {
                this.$error(err);
              } else {
                this.templateList.splice(index, 1);
                this.$saveData(config.templateList, this.templateList);
                this.addItem();
                this.$success("删除成功！");
              }
            });
          } else {
            this.templateList.splice(index, 1);
            this.$saveData(config.templateList, this.templateList);
            this.addItem();
            this.$success("删除成功！");
          }
        });
      }
    }
  }
};
</script>
