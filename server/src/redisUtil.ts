import * as redis from 'redis'

var client = redis.createClient(process.env.REDIS_URL);

export let redisSet = (key: string, value: string) => {
    return new Promise<boolean>(async resolve => {
        console.log('redisSet', key, value)
        await client.set(key, value, () => resolve(true))
    })
}

export let redisGet = (key: string) => {
    return new Promise<String>(async resolve => {
        console.log('redisGet', key)
        // await client.get(key, (res, s) => resolve(s));
        await client.get(key, (res, s) => resolve(s !== 'undefined' ? s : undefined));

    })
}