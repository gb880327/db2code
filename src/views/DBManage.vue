<template>
  <div>
    <Split v-model="split" :style="{height: getHeight+'px'}">
      <div slot="left" class="split-left">
        <div class="left-opt">
          <Row>
            <Col span="12" style="border-right: 1px solid #dcdee2;">
              <Button type="text" style="width:100%;" @click="delItem">删除</Button>
            </Col>
            <Col span="12" style="border-left: 1px solid #dcdee2;">
              <Button type="text" style="width:100%;" @click="addItem">新增</Button>
            </Col>
          </Row>
        </div>
        <div class="left-list" :style="{height: (getHeight - 38)+'px'}">
          <ul class="itemList">
            <li v-for="item in dbList" :key="item.id" :id="item.id" @click="itemClick(item)">
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div slot="right" class="pane split-right" :style="{height:getHeight+'px'}">Right Pane</div>
    </Split>
  </div>
</template>
<script>
import config from "@/libs/config";

export default {
  data() {
    return {
      split: 0.2,
      height: 0,
      select: [],
      dbList: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.height = this.$parent.$el.clientHeight;
    });
    this.init();
  },
  computed: {
    getHeight() {
      return this.height;
    }
  },
  methods: {
    init() {
      let data = localStorage.getItem(config.dbList);
      alert(data);
      this.dbList = (data === "" || data == null || data == undefined) ? [{
          id: 0,
          name: "mysql",
          props: {}
        }] : JSON.parse(data);
    },
    itemClick(item) {
      let list = document
        .getElementsByClassName("itemList")[0]
        .getElementsByTagName("li");
      let index = this.select.findIndex(it => it == item.id);
      for (let it of list) {
        if (parseInt(it.getAttribute("id")) == item.id) {
          it.className = index >= 0 ? "" : "selected";
        } else {
          it.className =
            this.select.findIndex(sub => sub == it.id) >= 0 ? "selected" : "";
        }
      }
      if (index >= 0) {
        this.select.splice(index, 1);
      } else {
        this.select.push(item.id);
      }
    },
    addItem() {
      let id = new Date().getTime();
      this.dbList.push({
        id: id,
        name: "mysql " + id,
        props: {}
      });
      localStorage.setItem(config.dbList, JSON.stringify(this.dbList));
    },
    delItem() {
      if (this.select.length == 0) {
        this.$Notice.error({
          title: "请请选择要删除的数据！"
        });
      } else {
        this.select.forEach(item => {
          this.dbList.splice(this.dbList.findIndex(it => it.id == item), 1);
        });
        localStorage.setItem(config.dbList, JSON.stringify(this.dbList));
      }
    }
  }
};
</script>
<style lang="css" scoped>
.pane {
  padding: 10px;
}
.split-left {
  border-top: 1px solid #dcdee2;
  border-left: 1px solid #dcdee2;
  border-bottom: 1px solid #dcdee2;
}
.split-right {
  border-top: 1px solid #dcdee2;
  border-right: 1px solid #dcdee2;
  border-bottom: 1px solid #dcdee2;
}
.left-list {
  width: 100%;
  overflow-y: scroll;
}
.left-opt {
  border-bottom: 1px solid #dcdee2;
  width: 100%;
  height: 35px;
}
.itemList {
  list-style: none;
  padding: 0;
  margin: 0;
}
.itemList li {
  padding: 5px 10px;
  margin: 4px;
  font-size: 14px;
  cursor: pointer;
  background-color: #dcdee2;
  border-radius: 5px;
  color: black;
}
.itemList li:hover {
  background-color: #b0b4bb;
}
.itemList .selected {
  background-color: #515a6c;
  color: #ffffff;
}
</style>
