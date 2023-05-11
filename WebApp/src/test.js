import axios from "axios"

const url = 'http://localhost:8080/newUser/add-accounts-to-user'

const mail = 'test1@mail.ru'
const accounts = [1, 2, 3]

const request = async () => {
  await axios.post(url, {mail, accounts})
}

request()