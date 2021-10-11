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
 * @description: 通过手机号登陆,以获取Cookie
 */
const loginByPhone = async () => {
  console.log('i am here')
  const url = `${api}/login/cellphone`
  const res = await axios({
    method: 'POST',
    url,
    data: {
      phone: '18502901079',
      password: '2021@Netease',
    },
  })
  return res.data.cookie
}

/**
 * @description: 获取Cookie
 */

const getCookie = async () => {
  const localCookie = await readFile('./.cookie', 'utf8')
  const { data } = await getLoginStatus(localCookie)
  if (data.account && data.profile) {
    return localCookie
  } else {
    const COOKIE = await loginByPhone()
    await writeFile('./.cookie', COOKIE)
    return COOKIE
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

checkIn().then(
  (res) => {
    console.log(res)
  },
  (error) => {
    console.log(error?.response.data)
  }
)
