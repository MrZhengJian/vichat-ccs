<template>
    <div class="agent_management">
        <Card class="search">
            <div>
                <div class="search_item">
                    <div class="search_label">{{$t('name')}}</div>
                    <div class="search_input">
                        <Input v-model="searchMes.companyName" :maxlength='60' clearable :placeholder="agent_name_placeholder" />
                    </div>
                </div>
                <div class="search_item">
                    <div class="search_label">{{$t('user_table_modal1_account_label')}}</div>
                    <div class="search_input">
                        <Input v-model="searchMes.account" :maxlength='20' clearable :placeholder="agent_acount_placeholder" />
                    </div>
                </div>

                <div class="search_item">
                    <Button type='primary' @click="search">{{$t('search')}}</Button>
                </div>
            </div>

        </Card>
    	<div class="content" ref='content'>
            <div class="btns">
                <Button type='primary' v-if="accessList.agent_add" @click="addAgent">{{$t('addagent')}}</Button>
            </div>
            <div class="table">
                <Table stripe :height="tableHeight" :columns="columns" :data="tableData"></Table>
            </div>
        </div>
        <div class="page">
	        <div style="float: right;">
	            <Page
                  ref="pages"
                  @on-change="changePage"
                  @on-page-size-change="changePageSize"
                  :total='pages.total'
                  show-total
                  :page-size-opts = "[10,20,50]"
                  show-elevator
                  show-sizer
                  placement="top"
              ></Page>
	        </div>
	    </div>
        <!-- 添加代理商 -->
        <Modal :title="add_agent" v-model="modal1" :width="600">
            <Form class="myForm" :model="form" :label-width="150" ref="form" :rules="ruleCustom">
                <FormItem :label="agent_name_label" prop="companyName">
                    <Input type="text" v-model='form.companyName' :maxlength='60' :placeholder="agent_name_placeholder" style="width:300px;"></Input>
                </FormItem>
                <FormItem :label="agent_acount_label" prop="account">
                    <Input type="text" v-model="form.account" :maxlength='20' :placeholder="agent_acount_placeholder" style="width:300px;"></Input>
                </FormItem>
                <FormItem :label="user_table_modal1_pwd_label" prop="password">
                    <Input type="password" v-model='form.password' :maxlength='16' :minlength='6' :placeholder="user_table_modal1_pwd_placeholder" style="width:300px;"></Input>
                </FormItem>
                <FormItem :label="confirm_password" prop="repassword">
                    <Input type="password" v-model='form.repassword' :maxlength='16' :minlength='6' :placeholder="register_repeat_pwd_placeholder" style="width:300px;"></Input>
                </FormItem>
                <FormItem :label="contacts" prop="adminName">
                    <Input type="text" v-model='form.adminName' :maxlength='20' :placeholder="contacts_palcehoolder" style="width:300px;"></Input>
                </FormItem>
                <FormItem :label="contacts_number" prop="mobile">
                    <Input type="text" v-model="form.mobile" :maxlength='100' :placeholder="user_table_modal1_tel_placeholder" style="width:300px;"></Input>
                </FormItem>
                <FormItem label="URL" prop="url">
                    <Input type="text" v-model='form.url' :maxlength='40' style="width:300px;"></Input>
                </FormItem>
                <FormItem :label="agent_address_label" prop="address">
                    <Input type="text" v-model="form.address" :maxlength='100' :placeholder="agent_address_placeholder" style="width:300px;"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="default" size="large" @click="modal1=false">{{$t('cancel')}}</Button>
                <Button type="primary" size="large" @click="sendAddAgent">{{$t('ok')}}</Button>
            </div>
        </Modal>
        <!-- 编辑 -->
        <Modal :title="edit_agent"  v-model="modal4" >
            <Form class="myForm" :model="form" :label-width="120" ref="form1" :rules="ruleCustom">
                <FormItem :label="agent_name_label" prop="companyName">
                    <Input disabled type="text" v-model='form.companyName' :maxlength='60' :placeholder="agent_name_placeholder" style="width:300px;"></Input>
                </FormItem>
                <FormItem :label="agent_acount_label" prop="account">
                    <Input disabled type="text" v-model="form.account" :maxlength='20' :placeholder="agent_acount_placeholder" style="width:300px;"></Input>
                </FormItem>
                <FormItem :label="contacts" prop="adminName">
                    <Input type="text" v-model='form.adminName' :maxlength='20' :placeholder="contacts_palcehoolder" style="width:300px;"></Input>
                </FormItem>
                <FormItem :label="contacts_number" prop="mobile">
                    <Input type="text" v-model="form.mobile" :maxlength='100' :placeholder="user_table_modal1_tel_placeholder" style="width:300px;"></Input>
                </FormItem>
                <FormItem label="URL" prop="url">
                    <Input type="text" v-model='form.url' :maxlength='40' style="width:300px;"></Input>
                </FormItem>
                <FormItem :label="agent_address_label" prop="address">
                    <Input type="text" v-model="form.address" :maxlength='100' :placeholder="agent_address_placeholder" style="width:300px;"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="default" size="large" @click="modal4=false">{{$t('cancel')}}</Button>
                <Button type="primary" size="large" @click="sendModify">{{$t('ok')}}</Button>
            </div>
        </Modal>
        <!-- 续约 -->
        <Modal :title="Recharge" v-model="modal3">
            <Form :model="renew_form" ref="renew" :rules="renewRule"  :label-width="120">
                <FormItem  :label="RechargeByMonth"  style="margin:12px;">
                    <InputNumber :min="1" v-model="renew_form.monthNumber" :max="99999999" style="width: 300px"></InputNumber>
                </FormItem>
                <FormItem  :label="remark"  style="margin:12px;">
                    <Input v-model="renew_form.record" type="textarea" :rows="3" :maxlength='100' style="width: 300px"/>
                </FormItem>
            </Form>
             <div slot="footer">
                <Button type="default" size="large" @click="modal3=false">{{$t('cancel')}}</Button>
                <Button type="primary" size="large" @click="renewConfirm">{{$t('ok')}}</Button>
            </div>
        </Modal>
        <!-- 续约确认 -->
        <Modal :title="Recharge" v-model="modal2" >
           <h1 style="text-align:center;margin:20px;">{{$t('Recharge_confirm')}}</h1>
           <div slot="footer">
                <Button type="default" size="large" @click="modal2=false">{{$t('cancel')}}</Button>
                <Button type="primary" size="large" @click="sendRenew">{{$t('ok')}}</Button>
            </div>
        </Modal>
        <!-- 行内删除提示 -->
        <Modal :title="modal3_title" v-model="modal13">
            <p style="margin:20px 0;text-align:center;font-size:20px">
                {{$t('user_table_modal7_content')}}
            </p>
            <div slot="footer">
                <Button type="default" size="large" @click="modal13=false">
                    {{$t('cancel')}}
                </Button>
                <Button type="primary" size="large" @click="confirmDeletion">
                    {{$t('ok')}}
                </Button>
            </div>
        </Modal>
        <!-- 修改密码 -->
        <Modal :title="modal6_title" v-model="modal6">
            <Form ref="changePassword" :model="changePassword" :label-width="120" :rules="ruleCustom">
                <FormItem :label="user_table_modal6_newPwd_label" prop="password">
                    <Input type="password" v-model="changePassword.password" :placeholder="user_table_modal6_newPwd_placeholder" :minlength="6" :maxlength='16' style="width: 300px" ></Input>
                </FormItem>
                <FormItem :label="repeat" prop="repassword1">
                    <Input type="password" v-model="changePassword.repassword1" :placeholder="register_repeat_pwd_placeholder" :minlength="6" :maxlength='16' style="width: 300px" ></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="default" size="large" @click="modal6=false">
                    {{$t('cancel')}}
                </Button>
                <Button type="primary" size="large" @click="sendNewpwd">
                    {{$t('ok')}}
                </Button>
            </div>
        </Modal>
    </div>

</template>

<script type="ecmascript-6">
import { queryCompany, queryAgentCompany, registerAgentCompany, batchUpdateCompanyExpiredDate, saveAgentCompany, deleteAgentCompany, chgAgentPassword} from '@/api/agent-manage'
import { getSession} from '@/api/user'
import {dateFormat} from '@/libs/tools'
import { mapMutations } from 'vuex'
export default {
  data () {
    const validateAccount = (rule, value, callback) => {
      value = value.trim()
      if (value === '') {
        callback(new Error(this.$t('cannotEmpty')))
      } else if (value.length > 20) {
        callback(new Error(this.$t('max_len_rules')))
      } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        callback(new Error(this.$t('account_reg_error')))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      value = value.trim()
      if (value === '') {
        callback(new Error(this.$t('cannotEmpty')))
      } else if (value.length > 18 || value.length < 6) {
        callback(new Error(this.$t('pwd_len_rules')))
      } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        callback(new Error(this.$t('account_reg_error')))
      } else {
        callback()
      }
    }
    const validateRepassword = (rule, value, callback) => {
      value = value.trim()
      if (value === '') {
        callback(new Error(this.$t('cannotEmpty')))
      } else if (value.length > 18 || value.length < 6) {
        callback(new Error(this.$t('pwd_len_rules')))
      } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        callback(new Error(this.$t('account_reg_error')))
      } else if (value !== this.form.password) {
        callback(new Error(this.$t('register_password_repeat')))
      } else {
        callback()
      }
    }
    const validateRepassword1 = (rule, value, callback) => {
      value = value.trim()
      if (value === '') {
        callback(new Error(this.$t('cannotEmpty')))
      } else if (value.length > 18 || value.length < 6) {
        callback(new Error(this.$t('pwd_len_rules')))
      } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        callback(new Error(this.$t('account_reg_error')))
      } else if (value !== this.changePassword.password) {
        callback(new Error(this.$t('register_password_repeat')))
      } else {
        callback()
      }
    }
    const validateUserName = (rule, value, callback) => {
      value = value.trim()
      if (value === '') {
        callback(new Error(this.$t('cannotEmpty')))
      } else if (value.length > 20) {
        callback(new Error(this.$t('max_len_rules')))
      } else {
        callback()
      }
    }
    const validateUserName1 = (rule, value, callback) => {
      value = value.trim()
      if (value === '') {
        callback()
      } else if (value.length > 20) {
        callback(new Error(this.$t('max_len_rules')))
      } else {
        callback()
      }
    }
    return {
      agentList: [],
      agentItemId: '',
      winHeight: document.body.clientHeight,
      winWidth: document.body.clientWidth,
      accessList: {
        'agent_edit': this.$store.state.user.funcObj.agent_edit || false,
        'agent_recharge': this.$store.state.user.funcObj.agent_recharge || false,
        'agent_add': this.$store.state.user.funcObj.agent_add || false,
        'child_agent_del': this.$store.state.user.funcObj.child_agent_del || false
      },
      moreSearch: this.$t('moreSearch'),
      changePassword: { // 修改密码时
        password: '',
        repassword1: '',
        agentId: ''
      },
      pages: {
        page: 1,
        rows: 10,
        total: 0
      },
      columns: [

        {
          title: this.$t('agent'),
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
          title: this.$t('contacts'),
          key: 'adminName',
          ellipsis: true,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top-start' }
            }, [
              params.row.adminName,
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.adminName)
            ])
          }
        },
        {
          title: this.$t('contacts_number'),
          key: 'mobile',
          ellipsis: true,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top-start' }
            }, [
              params.row.mobile,
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.mobile)
            ])
          }
        },
        {
          title: this.$t('user_table_modal1_account_label'),
          key: 'account',
          ellipsis: true,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top-start' }
            }, [
              params.row.account,
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.account)
            ])
          }
        },
        {
          title: this.$t('balance'),
          key: 'authMonth',
          ellipsis: true,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top-start' }
            }, [
              params.row.authMonth,
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.authMonth)
            ])
          }
        },
        {
          title: this.$t('leafLevel'),
          key: 'leafLevel',
          ellipsis: true,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top-start' }
            }, [
              params.row.leafLevel,
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.leafLevel)
            ])
          }
        },
        {
          title: this.$t('user_table_col_action'),
          key: 'action',
          align: 'center',
          width: 300,
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
              h('Button',
                {
                  on: {
                    click: () => {
                      this.openRenew(params)
                    }
                  },
                  style: {
                    display: this.accessList.agent_recharge ? 'inline-block' : 'none',
                    cursor: 'pointer',
                    color: params.row.leafLevel == 1 ? '#2DB7F5' : '#ddd'
                  },
                  props: {
                    disabled: params.row.leafLevel != 1,
                    type: 'text',
                    size: 'small'
                  }
                }, this.$t('Recharge')),
              h('Button',
                {
                  on: {
                    click: () => {
                      this.edit(params)
                    }
                  },
                  style: {
                    display: this.accessList.agent_edit ? 'inline-block' : 'none',
                    cursor: 'pointer',
                    color: '#2DB7F5'
                  },
                  props: {
                    type: 'text',
                    size: 'small'
                  }
                }, this.$t('user_table_col_edit')),
              h('Button',
                {
                  on: {
                    click: () => {
                      this.changePwd(params)
                    }
                  },
                  style: {
                    display: this.accessList.child_agent_del ? 'inline-block' : 'none',
                    cursor: 'pointer',
                    color: '#2DB7F5'
                  },
                  props: {
                    type: 'text',
                    size: 'small'
                  }
                }, this.$t('user_table_col_pwd')),
              h('Button',
                {
                  on: {
                    click: () => {
                      // console.log(params)
                      this.agentId = params.row.agentId
                      this.modal13 = true
                    }
                  },
                  style: {
                    display: this.accessList.child_agent_del ? 'inline-block' : 'none',
                    color: '#F25E43',
                    cursor: 'pointer'
                  },
                  props: {
                    type: 'text',
                    size: 'small'
                  }
                }, this.$t('user_table_col_delete'))
            ])
          }
        }
      ],
      tableData: [],
      modal1: false,
      modal2: false,
      modal3: false,
      modal4: false,
      modal6: false,
      modal13: false,
      agentId: '',
      searchMes: {
        companyName: '',
        account: ''
      },
      form: {
        companyName: '',
        account: '',
        password: '',
        parentId: this.parentId,
        adminName: '',
        url: 'http://',
        address: '',
        mobile: ''
      },
      modifyParam: {},
      ruleCustom: {
        companyName: [
          {required: true, validator: validateUserName, trigger: 'blur'}
        ],
        password: [
          {required: true, validator: validatePassword, trigger: 'blur'}
        ],
        repassword: [
          {required: true, validator: validateRepassword, trigger: 'blur'}
        ],
        repassword1: [
          {required: true, validator: validateRepassword1, trigger: 'blur'}
        ],
        account: [
          {required: true, validator: validateAccount, trigger: 'blur'}
        ],
        adminName: [
          {required: true, validator: validateUserName, trigger: 'blur'}
        ]

      },
      renewMax: 0,
      renew_form: {
        agentIds: '',
        monthNumber: 1,
        record: ''
      },
      renewRule: {
        monthNumber: [
          {required: true, message: this.$t('renew_by_month_rule'), trigger: 'blur'}
        ],
        expiredDate: [
          {required: true, message: this.$t('renew_by_date_rule'), trigger: 'blur'}
        ]
      }
    }
  },

  created: function () {
    let _this = this
    // 表格
    this.queryAgentCompany()
  },
  mounted: function () {
    let _this = this

    this.winHeight = document.body.clientHeight
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        _this.winWidth = window.screenWidth
        window.screenHeight = document.body.clientHeight
        _this.winHeight = window.screenHeight
      })()
    }
  },
  watch: {
    winHeight (val) {
      if (!this.timer) {
        this.winHeight = val
        console.log(val)
        this.timer = true
        let _this = this
        setTimeout(function () {
          // that.screenWidth = that.$store.state.canvasWidth
          // console.log(_this.winHeight)
          // _this.init()
          _this.timer = false
        }, 400)
      }
    }
  },
  methods: {
    queryAgentCompany () {
      let _this = this
      let param = {
        companyName: this.searchMes.companyName,
        account: this.searchMes.account,
        page: this.pages.page,
        rows: this.pages.rows
      }
      queryAgentCompany(param)
        .then((res) => {
          if (res.data.code == 0) {
            _this.pages.total = res.data.count
            _this.trunTableData(res.data.data)
          }
        })
    },
    trunTableData (data) {
      this.tableData = []
      for (let i = 0; i < data.length; i++) {
        if (!data[i].authMonth) {
          data[i].authMonth = 0
        }
      }
      this.tableData = data
    },
    search () {
      this.$refs.pages.currentPage = 1
      this.pages.page = 1
      this.queryAgentCompany()
    },
    showMoreSearch () {
      if (this.moreSearch == this.$t('moreSearch')) {
        this.moreSearch = this.$t('normalSearch')
      } else {
        this.moreSearch = this.$t('moreSearch')
      }
    },
    addAgent () {
      console.log(11)
      this.clear()
      this.modal1 = true
    },
    sendAddAgent () {
      let _this = this
      let params = JSON.parse(JSON.stringify(this.form))
      this.$refs.form.validate((valid) => {
        if (valid) {
          registerAgentCompany(params).then(res => {
            if (res.data.code == 0) {
              _this.$Message.success(_this.$t('success'))
              _this.queryAgentCompany()
              _this.modal1 = false
            }
          })
        }
      })
    },
    edit (param) {
      this.modifyParam = this.tableData[param.index]
      this.form.account = param.row.account || ''
      this.form.companyName = param.row.companyName || ''
      this.form.adminName = param.row.adminName || ''
      this.form.mobile = param.row.mobile || ''
      this.form.url = param.row.url || ''
      this.form.address = param.row.address || ''
      this.modal4 = true
    },
    sendModify () {
      let _this = this
      this.modifyParam.account = this.form.account
      this.modifyParam.companyName = this.form.companyName
      this.modifyParam.adminName = this.form.adminName
      this.modifyParam.mobile = this.form.mobile
      this.modifyParam.url = this.form.url
      this.modifyParam.address = this.form.address
      delete this.modifyParam.createTime
      delete this.modifyParam.updateTime
      this.$refs.form1.validate((valid) => {
        if (valid) {
          saveAgentCompany(this.modifyParam)
            .then(res => {
              if (res.data.code == 0) {
                _this.modal4 = false
                _this.$Message.success(_this.$t('channel_modifyChannel_ok'))
                _this.queryAgentCompany()
              }
            })
        }
      })
    },
    // 点击修改密码按钮时
    changePwd (params) {
      this.modal6 = true
      this.changePassword.password = ''
      this.changePassword.repassword1 = ''
      this.changePassword.agentId = params.row.agentId
    },
    // 发送修改密码的新密码
    sendNewpwd () {
      const _this = this
      this.$refs.changePassword.validate((valid) => {
        if (valid) {
          chgAgentPassword(this.changePassword)
            .then(function (res) {
              if (res.data.code == 0) {
                _this.modal6 = false
                _this.$Message.success(_this.$t('user_table_modify_ok'))
                _this.$emit('search')
              } else {
                _this.$Message.error(res.data.msg)
              }
            })
        }
      })
    },
    openRenew (param) {
      let _this = this
      this.renew_form.record = ''
      this.renew_form.monthNumber = 1
      this.renew_form.agentIds = param.row.agentId
      getSession()
        .then((res) => {
          if (res.data.code == 0) {
            _this.modal3 = true
            // console.log(_this.renewMax )
          }
        })
      // console.log(this.renew_form)
    },

    erpiredFormat () {
      if (this.renew_form.expiredDate != '') {
        this.renew_form.expiredDate = dateFormat(new Date(this.renew_form.expiredDate), 'yyyy-MM-dd')
      }
    },
    clear () {
      this.form = {
        companyName: '',
        account: '',
        password: '',
        repassword: '',
        parentId: this.parentId,
        adminName: '',
        url: 'http://',
        address: '',
        mobile: ''
      }
    },
    renewConfirm () {
      this.modal2 = true
      this.modal3 = false
    },
    sendRenew () {
      let _this = this
      let params = JSON.parse(JSON.stringify(this.renew_form))
      batchUpdateCompanyExpiredDate(params).then(res => {
        if (res.data.code == 0) {
          _this.$Message.success(_this.$t('Recharge_success'))
          _this.queryAgentCompany()
          _this.modal2 = false
        }
      })
    },
    confirmDeletion () {
      let _this = this
      // console.log(this.tableData[this.delIndex])
      deleteAgentCompany({agentId: this.agentId})
        .then(res => {
          if (res.data.code == 0) {
            _this.$Message.success(_this.$t('user_table_delete_ok'))
            _this.queryAgentCompany()
            _this.modal13 = false
          }
        })
    },
    changePage (current) {
      this.pages.page = current
      this.queryAgentCompany()
    },
    changePageSize (pageSize) {
      this.pages.rows = pageSize
      this.queryAgentCompany()
    }
  },
  computed: {
    tableHeight: function () {
      return this.winHeight - 300
    },
    modal3_title: function () {
      return this.$t('user_table_modal3_title')
    },
    remark: function () {
      return this.$t('remark')
    },
    please_enter_name: function () {
      return this.$t('please_enter_name')
    },
    renewPriceMax: function () {
      return parseInt(this.comRenewMax)
    },
    renewBlance: function () {
      return this.comRenewMax - this.renewCount
    },
    renewCount: function () {
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
    user_table_modal1_pwd_label: function () {
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
    user_table_modal1_tel_placeholder: function () {
      return this.$t('user_table_modal1_tel_placeholder')
    },
    agent_address_label: function () {
      return this.$t('agent_address_label')
    },
    agent_address_placeholder: function () {
      return this.$t('agent_address_placeholder')
    },
    contacts_number: function () {
      return this.$t('contacts_number')
    },
    current_balance: function () {
      return this.$t('current_balance')
    },
    surplus: function () {
      return this.$t('surplus')
    },
    total: function () {
      return this.$t('total')
    },
    modal6_title: function () {
      return this.$t('user_table_modal6_title')
    },
    user_table_modal6_newPwd_label: function () {
      return this.$t('user_table_modal6_newPwd_label')
    },
    user_table_modal6_newPwd_placeholder: function () {
      return this.$t('user_table_modal6_newPwd_placeholder')
    },
    repeat: function () {
      return this.$t('repeat')
    }
  },
  mounted: function () {
    window.document.title = localStorage.getItem('platformNameLong')
  }

}
</script>

<style rel="stylesheet" lang="less">
    @import "../../styles/common.less";
    @import './agent_management.less';
</style>
