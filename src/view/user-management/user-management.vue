<script type="text/javascript">
/* eslint-disable */
</script>
<style rel="stylesheet" lang="less">
    @import "../../styles/common.less";
    @import "./user-management.less";
    
</style>
<template>
    <div class="user_manager">
        <div class="title">
            {{$t('companyNameLabel')}}：{{companyName}}
        </div>
        <Row :gutter="8" class="main">
            <div ref='col3'  class="treeCol">
            <Spin fix size="large" v-show="spin2"></Spin>
                <!-- 向子组件传值，:aaa="1"传递的是数字1   aaa="1"传递的是字符串1 -->
                <org-tree v-on:search="search" @defaultOrg="defaultOrg" :partyId="partyId" origin="user"></org-tree>
            </div>
            <div >
                <Spin fix size="large" v-show="spin1"></Spin>
                <person-table v-on:search="search" :orgMes="orgMes" :partyId="partyId" :rechargeType="rechargeType" :newQuery="newQuery" :personData="personData" :total="total" :canRenew="canRenew"></person-table>
            </div>
        </Row> 
    </div>
    
</template>

<script type="ecmascript-6">
import personTable from '@/view/common-components/person-table/person-table'
import orgTree from '@/view/common-components/org-tree/org-tree'
import { queryEdposUsers } from '@/api/user-manage'

export default {
    components:{
        orgTree,
        personTable
    },
    data () {
    	return{
            partyId:this.$route.params.partyId || localStorage.getItem('ccs_partyId'),
            canRenew:this.$route.params.canRenew || localStorage.getItem('ccs_canRenew'),
            rechargeType:this.$route.params.rechargeType || localStorage.getItem('ccs_rechargeType'),
            personData:[],
            total:0,
            searchParams:{
                partyId:this.partyId,
                displayState: 99,
                orgId: 0,
                userName: '',
                page: 1,
                limit: 10,
            },
            orgMes:{},
            newQuery:false,
            spin1:false,
            spin2:false,
            companyName:localStorage.getItem('ccs_companyName')
    	}
    },
    computed:{

    },
    created:function(){
    },
    methods:{
        search(arr){

            const _this = this
            _this.spin1 = true
            if(arr){
                if(arr.length >2 ){//只有点击组织树是length才会为3
                    this.orgMes = arr[2]
                }
                
                this.searchParams[arr[0]] = arr[1]
                if(arr[0]=='orgId'||arr[0]=='userName'||arr[0]=='userType')  this.searchParams.page = 1
            }
            this.searchParams.partyId = this.partyId
            queryEdposUsers(this.searchParams)
            .then(function(res){
                if(res.data.code&&res.data.code==-1){
                    _this.$router.push({
                        name:'login'
                    });
                }
                _this.newQuery = true
                _this.personData = res.data.data
                _this.total = res.data.count
                _this.spin1 = false
            })
        },
        defaultOrg(obj){
            this.orgMes = obj
        }
    }
}
</script>

