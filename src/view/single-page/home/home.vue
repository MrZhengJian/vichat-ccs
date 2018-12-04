<script type="text/javascript">
  /* eslint-disable */
</script>

<style lang="less">
    @import "../../../styles/common.less";
    @import "./home.less";    
</style>
<template>
    <div class="home-main" style="margin-bottom:30px;">
        
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import { getCounts } from '@/api/home';
export default {
    name: 'home',
    created:function(){
        // this.getCount()
    },
    components: {
        
    },
    data () {
        return {
            count: {
                accountNum: 0,
                agentCompanyNum: 0,
                agentCompanyUserNum:0,
                childAgentNum: 0,
                expiringUserNum: 0
            },

            logoText:localStorage.getItem('platformNameLong'),
            userName:this.$store.state.user.userObj.userName,
            // company:this.$store.state.user.CompanyObj.companyName,
            // account:this.$store.state.user.userObj.account,
            // balance:this.$store.state.user.CompanyObj.authMonth
        };
    },
    computed: {
       
    },
    mounted:function(){
    },
    methods: {   
        // getCount(){
        //     let _this = this 
        //     getCounts()
        //     .then(function(res){
        //         if(res.data.code==0){
        //             _this.count = res.data.obj
        //         }
        //     })
        // }
    }
};
</script>
