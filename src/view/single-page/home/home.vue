<script type="text/javascript">
/* eslint-disable */
</script>

<style lang="less">
    @import "../../../styles/common.less";
    @import "./home.less";    
</style>
<template>
    <div class="home-main" style="margin-bottom:30px;">
        <Card>
            <p slot="title">{{$t('systemMessage')}}</p>
            <Row>
                <Col :span='10'>{{$t('currentAccount')}}</Col>
                <Col :span='14'>{{currentAccount}}</Col>
            </Row>
            <Row>
                <Col :span='10'>{{$t('currentNumAccounts')}} / {{$t('limitedNumAccounts')}}</Col>
                <Col :span='14' v-bind:class={red:isRed}>{{count.effectiveUserNum}} / {{count.maxAuthNum}}</Col>
            </Row>
            
        </Card>

        <Card>
            <p slot="title">{{$t('agentMessage')}}</p>
            <Row>
                <Col :span='10'>{{$t('level1Agent')}}</Col>
                <Col :span='14'>{{count.oneLevelAgentNum}}</Col>
            </Row>
            <Row>
                <Col :span='10'>{{$t('allAgent')}}</Col>
                <Col :span='14'>{{count.allAgentNum}}</Col>
            </Row>
            
        </Card>

        <Card>
            <p slot="title">{{$t('companyMessage')}}</p>
            <Row>
                <Col :span='10'>{{$t('companyCount')}}</Col>
                <Col :span='14'>{{count.companyNum}}</Col>
            </Row>
            <Row>
                <Col :span='10'>{{$t('validCount')}}</Col>
                <Col :span='14'>{{count.effectiveUserNum}}</Col>
            </Row>
            <Row>
                <Col :span='10'>{{$t('totalCount')}}</Col>
                <Col :span='14'>{{count.allUserNum}}</Col>
            </Row>
            
        </Card>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import { getMainInfo } from '@/api/home';
export default {
    name: 'home',
    created:function(){
        this.getCount()
    },
    components: {
        
    },
    data () {
        return {
            currentAccount:this.$store.state.user.userObj.account,
            count:{
                maxAuthNum:0,
                oneLevelAgentNum:0,
                allAgentNum:0,
                companyNum:0,
                effectiveUserNum:0,
                allUserNum:0,
            },
            isRed:false
        };
    },
    computed: {
       
    },
    mounted:function(){
    },
    methods: {   
        getCount(){
            let _this = this 
            getMainInfo()
            .then(function(res){
                if(res.data.code==0){
                    _this.count = res.data.obj
                    _this.isRed = _this.count.effectiveUserNum/_this.count.maxAuthNum>=0.8?true:false
                }
            })
        }
    }
};
</script>
