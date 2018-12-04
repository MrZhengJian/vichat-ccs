/* eslint-disable */
import axios from '@/libs/api.request'

export const registerCompany = (params) => {
  return axios.request({
    url: '/ccs/api/registerCompany',
    method: 'get',
    params
  })
}