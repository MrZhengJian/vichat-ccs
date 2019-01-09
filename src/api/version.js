/* eslint-disable */
import axios from '@/libs/api.request'

export const uploadAppVersionFile = (params) => {
  return axios.request({
    url: '/ccs/api/uploadAppVersionFile',
    method: 'get',
    params
  })
}

export const startAppVersionFile = (params) => {
    return axios.request({
      url: '/ccs/api/startAppVersionFile',
      method: 'get',
      params
    })
}

export const sendAppVersionMsg = (params) => {
    return axios.request({
      url: '/ccs/api/sendAppVersionMsg',
      method: 'get',
      params
    })
}

export const queryAppVersionFile = (params) => {
    return axios.request({
      url: '/ccs/api/queryAppVersionFile',
      method: 'get',
      params
    })
}

export const delAppVersionFile = (params) => {
    return axios.request({
      url: '/ccs/api/delAppVersionFile',
      method: 'post',
      data:params
    })
}

