<template>
    <div style="display: inline-block;vertical-align: middle;width:100%;">
        <span class="item-span" @click="onselect">
            {{title}}
            <span v-if="value.parent" style="font-size:12px">[模板分类]</span>
        </span>
        <div class="icons">
            <Icon type="ios-create-outline" class="item-icon" color="#2d8cf0" @click="onedit" v-if="value.parent"/>
            <Icon type="ios-close-circle-outline" class="item-icon" color="#f10606" @click="onclose"/>
        </div>
    </div>
</template>
<script>
export default {
    name: "leftItem",
    props:{
        title: {
            type: String,
            default: ""
        },
        value:{
            type: Object,
            default:()=>{return {};}
        }
    },
    data(){
        return {

        };
    },
    methods:{
        onselect(){
            this.$emit('select', this.value);
        },
        onedit(){
            this.$emit('edit', this.value);
        },
        onclose(){
            this.$emit('delete', this.value);
        }
    }
}
</script>
<style scoped>
.item-span{
    display: inline-block;
    width:70%;
    font-size:16px;
    cursor: pointer;
}
.icons{
    display: inline-block;
    text-align: right;
    width:30%;
    padding-right:5px;
}
.item-icon{
    font-size: 18px;
    margin-right: 5px;
    font-weight: bold;
    cursor: pointer;
    vertical-align: text-bottom;
}
</style>
