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

