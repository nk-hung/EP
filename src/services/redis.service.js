const redis = require('redis');
const { promisify } = require('util');
const { reservationInventory } = require('../models/repositories/inventory.repo');
const redisClient = redis.createClient();

const pexpire = promisify(redisClient.expire).bind(redisClient)
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2023_${productId}`
    const retryTimes = 10;
    const expireTime = 3000; // 3 seconds tam thoi lock

    for (let i = 0; i < retryTimes; i++) {
       // tao mot key, thang nao nam giu moi duoc vao thanh toan
       const result = await setnxAsync(key, expireTime)
       console.log('result::', result)
       if (result) {
            // thao tac voi inventory
            const isReservation = await reservationInventory({
                productId,
                quantity, cartId
            })

            if (isReservation.modifiedCount) {
                await pexpire(key, expireTime)
                return key
            }
            return null;
       } else {
            await new Promise((resolve, reject) => setTimeout( resolve, 50))
       }
    }
}

const releaseLock = async keyLock => {
    const delAsync = promisify(redisClient.del).bind(redisClient)
    return await delAsync(keyLock)
}

module.exports = {
    acquireLock,
    releaseLock
};