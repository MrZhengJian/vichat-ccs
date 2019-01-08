/* eslint-disable */
import axios from '@/libs/api.request'

export const queryChannels = (params) => {
  return axios.request({
    url: '/ccs/api/queryRooms',
    method: 'get',
    params
  })
}
export const saveChannel = (params) => {
  return axios.request({
    url: '/ccs/api/saveRoom',
    method: 'get',
    params
  })
}
export const deleteChannel = (params) => {
  return axios.request({
    url: '/ccs/api/deleteRoom',
    method: 'post',
    params
  })
}

export const queryRoomMembers = (params) => {
  return axios.request({
    url: '/ccs/api/queryRoomMembers',
    method: 'get',
    params
  })
}

export const saveRoomMembers = (params) => {
  return axios.request({
    url: '/ccs/api/saveRoomMembers',
    method: 'post',
    data:params
  })
}
export const deleteRoomMember = (params) => {
  return axios.request({
    url: '/ccs/api/deleteRoomMember',
    method: 'post',
    params
  })
}
export const loadRoomCache = (params) => {
  return axios.request({
    url: '/ccs/api/loadRoomCache',
    method: 'get',
    params
  })
}

export const batchDeleteRoomMember = (params) => {
  return axios.request({
    url: '/ccs/api/batchDeleteRoomMember',
    method: 'post',
    data:params
  })
}

export const switchRec = (params) => {
  return axios.request({
    url: '/ccs/api/switchRec',
    method: 'post',
    params
  })
}

export const setRoomMemberAdminGrade = (params) => {
  return axios.request({
    url: '/ccs/api/setRoomMemberAdminGrade',
    method: 'get',
    params
  })
}