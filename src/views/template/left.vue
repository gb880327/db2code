<template>
  <div>
    <div class="add" @click="add">
      <Icon type="ios-add" size="22"/>
    </div>
    <Tree :data="data"></Tree>
  </div>
</template>
<script>
import leftItem from "./item";
import Service from "@/libs/service";

export default {
  name: "left",
  components: {
    leftItem
  },
  data() {
    return {
      service: new Service(),
      data: [],
      on_event: {
        select: this.onselect,
        edit: this.onedit,
        delete: this.ondelete
      }
    };
  },
  created() {
    this.load();
  },
  methods: {
    add(){
      this.$parent.clean();
    },
    onselect(item) {
      if (item.parent) {
        this.$parent.clean();
      } else {
        this.$parent.edit({
          name: item.name,
          id: item.id,
          group: item.type,
          path: item.path
        });
      }
    },
    onedit(item) {
      let templateList = this.$parent.templateList;
      if (item.parent) {
        this.$parent.$refs.type.show(item.id, item.name);
      }
    },
    ondelete(item) {
      const _this = this;
      let templateList = this.$parent.templateList;
      if (item.parent) {
        this.$confirm("确认删除该分类？", () => {
          let index = templateList.findIndex(it => it.id == item.id);
          if (templateList[index].template.length > 0) {
            _this.$error("请先删除该分类下的模板！");
            return;
          }
          templateList.splice(index, 1);
          _this.$saveData(_this.$TEMPLATE, templateList);
          _this.$success("删除成功！");
          _this.load();
          _this.$parent.onsuccess();
        });
      } else {
        this.$confirm("确认删除该模板?", () => {
          this.service.delTemplate(item.path).then(res => {
            if (res) {
              let groupIndex = templateList.findIndex(
                it => it.id === item.type
              );
              let group = templateList[groupIndex];
              let index = group.template.findIndex(it => it.id === item.id);
              group.template.splice(index, 1);
              templateList[groupIndex] = group;
              _this.$saveData(_this.$TEMPLATE, templateList);
              _this.$success("删除成功！");
              _this.load();
              _this.$parent.onsuccess();
            }
          });
        });
      }
    },
    load() {
      this.data = [];
      let templateList = this.$parent.templateList;
      templateList.forEach(item => {
        let children = [];
        item.template.forEach(it => {
          children.push({
            title: it.name,
            id: it.id,
            path: it.path,
            typeId: item.id,
            render: (h, { root, node, data }) => {
              return h(leftItem, {
                props: {
                  title: data.title,
                  value: {
                    id: data.id,
                    name: data.title,
                    path: data.path,
                    type: data.typeId,
                    parent: false
                  }
                },
                on: this.on_event
              });
            }
          });
        });
        this.data.push({
          title: item.name,
          expand: false,
          id: item.id,
          render: (h, { root, node, data }) => {
            return h(leftItem, {
              props: {
                title: data.title,
                value: { id: item.id, name: data.title, parent: true }
              },
              on: this.on_event
            });
          },
          children: children
        });
      });
    }
  }
};
</script>
<style scoped>
.add {
  border: 1px dashed #80808099;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
  margin-top: 5px;
}
</style>
