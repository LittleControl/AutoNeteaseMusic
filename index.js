import axios from 'axios'
import { readFile, writeFile } from 'fs/promises'

const api = 'http://localhost:3000'

/**
 * @description: 拦截请求,添加cookie等信息
 */
axios.interceptors.request.use(
  async (config) => {
    config.withCredentials = true

    /**
     * @description: 防止网易对IP的限制
     */
    config.headers['X-Real-IP'] = '123.138.78.143'
    const { url, params, data } = config
    if (!params) {
      config.params = {}
    }
    config.params.timestamp = Date.now()
    if (url?.includes('/login')) {
      return config
    }
    const COOKIE = await getCookie()
    if (!data) {
      config.data = {}
    }
    config.data.cookie = COOKIE
    return config
  },
  async (error) => {
    return Promise.reject(error)
  }
)

/**
 * @description: 从文件读取账户信息
 */
const getAccountInfo = async () => {
  try {
    const res = await readFile('./.account', 'utf-8')
    const resArr = res.split('\r\n')
    return {
      phone: resArr[0],
      password: resArr[1],
    }
  } catch (error) {
    return error
  }
}

/**
 * @description: 通过手机号登陆,以获取Cookie
 */
const loginByPhone = async () => {
  const url = `${api}/login/cellphone`
  const accoutInfo = await getAccountInfo()
  const { phone, password } = accoutInfo
  const res = await axios({
    method: 'POST',
    url,
    data: {
      phone,
      password,
    },
  })
  return res.data?.cookie ?? ''
}

/**
 * @description: 获取Cookie
 */

const getCookie = async () => {
  try {
    const localCookie = await readFile('./.cookie', 'utf8')
    const { data } = await getLoginStatus(localCookie)
    if (data.account && data.profile) {
      return localCookie
    } else {
      const COOKIE = await loginByPhone()
      await writeFile('./.cookie', COOKIE)
      return COOKIE
    }
  } catch (error) {
    console.log(error)
    return ''
  }
}

/**
 * @description: 获取用户登陆状态
 */
const getLoginStatus = async (cookie) => {
  const url = `${api}/login/status`
  const res = await axios({
    method: 'POST',
    url,
    data: {
      cookie,
    },
  })
  return res.data
}

/**
 * @description: 获取用户等级相关信息
 */
const getUserLevelInfo = async () => {
  const url = `${api}/user/level`
  const { data } = await axios({
    method: 'POST',
    url,
  })
  return data
}

/**
 * @description: 前端接口
 */
const checkIn = async () => {
  const url = `${api}/daily_signin`
  const { data } = await axios({
    method: 'POST',
    url,
  })
  return data
}

/**
 * @description: 获取每日推荐歌单
 */
const getDailyPlaylist = async () => {
  const url = `${api}/recommend/resource`
  const { data } = await axios({
    method: 'POST',
    url,
  })
  return data
}

/**
 * @description: 获取每日推荐歌曲
 */
const getDailySongs = async () => {
  const url = `${api}/recommend/songs`
  const { data } = await axios({
    method: 'POST',
    url,
  })
  return data
}

/**
 * @description: 云贝签到
 */
const checkInYunbei = async () => {
  const url = `${api}/yunbei/sign`
  const { data } = await axios({
    method: 'POST',
    url,
  })
  return data
}

const dailyTask = async () => {
  const res = await checkIn()
  const resYunbei = await checkInYunbei()
  return 'Checkin Success!'
}

dailyTask().then(
  (res) => console.log(res),
  (error) => console.log(error.response?.data)
)
