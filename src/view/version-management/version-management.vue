<script type="text/javascript">
/* eslint-disable */
</script>
<style rel="stylesheet" lang="less">
    @import "../../styles/common.less";
    @import "./version-management.less";
    
</style>
<template>
    <div class="version_management">
        <Card class="searchCard">
            <div style="overflow:hidden">
                <div class="searchBox">
                    <span>{{$t('versionId')}}：</span> 
                    <Input v-model="searchMes.versionId" :placeholder="versionId_placeholder" clearable :maxlength='20' type="text"  style="width:160px"/>
                </div>
                <div class="searchBox">
                    <span>{{$t('pkgId')}}：</span>
                    <Input v-model="searchMes.pkgId" :placeholder="pkgId_placeholder" clearable type="text" :maxlength='20' style="width:160px"/>
                </div>
                 <div class="searchBox">
                    <span>{{$t('versionCode')}}：</span> 
                    <Input v-model="searchMes.versionCode" :placeholder="versionCode_placeholder" clearable :maxlength='20' type="text"  style="width:160px"/>
                </div>
                <div class="searchBox">
                    <span>{{$t('fileName')}}：</span>
                    <Input v-model="searchMes.fileName" :placeholder="fileName_placeholder" clearable type="text" :maxlength='20' style="width:160px"/>
                </div>
                <div class="searchBox">
                    <Button type="primary" @click='search'>&nbsp;&nbsp;{{$t('search')}}&nbsp;&nbsp;</Button>
                </div>
            </div>
        </Card>
        <div class="content">
            <div class="btns">
                <Button type="primary" @click="modal3=true">{{$t('push')}}</Button>
                <Button type="primary" @click="openUpload">{{$t('upload')}}</Button>
            </div>
            <div class="tableBox">
                <Table @on-selection-change="tableSelection" ref="selection" :columns="tableColums" :data="tableData"></Table>
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

        <Modal
            v-model="modal1"
            :title="uploadFile"
        >
             <Form ref="uploadFile" :model="uploadFileForm" :rules="ruleCustom" :label-width="120">
                <FormItem :label="versionCode" prop="versionCode">
                    <Input type="text" v-model="uploadFileForm.versionCode" :maxlength='20' :placeholder="versionCode_placeholder" style="width: 300px"></Input>
                </FormItem>
                <FormItem :label="versionId" prop="versionId">
                    <Input type="text" v-model="uploadFileForm.versionId" :maxlength='20' :placeholder="versionId_placeholder" style="width: 300px"></Input>
                </FormItem>  
                <FormItem :label="pkgId" prop="pkgId">
                    <Input type="text" v-model="uploadFileForm.pkgId" :maxlength='20' :placeholder="pkgId_placeholder" style="width: 300px"></Input>
                </FormItem> 
                <FormItem :label="uploadFile" prop="uploadFile">
                    <Upload 
                        action="/ccs/api/uploadAppVersionFile"
                        ref="uploadBtn"
                        v-model="uploadFileForm.uploadFile"
                        :name="uploadFileName"
                        :data="uploadFileForm"
                        :format="['apk']"
                        :on-success="handleSuccess"
                        :on-error="handleError"
                        :before-upload="beforeUpload"
                        :on-format-error="handleFormatError"
                    >
                        <Button icon="ios-cloud-upload-outline" @click="uploadBtnClick">{{this.$t('upload')}}{{this.$t('file')}}</Button>
                    </Upload>
                </FormItem> 
            </Form>
            <div slot="footer">
                <Button type="default" size="large" @click="modal1=false">
                    {{$t('close')}}
                </Button>
            </div>
        </Modal>
        <Modal
            v-model="modal2"
            :title="publish"
        >
            <h1 style="padding:20px;text-align:center">{{$t('comfirmPublish')}}</h1>
            <div slot="footer">
                <Button type="default" size="large" @click="modal2=false">
                    {{$t('cancel')}}
                </Button>
                <Button type="primary" size="large" @click="sendPublish">
                    {{$t('ok')}}
                </Button>
            </div>
        </Modal>
        <Modal
            v-model="modal3"
            :title="push"
        >
            <h1 style="padding:20px;text-align:center">{{$t('comfirmPushMessage')}}</h1>
            <div slot="footer">
                <Button type="default" size="large" @click="modal3=false">
                    {{$t('cancel')}}
                </Button>
                <Button type="primary" size="large" @click="sendPush">
                    {{$t('ok')}}
                </Button>
            </div>
        </Modal>
    </div>
    
</template>

<script type="ecmascript-6">
import { queryAppVersionFile,sendAppVersionMsg,startAppVersionFile,uploadAppVersionFile } from '@/api/version'
export default {
    created:function(){
        this.queryAppVersionFile()
    },
    data () {
        const validateUserName = (rule, value, callback) => {
            value = value.trim()
            if (value === '') {
                callback(new Error(this.$t('cannotEmpty')));
            } else if (value.length>20) {
                callback(new Error(this.$t('max_len_rules')));
            } else {
                callback();
            }
        };
    	return{
            isUploadOK:false,
            searchMes:{
                versionId:'',
                pkgId:'',
                fileName:'',
                versionCode:'',
                fileState:''
            },
            tableData:[],
            tableColums:[
                {
                  title: this.$t('versionId'),
                  key: 'versionId',
                  ellipsis: true,
                  render: (h, params) => {
                    return h('Tooltip', {
                      props: { placement: 'top-start' }
                    }, [
                      params.row.versionId,
                      h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.versionId)
                    ])
                  }
                },
                {
                  title: this.$t('pkgId'),
                  key: 'pkgId',
                  ellipsis: true,
                  render: (h, params) => {
                    return h('Tooltip', {
                      props: { placement: 'top-start' }
                    }, [
                      params.row.pkgId,
                      h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.pkgId)
                    ])
                  }
                },
                
                {
                  title: this.$t('versionCode'),
                  key: 'versionCode',
                  ellipsis: true,
                  render: (h, params) => {
                    return h('Tooltip', {
                      props: { placement: 'top-start' },
                    //   style:{
                    //     color:params.row.versionCode==this.$t('used')?'#19be6b':'#515a6e'
                    //   }
                    }, [
                      params.row.versionCode,
                      h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.versionCode)
                    ])
                  }
                },
                {
                  title: this.$t('fileName'),
                  key: ' fileName',
                  ellipsis: true,
                  render: (h, params) => {
                    return h('Tooltip', {
                      props: { placement: 'top-start' }
                    }, [
                      params.row. fileName,
                      h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row. fileName)
                    ])
                  }
                },
                {
                  title: this.$t('state'),
                  key: ' fileState',
                  ellipsis: true,
                  render: (h, params) => {
                    return h('Tooltip', {
                      props: { placement: 'top-start' },
                      style:{
                        color:params.row.fileState==this.$t('published')?'#19be6b':'#515a6e'
                      }
                    }, [
                      params.row.fileState,
                      h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row. fileState)
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
                                            this.fileId = params.row.fileId
                                            this.modal2 = true
                                        }
                                    },
                                    style:{
                                        // display:this.accessList.company_edit?'inline-block':'none',
                                        color:params.row.fileState==this.$t('published')?'#ccc':'#2DB7F5',
                                        cursor:'pointer'
                                    },
                                    props: {
                                        disabled:params.row.fileState==this.$t('published')?true:false,
                                        type: 'text',
                                        size: 'small'
                                    } 
                                },this.$t('publish'))
                        ]);
                    }
                }
              
            ],
            page:{
                total:0,
                current:1,
                size:10
            },
            selection:[],
            selectionUid:[],
            uploadFileName:'fileupload',
            uploadFileForm:{
                versionCode:'',
                versionId:'', 
                pkgId:''
            },
            ruleCustom:{
                versionCode: [
                    {required: true,validator: validateUserName, trigger: 'blur'}
                ],
                versionId: [
                    {required: true,validator: validateUserName, trigger: 'blur'}
                ],
                pkgId: [
                    {required: true,validator: validateUserName, trigger: 'blur'}
                ]
            },
            modal1: false, //
            modal2: false, //
            modal3: false, //
            fileId:'',



            uploadFile:this.$t('upload')+this.$t('file'),
            versionId:this.$t('versionId'),
            pkgId:this.$t('pkgId'),
            fileName:this.$t('fileName'),
            versionCode:this.$t('versionCode'),
            versionId_placeholder:this.$t('versionId_placeholder'),
            pkgId_placeholder:this.$t('pkgId_placeholder'),
            versionCode_placeholder:this.$t('versionCode_placeholder'),
            fileName_placeholder:this.$t('fileName_placeholder'),
            publish:this.$t('publish'),
            push:this.$t('push'),
    	}
    },


    methods:{
        queryAppVersionFile(){
            let _this = this
            let param = {
                page:this.page.current,
                rows:this.page.size,
                versionId:this.searchMes.versionId,
                pkgId:this.searchMes.pkgId,
                versionCode:this.searchMes.versionCode,
                fileName:this.searchMes.fileName,
                fileState:this.searchMes.fileState,
            }
            queryAppVersionFile(param).
            then(res=>{
                _this.page.total = res.data.count
                _this.tableData = _this.turnData(res.data.data)
                _this.selection = []
            })
        },
        search(){
            this.$refs.page.currentPage=1
            this.page.current = 1
            this.queryAppVersionFile()
        },
        turnData(data){
            let _this = this
            data.forEach(function(item,index){
                item.fileState=item.fileState==2?_this.$t('unpublished'):_this.$t('published')
            })
            return data
        },
        changePage(current){
            this.page.current = current
            this.queryAppVersionFile()
        },
        changePageSize(current){
            this.page.size = current
            this.queryAppVersionFile()
        },
        tableSelection (selection) {
            let _this = this
            this.newQuery = false
            this.selection = selection
            
            this.selection.forEach(function(item){
                item.resState=item.resState==_this.$t('used')?0:1
            })
        },
        openUpload(){
            this.uploadFileForm={
                versionCode:'',
                versionId:'', 
                pkgId:''
            },
            this.$refs.uploadBtn.clearFiles()
            this.modal1 = true
        },
        uploadBtnClick(){
            
        },
        beforeUpload(obj){
            if(this.uploadFileForm.versionCode==""||this.uploadFileForm.versionId==""||this.uploadFileForm.pkgId==""){
                this.$Message.error(this.$t('pleaseEnterMsgFirst'))
                return false
            }
            // this.uploadFileName = obj.name
            this.$refs.uploadBtn.clearFiles()
        },
        handleSuccess(response, file, fileList){
            this.$Message.success(this.$t('upload')+this.$t('success'))
            this.queryAppVersionFile()
            this.modal1 = false
        },
        handleError(error, file, fileList){
            this.$Message.error(this.$t('upload')+this.$t('fail'))
        },
        handleFormatError(file){
            this.$Message.error(this.$t('fileTypeErr'))
        },
        sendPublish(){
            let _this = this
            startAppVersionFile({fileId:this.fileId})
            .then(res=>{
                if(res.data.code==0){
                    _this.$Message.success(_this.$t('publish')+_this.$t('success'))
                    _this.modal2 = false
                    _this.queryAppVersionFile()
                }
            })
        },
        sendPush(){
            let _this = this
            sendAppVersionMsg()
            .then(res=>{
                if(res.data.code==0){
                    _this.$Message.success(_this.$t('push')+_this.$t('success'))
                    _this.modal3 = false
                    // _this.queryAppVersionFile()
                }
            })
        },
    },
    computed:{
        
    }
}
</script>

