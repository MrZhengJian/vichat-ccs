/* eslint-disable */
import axios from '@/libs/api.request'

export const getMainInfo = (params) => {
  return axios.request({
    url: '/ccs/api/getMainInfo',
    method: 'get'
  })
}

