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

(async () => {
  console.log('Connecting to database')

  const pool = await getDbConnection()
  // const connection = await pool.getConnection()
  console.log('Connected to MySQL database')

  console.log('Start app')

  console.log('Get response from tsetmc website')
  await axios.get('http://www.tsetmc.com/tsev2/data/MarketWatchInit.aspx?h=0&r=0').then(async (resp) => {
    let data = resp.data
    console.log('Response: '+ data.length)
    console.log(data)
    let content = data.split('@')
    if(content[2]) {
      let items = content[2].split(';')
      // for(let i=0; i < 1; i++) {
      // items.forEach(async function(itemCurrent) {
      for(let i=0; i < items.length; i++) {
        let cols = items[i].split(',')
        // let cols = itemCurrent.split(',')
        // console.log(cols)
        let item = parseItem(cols)
        if(item == undefined) {
          return
        }

        // console.log(item)
        const count = await pool.query('SELECT COUNT(id) as count from `symbol` WHERE code=?', [item['code']])
        // console.log(count[0][0].count)

        if(count[0][0] == [] || count[0][0].count == 0) {
          await pool.query(
            'INSERT INTO `symbol` SET symbol=?, name=?, code=?, ins=?',
            [item['symbol'], item['name'], item['code'], item['ins']]
          )
        }
        const result = await pool.query('SELECT * from `symbol` WHERE `code`=? LIMIT 1', [item['code']])
        let symbolID = result[0][0].id
        console.log(symbolID)

        await pool.query('INSERT INTO `history` SET symbol_id=?, time=?, count_all=?, volume_all=?, price_all=?, price_yesterday_last=?, price_today_first=?, price_now=?, price_max=?, price_min=?, price_close=?, eps=?',
          [
            symbolID,
            Math.floor(new Date().getTime() / 1000),
            item['count_all'],
            item['volume_all'],
            item['price_all'],
            item['price_yesterday_last'],
            item['price_today_first'],
            item['price_now'],
            item['price_max'] != '' ? item['price_max'] : null,
            item['price_min'] != '' ? item['price_min'] : null,
            item['price_close'] != '' ? item['price_close'] : null,
            item['eps'] != '' ? item['eps'] : null
          ]
        )

      })
    }
  })

  console.log('Close database connection')
  // await connection.release()
  // await pool.releaseConnection()
  pool.end()

  console.log('End app')
})()
