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

      // KASIKA

      KASIKA_TOYOTACHUO_EMAIL?: string,
      KASIKA_TOYOTACHUO_PASS?: string,

      KASIKA_TOYOTAOBAYASHI_EMAIL?: string,
      KASIKA_TOYOTAOBAYASHI_PASS?: string,

      KASIKA_TAKAHAMACHUO_EMAIL?: string,
      KASIKA_TAKAHAMACHUO_PASS?: string,

      KASIKA_TOYOKAWACHUO_EMAIL?: string,
      KASIKA_TOYOKAWACHUO_PASS?: string,

      KASIKA_TOYOKAWAYAWATA_EMAIL?: string,
      KASIKA_TOYOKAWAYAWATA_PASS?: string,

      KASIKA_GAMAGORI_EMAIL?: string,
      KASIKA_GAMAGORI_PASS?: string,

      KASIKA_TOYOHASHIMUKAIYAMA_EMAIL?: string,
      KASIKA_TOYOHASHIMUKAIYAMA_PASS?: string,

      KASIKA_TOYOHASHIFUJISAWA_EMAIL?: string,
      KASIKA_TOYOHASHIFUJISAWA_PASS?: string,

      KASIKA_CHIKUSA_EMAIL?: string,
      KASIKA_CHIKUSA_PASS?: string,

      KASIKA_YAGUMA_EMAIL?: string,
      KASIKA_YAGUMA_PASS?: string,

      KASIKA_OGAKI_EMAIL?: string,
      KASIKA_OGAKI_PASS?: string,

      // Chatwork
      CW_TOKEN : string,
      CW_TOKEN_TEST : string,

      // Common

      CLUSTER_MAXCONCURRENCY: number

      BROWSER_TYPE?: 'NORMAL' | 'HEADLESS',
      ENVIRONMENT?: 'dev' | 'prod',
      NODE_ENV: string,
      CLI_KINTONE_PATH: string
    }
  }
}


export {};
