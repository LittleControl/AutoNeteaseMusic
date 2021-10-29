import axios from 'axios'
import path from 'path'
import parsePhoneNumber from 'libphonenumber-js'
import { promises } from 'fs'
import { data } from 'core-js/internals/is-forced'
import { info } from 'console'
const { readFile, writeFile } = promises

const CONFIG_DIR = path.join(__dirname, 'config')
const INFO = {
  api: undefined,
  phone: undefined,
  password: undefined,
  cookie: undefined,
}

/**
 * @description: 获取api
 */
const getLocalApi = async (dir) => {
  let api
  try {
    const content = await readFile(`${dir}/api`, 'utf-8')
    api = content.split('\n')[0]
  } catch (error) {
    api = 'https://api.littlecontrol.me'
  }
  return api
}

/**
 * @description: 通过手机号登陆,以获取Cookie
 */
// const loginByPhone = async (dir, info) => {
const getCookie = async (dir, info) => {
  if (!info.api) {
    info.api = await getLocalApi(dir)
  }
  const url = `${info.api}/login/cellphone`
  try {
    if (!info.phone && !info.password && !info.countrycode) {
      const { password, phone, countrycode } = await getAccountInfo(dir)
      info.password = password
      info.phone = phone
      info.countrycode = countrycode
    }
    const { data } = await axios({
      method: 'POST',
      url,
      data: {
        phone: info.phone,
        password: info.password,
        countrycode: info.countrycode,
      },
    })
    return data?.cookie
  } catch (error) {
    console.log(error?.response?.data)
    console.log('get cookie error')
    console.log(`error: ${error?.response?.data}`)
  }
}

/**
 * @description: 获取用户登陆状态
 */
const getLoginStatus = async (dir, info) => {
  if (!info.api) {
    info.api = await getLocalApi(dir)
  }
  const url = `${info.api}/login/status`
  try {
    const res = await axios({
      method: 'POST',
      url,
      data: {
        cookie: info.cookie,
      },
    })
    if (data.account && data.profile) {
      return true
    }
    return false
  } catch (error) {
    console.log(`error: ${error?.response?.data}`)
    return false
  }
}
/**
 * @description: 从文件读取账户信息
 */
const getAccountInfo = async (dir) => {
  try {
    const res = await readFile(`${dir}/account`, 'utf-8')
    const resArr = res.split('\n')
    const parsedNumber = parsePhoneNumber(resArr[0], 'CN')
    const phone = parsedNumber?.formatNational().replace(/[()\s-]/g, '')
    const countrycode = parsedNumber?.countryCallingCode
    return {
      phone,
      countrycode,
      password: resArr[1],
    }
  } catch (error) {
    console.log('读取用户账户密码失败')
    return {}
  }
}

// /**
//  * @description: 获取Cookie
//  */

// const getCookie = async (dir, info) => {
//   try {
//     const COOKIE = await loginByPhone(dir, info)
//     info.cookie = COOKIE
//   } catch (error) {
//     console.log(error?.response?.data)
//     console.log('cookie读取失败')
//   }
// }

/**
 * @description: 拦截请求,添加cookie等信息
 */
axios.interceptors.request.use(
  async (config) => {
    config.withCredentials = true
    //防止网易对IP的限制
    config.headers['X-Real-IP'] = '123.138.78.143'
    const { method, url } = config
    config.params ??= {}
    if (method?.toUpperCase() === 'POST') {
      config.params.timestamp = Date.now()
      config.params.realIP = '123.138.78.143'
    }
    config.data ??= {}
    if (url?.includes('login')) {
      return config
    }
    if (!INFO.cookie) {
      INFO.cookie = await getCookie(CONFIG_DIR, INFO)
    }
    config.data.cookie = INFO.cookie
    return config
  },
  async (error) => {
    return Promise.reject(error)
  }
)

/**
 * @description: 打卡签到
 */
const checkIn = async (api) => {
  const url = `${api}/daily_signin`
  let res
  try {
    res = await axios({
      method: 'POST',
      url,
    })
    console.log('Android端签到完成')
  } catch (error) {
    console.log(`Android端签到失败, error: ${error?.response?.data}`)
    res = error?.response?.data
  }
  try {
    res = await axios({
      method: 'POST',
      url,
      params: {
        type: 1,
      },
    })
    console.log('Web/PC端签到完成')
  } catch (error) {
    console.log(`Web/PC端签到失败, error: ${error?.response?.data}`)
    res = error?.response?.data
  }
  return res
}

/**
 * @description: 获取每日推荐歌单
 */
const getDailyPlaylist = async (api) => {
  const url = `${api}/recommend/resource`
  try {
    const { data } = await axios({
      method: 'POST',
      url,
    })
    return data
  } catch (error) {
    console.log(`获取每日推荐歌单失败, error: ${error?.response?.data}`)
    return {}
  }
}

/**
 * @description: 获取歌单详情
 */
const getPlaylistContent = async (id, api) => {
  const url = `${api}/playlist/detail`
  try {
    const { data } = await axios({
      method: 'POST',
      url,
      params: {
        id,
      },
    })
    return data
  } catch (error) {
    console.log(`获取歌单详情失败, error: ${error?.response?.data}`)
    return {}
  }
}

/**
 * @description: 根据每日歌单推荐刷播放量
 */
const playDailyLists = async (api) => {
  const url = `${api}/scrobble`
  const { recommend } = await getDailyPlaylist(api)
  if (!recommend) return
  try {
    recommend.forEach(async (item) => {
      const { privileges } = await getPlaylistContent(item.id, api)
      privileges.forEach(async (song) => {
        await axios({
          method: 'POST',
          url,
          params: {
            id: song.id,
            sourceid: item.id,
            time: 1000,
          },
        })
      })
    })
    console.log('每日推荐歌单刷取完成')
    return '每日推荐歌单刷取完成'
  } catch (error) {
    console.log(`每日推荐歌单刷取失败,error: ${error?.response?.data}`)
    return '每日推荐歌单刷取失败'
  }
}

/**
 * @description: 获取每日推荐歌曲
 */
const getDailySongs = async (api) => {
  const url = `${api}/recommend/songs`
  try {
    const { data } = await axios({
      method: 'POST',
      url,
    })
    return data.data
  } catch (error) {
    console.log(`获取每日推荐歌曲失败, error: ${error?.response?.data}`)
    return {}
  }
}

/**
 * @description: 听歌打卡, 根据每日推荐刷听歌量
 */
const playDailySongs = async (api) => {
  const url = `${api}/scrobble`
  const { dailySongs } = await getDailySongs(api)
  if (!dailySongs) return
  try {
    dailySongs.forEach(async (song) => {
      await axios({
        method: 'POST',
        url,
        params: {
          id: song.id,
          sourceid: song.al.id,
          time: 500,
        },
      })
    })
    console.log('每日推荐歌曲刷取完成')
    return '每日推荐歌曲刷取完成'
  } catch (error) {
    console.log(`每日推荐歌曲刷取失败,error: ${error?.response?.data}`)
    return '每日推荐歌曲刷取失败'
  }
}

/**
 * @description: 云贝签到
 */
const checkInYunbei = async (api) => {
  const url = `${api}/yunbei/sign`
  let res
  try {
    res = await axios({
      method: 'POST',
      url,
    })
    console.log('云贝签到完成')
    return '云贝签到完成'
  } catch (error) {
    console.log(`云贝签到失败, error: ${error?.response?.data}`)
    return '云贝签到失败'
  }
}

export const main = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false
  let res = []
  try {
    const API = await getLocalApi(CONFIG_DIR)
    info.api = API
    res.push(await playDailySongs(API))
    res.push(await playDailyLists(API))
    res.push(await checkIn(API))
    res.push(await checkInYunbei(API))
  } catch (error) {
    res.push(error)
  }
  callback(null, res)
}
