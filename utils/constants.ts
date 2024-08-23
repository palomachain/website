export const TWITTER_LINK = 'https://twitter.com/paloma_chain';
export const TELEGRAM_LINK = 'https://t.me/palomachain';
export const GITHUB_LINK = 'https://github.com/palomachain';
export const DISCORD_LINK = 'https://discord.gg/tNqkNHvVNc';

export const PALOMABOT_WEBSITE_LINK = 'https://palomabot.ai';

export const LATEST_BLOG_SHOW_CNT = 3;

export const PAGE_LANDING = 'landing-page';

export const TotalNodes = 20000;
export const NodeSlot1 = 1000;
export const ChangeR = 0.9596080047;
export const StartingPrice = 50;
export const EndingPrice = 15000;
export const Exponent = 2;
export const NSlots = 40;
export const GrainsPerNode = 50000;
export const TotalGrains = 6120000000;
export const Inflation = 7; // 7%
export const CommunityFee = 2; // 2%
export const ValidatorFee = 5; // 5%
export const RelayRewardFee = 30; // 30%
export const PigeonGasFee = 10; // 10%
export const Increment = (EndingPrice - StartingPrice) / (NSlots - 1) ** Exponent;

export const NodeSaleStartDate = 1725447600 * 1000; // 11:00 AM, September 4, 2024 Coordinated Universal Time (UTC)
export const NodeSaleEndDate = 1728039600 * 1000; // 11:00 AM, Oct 4, 2024 Coordinated Universal Time (UTC)

export const PaymentStatus = [
  0, // purchased
  1, // whitelisted
  2, // activated
  3, // sold
];
