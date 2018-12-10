/* eslint-disable */
import axios from '@/libs/api.request'

export const queryAgentCompany = (params) => {
  return axios.request({
    url: '/ccs/api/queryAgentCompany',
    method: 'get',
    params
  })
}

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

export const registerAgentCompany = (params) => {
  return axios.request({
    url: '/ccs/api/registerAgentCompany',
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
export const saveAgentCompany = (params) => {
  return axios.request({
    url: '/ccs/api/saveAgentCompany',
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
