import axios from 'axios'

const api = 'http://localhost:3000'
const loginByPhone = () => {
  const url = `${api}/login/cellphone`
  axios
    .get(url, {
      params: {
        phone: '18502901079',
        password: '2021@Netease',
      },
    })
    .then(
      (res) => {
        console.log(res)
      },
      (rej) => {
        console.log(rej)
      }
    )
}
loginByPhone()
