/* eslint-disable */
import axios from '@/libs/api.request'

export const queryPrisonSecRole = (params) => {
  return axios.request({
    url: '/ccs/api/querySecRole',
    method: 'get',
    params
  })
}

export const saveOrUpdSecRole = (params) => {
  return axios.request({
    url: '/ccs/api/saveOrUpdSecRole',
    method: 'get',
    params
  })
}

export const delSecRole = (params) => {
  return axios.request({
    url: '/ccs/api/delSecRole',
    method: 'get',
    params
  })
}

export const getTree = (params) => {
  return axios.request({
    url: '/ccs/api/secZTree',
    method: 'get',
    params
  })
}

export const saveSecRoleFunction = (params) => {
  return axios.request({
    url: '/ccs/api/saveSecRoleFunction',
    method: 'post',
    data:params
  })
}

export const querySecRoleFunctionByRoid = (params) => {
  return axios.request({
    url: '/ccs/api/querySecRoleFunctionByRoid',
    method: 'get',
    params
  })
}