<script type="text/javascript">
/* eslint-disable */
</script>
<style rel="stylesheet" lang="less">
    @import "../../styles/common.less";
    @import "./SN-management.less";
    
</style>
<template>
    <div class="SN_manager">
        <Card class="searchCard">
            <div style="overflow:hidden">
                <div class="searchBox">
                    <span>{{$t('SN')}}：</span> 
                    <Input v-model="searchMes.sn" clearable :maxlength='20' type="text"  style="width:200px"/>
                </div>
                <div class="searchBox">
                    <span>{{$t('alarmType')}}：</span>
                    <Input v-model="searchMes.snType" clearable type="text" :maxlength='20' style="width:200px"/>
                </div>
                <div class="searchBox">
                    <span>{{$t('state')}}：</span>
                    <Select v-model="searchMes.resState" style="width:200px">
                        <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
                <div class="searchBox">
                    <Button type="primary" @click='search'>&nbsp;&nbsp;{{$t('search')}}&nbsp;&nbsp;</Button>
                </div>
            </div>
        </Card>
        <div class="content">
            <div class="btns">
                <Button type="primary" @click="batchImportModal(0)">{{$t('account_import')}}</Button>
                <Button type="primary" @click="batchImportModal(1)">{{$t('batchAssign')}}</Button>
                <Button type="primary" @click="assign">{{$t('assign')}}</Button>
            </div>
            <div class="tableBox">
                <Table stripe @on-selection-change="tableSelection" ref="selection" :columns="tableColums" :data="tableData"></Table>
            </div>
        </div>
        
        <div class="page">
            <div style="float: right;">
                <Page 
                    ref='page'
                    @on-change="changePage" 
                    @on-page-size-change="changePageSize"
                    :total=page.total 
                    :page-size-opts = "[10,20,50]"
                    show-elevator 
                    show-sizer 
                    show-total
                    placement="top"
                ></Page>
            </div>
        </div>
        <!-- 批量导入 -->
        <Modal :title="modal11Title" v-model="modal11" :width="800">
            <div class="example1">
                <span style="display:inline-block;text-align:right;">{{$t('agent')}}：</span>
                <Select clearable  filterable v-model="importAgentId" style="width:300px">
                    <Option v-for="item in agentList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </div>
            <a class="example" href="./example-SN.xlsx">{{$t('Example')}}</a>
            <upload-excel ref="uploadExcel" @uploadTableData="uploadTableData"></upload-excel>
            <div slot="footer">
                <Button type="default" size="large" @click="modal11=false">
                    {{$t('cancel')}}
                </Button>
                <Button type="primary" size="large" @click="sendBatchImport">
                    {{$t('ok')}}
                </Button>
            </div>
        </Modal>
        <!-- 导入结果 -->
        <Modal 
            :title="Result" 
            class="importResult"
            v-model="modal12" 
            :value="tabName"     
            >
            <Tabs type="card" @on-click="tabChange">
                <TabPane :label="successList" name="name1">
                    <Table stripe border :columns="importSuccessColumns" :data="importSuccessData"></Table>
                </TabPane>
                <TabPane :label="errorList" name="name2">
                    <Table stripe border :columns="importFailurecolumns" :data="importFailureData"></Table>
                </TabPane>
            </Tabs>
            <div slot="footer">
                <Button v-if="n==0" type="default" size="large" @click="modal12=false">
                    {{$t('cancel')}}
                </Button>
                <Button  v-if="n==0&&tabName=='name1'" type="primary" size="large" @click="batchSaveEdposUser">
                    {{$t('user_table_btn_batchImport')}}
                </Button>
                <Button v-if="n==1" type="primary" size="large" @click="modal12=false">
                    {{$t('close')}}
                </Button>
            </div>
        </Modal>
        <Modal 
            :title="Assign" 
            v-model="modal1" 
            class='AssginSN'
            >
            <div style="margin:15px 0">
                <span style="display:inline-block;text-align:right;width:120px;">{{$t('agent')}}：</span>
                <Select filterable v-model="importAgentId" style="width:300px">
                    <Option v-for="item in agentList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </div>
            
            <div slot="footer">
                <Button  type="default" size="large" @click="modal1=false">
                    {{$t('cancel')}}
                </Button>
                <Button type="primary" size="large" @click="comfirmAssign">
                    {{$t('ok')}}
                </Button>
            </div>
        </Modal>
        <Modal 
            :title="Assign" 
            v-model="modal2" 
            class='AssginSN'
            >
           
            <h1 style="text-align:center;margin:10px;">{{$t('confirmAssign')}}</h1>
            <div slot="footer">
                <Button  type="default" size="large" @click="modal2=false">
                    {{$t('cancel')}}
                </Button>
                <Button type="primary" size="large" @click="sendAssign(0)">
                    {{$t('ok')}}
                </Button>
            </div>
        </Modal>
    </div>
    
</template>

<script type="ecmascript-6">
import { querySnResources,batchCheckSN,batchSaveSN,assignSN } from '@/api/sn'
import uploadExcel from '@/view/excel/upload-excel'
import { queryAgentCompany } from '@/api/agent-manage'
export default {
    components:{
        uploadExcel
    },
    created:function(){
        this.getSnResources()
        this.getAgentList()
    },
    data () {
    	return{
            n:0,  //导入结果modal中   0=导入  1=分配
            modal1: false, // 
            modal2: false, // 
            modal11: false, // 批量导入
            modal12: false, // 批量导入结果
            searchMes:{
                sn:'',
                snType:'',
                resState:2
            },
            stateList:[
                {
                    value:2,
                    label:this.$t('all')
                },
                {
                    value:0,
                    label:this.$t('used')
                },
                {
                    value:1,
                    label:this.$t('unused')
                }
            ],
            tableData:[],
            tableColums:[
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                  title: this.$t('SN'),
                  key: 'sn',
                  ellipsis: true,
                  render: (h, params) => {
                    return h('Tooltip', {
                      props: { placement: 'top-start' }
                    }, [
                      params.row.sn,
                      h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.sn)
                    ])
                  }
                },
                {
                  title: this.$t('alarmType'),
                  key: 'snType',
                  ellipsis: true,
                  render: (h, params) => {
                    return h('Tooltip', {
                      props: { placement: 'top-start' }
                    }, [
                      params.row.snType,
                      h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.snType)
                    ])
                  }
                },
                {
                  title: this.$t('company'),
                  key: 'agentCompanyName',
                  ellipsis: true,
                  render: (h, params) => {
                    return h('Tooltip', {
                      props: { placement: 'top-start' }
                    }, [
                      params.row.agentCompanyName,
                      h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.agentCompanyName)
                    ])
                  }
                },
                {
                  title: this.$t('state'),
                  key: 'resState',
                  ellipsis: true,
                  render: (h, params) => {
                    return h('Tooltip', {
                      props: { placement: 'top-start' },
                      style:{
                        color:params.row.resState==this.$t('used')?'#19be6b':'#515a6e'
                      }
                    }, [
                      params.row.resState,
                      h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.resState)
                    ])
                  }
                },
                {
                    title: this.$t('org_table_col_action'),
                    key: 'action',
                    align: 'center',
                    fixed: 'right',
                    width:150,
                    render: (h, params) => {
                        return h('div', [
                            h('Button', 
                                {
                                    on: {
                                        click: () => {
                                            // console.log(params)
                                            // if(params.row.resState==this.$t('used')){
                                            //     this.$Message.error(this.$t('usedError1'))
                                            //     return
                                            // }
                                            this.n = 1
                                            this.singleAssign = [{
                                                sn:params.row.sn,
                                                snType:params.row.snType
                                            }]
                                            this.modal1 = true
                                            this.isSingleAssign = true
                                        }
                                    },
                                    style:{
                                        // display:this.accessList.company_edit?'inline-block':'none',
                                        color:params.row.resState==this.$t('used')?'#ccc':'#2DB7F5',
                                        cursor:'pointer'
                                    },
                                    props: {
                                        disabled:params.row.resState==this.$t('used')?true:false,
                                        type: 'text',
                                        size: 'small'
                                    } 
                                },this.$t('assign'))
                        ]);
                    }
                }
              
            ],
            page:{
                total:0,
                current:1,
                size:10
            },
            singleAssign:[],
            isSingleAssign:false,
            selection:[],
            selectionUid:[],
            batchImportContent:'',
            tabName:'name1',
            successCount:0,
            errorCount:0,
            successList:(h) => {
                return h('div', [
                    h('span', this.$t('user_table_import_success_list')),
                    h('Badge', {
                        props: {
                            count: this.successCount
                        },
                        style:{
                            'margin-left':'5px',
                        }

                    })
                ])
            },
            errorList:(h) => {
                return h('div', [
                    h('span', this.$t('user_table_import_falied_list')),
                    h('Badge', {
                        props: {
                            count: this.errorCount
                        },
                        style:{
                            'margin-left':'5px',
                        }
                    })
                ])
            },
            importSuccessColumns:[
                {
                    type: 'index',
                    width: 60,
                    align: 'center'
                },
                {
                    title: this.$t('SN'),
                    key: 'sn'
                },
                {
                    title: this.$t('alarmType'),
                    key: 'snType'
                }
            ],
            importSuccessData:[],
            importFailurecolumns:[
                {
                    type: 'index',
                    width: 60,
                    align: 'center'
                },
                {
                    title: this.$t('SN'),
                    key: 'sn'
                },
                {
                    title: this.$t('alarmType'),
                    key: 'snType'
                },
                {
                    title: this.$t('ERRS'),
                    key: 'ext1'
                },
            ],
            importFailureData:[],
            uploadTableDataContent:[],
            assignAgentId:0,
            importAgentId:0,
            agentList:[],
            modal11Title:this.$t('user_table_btn_batchImport')
    	}
    },


    methods:{
        getSnResources(){
            let _this = this
            let param = {
                page:this.page.current,
                rows:this.page.size,
                sn:this.searchMes.sn,
                snType:this.searchMes.snType,
                resState:this.searchMes.resState==2?'':this.searchMes.resState
            }
            querySnResources(param).
            then(res=>{
                _this.page.total = res.data.count
                _this.tableData = _this.turnData(res.data.data)
                _this.selection = []
            })
        },
        turnData(data){
            let _this = this
            data.forEach(function(item,index){
                item.resState=item.resState==1?_this.$t('unused'):_this.$t('used')
                if(!item.agentId&&!item.agentCompanyName){
                    item.agentCompanyName = 'CCS'
                }
            })
            return data
        },
        changePage(current){
            this.page.current = current
            this.getSnResources()
        },
        changePageSize(current){
            this.page.size = current
            this.getSnResources()
        },
        tableSelection (selection) {
            let _this = this
            this.newQuery = false
            this.selection = selection
            
            this.selection.forEach(function(item){
                item.resState=item.resState==_this.$t('used')?0:1
            })
        },
        batchImportModal(n){
            this.n = n
            if(n){
                this.modal11Title = this.$t('assign')
            }else{
                this.modal11Title = this.$t('user_table_btn_batchImport')
            }
            this.modal11 = true
            this.uploadTableDataContent=[]
            // this.c=''
            this.$refs.uploadExcel.initUpload()
        },
        uploadTableData(data){
            let tableData=[]
            for(let i=0;i<data.length;i++){
                if(!data[i].SN||!data[i]['SN Type']){
                    this.$Message.error(this.$t('impotError'))
                    this.$refs.uploadExcel.tableData=[]
                    this.$refs.uploadExcel.tableTitle=[]
                    this.$refs.uploadExcel.showProgress=false
                    this.$refs.uploadExcel.file=null
                    return
                }
                let obj = {
                    sn:data[i].SN,
                    snType:data[i]['SN Type'],
                } 

                tableData.push(obj)
            }
           
            this.uploadTableDataContent = tableData
        },
        sendBatchImport(){
            let _this = this
            if(this.modal11Title == this.$t('user_table_btn_batchImport')){
                if(this.uploadTableDataContent.length==0){
                    this.$Message.error(this.$t('user_table_import_Content_error'))
                    return
                }
                batchCheckSN({'agentId':this.importAgentId,'snResources':this.uploadTableDataContent})
                .then(function(res){
                    // console.log(res)
                    if(res.data.code==0){
                        _this.modal11 = false
                        _this.modal12 = true
                        _this.turnDate(res.data.data.errorUsers)
                        _this.turnDate(res.data.data.successUsers)
                        _this.errorCount = res.data.data.errorUsers.length
                        _this.importFailureData = res.data.data.errorUsers
                        _this.successCount = res.data.data.successUsers.length
                        _this.importSuccessData = res.data.data.successUsers
                    }
                })
            }
            
            if(this.modal11Title == this.$t('assign')){
                if(this.importAgentId==''){
                    this.$Message.error(this.$t('user_table_import_agentId_error'))
                    return
                }
                if (this.selection.length == 0 && this.uploadTableDataContent.length==0){
                    this.$Message.error(this.$t('user_table_import_Content_error'))
                    return
                }
                this.sendAssign(this.uploadTableDataContent)
            }

            
        },
        turnDate(arr){
            for(let i=0;i<arr.length;i++){
                if(arr[i].ext1) arr[i].ext1 = this.$t(arr[i].ext1)
            }
        },
        batchSaveEdposUser(){
            const _this = this
            if(this.successCount==0){
                this.$Message.error(this.$t('user_table_import_Content_error'))
                return
            }
            batchSaveSN(this.importSuccessData)
            .then(function(res){
                if(res.data.code==0){
                    _this.$Message.success(_this.$t('user_table_import_success_list'))
                    _this.modal12=false
                    _this.getSnResources()
                }
            })
        },
        tabChange(name){
            if(this.tabName==name){return}
            if(this.tabName=='name1'){
                this.tabName='name2'
            }else{
                this.tabName='name1'
            }
        },
        search(){
            this.$refs.page.currentPage=1
            this.page.current = 1
            this.getSnResources()
        },
        getAgentList(){
            let _this = this
            queryAgentCompany()
            .then((res)=>{
                if(res.data.code==0){
                    res.data.data.forEach(function(item){
                        let obj = {
                            value:item.agentId,
                            label:item.companyName+'【'+item.account+'】'
                        }
                        _this.agentList.push(obj)
                    })
                }
                
            })
        },
        assign(){
            this.n = 1
            if(this.selection.length==0){
                this.$Message.error(this.$t('user_table_select_warning'))
                return
            }
            let used = false
            let assign = false
            this.selection.forEach(function(item){
                if(item.agentCompanyName&&item.agentCompanyName!=""){
                    assign = true
                }
                if(item.resState==0){
                    used = true
                }
            })
            // if(assign){
            //     this.$Message.warning(this.$t('usedError'))
            //     return
            // }
            if(used){
                this.$Message.warning(this.$t('usedError1'))
                return
            }
            this.isSingleAssign = false
            this.modal1 = true
        },
        comfirmAssign(){
            if(this.importAgentId==0){
                this.$Message.error(this.$t('user_table_import_agentId_error'))
                return
            }
            this.modal1=false;
            this.modal2=true
        },
        sendAssign(data){
            let _this = this
            if(data==0){
                data = this.isSingleAssign?this.singleAssign:this.selection
            }
            let param = {
                agentId:this.importAgentId,
                snResources:data
            }
            assignSN(param).
            then((res)=>{
                if(res.data.code==0){
                    _this.modal11 = false
                    _this.modal12 = true
                    _this.turnDate(res.data.data.errorUsers)
                    _this.turnDate(res.data.data.successUsers)
                    _this.errorCount = res.data.data.errorUsers.length
                    _this.importFailureData = res.data.data.errorUsers
                    _this.successCount = res.data.data.successUsers.length
                    _this.importSuccessData = res.data.data.successUsers
                    // _this.$Message.success(_this.$t('assignSuccess'))
                    _this.getSnResources()
                    _this.modal2 = false
                    _this.modal11 = false

                }
            })
        }
    },
    computed:{
        batchImport: function () {
          return this.$t('user_table_btn_batchImport')
        },
        user_table_batchImportContent:function () {
          return this.$t('user_table_batchImportContent')
        },
        Result:function () {
          return this.$t('Result')
        },
        Assign:function () {
          return this.$t('assign')
        },
    },
}
</script>

