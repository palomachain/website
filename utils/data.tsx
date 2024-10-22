import { IAlertInfo, IInstructionsNodeSteps } from 'interfaces/nodeSale';
import React from 'react';

export const SupportChains = ['ethereum', 'binance', 'arbitrum', 'base', 'optimism', 'b', 'polygon', 'gnosis'];

export const JoinFlow = [
  'To join the flock, you will need to purchase a Paloma LightNode.',
  'Download the client and register your program.',
  'Run it Daily. Successful work will generate GRAINs to your Light Node account on your computer.',
  'Your Light Node will secure the Paloma network of relay pigeons that sends messages between blockchains.',
];

export const WorkFlow = [
  {
    icon: 'pigeon-work-1.svg',
    title: 'Validator Pigeons',
    describe: 'Validator pigeons manage the blockchain, execute transaction relays, and run advanced Paloma software.',
  },
  {
    icon: 'pigeon-work-2.svg',
    title: 'Delegator Pigeons',
    describe:
      'Delegator pigeons stake their tokens with reliable validators to ensure no validator controls more than 60% of the network.',
  },
  {
    icon: 'pigeon-work-3.svg',
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
  {
    icon: 'nectar.png',
    title: 'NECTAR',
    describe:
      "Nectar is a decentralized delta-hedged stablecoin built on Arbitrum's GMX. Zero minting fees, no interest. Funding rate income insures against negative periods.",
    items: [
      {
        name: 'With Nectar, We Can Create Delta Neutral Hedges for any Pair as Long as There is Access to an Off-Chain Perp.',
      },
      {
        name: 'New Markets Can be Created as Soon as Perp Markets are Created. All that is Required is Initial Liquidity for a Token/NecUSD Pair.',
      },
      {
        name: 'Nectar Captures the Long Tail of Assets to Offer Liquid, Delta Neutral Stablecoin Issuance.',
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

export const SupportSystems = {
  Mac: 'MacOS',
  Windows: 'Windows',
  Linux: 'Linux',
  VPS: 'VPS',
};

export const PalomaInstructionsSteps: {
  [x: string]: IInstructionsNodeSteps[];
} = {
  [SupportSystems.Mac]: [
    {
      head: 'Download Docker installer',
      steps: [
        {
          title: <p>Download the installer for your Mac hardware</p>,
          externalBtns: [
            {
              text: 'Apple Silicon (M1 or higher)',
              link: 'https://desktop.docker.com/mac/main/arm64/Docker.dmg?utm_source=docker&utm_medium=webreferral&utm_campaign=docs-driven-download-mac-arm64',
            },
            {
              text: 'Mac with Intel Chip',
              link: 'https://desktop.docker.com/mac/main/amd64/Docker.dmg?utm_source=docker&utm_medium=webreferral&utm_campaign=docs-driven-download-mac-amd64',
            },
          ],
          describe:
            'On your Mac, pull down the Apple icon in the upper-left corner of your screen. Choose About This Mac. If the window shows an item labeled Chip, you have a Mac with Apple silicon. If the window shows an item labeled Processor, you have an Intel-based Mac.',
        },
        {
          title: (
            <p>
              Double-click <span>Docker.dmg</span> to open the installer, then drag the Docker icon to the Applications
              folder. By default, Docker Desktop is installed at <span>/Applications/Docker.app.</span>
            </p>
          ),
        },
        {
          title: (
            <p>
              Double-click <span>Docker.app</span> in the <b>Applications</b> folder to start Docker.
            </p>
          ),
        },
        {
          title: <p>The Docker menu displays the Docker Subscription Service Agreement.</p>,
        },
        {
          title: (
            <p>
              Select <b>Accept</b> to continue. Docker Desktop starts after you accept the terms.
            </p>
          ),
        },
        {
          title: (
            <p>
              Select <b>Finish.</b>
            </p>
          ),
        },
      ],
    },
    {
      head: 'Download the Setup Script',
      steps: [
        {
          title: <p>Download the Setup Script for your Mac hardware</p>,
          externalBtns: [
            {
              text: 'Download Setup',
              link: 'https://download.palomachain.com/lightnode/setup.sh',
            },
          ],
        },
        {
          title: (
            <p>After downloading the setup on your Mac, open the Terminal application found in the Utilities folder</p>
          ),
          commands: [
            {
              name: (
                <p>
                  <b>First time LightNode Buyers:</b> Copy and Past the command:
                </p>
              ),
              command: <p>sh $HOME/Downloads/setup.sh</p>,
              copyCommand: 'sh $HOME/Downloads/setup.sh',
            },
            {
              name: (
                <p>
                  <b>For repeat LightNode Buyers Only:</b> Copy and Past the command:
                </p>
              ),
              command: <p>sh $HOME/Downloads/setup.sh add-node</p>,
              copyCommand: 'sh $HOME/Downloads/setup.sh add-node',
            },
          ],
        },
      ],
    },
    // {
    //   head: 'Install the Lightnode',
    //   steps: [
    //     {
    //       title: <p>Open the Terminal Application in Macintosh Utilities</p>,
    //       commands: [
    //         {
    //           name: <p>Copy and Past the command:</p>,
    //           command: (
    //             <p>
    //               docker run --pull=always -ti -v ./password-store/.gnupg:/root/.gnupg -v
    //               ./password-store/.password-store:/root/.password-store palomachain/
    //               <span>lightnode-client:latest</span>
    //             </p>
    //           ),
    //           copyCommand:
    //             'docker run --pull=always -ti -v ./password-store/.gnupg:/root/.gnupg -v ./password-store/.password-store:/root/.password-store palomachain/lightnode-client:latest',
    //         },
    //       ],
    //     },
    //     {
    //       title: <p>After activating the node, you can keep it running in the background</p>,
    //       commands: [
    //         {
    //           name: <p>Copy and Past the command:</p>,
    //           command: (
    //             <p>
    //               docker run --pull=always -ti -v ./password-store/.gnupg:/root/.gnupg -v
    //               ./password-store/.password-store:/root/.password-store palomachain/
    //               <span>lightnode-client:latest automate</span>
    //             </p>
    //           ),
    //           copyCommand:
    //             'docker run --pull=always -ti -v ./password-store/.gnupg:/root/.gnupg -v ./password-store/.password-store:/root/.password-store palomachain/lightnode-client:latest automate',
    //         },
    //         {
    //           name: <p>Input your keystore password</p>,
    //         },
    //         {
    //           name: <p>Press CTRL-P - CTRL-Q</p>,
    //         },
    //       ],
    //     },
    //   ],
    // },
  ],
  [SupportSystems.Windows]: [
    {
      head: 'Download Docker Installer',
      steps: [
        {
          title: <p>Download the installer for your Windows hardware</p>,
          externalBtns: [
            {
              text: 'Windows Intel Chip',
              link: 'https://desktop.docker.com/win/main/amd64/Docker Desktop Installer.exe?utm_source=docker&utm_medium=webreferral&utm_campaign=docs-driven-download-win-amd64',
            },
            {
              text: 'ARM Chip',
              link: 'https://desktop.docker.com/win/main/arm64/Docker Desktop Installer.exe?utm_source=docker&utm_medium=webreferral&utm_campaign=docs-driven-download-win-arm64',
            },
          ],
          describe:
            'Open the Settings app (Win + I) and go to System > About. Under Device specifications, check "System type": x64-based or x86-based means an Intel or AMD processor, while ARM-based indicates an ARM processor.',
        },
        {
          title: (
            <p>
              Double-click <span>Docker Desktop Installer.exe</span> to run the installer.
              <br />
              By default, Docker Desktop is installed at
              <br />
              <span>C:\Program Files\Docker\Docker</span>
            </p>
          ),
        },
        {
          title: (
            <p>
              When prompted, ensure the <b>Use WSL 2</b> instead of <b>Hyper-V</b> option on the Configuration page is
              selected or not depending on your choice of backend.
              <br />
              <br />
              If your system only supports one of the two options, you will not be able to select which backend to use
            </p>
          ),
        },
        {
          title: (
            <p>
              Follow the instructions on the installation wizard to authorize the installer and proceed with the
              install.
            </p>
          ),
        },
        {
          title: <p>When the installation is successful, select Close to complete the installation process.</p>,
        },
      ],
    },
    {
      head: 'Start Docker Desktop for Microsoft Windows',
      describe: (
        <p>
          Docker Desktop does not start automatically after installation.
          <br />
          To start Docker Desktop:
        </p>
      ),
      steps: [
        {
          title: <p>Search for Docker, and select Docker Desktop in the search results</p>,
          img: <img src="/assets/home/search-docker.png" alt="search-docker" />,
        },
        {
          title: <p>The Docker menu displays the Docker Subscription Service Agreement.</p>,
        },
        {
          title: (
            <p>
              Select <b>Accept</b> to continue. Docker Desktop starts after you accept the terms.
              <br />
              <br />
              Note that Docker Desktop won't run if you do not agree to the terms.
              <br />
              You can choose to accept the terms at a later date by opening Docker Desktop.
            </p>
          ),
        },
      ],
    },
    {
      head: 'Install the LightNode',
      steps: [
        {
          title: <p>Open the Windows PowerShell</p>,
          commands: [
            {
              name: (
                <p>
                  <b>First time LightNode Buyers:</b> Copy and Past the command:
                </p>
              ),
              command: (
                <p>
                  docker run --rm --pull=always -ti -v $env:USERPROFILE\paloma-lightnode\.paloma:/root/.paloma
                  palomachain/lightnode-client:v2 setup-node
                </p>
              ),
              copyCommand:
                'docker run --rm --pull=always -ti -v $env:USERPROFILE\\paloma-lightnode\\.paloma:/root/.paloma palomachain/lightnode-client:v2 setup-node',
            },
            {
              name: (
                <p>
                  <b>For repeat LightNode Buyers Only:</b> Copy and Past the command:
                </p>
              ),
              command: (
                <p>
                  docker run --rm --pull=always -ti -v $env:USERPROFILE\paloma-lightnode\.paloma:/root/.paloma
                  palomachain/lightnode-client:v2 add-node
                </p>
              ),
              copyCommand:
                'docker run --rm --pull=always -ti -v $env:USERPROFILE\\paloma-lightnode\\.paloma:/root/.paloma palomachain/lightnode-client:v2 add-node',
            },
          ],
        },
        // {
        //   title: <p>After registering the node, you can keep it running in the background</p>,
        //   commands: [
        //     {
        //       name: <p>Copy and Past the command:</p>,
        //       command: (
        //         <p>
        //           docker run --pull=always -ti -v ./password-store/.gnupg:/root/.gnupg -v
        //           ./password-store/.password-store:/root/.password-store palomachain/
        //           <span>lightnode-client:latest automate</span>
        //         </p>
        //       ),
        //       copyCommand:
        //         'docker run --pull=always -ti -v ./password-store/.gnupg:/root/.gnupg -v ./password-store/.password-store:/root/.password-store palomachain/lightnode-client:latest automate',
        //     },
        //     {
        //       name: <p>Input your keystore password</p>,
        //     },
        //     {
        //       name: <p>Press CTRL-P - CTRL-Q</p>,
        //     },
        //   ],
        // },
      ],
    },
  ],
  [SupportSystems.Linux]: [
    // {
    //   head: 'Download Docker installer',
    //   describe:
    //     'To get started with Docker Engine on Ubuntu, make sure you meet the prerequisites, and then follow the installation steps.',
    //   subItems: [
    //     {
    //       title: 'Prerequisites',
    //       subTitle: 'Firewall limitations',
    //       alert: {
    //         type: 'warning',
    //         label:
    //           'Before you install Docker, make sure you consider the following security implications and firewall incompatibilities.',
    //       },
    //       li: [
    //         <p>
    //           If you use ufw or firewalld to manage firewall settings, be aware that when you expose container ports
    //           using Docker, these ports bypass your firewall rules. For more information, refer to Docker and ufw.
    //         </p>,
    //         <p>
    //           Docker is only compatible with <span>iptables-nft</span> and <span>iptables-legacy</span> Firewall rules
    //           created with <span>nft</span> are not supported on a system with Docker installed. Make sure that any
    //           firewall rulesets you use are created with <span>iptables</span> or <span>ip6tables</span>, and that you
    //           add them to the <span>DOCKER-USER</span> see{' '}
    //           <a href="https://docs.docker.com/engine/network/packet-filtering-firewalls/" target="_blank">
    //             Packet filtering and firewalls.
    //           </a>
    //           and firewalls.
    //         </p>,
    //       ],
    //     },
    //     {
    //       title: 'OS Requirements',
    //       body: [
    //         <p>To install Docker Engine, you need the 64-bit version of one of these Ubuntu versions:</p>,
    //         <ul>
    //           <li>Ubuntu Noble 24.04 (LTS)</li>
    //           <li>Ubuntu Jammy 22.04 (LTS)</li>
    //           <li>Ubuntu Focal 20.04 (LTS)</li>
    //         </ul>,
    //         <p>
    //           Docker Engine for Ubuntu is compatible with x86_64 (or amd64), armhf, arm64, s390x, and ppc64le (ppc64el)
    //           architectures.
    //         </p>,
    //       ],
    //     },
    //   ],
    // },
    // {
    //   head: 'Download Docker installer',
    //   subItems: [
    //     {
    //       title: 'Uninstall old versions',
    //       body: [
    //         <p>Before you can install Docker Engine, you need to uninstall any conflicting packages.</p>,
    //         <p>
    //           Distro maintainers provide unofficial distributions of Docker packages in APT. You must uninstall these
    //           packages before you can install the official version of Docker Engine.
    //         </p>,
    //         <p>The unofficial packages to uninstall are:</p>,
    //         <ul>
    //           <li>
    //             <span>docker.io</span>
    //           </li>
    //           <li>
    //             <span>docker-compose</span>
    //           </li>
    //           <li>
    //             <span>docker-compose-v2</span>
    //           </li>
    //           <li>
    //             <span>docker-doc</span>
    //           </li>
    //           <li>
    //             <span>podman-docker</span>
    //           </li>
    //         </ul>,
    //         <p>
    //           Moreover, Docker Engine depends on <span>containerd</span> and <span>runc.</span>. Docker Engine bundles
    //           these dependencies as one bundle: <span>containerd.io</span> . If you have installed the{' '}
    //           <span>containerd</span> or <span>runc.</span> previously, uninstall them to avoid conflicts with the
    //           versions bundled with Docker Engine.
    //         </p>,
    //         {
    //           name: <p>Run the following command to uninstall all conflicting packages:</p>,
    //           command: (
    //             <p>
    //               $ for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do
    //               sudo apt-get remove $pkg; done
    //             </p>
    //           ),
    //           copyCommand:
    //             '$ for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done',
    //         },
    //         <p>
    //           <span>apt-get</span> might report that you have none of these packages installed.
    //         </p>,
    //         <p>
    //           Images, containers, volumes, and networks stored in <span>/var/lib/docker/</span> aren't automatically
    //           removed when you uninstall Docker. If you want to start with a clean installation, and prefer to clean up
    //           any existing data, read the{' '}
    //           <a href="https://docs.docker.com/engine/install/ubuntu/#uninstall-docker-engine" target="_blank">
    //             uninstall Docker Engine
    //           </a>{' '}
    //           section.
    //         </p>,
    //       ],
    //     },
    //   ],
    // },
    {
      head: 'Download Docker Installer',
      subItems: [
        {
          title: 'Installation Methods',
          body: (
            <>
              <p>You can install Docker Engine in different ways, depending on your needs:</p>
              <ul>
                <li>
                  Docker Engine comes bundled with{' '}
                  <a href="https://docs.docker.com/desktop/install/linux-install/" target="_blank">
                    Docker Desktop for Linux
                  </a>
                  . This is the easiest and quickest way to get started.
                </li>
                <li>
                  Set up and install Docker Engine from{' '}
                  <a href="https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository" target="_blank">
                    Docker's <span>apt</span> repository.
                  </a>
                </li>
                <li>
                  <a href="https://docs.docker.com/engine/install/ubuntu/#install-from-a-package" target="_blank">
                    Install it manually
                  </a>{' '}
                  and manage upgrades manually.
                </li>
                <li>
                  Use a{' '}
                  <a
                    href="https://docs.docker.com/engine/install/ubuntu/#install-using-the-convenience-script"
                    target="_blank"
                  >
                    convenience script
                  </a>
                  . Only recommended for testing and development environments.
                </li>
              </ul>
            </>
          ),
        },
        {
          title: (
            <a href="https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository" target="_blank">
              Install using the <span>apt</span> repository
            </a>
          ),
          describe: (
            <p>
              Before you install Docker Engine for the first time on a new host machine, you need to set up the Docker
              repository. Afterward, you can install and update Docker from the repository.
            </p>
          ),
          steps: [
            {
              title: (
                <p>
                  Set up Docker's <span>apt</span> repository.
                </p>
              ),
              commands: [
                {
                  command: (
                    <div className="copy-command-with-color">
                      <p className="gray-color"># Add Docker's official GPG key:</p>
                      <p>sudo apt-get update</p>
                      <p>sudo apt-get install ca-certificates curl</p>
                      <p>
                        sudo install -m <span>0755</span> -d /etc/apt/keyrings
                      </p>
                      <p>
                        sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
                      </p>
                      <p>sudo chmod a+r /etc/apt/keyrings/docker.asc</p>
                      <p className="copy-command-with-color__gray my-24"># Add the repository to Apt sources:</p>
                      <p>
                        <span className="orange-color">echo</span> \<br />
                        &nbsp;&nbsp; <span className="green-color">"deb [arch=</span>
                        <span className="orange-color">$(</span>dpkg --print-architecture
                        <span className="orange-color">)</span>{' '}
                        <span className="green-color">
                          signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu
                        </span>{' '}
                        \ <span className="orange-color">$(</span>. /etc/os-release <span>&&</span>{' '}
                        <span className="orange-color">echo</span> "$VERSION_CODENAME"
                        <span className="orange-color">)</span> <span className="green-color">stable"</span>{' '}
                        <span className="gray-color">|</span> \<br />
                        sudo tee /etc/apt/sources.list.d/docker.list &gt; /dev/null
                        <br />
                        sudo apt-get update
                      </p>
                    </div>
                  ),
                  copyCommand:
                    'sudo apt-get update \n sudo apt-get install ca-certificates curl \n sudo install -m 0755 -d /etc/apt/keyrings \n sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc \n echo  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \\ \n sudo tee /etc/apt/sources.list.d/docker.list > /dev/null \n sudo apt-get update',
                },
              ],
              alert: {
                type: IAlertInfo.NOTE,
                text: (
                  <p>
                    If you use an Ubuntu derivative distro, such as Linux Mint, you may need to use{' '}
                    <span>UBUNTO_CODENAME</span> instead of <span>VERSION_NAME</span>.
                  </p>
                ),
              },
            },
            {
              title: <p>Install the Docker packages.</p>,
              describe: <p>To install the latest version, run:</p>,
              commands: [
                {
                  command: (
                    <p>
                      $ sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin
                      docker-compose-plugin
                    </p>
                  ),
                  copyCommand:
                    'sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin',
                },
              ],
            },
            {
              title: (
                <p>
                  Verify that the Docker Engine installation is successful by running the <span>hello-world</span>{' '}
                  image.
                </p>
              ),
              commands: [
                {
                  command: <p>$ sudo docker run hello-world</p>,
                  copyCommand: 'sudo docker run hello-world',
                  instruction: (
                    <p>
                      This command downloads a test image and runs it in a container. When the container runs, it prints
                      a confirmation message and exits.
                    </p>
                  ),
                },
              ],
            },
          ],
        },
      ],
      footer: <p>You have now successfully installed and started Docker Engine.</p>,
    },
    {
      head: 'Download the Setup Script',
      steps: [
        {
          title: <p>Download the Setup Script for your Linux hardware</p>,
          externalBtns: [
            {
              text: 'Download Setup',
              link: 'https://download.palomachain.com/lightnode/setup.sh',
            },
          ],
        },
        {
          title: <p>After downloading the setup on your Linux, open the Command Line.</p>,
          commands: [
            {
              name: (
                <p>
                  <b>First time LightNode Buyers:</b> Copy and Past the command:
                </p>
              ),
              command: <p>sudo sh $HOME/Downloads/setup.sh</p>,
              copyCommand: 'sudo sh $HOME/Downloads/setup.sh',
            },
            {
              name: (
                <p>
                  <b>For repeat LightNode Buyers Only:</b> Copy and Past the command:
                </p>
              ),
              command: <p>sudo sh $HOME/Downloads/setup.sh add-node</p>,
              copyCommand: 'sudo sh $HOME/Downloads/setup.sh add-node',
            },
          ],
        },
      ],
    },
  ],
  [SupportSystems.VPS]: [
    {
      head: 'Virtual Private Server LightNode',
      subItems: [
        {
          title: 'Docker Installation Instructions',
          describe: 'Open the Linux command line and follow the steps below to install Docker.',
          steps: [
            {
              title: (
                <p>
                  <b>Update and get Certificates.</b> Copy and Past the command:
                </p>
              ),
              commands: [
                {
                  command: (
                    <p>
                      sudo apt-get update
                      <br />
                      sudo apt-get install ca-certificates curl
                    </p>
                  ),
                  copyCommand: 'sudo apt-get update \n sudo apt-get install ca-certificates curl',
                  isTitle: false,
                },
              ],
            },
            {
              title: (
                <p>
                  <b>Install docker Key Rings.</b> Copy and Past the command:
                </p>
              ),
              commands: [
                {
                  command: (
                    <p>
                      sudo install -m 0755 -d /etc/apt/keyrings <br />
                      sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc{' '}
                      <br />
                      sudo chmod a+r /etc/apt/keyrings/docker.asc
                    </p>
                  ),
                  copyCommand:
                    'sudo install -m 0755 -d /etc/apt/keyrings \n sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc \n sudo chmod a+r /etc/apt/keyrings/docker.asc',
                  isTitle: false,
                },
              ],
            },
            {
              title: (
                <p>
                  <b>Install Ubuntu Docker Key Rings.</b> Copy and Past the command:
                </p>
              ),
              commands: [
                {
                  command: (
                    <p>
                      echo \<br /> "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc]
                      https://download.docker.com/linux/ubuntu \ $(. /etc/os-release && echo "$VERSION_CODENAME")
                      stable" | \ <br />
                      sudo tee /etc/apt/sources.list.d/docker.list &gt; /dev/null
                    </p>
                  ),
                  copyCommand:
                    'echo \\\n"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \\$(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \\sudo tee /etc/apt/sources.list.d/docker.list > /dev/null',
                  isTitle: false,
                },
              ],
            },
            {
              title: (
                <p>
                  <b>Update packages and install docker.</b> Copy and Past the command:
                </p>
              ),
              commands: [
                {
                  command: (
                    <p>
                      sudo apt-get update
                      <br />
                      sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin
                      docker-compose-plugin
                    </p>
                  ),
                  copyCommand:
                    'sudo apt-get update \n sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin',
                  isTitle: false,
                },
              ],
            },
            {
              title: (
                <p>
                  <b>Verify if Docker runs.</b> Copy and Past the command:
                </p>
              ),
              commands: [
                {
                  command: <p>sudo docker run hello-world</p>,
                  copyCommand: 'sudo docker run hello-world',
                  isTitle: false,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      head: 'Virtual Private Server LightNode',
      subItems: [
        {
          title: 'Install Paloma LightNode',
          describe:
            'Once Docker is successfully installed, open the Linux command line and follow the steps below to install Paloma Lightnode.',
          steps: [
            {
              title: (
                <p>
                  <b>Prepare your download directory.</b> Copy and Past the command:
                </p>
              ),
              commands: [
                {
                  command: <p>mkdir -p ~/Downloads</p>,
                  copyCommand: 'mkdir -p ~/Downloads',
                  isTitle: false,
                },
              ],
            },
            {
              title: (
                <p>
                  <b>Download the Setup Script for your Linux hardware.</b>
                </p>
              ),
              externalBtns: [
                {
                  text: 'Download Setup',
                  link: 'https://download.palomachain.com/lightnode/setup.sh',
                },
              ],
            },
            {
              title: (
                <p>
                  <b>Run Paloma LightNode v1 setup.</b> Copy and Past the command:
                </p>
              ),
              commands: [
                {
                  command: <p>bash $HOME/Downloads/setup.sh</p>,
                  copyCommand: 'bash $HOME/Downloads/setup.sh',
                  isTitle: false,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const UpgradeMigrationGuide: {
  [x: string]: IInstructionsNodeSteps[];
} = {
  [SupportSystems.Mac]: [
    {
      head: 'Upgrade v1 to v2',
      steps: [
        {
          title: <p>Download the Setup Script for your Mac hardware</p>,
          externalBtns: [
            {
              text: 'Download Setup',
              link: '',
            },
          ],
        },
        {
          title: <p>Import all Keys from v1</p>,
          commands: [
            {
              name: (
                <p>
                  For <b>each key</b> run the command:
                </p>
              ),
              command: <p>sh $HOME/Downloads/setup.sh import-key</p>,
              copyCommand: 'sh $HOME/Downloads/setup.sh import-key',
            },
            {
              name: 'Input the key Mnemonic',
            },
          ],
        },
        {
          title: (
            <p>
              <b>(Optional)</b> If you have ledger keys, import them using the command:
            </p>
          ),
          commands: [
            {
              command: <p>sh $HOME/Downloads/setup.sh import-ledger</p>,
              copyCommand: 'sh $HOME/Downloads/setup.sh import-ledger',
              isTitle: false,
            },
          ],
        },
        {
          title: (
            <p>
              <b>(Optional)</b> Verify that all keys are included with the command:
            </p>
          ),
          commands: [
            {
              command: <p>sh $HOME/Downloads/setup.sh show-keys</p>,
              copyCommand: 'sh $HOME/Downloads/setup.sh show-keys',
              isTitle: false,
            },
          ],
        },
        {
          title: <p>Recover your node with</p>,
          commands: [
            {
              command: <p>sh $HOME/Downloads/setup.sh node-recover all</p>,
              copyCommand: 'sh $HOME/Downloads/setup.sh node-recover all',
              isTitle: false,
            },
          ],
        },
      ],
    },
  ],
  [SupportSystems.Linux]: [
    {
      head: 'Upgrade v1 to v2',
      steps: [
        {
          title: <p>Download the Setup Script for your Linux hardware</p>,
          externalBtns: [
            {
              text: 'Download Setup',
              link: '',
            },
          ],
        },
        {
          title: <p>Import all Keys from v1</p>,
          commands: [
            {
              name: (
                <p>
                  For <b>each key</b> run the command:
                </p>
              ),
              command: <p>sh $HOME/Downloads/setup.sh import-key</p>,
              copyCommand: 'sh $HOME/Downloads/setup.sh import-key',
            },
            {
              name: 'Input the key Mnemonic',
            },
          ],
        },
        {
          title: (
            <p>
              <b>(Optional)</b> If you have ledger keys, import them using the command:
            </p>
          ),
          commands: [
            {
              command: <p>sh $HOME/Downloads/setup.sh import-ledger</p>,
              copyCommand: 'sh $HOME/Downloads/setup.sh import-ledger',
              isTitle: false,
            },
          ],
        },
        {
          title: (
            <p>
              <b>(Optional)</b> Verify that all keys are included with the command:
            </p>
          ),
          commands: [
            {
              command: <p>sh $HOME/Downloads/setup.sh show-keys</p>,
              copyCommand: 'sh $HOME/Downloads/setup.sh show-keys',
              isTitle: false,
            },
          ],
        },
        {
          title: <p>Recover your node with</p>,
          commands: [
            {
              command: <p>sh $HOME/Downloads/setup.sh node-recover all</p>,
              copyCommand: 'sh $HOME/Downloads/setup.sh node-recover all',
              isTitle: false,
            },
          ],
        },
      ],
    },
  ],
  [SupportSystems.Windows]: [
    {
      head: 'Upgrade v1 to v2',
      steps: [
        {
          title: <p>Download the Setup Script for your Mac hardware</p>,
          externalBtns: [
            {
              text: 'Download Setup',
              link: 'https://desktop.docker.com/mac/main/arm64/Docker.dmg?utm_source=docker&utm_medium=webreferral&utm_campaign=docs-driven-download-mac-arm64',
            },
          ],
        },
        {
          title: <p>Import all Keys from v1</p>,
          commands: [
            {
              name: (
                <p>
                  For <b>each key</b> run the command:
                </p>
              ),
              command: <p>sh $HOME/Downloads/setup.sh import-key</p>,
              copyCommand: 'sh $HOME/Downloads/setup.sh import-key',
            },
            {
              name: 'Input the key Mnemonic',
            },
          ],
        },
        {
          title: (
            <p>
              <b>(Optional)</b> If you have ledger keys, import them using the command:
            </p>
          ),
          commands: [
            {
              command: <p>sh $HOME/Downloads/setup.sh import-ledger</p>,
              copyCommand: 'sh $HOME/Downloads/setup.sh import-ledger',
              isTitle: false,
            },
          ],
        },
        {
          title: (
            <p>
              <b>(Optional)</b> Verify that all keys are included with the command:
            </p>
          ),
          commands: [
            {
              command: <p>sh $HOME/Downloads/setup.sh show-keys</p>,
              copyCommand: 'sh $HOME/Downloads/setup.sh show-keys',
              isTitle: false,
            },
          ],
        },
        {
          title: <p>Recover your node with</p>,
          commands: [
            {
              command: <p>sh $HOME/Downloads/setup.sh node-recover all</p>,
              copyCommand: 'sh $HOME/Downloads/setup.sh node-recover all',
              isTitle: false,
            },
          ],
        },
      ],
    },
  ],
};

export const ActivateInstructionsSteps: {
  [x: string]: {
    title?: string | JSX.Element;
    commands?: {
      name?: string | JSX.Element;
      command?: string | JSX.Element;
      copyCommand?: string;
      instruction?: string | JSX.Element;
    }[];
  }[];
} = {
  [SupportSystems.Mac]: [
    {
      title: <p>After activating your LightNode, open the Terminal application found in the Utilities folder.</p>,
      commands: [
        {
          command: <p>sh $HOME/Downloads/setup.sh activate</p>,
          copyCommand: 'sh $HOME/Downloads/setup.sh activate',
        },
      ],
    },
    {
      title: <p>Automatically claim rewards and redelegate stakes for all your nodes every hour.</p>,
      commands: [
        {
          command: <p>sh $HOME/Downloads/setup.sh automate</p>,
          copyCommand: 'sh $HOME/Downloads/setup.sh automate',
        },
      ],
    },
  ],
  [SupportSystems.Windows]: [
    {
      title: <p>After activating your LightNode, open the Windows PowerShell</p>,
      commands: [
        {
          command: (
            <p>
              docker run --rm --pull=always -ti -v $env:USERPROFILE\paloma-lightnode\.paloma:/root/.paloma
              palomachain/lightnode-client:v2 activate
            </p>
          ),
          copyCommand:
            'docker run --rm --pull=always -ti -v $env:USERPROFILE\\paloma-lightnode\\.paloma:/root/.paloma palomachain/lightnode-client:v2 activate',
        },
      ],
    },
    {
      title: <p>Automatically claim rewards and redelegate stakes for all your nodes every hour.</p>,
      commands: [
        {
          command: (
            <p>
              docker run --rm --pull=always -ti -v $env:USERPROFILE\paloma-lightnode\.paloma:/root/.paloma
              palomachain/lightnode-client:v2 automate
            </p>
          ),
          copyCommand:
            'docker run --rm --pull=always -ti -v $env:USERPROFILE\\paloma-lightnode\\.paloma:/root/.paloma palomachain/lightnode-client:v2 automate',
        },
      ],
    },
  ],
  [SupportSystems.Linux]: [
    {
      title: <p>After activating your LightNode, open the Terminal application.</p>,
      commands: [
        {
          command: <p>sudo sh $HOME/Downloads/setup.sh activate</p>,
          copyCommand: 'sudo sh $HOME/Downloads/setup.sh activate',
        },
      ],
    },
    {
      title: <p>Automatically claim rewards and redelegate stakes for all your nodes every hour.</p>,
      commands: [
        {
          command: <p>sudo sh $HOME/Downloads/setup.sh automate</p>,
          copyCommand: 'sudo sh $HOME/Downloads/setup.sh automate',
        },
      ],
    },
  ],
  [SupportSystems.VPS]: [
    {
      title: <p>After activating your LightNode, open the Terminal application.</p>,
      commands: [
        {
          command: <p>bash $HOME/Downloads/setup.sh activate</p>,
          copyCommand: 'bash $HOME/Downloads/setup.sh activate',
        },
      ],
    },
    {
      title: <p>Automatically claim rewards and redelegate stakes for all your nodes every hour.</p>,
      commands: [
        {
          command: <p>bash $HOME/Downloads/setup.sh automate</p>,
          copyCommand: 'bash $HOME/Downloads/setup.sh automate',
        },
      ],
    },
  ],
};
