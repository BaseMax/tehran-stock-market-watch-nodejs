/*
 * @Name: tehran stock
 * @Date: 2021-01-01
 * @Author: Max Base
 */

const fs = require('fs')
const dotenv = require('dotenv')
const axios = require('axios')
// const mysql = require('promise-mysql')
const mysql = require('mysql2/promise')

const arabicToPersian = (str) => {
  return str
}

const round = (num, dec) => {
  const [sv, ev] = num.toString().split('e')
  return Number(Number(Math.round(parseFloat(sv + 'e' + dec)) + 'e-' + dec) + 'e' + (ev || 0))
}

const n2n = (num) => {
  return round(num, 2)
}

const countDigits = (input) => {
  return 0
}

const preapreENV = () => {
  const envConfig = dotenv.parse(fs.readFileSync('.env.txt'))
  for (const k in envConfig) {
    process.env[k] = envConfig[k]
  }
}
preapreENV()

const getDbConnection = () => {
  return mysql.createPool({
    host:       process.env.DB_HOST,
    user:       process.env.DB_USER,
    password:   process.env.DB_PASS,
    database:   process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  })
  // return await mysql.createConnection({
  //   host:       process.env.DB_HOST,
  //   user:       process.env.DB_USER,
  //   password:   process.env.DB_PASS,
  //   database:   process.env.DB_NAME
  // })
}

const intval = (str) => {
  return parseInt(str)
}

const floatval = (str) => {
  return parseFloat(str)
}

const parseItem = (cols) => {
  let info = []
  let namadID = cols[0]
  info['code'] = namadID
  info['ins'] = cols[1]

  info['symbol'] = cols[2]
  info['name'] = cols[3]
  info['time'] = cols[3]

  info['count_all'] = cols[8]
  info['volume_all'] = cols[9]
  info['price_all'] = cols[10]


  info['price_yesterday_last'] = cols[7]
  info['price_today_first'] = cols[5]
  info['price_now'] = cols[13]

  info['price_min'] = cols[11]
  info['price_max'] = cols[12]
  info['price_close'] = cols[6]

  // info['buy_count'] = cols[17]
  // info['buy_price'] = cols[17]
  // info['buy_volume'] = cols[17]
  // info['sell_count'] = cols[17]
  // info['sell_price'] = cols[17]
  // info['sell_volume'] = cols[17]

  info['eps'] = cols[14]
  return info
}
