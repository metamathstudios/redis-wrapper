# redis-wrapper
Redis database IO wrapper for MetaMath projects


### Installation

Use your preferred dependencies manager:

```csh
npm install @metamathstudios/redis-wrapper
```

Or

```csh
yarn add @metamathstudios/redis-wrapper
```

This wrapper is used to interact with a [Redis cloud instance](https://app.redislabs.com/#/databases). In order to get started, you need create a `.env` and fill out the variables with valid Redis Cloud information:

```csh
REDIS_USER='default'
REDIS_PW='YOUR_REDIS_CLOUD_PASSWORD'
REDIS_HOST='YOUR_REDIS_CLOUD_HOST_URL'
REDIS_PORT='YOUR_REDIS_CLOUD_PORT'
```

# Usage

redis-wrapper is configured to work with data in the following format:

`key` should be a 12-digit Hexadecimal code. Example: `14A12F09BCFA`

`value` should be a JSON file with the following properties:

```jsx
{
  from: '0xd9bca352c1466dAb438b05069C97C520445d68fD', 
  to: '0x9eA27375C0A7B76F2D86685C65f5823a536eEd65',
  origin: '0x1',
  target: '0x4',
  tx: '0xa5c4a23eed45247d149e728a52681254fe4f521ebbfa4cd989f7e6956ba2c301',
  status: 'initiated',
  amount: '1000000000'
}
```

redis-wrapper gives access to eight functions:

- [start()](#-start)
- [stop()](#-stop)
- [getAllKeys()](#-getAllKeys)
- [setValue()](#-setValue)
- [deleteValue()](#-deleteValue)
- [getValue()](#-getValue)
- [getAccountTxs()](#-getAccountTxs)
- [getAccountIndexes()](#-getAccountIndexes)

### ✅ start

Start opens a new client socket.

_Example:_

```jsx
const db = require('@metamathstudios/redis-wrapper')

const openSocket = async () => {
  await db.start() // will open a new client socket to interact with Redis Database
}

openSocket()
```
### ✅ stop

Closes current client socket.

_Example:_

```jsx
const db = require('@metamathstudios/redis-wrapper')

const closeSocket = async () => {
  await db.stop() // will close current Redis Database client socket
}

closeSocket()
```

### ✅ getAllKeys

Get all existing keys from a Redis Cloud db instance.

_Example:_

```jsx
const db = require('@metamathstudios/redis-wrapper')

const printKeys = async () => {
  await db.start() // will open a new client socket to interact with Redis Database
  console.log(await db.getAllKeys()) // print to console all existing Keys on target Redis Database
  await db.stop() // will close current Redis Database client socket
}

printKeys()
```

### ✅ setValue

Write a new `key` & `value` pair to Database.

_Example:_

```jsx
const db = require('@metamathstudios/redis-wrapper')

const oyenteKey = '14A12F09BCFA'
const oyenteData = {
  from: '0xd9bca352c1466dAb438b05069C97C520445d68fD', 
  to: '0x9eA27375C0A7B76F2D86685C65f5823a536eEd65',
  origin: '0x1',
  target: '0x4',
  tx: '0xa5c4a23eed45247d149e728a52681254fe4f521ebbfa4cd989f7e6956ba2c301',
  status: 'initiated',
  amount: '1000000000'
}

const writeToRedis = async (key, data) => {
  await db.start() // will open a new client socket to interact with Redis Database
  const receipt = await db.setValue(key, data) // receipt returns {true} if value is sucessfully set, and {false} otherwise
  console.log(receipt) // Should log {true}
  await db.stop() // will close current Redis Database client socket
}

writeToRedis(oyenteKey, oyenteData)
```

### ✅ deleteValue

Delete entry of given `key`.

_Example:_

```jsx
const db = require('@metamathstudios/redis-wrapper')

const oyenteKey = '14A12F09BCFA'

const deleteEntry = async (key) => {
  await db.start() // will open a new client socket to interact with Redis Database
  const receipt = await db.deleteValue(key) // receipt returns {true} if value is sucessfully deleted, and {false} otherwise
  console.log(receipt) // Should log {true} only if the key & value pair existed prior to deleteValue
  await db.stop() // will close current Redis Database client socket
}

deleteEntry(oyenteKey)
```

### ✅ getValue

Read entry for given `key`.

_Example:_

```jsx
const db = require('@metamathstudios/redis-wrapper')

const oyenteKey = '14A12F09BCFA'
const oyenteData = {
  from: '0xd9bca352c1466dAb438b05069C97C520445d68fD',
  to: '0x9eA27375C0A7B76F2D86685C65f5823a536eEd65',
  origin: '0x1',
  target: '0x4',
  tx: '0xa5c4a23eed45247d149e728a52681254fe4f521ebbfa4cd989f7e6956ba2c301',
  status: 'initiated',
  amount: '1000000000'
}

const readEntry = async (key, data) => {
  await db.start() // will open a new client socket to interact with Redis Database
  await db.setValue(key, data) // write data to Redis Database
  console.log(await db.getValue(key))
  await db.stop() // will close current Redis Database client socket
}

readEntry(oyenteKey, oyenteData)
```

Console should log:

```csh
{
  from: '0xd9bca352c1466dAb438b05069C97C520445d68fD',
  to: '0x9eA27375C0A7B76F2D86685C65f5823a536eEd65',
  origin: '0x1',
  target: '0x4',
  tx: '0xa5c4a23eed45247d149e728a52681254fe4f521ebbfa4cd989f7e6956ba2c301',
  status: 'initiated',
  amount: '1000000000'
}
```
### ✅ getAccountTxs

List all data from transactions originated from a given `account`

_Example:_

```jsx
const db = require('@metamathstudios/redis-wrapper')

const account = '0xd9bca352c1466dAb438b05069C97C520445d68fD'

const firstTxsKey = '14A12F09BCFA'
const secondTxsKey = '7BC091DCA5FF'


const firstTxs = {
  from: '0xd9bca352c1466dAb438b05069C97C520445d68fD',
  to: '0x9eA27375C0A7B76F2D86685C65f5823a536eEd65',
  origin: '0x1',
  target: '0x4',
  tx: '0xa5c4a23eed45247d149e728a52681254fe4f521ebbfa4cd989f7e6956ba2c301',
  status: 'initiated',
  amount: '1000000000'
}

const secondTxs = {
  from: '0xd9bca352c1466dAb438b05069C97C520445d68fD',
  to: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
  origin: '0x4',
  target: '0x1',
  tx: '0xdebc379ac6ef0aed3fb604ecb48f2df8a137976c871622fd8645110e04b23398',
  status: 'initiated',
  amount: '5000'
}


const filterEntries = async (acc) => {
  await db.start() // will open a new client socket to interact with Redis Database
  await db.setValue(firstTxsKey, firstTxs)
  await db.setValue(secondTxsKey, secondTxs)
  console.log(await db.getAccountTxs(acc))
  await db.stop() // will close current Redis Database client socket
}

filterEntries(account)
```

Console should log:

```csh
{
  txs: [
    {
      from: '0xd9bca352c1466dAb438b05069C97C520445d68fD',
      to: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
      origin: '0x4',
      target: '0x1',
      tx: '0xdebc379ac6ef0aed3fb604ecb48f2df8a137976c871622fd8645110e04b23398',
      status: 'initiated',
      amount: '5000'
    },
    {
      from: '0xd9bca352c1466dAb438b05069C97C520445d68fD',
      to: '0x9eA27375C0A7B76F2D86685C65f5823a536eEd65',
      origin: '0x1',
      target: '0x4',
      tx: '0xa5c4a23eed45247d149e728a52681254fe4f521ebbfa4cd989f7e6956ba2c301',
      status: 'initiated',
      amount: '1000000000'
    }
  ]
}
```

### ✅ getAccountIndexes

List all `keys` from transactions originated from a given `account`

_Example:_

```jsx
const db = require('@metamathstudios/redis-wrapper')

const account = '0xd9bca352c1466dAb438b05069C97C520445d68fD'

const firstTxsKey = '14A12F09BCFA'
const secondTxsKey = '7BC091DCA5FF'


const firstTxs = {
  from: '0xd9bca352c1466dAb438b05069C97C520445d68fD',
  to: '0x9eA27375C0A7B76F2D86685C65f5823a536eEd65',
  origin: '0x1',
  target: '0x4',
  tx: '0xa5c4a23eed45247d149e728a52681254fe4f521ebbfa4cd989f7e6956ba2c301',
  status: 'initiated',
  amount: '1000000000'
}

const secondTxs = {
  from: '0xd9bca352c1466dAb438b05069C97C520445d68fD',
  to: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
  origin: '0x4',
  target: '0x1',
  tx: '0xdebc379ac6ef0aed3fb604ecb48f2df8a137976c871622fd8645110e04b23398',
  status: 'initiated',
  amount: '5000'
}


const filterEntries = async (acc) => {
  await db.start() // will open a new client socket to interact with Redis Database
  await db.setValue(firstTxsKey, firstTxs)
  await db.setValue(secondTxsKey, secondTxs)
  console.log(await db.getAccountIndexes(acc))
  await db.stop() // will close current Redis Database client socket
}

filterEntries(account)
```

Console should log:

```csh
{ id: [ '7BC091DCA5FF', '14A12F09BCFA' ] }
```
