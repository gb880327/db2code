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
          <Input v-model="name" placeholder="请输入项目名称..." style="width: 198px"/>
        </div>
        <div class="row">
          <span class="labelName">数据库：</span>
          <Select v-model="dataBase" style="width:200px" @on-change="dbChange">
            <Option v-for="item in dbList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </div>

        <div class="row" v-for="item,i in itemList" :key="i">
          <div class="col">
            <span class="labelName">模板：</span>
            <Select v-model="item.template" style="width:200px">
              <Option v-for="item in templateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div>&nbsp;
          <pathChoose class="col" title="输出目录" v-model="item.output"></pathChoose>&nbsp;&nbsp;
          <Button type="error">删除</Button>
        </div>
        <Button class="add">添加</Button>
        <div class="row" v-if="tableList.length > 0">
          <Row>
            <Col span="8">
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
            </Col>
            <Col span="16"></Col>
          </Row>
        </div>
        <div class="row">
          <Button type="primary" class="btn" style="width:200px;margin-left:100px;" @click="save">保存</Button>
          <Button type="error" class="btn" v-if="currentId>0" style="width:200px;" @click="delItem">删除项目</Button>
        </div>
      </div>
    </Split>
  </div>
</template>
<script>
import config from "@/libs/config";
import pathChoose from "@/views/PathChoose";

export default {
  components: {
    pathChoose
  },
  data() {
    return {
      split: 0.2,
      height: 0,
      name: "",
      projectList: [
        {
          id: 123,
          name: "Project1"
        }
      ],
      currentId: 0,
      tableColumns: [
        {
          type: "selection",
          title: "编号"
        },
        {
          title: "表名",
          key: "tableName"
        }
      ],
      templateList: [], //模板列表
      dbList: [], //数据库列表
      tableList: [], //表
      itemList: [
        //添加的生成项
        {
          template: 1,
          output: ""
        }
      ],
      selectTable: [], //选择的表
      dataBase: ""
    };
  },
  mounted() {
    this.templateList = this.$getDataForObj(config.templateList);
    this.dbList = this.$getDataForObj(config.dbList);
    this.$nextTick(() => {
      this.height = this.$parent.$el.clientHeight;
    });
  },
  computed: {
    getHeight() {
      return this.height - 32;
    }
  },
  methods: {
    selectAllHanlder(selection) {
      this.selectTable.splice(0, this.selectTable.length);
      selection.forEach(item => {
        this.selectTable.push(item.tableName);
      });
    },
    unselectAllHanlder(selection) {
      this.selectTable.splice(0, this.selectTable.length);
    },
    unselectHanlder(selection, row) {
      this.selectTable.splice(
        this.selectTable.findIndex(it => it === row.tableName),
        1
      );
    },
    selectHanlder(selection, row) {
      this.selectTable.push(row.tableName);
    },
    dbChange() {
      this.tableList = [{ tableName: "Demo1" }, { tableName: "Demo2" }];
    },
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
    },
    addItem() {},
    save() {},
    delItem() {}
  }
};
</script>
<style scoped>
.add {
  margin: 0 100px;
  width: 200px;
  border: 1px dashed #dcdee2;
}
.add:focus{
  box-shadow: none;
}
</style>
