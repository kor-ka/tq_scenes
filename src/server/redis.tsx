import * as redis from 'redis'

var client = redis.createClient(process.env.REDIS_URL);

export let redisSet = (key: string, value: string) => {
    return new Promise<boolean>(resolve => {
        client.set(key, value, () => resolve(true))
    })
}

export let redisGet = (key: string) => {
    return new Promise<String>(resolve => {
        client.get(key, (res, s) => resolve(s));
    })
}

export let parseJson = (body: any) => {
    return new Promise<any>(resolve => {
        resolve(JSON.parse(body));
    })
}