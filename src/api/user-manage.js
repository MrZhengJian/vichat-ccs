/* eslint-disable */
import axios from '@/libs/api.request'

export const queryEdposUsers = (params) => {
  return axios.request({
    url: '/ccs/api/queryUserBasic',
    method: 'get',
    params
  })
}

export const saveEdposUser = (params) => {
  return axios.request({
    url: '/ccs/api/saveUserBasic',
    method: 'post',
    params
  })
}

export const deleteEdposUser = (params) => {
  return axios.request({
    url: '/ccs/api/deleteUser',
    method: 'post',
    params
  })
}

export const batchDeleteUser = (params) => {
  return axios.request({
    url: '/ccs/api/batchDelUser',
    method: 'post',
    data:params
  })
}
export const chgEdposUserOrg = (params) => {
  return axios.request({
    url: '/ccs/api/batchUpdateUserOrg',
    method: 'post',
    params
  })
}

export const chgUserPassword = (params) => {
  return axios.request({
    url: '/ccs/api/chgPassword',
    method: 'post',
    params
  })
}

export const imsPush = (params) => {
  return axios.request({
    url: '/ccs/api/setLocation',
    method: 'get',
    params
  })
}

export const orgZTree = (params) => {
  return axios.request({
    url: '/ccs/api/getOrgTree',
    method: 'get',
    params
  })
}

export const loadSysStaticData = (params) => {
  return axios.request({
    url: '/ccs/api/loadSysStaticData',
    method: 'get'
  })
}

export const batchUpdateUserRole = (params) => {
  return axios.request({
    url: '/ccs/api/batchUpdateUserRole',
    method: 'get',
    params
  })
}

export const batchUpdateUserExpiredDate = (params) => {
  return axios.request({
    url: '/ccs/api/batchUpdateUserExpiredDate',
    method: 'get',
    params
  })
}

export const getSecRoleByUid = (params) => {
  return axios.request({
    url: '/ccs/api/getSecRoleByUid',
    method: 'get',
    params
  })
}

export const batchCheckUsers = (params) => {
  return axios.request({
    url: '/ccs/api/batchCheckUserBasic',
    method: 'post',
    data:params
  })
}

export const batchSaveUserBasic = (params) => {
  return axios.request({
    url: '/ccs/api/batchSaveUserBasic',
    method: 'post',
    data:params
  })
}