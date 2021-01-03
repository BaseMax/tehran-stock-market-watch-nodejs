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
