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
        <Tabs type="card">
          <TabPane label="项目信息">
            <div class="row">
              <span class="labelName">项目名称：</span>
              <Input v-model="data.name" placeholder="请输入项目名称..." style="width: 198px"/>
            </div>
            <div class="row">
              <span class="labelName">项目包名：</span>
              <Input v-model="data.package" placeholder="请输入packageName..." style="width:198px;"></Input>
            </div>
            <div class="row">
              <span class="labelName">swagger API：</span>
              <i-switch size="large" v-model="data.swagger">
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
              </i-switch>
            </div>
            <div class="row">
              <span class="labelName">数据库：</span>
              <Select v-model="data.dataBase" style="width:200px" @on-change="dbChange">
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
            <div class="row" v-for="item,i in data.templateList" :key="i">
              <div class="col">
                <span class="labelName">模板：</span>
                <Select v-model="item.template" style="width:200px">
                  <Option
                    v-for="item in templateList"
                    :value="item.path"
                    :key="item.name"
                    :disabled="templateShow(item.path)"
                  >{{ item.name }}</Option>
                </Select>
              </div>&nbsp;
              <pathChoose class="col" title="输出目录" v-model="item.output"></pathChoose>&nbsp;&nbsp;
              <Button type="error" @click="delTemp(item.id)" v-if="data.templateList.length > 1">删除</Button>
            </div>
            <div class="row" style="padding-left:100px;">
              <span class="tips" v-if="templateList.length == 0">
                <a
                  href="javascript:void(0);"
                  @click="$router.push({ path: '/TemplateManage' })"
                >添加模板</a>
              </span>
            </div>
            <Button class="add" @click="addTemp">添加</Button>
          </TabPane>
          <TabPane label="数据源"></TabPane>
        </Tabs>
        <div class="row">
          <Button type="primary" class="btn" style="width:200px;margin-left:100px;" @click="save">保存</Button>
          <Button
            type="error"
            class="btn"
            v-if="data.id>0"
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
import Service from "@/libs/service";
import { constants } from "crypto";
import { type } from "os";

export default {
  components: {
    pathChoose
  },
  data() {
    return {
      split: 0.2,
      height: 0,
      current: {
        name: "",
        path: ""
      },
      data: {
        id: 0,
        name: "",
        package: "",
        swagger: false,
        tables: [],
        dataBase: 0,
        templateList: [
          {
            template: "",
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
        },
        {
          title: "备注",
          key: "comment"
        }
      ],
      templateList: [], //模板列表
      dbList: [], //数据库列表
      tableList: [], //表
      project: new Service()
    };
  },
  mounted() {
    this.loadData();
    this.project.listTemplate().then(data => {
      this.templateList = data;
    });
    this.dbList = this.$getDataForObj(config.dbList);
    this.dbList = this.dbList == null ? [] : this.dbList;

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
    loadData() {
      this.projectList.splice(0, this.projectList.length);
      this.project.listProject().then(data => {
        this.projectList = data;
      });
    },
    selectAllHanlder(selection) {
      this.data.tables.splice(0, this.data.tables.length);
      selection.forEach(item => {
        this.data.tables.push(item.tableName);
      });
    },
    unselectAllHanlder(selection) {
      this.data.tables.splice(0, this.data.tables.length);
    },
    unselectHanlder(selection, row) {
      this.data.tables.splice(
        this.data.tables.findIndex(it => it === row.tableName),
        1
      );
    },
    selectHanlder(selection, row) {
      this.data.tables.push(row.tableName);
    },
    dbChange() {
      if (this.data.dataBase > 0) {
        let db = this.dbList.find(it => it.id == this.data.dataBase);
        if (db) {
          const dbUtil = new DataBaseUtil(db.props);
          dbUtil.listTable().then(result => {
            result.forEach(item => {
              this.tableList.push({
                tableName: item.table_name,
                comment: item.table_comment,
                _checked:
                  this.data.tables.findIndex(it => it === item.table_name) >= 0
              });
            });
          });
        }
      }
    },
    templateShow(path) {
      return (
        this.data.templateList.findIndex(item => item.template == path) >= 0
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
      this.project.getInfo(item.path).then(data => {
        if (data) {
          this.data = data;
          this.dbChange();
        }
      });
    },
    addTemp() {
      this.data.templateList.push({
        template: "",
        output: ""
      });
    },
    delTemp(path) {
      this.data.templateList.splice(
        this.data.templateList.findIndex(it => it.template == path),
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
      this.data = {
        id: 0,
        name: "",
        tables: [],
        package: "",
        swagger: false,
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
      if (this.data.name === "") {
        this.$error("请填写项目名称！");
        return;
      }
      if (this.data.package === "") {
        this.$error("请填写项目包名！");
        return;
      }
      if (this.data.dataBase == 0) {
        this.$error("请选择数据库！");
        return;
      }
      if (this.data.tables.length == 0) {
        this.$error("请选择数据表！");
        return;
      }
      for (let item of this.data.templateList) {
        if (item.template == 0 || item.output === "") {
          this.$error("请填写完整的模板信息！");
          return;
        }
      }
      this.project.saveProject(this.current.name, this.data).then(data => {
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
      this.project
        .delProject(this.current.name, this.current.path)
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
