/* eslint-disable */
import axios from '@/libs/api.request'

export const querySnResources = (params) => {
  return axios.request({
    url: 'ccs/api/querySnResources',
    method: 'get',
    params
  })
}


export const batchCheckSN = (params) => {
  return axios.request({
    url: '/ccs/api/batchCheckSN',
    method: 'post',
    data:params
  })
}

export const batchSaveSN = (params) => {
  return axios.request({
    url: '/ccs/api/batchSaveSN',
    method: 'post',
    data:params
  })
}

export const assignSN = (params) => {
  return axios.request({
    url: '/ccs/api/assignSN',
    method: 'post',
    data:params
  })
}