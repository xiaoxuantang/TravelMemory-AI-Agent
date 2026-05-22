export type RedisConfig = {
  url: string | undefined;
  token: string | undefined;
};

export function getRedisConfig(): RedisConfig {
  return {
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN
  };
}
