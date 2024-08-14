export const SupportChains = ['ethereum', 'bnb', 'arbitrum', 'base', 'optimism', 'b', 'polygon'];

export const JoinFlow = [
  'To join the flock, you will need to purchase a Paloma LightNode.',
  'Download the client and register your program.',
  'Run it Daily. Successful work will generate GRAINs to your Light Node account on your computer.',
  'Your Light Node will secure the Paloma network of relay pigeons that sends messages between blockchains.',
];

export const WorkFlow = [
  {
    icon: 'pigeon-work-1.png',
    title: 'Validator Pigeons',
    describe: 'Validator pigeons manage the blockchain, execute transaction relays, and run advanced Paloma software.',
  },
  {
    icon: 'pigeon-work-2.png',
    title: 'Delegator Pigeons',
    describe:
      'Delegator pigeons stake their tokens with reliable validators to ensure no validator controls more than 60% of the network.',
  },
  {
    icon: 'pigeon-work-3.png',
    title: 'Paloma Users',
    describe:
      "Paloma users create apps for trading, security, lending, borrowing, and monitoring digital assets. As Paloma grows, relay revenue will go to those who maintain the network's security and quality.",
  },
];

export const LightNodeFeatures = [
  {
    img: 'feature-0.svg',
    title: 'Mine GRAINs Every Block',
    describe:
      'Mine GRAINs every block, while your Paloma LightNode is running on your computer during your two year subscription.',
  },
  {
    img: 'feature-1.png',
    title: 'Collect Relay Fee Rewards',
    describe: 'Automatically collect relay fee GRAIN rewards from the Pigeon Network.',
  },
  {
    img: 'feature-2.png',
    title: 'Delegate GRAINs ',
    describe: 'Automatically delegate your GRAINs to active validators and relayers.',
  },
  {
    img: 'feature-3.png',
    title: 'Remove Inactive Validators',
    describe: 'Automatically remove your GRAINs from inactive validators.',
  },
  {
    img: 'feature-4.png',
    title: 'Vote On Proposals',
    describe: 'Vote on Community proposals to improve the network',
  },
  {
    img: 'feature-5.png',
    title: 'Automatically claim and re-Delegate minted GRAINs',
    describe: 'Automatically claim minted GRAINs and re-delegate them to new validators',
  },
  {
    img: 'feature-6.png',
    title: 'Monitor GRAIN Distribution',
    describe: 'Monitor the network distribution of GRAINs to maintain network relay capacity on target CHAINS.',
  },
  {
    img: 'feature-7.png',
    title: 'Trade GRAIN Payments',
    describe: 'Trade GRAIN payments with other Pigeon network members',
  },
];

export const EcosystemData = [
  {
    icon: 'uniswap.png',
    title: 'Uniswap Bots',
    describe: 'Uniswap users leverage Paloma’s trading bots for sophisticated trade execution across multiple chains.',
    backgroundImg: 'uniswap-shadow.png',
    items: [
      {
        name: 'Limit Order And Intent Bots',
      },
      {
        name: 'Trade Weighted Average Price (TWAP) Bots',
      },
    ],
  },
  {
    icon: 'curve.png',
    title: 'Curve Bots',
    describe:
      'Curve has processed nearly $30MM in volume in just six months. It is a decentralized exchange (DEX) and automated market maker (AMM) on Ethereum and EVM-compatible chains, designed for efficient trading of stablecoins and volatile assets.',
    backgroundImg: 'curve-shadow.png',
    items: [
      {
        name: 'Trading bots on Curve for Intents and LimitOrders',
      },
    ],
  },
  {
    icon: 'gmx.png',
    title: 'GMX bots',
    describe:
      'GMX is a decentralized spot and perpetual exchange that supports low swap fees and zero price impact trades.',
    backgroundImg: 'gmx-shadow.png',
    items: [
      {
        name: 'Short Funding Strategy Bots',
        text: 'The PalomaBot Short Funding bots allow anyone to take advantage of rising bitcoin and ethereum prices.',
      },
      {
        name: 'Delta Neutral Returns',
        text: 'This bot from Palomabot runs a strategy that is delta neutral to ETH / BTC, and collects short funding rate from a short perpetual position on GMX.',
      },
    ],
  },
  {
    icon: 'ethena.png',
    title: 'ethena staked usde bots',
    describe:
      "Ethena enables the creation and redemption of a delta-neutral synthetic dollar, USDe, crypto's first fully-backed, onchain, scalable, and censorship-resistant form of money. Staking USDe enables holders to receive the protocol's generated yield.",
    backgroundImg: 'ethena-shadow.png',
    items: [
      {
        name: 'Ethena Staked USDe Squeeze Bots',
        text: 'With up to 35x leverage allows users to take automated leverage and squeeze positions with Ethena’s staked stablecoin USDe',
      },
    ],
  },
  {
    icon: 'weth.png',
    title: 'lido wrapped staked eth bots',
    describe:
      "Wrapped stETH (wstETH) is an ERC-20 value-accruing token wrapper for Lido's Staked ETH or stETH. Its balance does not change with each oracle report, but its value in stETH does. Internally, it represents the user's share of the total supply of stETH tokens.",
    backgroundImg: 'weth-shadow.png',
    items: [
      {
        name: 'Lido Wrapped Staked ETH Squeeze Bots',
        text: 'With up to 10x Leverage allows users to take up automated leverage and squeeze positions with Lido’s Wrapped Staked ETH token, wstETH.',
      },
    ],
  },
  {
    icon: 'ezeth.png',
    title: 'Renzo EzETH bots',
    describe:
      'Liquid restaking protocol Renzo’s EzETH token enjoys multiples on points with leverage. Renzo is a strategy manager and liquid restaking token provider for both eigenLayer and symbiotic.',
    backgroundImg: 'ezeth-shadow.png',
    items: [
      {
        name: 'Leverage On Renzo LRTs',
        text: 'Llamalend Squeeze Bot with up to 9x Leverage allows users to take up automated leverage and squeeze positions with Renzo’s EzETH token.',
      },
      {
        name: 'Generate More Points',
        text: 'Collect Up To 3X EzPoints With Leverage.',
      },
    ],
  },
  {
    icon: 'peth.png',
    title: 'Puff Eth Bots',
    describe:
      'Liquid Restaking Protocol pufETH token enjoys multiples on points with leverage. Puffer is a decentralized native liquid restaking protocol (nLRP) built on Eigenlayer.',
    backgroundImg: 'peth-shadow.png',
    items: [
      {
        name: 'lamalend Squeeze Bot with up to 9x Leverage',
        text: 'Allows users to take up automated leverage and squeeze positions with Puffer’s pufETH token.',
      },
    ],
  },
  {
    icon: 'wbtc.png',
    title: 'wrapped bitcoin & threshold bitcoin Bots',
    describe: 'Automatically leverage bitcoin with liquidation protection and low borrowing costs.',
    backgroundImg: 'wbtc-shadow.png',
    items: [
      {
        name: 'Wrapped Bitcoin Squeeze Bots',
      },
      {
        name: 'Threshold Bitcoin Squeeze Bots',
      },
    ],
  },
  {
    icon: 'compound.svg',
    title: 'Compound Multichain Migration Bots',
    describe:
      'Compound users can now migrate their ETH and USDC position liquidity via Paloma’s Compound Multichain Migration bots. All liquidity is secured by the Paloma blockchain with fast execution across all Compound’s ETH and USDC lending chains.',
    backgroundImg: 'compound-shadow.svg',
    items: [
      {
        name: '1-Click Cross-Chain Liquidity',
        text: 'Execute Compound Lending Markets Liquidity Migration Across Multiple Chains with just One-Click.',
      },
      {
        name: 'Paloma Validator Custody',
        text: 'Paloma Validator Set Provides Custody and Security Across USDC Native Bridges.',
      },
      {
        name: 'Low Cost Per Play',
        text: 'Automatation-Enabled Decentralized Applications in the Ethereum Ecosystem.',
      },
    ],
  },
  {
    icon: 'paloma-bot.png',
    title: 'Prediction Market Bots',
    describe: 'Paloma Prediction Bots allow anyone to create and host prediction games',
    backgroundImg: 'paloma-bot-shadow.png',
    items: [
      {
        name: 'Price Prediction Game',
        text: 'To bet on the price of tokens such as CRV DAO Token',
      },
      {
        name: 'Awards On Every Epoch',
        text: '$500 Awards For Winners On Every Epoch',
      },
      {
        name: 'Low Cost Per Play',
        text: 'Low Cost Game Play On Arbitrum',
      },
    ],
  },
  {
    icon: 'tailored.png',
    title: 'T(AI)lored',
    describe: 'Your AI that works for you and pays you',
    backgroundImg: 't.png',
    items: [
      {
        name: 'Personalized AI',
        text: 'A Personal AI that gets things done just for you.',
      },
      {
        name: 'An AI Network',
        text: 'A decentralized coordination and payment network for personal AIs.',
      },
      {
        name: 'Get Paid',
        text: 'Receive points and tokens while AI’s do your work.',
      },
    ],
  },
  {
    icon: 'squeeze.png',
    title: 'squeeze',
    describe:
      'SQUEEZE is an EVM-based L2 that addresses Ethereum L1 stake incentives by offering uncapped L1 and L2 deposit incentives, enhanced by on-chain automation for higher transaction volume and better UI/UX',
    backgroundImg: 'squeeze-shadow.png',
    items: [
      {
        name: 'The first automated-EVM execution chain in the Cosmos',
      },
      {
        name: 'Native Yield Through Automated Crosschain Leverage',
      },
      {
        name: 'Automatation-Enabled Decentralized Applications in the Ethereum Ecosystem',
      },
    ],
  },
  {
    icon: 'paloma-swap.png',
    title: 'Paloma swap',
    describe:
      'Enjoy Free GRAINs and zero-fee, MEV-protected Swaps on Uniswap, Curve, Pancakeswap and a number of other AMMs on multiple chains. Millions on swaps completed in just a few months.',
    backgroundImg: 'paloma-swap-shadow.png',
    items: [
      {
        name: 'Get rewarded Paloma GRAINs for swapping',
      },
      {
        name: 'Avoid Front-end Fees and Swap For Free',
      },
      {
        name: 'Swap on Multiple L2s and on Ethereum',
      },
    ],
  },
  {
    icon: 'paloma-dex.png',
    title: 'paloma dex',
    describe:
      'PalomaDEX is Multi pool type automated market-maker (AMM) protocol powered by smart contracts on the Paloma blockchain. This AMM is a fork of the Astroport AMM codebase and aims to be the main liquidity trading destination on Paloma’s blockchain.',
    backgroundImg: 'paloma-dex-shadow.png',
    items: [
      {
        name: 'Bridge and Trade Tokens from any EVM Supported by Paloma',
      },
      {
        name: 'Create any Trading Pair on Paloma with Zero Gas',
      },
    ],
  },
];

export const Investors = [
  'investor1.png',
  'investor2.png',
  'investor3.png',
  'investor4.png',
  'investor5.png',
  'investor6.png',
];

export const NodeSaleLinks = {
  'Paloma LightNode Sale': [
    {
      title: 'Paloma LightNode Purchase Page',
      link: 'https://www.palomachain.com/',
    },
    {
      title: 'Paloma LightNode Registration',
      link: 'https://www.palomachain.com/register',
    },
  ],
  'Official Pages': [
    {
      title: "Paloma's Website",
      link: 'https://www.palomachain.com',
    },
    {
      title: "Paloma's Official Documentation",
      link: 'https://docs.palomachain.com',
    },
    {
      title: "Paloma's Governance Forum",
      link: 'https://forum.palomachain.com/',
    },
    {
      title: 'Paloma Explorer',
      link: 'https://paloma.explorers.guru/',
    },
  ],
  'Official Social Media': [
    {
      title: "Paloma's Twitter",
      link: 'https://x.com/paloma_chain',
      icon: '/assets/social/twitter.svg',
    },
    {
      title: "Paloma's Discord",
      link: 'https://discord.gg/YbjCJvXBuu',
      icon: '/assets/social/discord.svg',
    },
    {
      title: "Paloma's Official Telegram",
      link: 'https://t.me/palomachain',
      icon: '/assets/social/telegram.svg',
    },
    {
      title: "Paloma's Youtube Channel",
      link: 'https://www.youtube.com/channel/UC_ssI5Y8KGZOaaZmqQB44xQ',
      icon: '/assets/social/youtube.svg',
    },
  ],
  'Paloma Decentralized Apps': [
    {
      title: 'PalomaBot',
      link: 'https://palomabot.ai',
    },
    {
      title: 'PalomaBot Youtube Channel',
      link: 'https://www.youtube.com/channel/UC1Tws6CWO1iRRdpiffH3CWA',
    },
    {
      title: 'T(ai)lored AI',
      link: 'https://www.tailoredai.me/',
    },
    {
      title: 'Curvebot',
      link: 'https://curvebot.fi',
    },
    {
      title: 'PalomaSwap',
      link: 'https://palomaswap.com',
    },
  ],
};

export const Advisors = [
  {
    name: 'Anatoly Yakovenko',
    company: 'Solana',
    img: '/assets/advisors/1.svg',
    logo: '/assets/ecosystem/solana.svg',
  },
  {
    name: 'Marko Baricevic',
    company: 'Cosmos',
    img: '/assets/advisors/2.svg',
    logo: '/assets/ecosystem/cosmos.svg',
  },
  {
    name: 'Erik Mayo',
    company: 'Patache Digital',
    img: '/assets/advisors/3.svg',
    logo: '/assets/ecosystem/patache.svg',
  },
  {
    name: 'Lok Lee',
    company: 'Tuesday VC',
    img: '/assets/advisors/4.svg',
    logo: '/assets/ecosystem/tuesday-vc.svg',
  },
];

export const CustomerSupport = [
  {
    label: 'Enhanced Support',
    price: 50,
    effects: ['24/7 availability', 'Multiple modes of contact', 'Allows up to 8 tickets per month'],
    month: 24,
  },
  {
    label: 'Standard Support',
    price: 0,
    effects: [
      'Web-based only',
      'Limited to 2 tickets per month',
      'Target response time of 3 business days (no guarantee)',
    ],
    month: 0,
  },
];
