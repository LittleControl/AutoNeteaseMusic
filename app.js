import axios from 'axios'
import path from 'path'
import parsePhoneNumber from 'libphonenumber-js'
import { promises } from 'fs'
const { readFile } = promises

const CONFIG_DIR = path.join(__dirname, 'config')
const INFO = {
  api: undefined,
  cookies: [],
  accounts: [],
}

/**
 * @description: 获取api
 */
const getLocalApi = async (dir) => {
  let api
  try {
    const content = await readFile(`${dir}/api`, 'utf-8')
    api = content.replace(/[\s]/g, '')
  } catch (error) {
    console.log('读取本地API配置失败,使用默认的API配置')
    api = 'https://api.littlecontrol.me'
  }
  return api
}

/**
 * @description: 通过手机号登陆,获取Cookie
 */
const getCookies = async (dir, info) => {
  if (!info.api) {
    info.api = await getLocalApi(dir)
  }
  const url = `${info.api}/login/cellphone`
  try {
    const accounts = await getAccountInfo(dir)
    info.accounts = accounts
    const cookies = await Promise.all(
      accounts.map(async (current) => {
        const { data } = await axios({
          method: 'POST',
          url,
          data: {
            phone: current.phone,
            password: current.password,
            countrycode: current.countrycode,
          },
        })
        console.log(current.phone.slice(-4) + '登陆成功')
        return data?.cookie
      })
    )
    return cookies
  } catch (error) {
    console.log('获取Cookie失败')
    console.log(error?.response?.data)
    return []
  }
}

/**
 * @description: 从文件读取账户信息
 */
const getAccountInfo = async (dir) => {
  const res = []
  try {
    const fileContent = await readFile(`${dir}/account`, 'utf-8')
    const contentArr = fileContent.replace(/[\t\r ]/g, '').split('\n')
    contentArr.forEach((current, index, array) => {
      if (index % 2 === 0) {
        if (current === '') return
        const parsedNumber = parsePhoneNumber(current, 'CN')
        res.push({
          phone: parsedNumber?.formatNational().replace(/[()\s-]/g, ''),
          countrycode: parsedNumber?.countryCallingCode,
          password: array[index + 1],
        })
      }
    })
    return res
  } catch (error) {
    console.log('读取用户账户密码失败')
    return []
  }
}

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
    config.data.cookie = INFO.cookies[0]
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
  let res = []
  try {
    await axios({
      method: 'POST',
      url,
    })
    console.log('Android端签到完成')
    res.push('Android端签到完成')
  } catch (error) {
    console.log(`Android端签到失败`)
    console.log(error?.response?.data)
    res.push('Android端签到失败')
  }
  try {
    await axios({
      method: 'POST',
      url,
      params: {
        type: 1,
      },
    })
    console.log('Web/PC端签到完成')
    res.push('Web/PC端签到完成')
  } catch (error) {
    console.log(`Web/PC端签到失败`)
    console.log(error?.response?.data)
    res.push('Web/PC端签到失败')
  }
  console.log('两个平台前端都会有云贝奖励,Android端默认也会进行云贝签到')
  console.log('请登陆网易云查看云贝奖励是否正常')
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
    console.log(`获取每日推荐歌单失败`)
    console.log(error?.response?.data)
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
    console.log(`获取歌单详情失败`)
    console.log(error?.response?.data)
    return {}
  }
}

/**
 * @description: 根据每日歌单推荐刷播放量
 */
const playDailyLists = async (api) => {
  const url = `${api}/scrobble`
  const { recommend } = await getDailyPlaylist(api)
  if (!recommend) return '每日推荐歌单刷取失败'
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
    console.log(`每日推荐歌单刷取失败`)
    console.log(error?.response?.data)
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
    console.log(`获取每日推荐歌曲失败`)
    console.log(error?.response?.data)
    return {}
  }
}

/**
 * @description: 听歌打卡, 根据每日推荐刷听歌量
 */
const playDailySongs = async (api) => {
  const url = `${api}/scrobble`
  const { dailySongs } = await getDailySongs(api)
  if (!dailySongs) return '每日推荐歌曲刷取失败'
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

export const main = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false
  let res = {}
  try {
    INFO.api = await getLocalApi(CONFIG_DIR)
    INFO.cookies = await getCookies(CONFIG_DIR, INFO)
    while (INFO.cookies.length) {
      const { phone } = INFO.accounts.shift()
      res[phone] = []
      console.log('开始处理' + phone)
      res[phone].push(await playDailySongs(INFO.api))
      res[phone].push(await playDailyLists(INFO.api))
      res[phone].push(await checkIn(INFO.api))
      INFO.cookies.shift()
    }
  } catch (error) {
    res[error] = error
  }
  callback(null, res)
}
