<template>
  <div :style="{height: getHeight+'px'}">
    <div class="moduleTitle">项目管理</div>
    <Split v-model="split" :style="{height: getHeight+'px'}">
      <div slot="left" class="split-left">
        <div class="left-opt">
          <Button type="text" style="width:100%;font-weight: bold;" @click="addItem">新增</Button>
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
          <span class="labelName">模板名称：</span>
          <Input v-model="name" placeholder="请输入模板名称..." style="width: 198px"/>&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" class="btn" @click="save">保存</Button>
          <Button type="error" class="btn" v-if="currentId>0" @click="delItem">删除</Button>
        </div>
      </div>
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
      name: "",
      projectList: [
        {
          id: 123,
          name: "Project1"
        }
      ],
      currentId: 0
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.height = this.$parent.$el.clientHeight;
    });
  },
  computed: {
    getHeight() {
      return this.height - 30;
    }
  },
  methods: {
    itemClick(item) {},
    addItem() {},
    save() {},
    delItem() {}
  }
};
</script>
