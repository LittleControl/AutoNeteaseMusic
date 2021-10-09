import axios from 'axios'
import { readFile } from 'fs/promises'

const api = 'http://localhost:3000'

/**
 * @description: 通过手机号登陆,以获取Cookie
 */
const loginByPhone = async () => {
  const url = `${api}/login/cellphone?timestamp=${Date.now()}`
  const res = await axios({
    method: 'POST',
    url,
    data: {
      phone: '18502901079',
      password: '2021@Netease',
    },
    withCredentials: true,
  })
  return res.data.cookie
}

/**
 * @description: 获取用户登陆状态
 */
const getLoginStatus = async () => {
  const COOKIE = await loginByPhone()
  const url = `${api}/login/status`
  const res = await axios({
    method: 'GET',
    url,
    params: {
      cookie: COOKIE,
      timestamp: Date.now(),
    },
    withCredentials: true,
  })
  console.log(res.data.data.account)
  console.log(res.data.data.profile)
}

/**
 * @description: 获取用户等级相关信息
 */
const getUserLevelInfo = async () => {
  const COOKIE = await loginByPhone()
  const url = `${api}/user/level`
  const res = await axios({
    method: 'GET',
    url,
  })
  console.log(res)
}

// loginByPhone()
// getLoginStatus()

/**
 * @description: test file handle func
 */

const fsTest = async (path) => {
  const res = await readFile(path, 'utf8')
  console.log(res)
}
fsTest('./cookie')
