import Redis from "ioredis"
import dotenv from "dotenv"

dotenv.config()

if (!process.env.UPSTASH_REDIS_URL) {
    console.error('⚠️  UPSTASH_REDIS_URL is not defined in environment variables');
}

export const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: false,
});

redis.on('error', (err) => {
    console.error('❌ Redis connection error:', err.message);
});

redis.on('connect', () => {
    console.log('✓ Redis connected successfully');
});