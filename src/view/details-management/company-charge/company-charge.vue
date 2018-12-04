<template>
    <div class="company_charge">
        <Card class="search">
            <div>
                <div class="search_item">
                    <div class="search_label">{{$t('home_echart_date')}}</div>
                    <div class="search_input">
                        <DatePicker v-model='searchMes.date'  type="datetimerange" :options="dateOptions" :placeholder="SelectDate" style="width: 300px"></DatePicker>
                    </div>
                </div>
                <div class="search_item">
                    <div class="search_label">{{$t('alarmType')}}</div>
                    <div class="search_input">
                        <Select v-model="searchMes.busiType" style="width:150px" :placeholder="busiType_placeholder">
                            <Option v-for="item in busiTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>
                </div>
                
                
                <div class="moreSearch">
                    <a @click="showMoreSearch">{{moreSearch}}</a>
                </div>
                <div class="moreSearch">
                    <Button type='primary' @click="search">{{$t('search')}}</Button>
                </div>
            </div>
            <div class="moreSearchContent" v-if="moreSearch==$t('normalSearch')">
                <!-- <div class="search_item">
                    <div class="search_label">{{$t('name')}}</div>
                    <div class="search_input">
                        <Input v-model="searchMes.agentUname" style="width: 250px" clearable :placeholder="agentUname_placeholder" />
                    </div>
                </div> -->
                <div class="search_item">
                    <div class="search_label">{{$t('agent')}}</div>
                    <div class="search_input">
                        <Select 
                          v-model="searchMes.agentId" 
                          @on-change="selectAgent" 
                          clearable 
                          style="width:200px"
                          filterable
                          ref="select1"
                        >
                            <Option v-for="item in agentList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>
                </div>
                <div class="search_item">
                    <div class="search_label">{{$t('company')}}</div>
                    <div class="search_input">
                        <Select 
                          v-model="searchMes.partyId" 
                          @on-change="selectCompany" 
                          clearable 
                          style="width:200px"
                          filterable
                          ref="select2"
                        >
                            <Option v-for="item in companyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>
                </div>
                <div class="search_item">
                    <div class="search_label">{{$t('account')}}</div>
                    <div class="search_input">
                        <Select 
                          v-model="searchMes.uid" 
                          clearable 
                          style="width:200px"
                          filterable
                          ref="select3"
                        >
                        <Option v-for="item in userList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>
                </div>
                <div class="moreSearch">
                    <a @click="reset">{{$t('reset')}}</a>
                </div>
            </div>

        </Card>
    	<div class="content" ref='content'>
           
            <div class="table">
                <Table :columns="columns" :data="tableData"></Table>
            </div>  
            
      </div>
      <div class="pages">
          <div>
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
      <Modal v-model="modal1" class='details_remark'>
          <p slot="header">
              <span>{{$t('remark')}}</span>
          </p>
          <div class='p'><span>{{$t('describe')}}：</span>{{remarkDesc}}</div>
          <div class='p'>
             <span>{{$t('remark')}}：</span>
              <Input v-model="remarkContent" :maxlength="1000" type="textarea" :rows="4" :placeholder="enterRemark" />
          </div>
          <div slot="footer">
              <Button type="default" size="large" @click="modal1=false">{{$t('cancel')}}</Button>
              <Button type="primary" size="large" @click="sendRemark">{{$t('ok')}}</Button>
          </div>
      </Modal>
    </div>
    
</template>

<script type="ecmascript-6">
import { queryCreditRecord,setCreditRecordRemark,queryAgentCompanyShort,queryUserPartyCompanyShort,queryUserBasicShort } from '@/api/details-manage'
import { getSession} from '@/api/user'
import {dateFormat} from '@/libs/tools'
import { mapMutations } from 'vuex'
export default {
    data () {
        
        return {
            moreSearch:this.$t('moreSearch'),
            columns:[
                {
                  title: this.$t('home_echart_date'),
                  key: 'createTime',
                  width:150,
                  ellipsis: true,
                  render: (h, params) => {
                    return h('Tooltip', {
                      props: { placement: 'top-start' }
                    }, [
                      params.row.createTime,
                      h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.createTime)
                    ])
                  }
                },
                
                {
                  title: this.$t('register_firm_name_label'),
                  key: 'companyName',
                  ellipsis: true,
                  render: (h, params) => {
                    return h('Tooltip', {
                      props: { placement: 'top-start' }
                    }, [
                      params.row.companyName,
                      h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.companyName)
                    ])
                  }
                },
                {
                  title: this.$t('user_name'),
                  key: 'uname',
                  ellipsis: true,
                  render: (h, params) => {
                    return h('Tooltip', {
                      props: { placement: 'top-start' }
                    }, [
                      params.row.uname,
                      h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.uname)
                    ])
                  }
                },
                {
                  title: this.$t('alarmType'),
                  key: 'busiType',
                  ellipsis: true,
                  render: (h, params) => {
                    return h('Tooltip', {
                      props: { placement: 'top-start' }
                    }, [
                      params.row.busiType,
                      h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.busiType)
                    ])
                  }
                },
                {
                  title: this.$t('beforeBalance'),
                  key: 'chgBefore',
                  ellipsis: true,
                  render: (h, params) => {
                    return h('Tooltip', {
                      props: { placement: 'top-start' }
                    }, [
                      params.row.chgBefore,
                      h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.chgBefore)
                    ])
                  }
                },
                
                {
                  title: this.$t('value'),
                  key: 'chgValue',
                  ellipsis: true,
                  render: (h, params) => {
                    return h('Tooltip', {
                      props: { placement: 'top-start' }
                    }, [
                      params.row.chgValue,
                      h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.chgValue)
                    ])
                  }
                },
                {
                  title: this.$t('afterBalance'),
                  key: 'chgAfter',
                  ellipsis: true,
                  render: (h, params) => {
                    return h('Tooltip', {
                      props: { placement: 'top-start' }
                    }, [
                      params.row.chgAfter,
                      h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.chgAfter)
                    ])
                  }
                },
                {
                  title: this.$t('operator'),
                  key: 'agentUname',
                  ellipsis: true,
                  render: (h, params) => {
                    return h('Tooltip', {
                      props: { placement: 'top-start' }
                    }, [
                      params.row.agentUname,
                      h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.agentUname)
                    ])
                  }
                },
                {
                    title: this.$t('user_table_col_action'),
                    key: 'action',
                    align: 'center',
                    width:150,
                    fixed: 'right',
                    render: (h, params) => {
                        return h('div', [
                            h('Button',
                                {
                                    on: {
                                        click: () => {
                                          this.remarkContent =  params.row.ext1 || ''
                                          this.remarkDesc =  params.row.remark || ''
                                          this.logId = params.row.logId
                                          this.modal1 = true
                                        }
                                    },
                                    style:{
                                        // display:this.accessList.child_agent_recharge?'inline-block':'none',
                                        cursor:'pointer',
                                        color:'#2DB7F5'
                                    },
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    } 
                                },this.$t('remark')),
                            
                        ]);
                    }
                }
            ],
            tableData:[],
            modal1:false,
            remarkContent:'',
            remarkDesc:'',
            logId:'',
            searchMes:{
                busiType:'',
                date:['',''],
                agentId:'',
                partyId:'',
                uid:''
            },
            busiTypeList:[
                {
                  value:'',
                  label:this.$t('all')
                },
                {
                  value:'1',
                  label:this.$t('busiType1')
                },
                {
                  value:'2',
                  label:this.$t('busiType2')
                },
                {
                  value:'3',
                  label:this.$t('busiType3')
                }
            ],
            page:{
                total:0,
                current:1,
                size:10
            },
            dateOptions: {
              shortcuts: [
                  {
                      text: this.$t('1week'),
                      value () {
                          const end = new Date();
                          const start = new Date();
                          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                          return [start, end];
                      }
                  },
                  {
                      text: this.$t('1month'),
                      value () {
                          const end = new Date();
                          const start = new Date();
                          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                          return [start, end];
                      }
                  },
                  {
                      text: this.$t('3months'),
                      value () {
                          const end = new Date();
                          const start = new Date();
                          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                          return [start, end];
                      }
                  }
              ]
            },
            agentList:[],
            saveAgentList:[],
            companyList:[],
            userList:[],
            loading1:false,
            loading2:false,
            loading3:false
        }
    },
   
    created:function(){
        this.queryCreditRecord()
        this.quertAgentList()
        
    },
    methods: {
        queryCreditRecord(){
            let _this = this
            let params={
                page:this.page.current,
                rows:this.page.size,
                agentUname:this.searchMes.agentUname,
                busiType:this.searchMes.busiType,
                startDate:this.searchMes.date[0]?dateFormat(new Date(this.searchMes.date[0]),'yyyy-MM-dd'):'',
                endDate:this.searchMes.date[1]?dateFormat(new Date(this.searchMes.date[1]),'yyyy-MM-dd'):'',
                agentId:this.searchMes.agentId,
                partyId:this.searchMes.partyId,
                uid:this.searchMes.uid
            }
            queryCreditRecord(params)
            .then((res)=>{
                if(res.data.code==0){
                    _this.page.total = res.data.count
                    _this.trunTableData(res.data.data)
                }
                
            })
        },
        trunTableData(data){
            this.tableData=[]
            for(let i=0;i<data.length;i++){
                if(!data[i].authMonth){
                    data[i].authMonth = 0
                }
                if(data[i].ccsUid){
                    data[i].companyName=data[i].agentName
                    data[i].agentUname=data[i].ccsUname
                }
                data[i].createTime = dateFormat(new Date(data[i].createTime),'yyyy-MM-dd hh:mm:ss')
                switch(data[i].busiType){
                    case 1:
                        data[i].busiType = this.$t('busiType1');
                        break;
                    case 2:
                        data[i].busiType = this.$t('busiType2');
                        break;
                    case 3:
                        data[i].busiType = this.$t('busiType3');
                        break;
                }
            }

            this.tableData=data
        },
        changePage(current){
            this.page.current = current
            this.queryCreditRecord()
        },
        changePageSize(current){
            this.page.size = current
            this.queryCreditRecord()
        },
        search(){
            this.page.current=1
            this.$refs.page.currentPage=1
            this.queryCreditRecord()
        },
        sendRemark(){
          let _this = this
          if(this.remarkContent==''){
            this.$Message.error(this.$t('ctremark'))
          }else{
            let params = {
              logId:this.logId,
              remark:this.remarkContent
            }
            setCreditRecordRemark(params)
            .then(function(res){
              if(res.data.code==0){
                _this.$Message.success(_this.$t('user_table_modify_ok'))
                _this.queryCreditRecord()
                _this.modal1 = false
              }
            })
          }
        },
        showMoreSearch(){
            if(this.moreSearch==this.$t('moreSearch')){
                this.moreSearch=this.$t('normalSearch')
                this.$refs.content.style.top='130px';
            }else{
                this.moreSearch=this.$t('moreSearch')
                this.$refs.content.style.top='70px';
            }
        },
        quertAgentList(param){
            let _this = this
            _this.agentList = []
            queryAgentCompanyShort(param)
            .then((res)=>{
                if(res.data.code==0){
                    res.data.obj.forEach(function(item){
                        let obj = {
                            value : item[0],
                            label : item[1]
                        }
                        _this.agentList.push(obj)
                    })
                }
            })
        },
        quertCompanyList(param){
            let _this = this
            _this.companyList = []
            queryUserPartyCompanyShort(param).
            then((res)=>{
              if(res.data.code==0){
                res.data.obj.forEach(function(item){
                    let obj = {
                        value : item[0],
                        label : item[1]
                    }
                    _this.companyList.push(obj)
                })
              }
            })
        },
        quertUserList(param){
            let _this = this
            _this.userList= []
            queryUserBasicShort(param).
            then((res)=>{
              if(res.data.code==0){

                res.data.obj.forEach(function(item){
                    let obj = {
                        value : item[0],
                        label : item[1]
                    }
                    _this.userList.push(obj)
                })
              }
            })
        },
        selectAgent(data){
            this.companyList=[]
            this.userList=[]
            this.searchMes.partyId=''
            this.searchMes.uid=''
            if(data){
              this.quertCompanyList({agentId:data})
            }
            
        },
        selectCompany(data){
            this.userList=[]
            this.searchMes.uid=''
            if(data){
              this.quertUserList({partyId:data})
            }
        },
        reset(){
          this.searchMes={
                busiType:'',
                date:['',''],
          }
          this.$refs.select1.clearSingleSelect()
          this.$refs.select2.clearSingleSelect()
          this.$refs.select3.clearSingleSelect()
          this.companyList=[]
          this.userList=[]
        }
    },
    computed:{
        enterRemark:function(){
            return this.$t('enterRemark')
        },
        SelectDate:function(){
            return this.$t('SelectDate')
        },
        agentUname_placeholder:function(){
            return this.$t('agentUname_placeholder')
        },
        busiType_placeholder:function(){
            return this.$t('busiType_placeholder')
        },
        please_enter_name:function(){
            return this.$t('please_enter_name')
        },
        renewPriceMax:function () {
          return parseInt(this.comRenewMax)
        },
        renewBlance:function () {
          return this.comRenewMax-this.renewCount
        },
        renewCount:function () {
          return this.renew_form.monthNumber
        },
        comRenewMax: function () {
          return this.renewMax
        },
        edit_agent: function () {
          return this.$t('edit_agent')
        },
        addConfirm: function () {
          return this.$t('addConfirm')
        },
        name: function () {
          return this.$t('name')
        },
        user_table_modal1_pwd_placeholder: function () {
          return this.$t('user_table_modal1_pwd_placeholder')
        },
        user_table_modal1_userName_placeholder: function () {
          return this.$t('user_table_modal1_userName_placeholder')
        },
        register_repeat_pwd_placeholder: function () {
          return this.$t('register_repeat_pwd_placeholder')
        },
        user_table_modal1_pwd_label:function () {
          return this.$t('user_table_modal1_pwd_label')
        },
        register_firm_name_placeholder: function () {
          return this.$t('register_firm_name_placeholder')
        },
        user_table_modal1_account_label: function () {
          return this.$t('user_table_modal1_account_label')
        },
        user_table_modal1_account_placeholder: function () {
          return this.$t('user_table_modal1_account_placeholder')
        },
        user_table_btn_add: function () {
          return this.$t('user_table_btn_add')
        },
        user_table_modal1_expireDate_placeholder: function () {
          return this.$t('user_table_modal1_expireDate_placeholder')
        },
        register_firm_name_placeholder: function () {
          return this.$t('register_firm_name_placeholder')
        },
        user_table_modal1_account_label: function () {
          return this.$t('user_table_modal1_account_label')
        },
        user_table_modal1_account_placeholder: function () {
          return this.$t('user_table_modal1_account_placeholder')
        },
        renew: function () {
          return this.$t('renew')
        },
        Recharge: function () {
          return this.$t('Recharge')
        },
        RechargeByMonth: function () {
          return this.$t('RechargeByMonth')
        },
        renew_type: function () {
          return this.$t('renew_type')
        },
        renew_by_month: function () {
          return this.$t('renew_by_month')
        },
        renew_by_date: function () {
          return this.$t('renew_by_date')
        },
        renew_by_month_label: function () {
          return this.$t('renew_by_month_label')
        },
        renew_by_date_label: function () {
          return this.$t('renew_by_date_label')
        },
        renew_by_month_placeholder: function () {
          return this.$t('renew_by_month_placeholder')
        },
        renew_by_date_placeholder: function () {
          return this.$t('renew_by_date_placeholder')
        },
        renew_expiredDate: function () {
          return this.$t('renew_expiredDate')
        },
        user_table_modal1_expireDate_placeholder: function () {
          return this.$t('user_table_modal1_expireDate_placeholder')
        },
        my_balance: function () {
          return this.$t('my_balance')
        },
        add_agent: function () {
          return this.$t('add_agent')
        },
        agent_acount_label: function () {
          return this.$t('agent_acount_label')
        },
        agent_acount_placeholder: function () {
          return this.$t('agent_acount_placeholder')
        },
        agent_name_label: function () {
          return this.$t('agent_name_label')
        },
        agent_name_placeholder: function () {
          return this.$t('agent_name_placeholder')
        },
        confirm_password: function () {
          return this.$t('confirm_password')
        },
        contacts: function () {
          return this.$t('contacts')
        },
        contacts_palcehoolder: function () {
          return this.$t('contacts_palcehoolder')
        },
        contacts_number: function () {
          return this.$t('contacts_number')
        },
        user_table_modal2_title: function () {
          return this.$t('user_table_modal2_title')
        },
        user_table_modal1_tel_placeholder:function(){
            return this.$t('user_table_modal1_tel_placeholder')
        },
        agent_address_label:function(){
            return this.$t('agent_address_label')
        },
        agent_address_placeholder:function(){
            return this.$t('agent_address_placeholder')
        },
        contacts_number:function(){
            return this.$t('contacts_number')
        },
        current_balance:function(){
            return this.$t('current_balance')
        },
        surplus:function(){
            return this.$t('surplus')
        },
        total:function(){
            return this.$t('total')
        },
    },
    mounted:function(){
        window.document.title = localStorage.getItem('platformNameLong')
    }

};    
</script>

<style rel="stylesheet" lang="less">
    @import "../../../styles/common.less";
    @import './company-charge.less';
</style>