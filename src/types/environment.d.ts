declare global {
  namespace NodeJS {
    interface ProcessEnv {
      KINTONE_BASE_URL: string,
      KINTONE_CUSTOMERS_TOKEN: string,
      KINTONE_LONGTERM_CUSTOMERS_TOKEN: string,
      KINTONE_USER?: string,
      KINTONE_PASS?: string,

      SLACK_SIGNING_SECRET: string,
      SLACK_BOT_TOKEN: string,

      SLACK_CHANNEL_ID_TOYOKAWA: string,
      SLACK_CHANNEL_ID_TOYOHASHI: string,
      SLACK_CHANNEL_ID_TOYOTA: string,
      SLACK_CHANNEL_ID_NAKAGAWA: string,
      SLACK_CHANNEL_ID_GAMAGORI: string,
      SLACK_CHANNEL_ID_TAKAHAMA: string,
      SLACK_CHANNEL_ID_OGAKI: string,

      SLACK_CHANNEL_ID_TEST: string,
      SLACK_CHANNEL_ID_DEV: string,

      DO_NETWORK_USER: string,
      DO_NETWORK_PASSWORD: string,

      REINS_USER?: string,
      REINS_PASS?: string,

      CLUSTER_MAXCONCURRENCY: number

      BROWSER_TYPE?: 'NORMAL' | 'HEADLESS',
      ENVIRONMENT?: 'dev' | 'prod',
      NODE_ENV: string,
      CLI_KINTONE_PATH: string
    }
  }
}


export {};
