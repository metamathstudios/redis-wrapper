const redis = require('redis')
require('dotenv').config()

const client = redis.createClient({
  url: `redis://${process.env.REDIS_USER}:${process.env.REDIS_PW}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/`
})

client.on('error', (err) => console.log('Redis Client Error', err))

const validInputs = ['initiated', 'error', 'processed', 'finalized']

const getAllKeys = async () => {
  const jsonStr = '{"id": []}'
  const allKeys = JSON.parse(jsonStr)
  try {
    for await (const key of client.scanIterator()) {
      allKeys.id.push(key)
    }
    return allKeys
  } catch (e) {
    return e
  }
}

// setValue('14A12F09BCFA', '{"from" : "0x0", "to" : "0x0", "origin" : "0x1", "target" : "0x4", "tx" : "0x0000", "status" : "initiated", "amount" : "1000"}')

const setValue = async (key, data) => {
  if (typeof key === 'undefined' || !validInputs.includes(data.status)) { return false }

  try {
    const tempKeys = await getAllKeys()
    const tempData = await client.get(key)
    data = JSON.stringify(data)

    if (tempKeys.id.includes(key) && JSON.parse(tempData).status === JSON.parse(data).status) { return false }

    await client.set(key, data)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

const deleteValue = async (key) => {
  try {
    await client.del(key)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

const getValue = async (key) => {
  try {
    const data = await client.get(key)
    const jsonData = JSON.parse(data)
    return jsonData
  } catch (e) {
    console.log(e)
    return false
  }
}

const start = async () => {
  await client.connect()
}

const stop = async () => {
  await client.quit()
}

module.exports = {
  start,
  stop,
  getAllKeys,
  setValue,
  deleteValue,
  getValue
}
