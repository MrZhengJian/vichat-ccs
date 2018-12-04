/* eslint-disable */
import axios from '@/libs/api.request'

export const queryEdposOrgByParentId = (params) => {
  return axios.request({
    url: '/ccs/api/queryOrgsByParentId',
    method: 'get',
    params
  })
}
export const saveOrg = (params) => {
  return axios.request({
    url: '/ccs/api/saveOrg',
    method: 'post',
    params
  })
}
export const delOrg = (params) => {
  return axios.request({
    url: '/ccs/api/delOrg',
    method: 'get',
    params
  })
}
