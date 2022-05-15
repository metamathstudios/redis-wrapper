const db = require('../src/db-methods')

describe('Redis: Database Methods', () => {

  const oyenteObject = JSON.parse('{"from" : "0x0", "to" : "0x0", "origin" : "0x1", "target" : "0x4", "tx" : "0x0000", "status" : "initiated", "amount" : "1000"}')

  beforeEach( async () => {
   await db.start()
  })

  afterEach( async () => {
   await db.deleteValue('14A12F09BCFA')
   await db.stop()
  })

  it('Can read all keys from database', async () => {
    const keys = await db.getAllKeys()
    expect(keys.hasOwnProperty('id')).toBe(true)
  })

  it('Can write values to database', async () => {
    const receipt = await db.setValue('14A12F09BCFA', oyenteObject)
    expect(receipt).toBe(true)
  })

  it('Should error out if try to write with empty key', async () => {
    const receipt = await db.setValue(null, oyenteObject)
    expect(receipt).toBe(false)

  })

  it('Can delete values from database', async () => {
    const receipt = await db.deleteValue('14A12F09BCFA')
    expect(receipt).toBe(true)
  })

  it('Should error out if try to delete with empty key', async () => {
    const firstTry = await db.deleteValue(null)
    const secondTry = await db.deleteValue()
    expect(firstTry).toBe(false)
    expect(secondTry).toBe(false)

  })

  it('Can read target key value', async () => {
    await db.setValue('14A12F09BCFA', oyenteObject)
    const data = await db.getValue('14A12F09BCFA')
    expect(data).not.toBe(null)
  })

  it('Should error out if try read with empty key', async () => {
    const firstTry = await db.getValue(null)
    const secondTry = await db.getValue()
    expect(firstTry).toBe(false)
    expect(secondTry).toBe(false)

  })

  it('Should return all data that contain the searched address', async () => {
    await db.setValue('14A12F09BCFA', oyenteObject)
    oyenteObject.from = '0x1'
    await db.setValue('14A12F09BCFB', oyenteObject)
    oyenteObject.from = '0x2'
    await db.setValue('14A12F09BCFC', oyenteObject)
    const transactions = await db.getAccountTxs('0x1')
    await db.deleteValue('14A12F09BCFB')
    await db.deleteValue('14A12F09BCFC')
    expect(Object.entries(transactions.txs).length).toBe(1)
    expect(transactions.txs[0].from).toBe('0x1')
  })

  it('Should throw if searched address is null or undefined', async () => {

    try{
      await db.getAccountTxs(null)
    } catch (e){
      expect(e).toMatch('ERROR: Input is not valid!')
    }

    try{
      await db.getAccountTxs()
    } catch (e){
      expect(e).toMatch('ERROR: Input is not valid!')
    }
    
  })

  it('Values are valid formated JSON', async () => {
    await db.setValue('14A12F09BCFA', oyenteObject)
    const data = await db.getValue('14A12F09BCFA')
    expect(data.hasOwnProperty('from')).toBe(true)
    expect(data.hasOwnProperty('to')).toBe(true)
    expect(data.hasOwnProperty('origin')).toBe(true)
    expect(data.hasOwnProperty('target')).toBe(true)
    expect(data.hasOwnProperty('tx')).toBe(true)
    expect(data.hasOwnProperty('status')).toBe(true)
    expect(data.hasOwnProperty('amount')).toBe(true)
  })

  it('Should allow to overwrite STATUS only if different', async () => {
    await db.setValue('14A12F09BCFA', oyenteObject)
    const firstTry = await db.setValue('14A12F09BCFA', oyenteObject)
    oyenteObject.status = 'error'
    const secondTry = await db.setValue('14A12F09BCFA', oyenteObject)
    expect(firstTry).toBe(false)
    expect(secondTry).toBe(true)
  })

  it('Should accept only [initiated, error, processed or finalized] as status inputs', async () => {
    const firstTry = await db.setValue('14A12F09BCFA', oyenteObject)
    oyenteObject.status = 'processed'
    const secondTry = await db.setValue('14A12F09BCFA', oyenteObject)
    oyenteObject.status = 'finalized'
    const thirdTry = await db.setValue('14A12F09BCFA', oyenteObject)
    oyenteObject.status = 'foo'
    const fourthTry = await db.setValue('14A12F09BCFA', oyenteObject)
    oyenteObject.status = 'bar'
    const fifthTry = await db.setValue('14A12F09BCFA', oyenteObject)
    expect(firstTry).toBe(true)
    expect(secondTry).toBe(true)
    expect(thirdTry).toBe(true)
    expect(fourthTry).toBe(false)
    expect(fifthTry).toBe(false)
  })

})
