/* eslint-disable */
import axios from '@/libs/api.request'

export const queryCompany = (params) => {
  return axios.request({
    url: '/ccs/api/queryCompany',
    method: 'get',
    params
  })
}

export const getCompany = (params) => {
  return axios.request({
    url: '/ccs/api/getCompany',
    method: 'get',
    params
  })
}

export const saveCompany = (params) => {
  return axios.request({
    url: '/ccs/api/saveCompany',
    method: 'get',
    params
  })
}

export const registerCompany = (params) => {
  return axios.request({
    url: '/ccs/api/registerCompany',
    method: 'post',
    data:params
  })
}
export const deleteCompany = (params) => {
  return axios.request({
    url: '/ccs/api/deleteCompany',
    method: 'get',
    params
  })
}

export const batchUpdateCompanyExpiredDate = (params) => {
  return axios.request({
    url: '/ccs/api/batchUpdateCompanyExpiredDate',
    method: 'get',
    params
  })
}

export const queryAgentCompany = (params) => {
  return axios.request({
    url: '/ccs/api/queryAgentCompany',
    method: 'get',
    params
  })
}
export const registerAgentCompany = (params) => {
  return axios.request({
    url: '/ccs/api/registerAgentCompany',
    method: 'get',
    params
  })
}

export const batchUpdateAgentUsersExpiredDate = (params) => {
  return axios.request({
    url: '/ccs/api/batchUpdateAgentExpiredDate',
    method: 'get',
    params
  })
}

export const saveAgentCompany = (params) => {
  return axios.request({
    url: '/ccs/api/saveAgentCompany',
    method: 'get',
    params
  })
}

export const deleteAgentCompany = (params) => {
  return axios.request({
    url: '/ccs/api/deleteAgentCompany',
    method: 'get',
    params
  })
}
// AGENT USERS
export const queryCcsUser = (params) => {
  return axios.request({
    url: '/ccs/api/queryCcsUser',
    method: 'get',
    params
  })
}

export const batchCheckAgentUsers = (params) => {
  return axios.request({
    url: '/ccs/api/batchCheckAgentUsers',
    method: 'post',
    data:params
  })
}

export const batchSaveAgentUsers = (params) => {
  return axios.request({
    url: '/ccs/api/batchSaveAgentUsers',
    method: 'post',
    data:params
  })
}

export const chgCcsPassword = (params) => {
  return axios.request({
    url: '/ccs/api/chgCcsPassword',
    method: 'get',
    params
  })
}

export const saveCcsUser = (params) => {
  return axios.request({
    url: '/ccs/api/saveCcsUser',
    method: 'get',
    params
  })
}

export const deleteCcsUser = (params) => {
  return axios.request({
    url: '/ccs/api/deleteCcsUser',
    method: 'get',
    params
  })
}