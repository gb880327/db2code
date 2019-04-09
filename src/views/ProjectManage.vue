<template>
  <div :style="{height: getHeight+'px'}">
    <div class="moduleTitle">项目管理</div>
    <Split v-model="split" :style="{height: getHeight+'px'}">
      <div slot="left" class="split-left">
        <div class="left-opt">
          <Button type="text" class="addItem" @click="addItem">新增</Button>
        </div>
        <div class="left-list" :style="{height: (getHeight - 38)+'px'}">
          <ul class="itemList">
            <li v-for="item in projectList" :key="item.id" :id="item.id" @click="itemClick(item)">
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div slot="right" class="pane split-right" :style="{height:getHeight+'px'}">
        <div class="row">
          <span class="labelName">项目名称：</span>
          <Input v-model="current.name" placeholder="请输入项目名称..." style="width: 198px"/>
        </div>
        <div class="row">
          <span class="labelName">数据库：</span>
          <Select v-model="current.dataBase" style="width:200px" @on-change="dbChange">
            <Option v-for="item in dbList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
          <span class="tips" v-if="dbList.length == 0">
            <a href="javascript:void(0);" @click="$router.push({ path: '/DBManage' })">添加数据库配置</a>
          </span>
        </div>
        <div class="row" v-if="showTable">
          <Table
            :columns="tableColumns"
            :data="tableList"
            height="300"
            style="margin-left:100px;"
            @on-select="selectHanlder"
            @on-select-cancel="unselectHanlder"
            @on-select-all="selectAllHanlder"
            @on-select-all-cancel="unselectAllHanlder"
          ></Table>
        </div>
        <div class="row" v-for="item,i in current.templateList" :key="i">
          <div class="col">
            <span class="labelName">模板：</span>
            <Select v-model="item.template" style="width:200px">
              <Option
                v-for="item in templateList"
                :value="item.id"
                :key="item.id"
                :disabled="templateShow(item.id)"
              >{{ item.name }}</Option>
            </Select>
          </div>&nbsp;
          <pathChoose class="col" title="输出目录" v-model="item.output"></pathChoose>&nbsp;&nbsp;
          <Button type="error" @click="delTemp(item.id)" v-if="current.templateList.length > 1">删除</Button>
        </div>
        <div class="row" style="padding-left:100px;">
          <span class="tips" v-if="templateList.length == 0">
            <a href="javascript:void(0);" @click="$router.push({ path: '/TemplateManage' })">添加模板</a>
          </span>
        </div>
        <Button class="add" @click="addTemp">添加</Button>
        <div class="row">
          <Button type="primary" class="btn" style="width:200px;margin-left:100px;" @click="save">保存</Button>
          <Button
            type="error"
            class="btn"
            v-if="current.id>0"
            style="width:200px;"
            @click="delItem"
          >删除项目</Button>
        </div>
      </div>
    </Split>
  </div>
</template>
<script>
import config from "@/libs/config";
import pathChoose from "@/views/PathChoose";
import DataBaseUtil from "@/libs/database";
import { constants } from "crypto";

export default {
  components: {
    pathChoose
  },
  data() {
    return {
      split: 0.2,
      height: 0,
      current: {
        id: 0,
        name: "",
        tables: [],
        dataBase: 0,
        templateList: [
          {
            template: 0,
            output: ""
          }
        ]
      },
      projectList: [],
      tableColumns: [
        {
          type: "selection",
          title: "编号",
          width: 50
        },
        {
          title: "表名",
          key: "tableName"
        },{
          title: "备注",
          key: "comment"
        }
      ],
      templateList: [], //模板列表
      dbList: [], //数据库列表
      tableList: [] //表
    };
  },
  mounted() {
    this.projectList = this.$getDataForObj(config.projectList);
    this.templateList = this.$getDataForObj(config.templateList);
    this.dbList = this.$getDataForObj(config.dbList);
    this.$nextTick(() => {
      this.height = this.$parent.$el.clientHeight;
    });
  },
  computed: {
    getHeight() {
      return this.height - 32;
    },
    showTable() {
      return this.tableList.length > 0;
    }
  },
  methods: {
    selectAllHanlder(selection) {
      this.current.tables.splice(0, this.current.tables.length);
      selection.forEach(item => {
        this.current.tables.push(item.tableName);
      });
    },
    unselectAllHanlder(selection) {
      this.current.tables.splice(0, this.current.tables.length);
    },
    unselectHanlder(selection, row) {
      this.current.tables.splice(
        this.current.tables.findIndex(it => it === row.tableName),
        1
      );
    },
    selectHanlder(selection, row) {
      this.current.tables.push(row.tableName);
    },
    dbChange() {
      if (this.current.dataBase > 0) {
        const dbUtil = new DataBaseUtil(
          this.dbList.find(it => it.id == this.current.dataBase).props
        );
        dbUtil.listTable().then((result) => {
          result.forEach(it => {
            this.tableList.push({
              tableName: it.table_name,
              comment: it.table_comment,
              _checked: this.current.tables.findIndex(it => it === it.table_name) >= 0
            });
          });
        });
        // dbUtil.listFieldForTable("account_info").then((result)=>{
        //   console.log(result);
        // });
      }
    },
    templateShow(id) {
      return (
        this.current.templateList.findIndex(item => item.template == id) >= 0
      );
    },
    itemClick(item) {
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
      this.current = item;
      this.dbChange();
    },
    addTemp() {
      this.current.templateList.push({ template: 0, output: "" });
    },
    delTemp(id) {
      this.current.templateList.splice(
        this.current.templateList.findIndex(it => it.template == id),
        1
      );
    },
    addItem() {
      let list = document
        .getElementsByClassName("itemList")[0]
        .getElementsByTagName("li");
      for (let it of list) {
        it.className = "";
      }
      this.current = {
        id: 0,
        name: "",
        tables: [],
        dataBase: 0,
        templateList: [
          {
            template: 1,
            output: ""
          }
        ]
      };
      this.tableList.splice(0, this.tableList.length);
    },
    save() {
      if (this.current.name === "") {
        this.$error("请填写项目名称！");
        return;
      }
      if (this.current.dataBase == 0) {
        this.$error("请选择数据库！");
        return;
      }
      if (this.current.tables.length == 0) {
        this.$error("请选择数据表！");
        return;
      }
      for (let item of this.current.templateList) {
        if (item.template == 0 || item.output === "") {
          this.$error("请填写完整的模板信息！");
          return;
        }
      }
      if (this.current.id == 0) {
        this.current.id = new Date().getTime();
        this.projectList.push(this.current);
      }
      this.$saveData(config.projectList, this.projectList);
      this.addItem();
      this.$success("保存成功！");
    },
    delItem() {
      this.$confirm("确认是否删除该项目？", () => {
        this.projectList.splice(
          this.projectList.findIndex(it => it.id == this.current.id),
          1
        );
        this.$saveData(config.projectList, this.projectList);
        this.addItem();
      });
    }
  }
};
</script>
<style scoped>
.add {
  margin: 0 100px;
  width: 200px;
  border: 1px dashed #dcdee2;
}
.add:focus {
  box-shadow: none;
}
</style>
