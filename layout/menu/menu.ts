import {
  TELEGRAM_LINK,
  TWITTER_LINK,
  GITHUB_LINK,
  DISCORD_LINK,
  PALOMABOT_WEBSITE_LINK,
} from "utils/constants";

const baseUrl = process.env.BASE_URL;

const navMenu = [
  {
    title: "Developers",
    hasLink: false,
    description: "Find here all the useful links to start building on Paloma.",
    submenus: [
      {
        title: "Get Started",
        hasLink: false,
        submenus: [
          {
            title: "Quick Start",
            hasLink: true,
            link: "https://docs.palomachain.com/guide/develop/quick-start/quick-start.html",
            external: true,
          },
          {
            title: "Governance",
            hasLink: true,
            link: "https://docs.palomachain.com/guide/resources/governance.html",
            external: true,
          },
        ],
      },
      {
        title: "Guides",
        hasLink: false,
        submenus: [
          {
            title: "Running a node",
            hasLink: true,
            link: "https://docs.palomachain.com/guide/maintain/node/requirements.html",
            external: true,
          },
          {
            title: "Set up a limit order bot",
            hasLink: true,
            link: PALOMABOT_WEBSITE_LINK,
            external: true,
          },
        ],
      },
      {
        title: "Github",
        hasLink: false,
        submenus: [
          {
            title: "Read me",
            hasLink: true,
            link: "https://github.com/palomachain/paloma",
            external: true,
          },
        ],
      },
      {
        title: "Security",
        hasLink: false,
        submenus: [
          {
            title: "Read me",
            hasLink: true,
            link: "https://docs.palomachain.com/guide/security/security.html",
            external: true,
          },
        ],
      },
    ],
  },
  {
    title: "Applications",
    hasLink: false,
    description: "Discover the ecosystem of Paloma Products and Applications.",
    submenus: [
      {
        title: "Compass EVM",
        hasLink: true,
        link: "https://docs.palomachain.com/guide/develop/applications/compass-evm/overview.html",
        external: true,
      },
      {
        title: "Palomabot",
        hasLink: true,
        link: PALOMABOT_WEBSITE_LINK,
        external: true,
      },
    ],
  },
  {
    title: "Blog",
    hasLink: true,
    link: `${baseUrl}/blog`,
    external: false,
    description: "Stay up to date with the depevopments, news and announcements in Paloma.",
    submenus: [
      {
        title: "news and announcements",
        hasLink: true,
        link: `${baseUrl}/blog/announcements`,
        external: false,
      },
      {
        title: "Project Developments",
        hasLink: true,
        link: `${baseUrl}/blog/project-updates`,
        external: false,
      },
      {
        title: "event Recaps",
        hasLink: true,
        link: `${baseUrl}/blog/events`,
        external: false,
      },
    ]
  },
  {
    title: "Events",
    hasLink: true,
    link: `${baseUrl}/event/`,
    external: false,
  },
  {
    title: "Forum",
    hasLink: true,
    link: "https://forum.palomachain.com/",
    external: true,
  },
];

const footerMenu = [
  {
    title: "Features",
    hasLink: false,
    submenus: [
      {
        title: "pigeon",
        hasLink: true,
        link: "https://docs.palomachain.com/guide/maintain/node/install-pigeon.html",
        external: true,
      },
      {
        title: "SDKs",
        hasLink: true,
        link: "https://docs.palomachain.com/guide/develop/quick-start/resources.html#sdks",
        external: true,
      },
      {
        title: "Compass-EVM",
        hasLink: true,
        link: "https://docs.palomachain.com/guide/develop/applications/compass-evm/overview.html#model",
        external: true,
      },
    ],
  },
  {
    title: "Examples",
    hasLink: false,
    submenus: [
      // {
      //   title: "Execute an EVM contract",
      //   hasLink: true,
      //   link: "https://docs.palomachain.com/guide/develop/quick-start/generic-message.html",
      //   external: true,
      // },
      // {
      //   title: "Palomaswap",
      //   hasLink: true,
      //   link: "https://www.palomaswap.com/",
      //   external: true,
      // },
      {
        title: "Limit Order Bot",
        hasLink: true,
        link: PALOMABOT_WEBSITE_LINK,
        external: true,
      },
    ],
  },
  {
    title: "Company",
    hasLink: false,
    submenus: [
      {
        title: "Careers",
        hasLink: true,
        link: "https://volume.finance/careers/",
        external: true,
      },
      {
        title: "Brand Assets",
        hasLink: true,
        link: `${baseUrl}/brand-assets`,
        external: false,
      },
      // {
      //   title: "About",
      //   hasLink: true,
      //   link: `${baseUrl}/about`,
      //   external: false,
      // },
      {
        title: "Forum",
        hasLink: true,
        link: "https://forum.palomachain.com/",
        external: true,
      },
      {
        title: "Security",
        hasLink: true,
        link: "https://docs.palomachain.com/guide/security/security.html",
        external: true,
      },
    ],
  },
  {
    title: "Social Media",
    hasLink: false,
    submenus: [
      {
        title: "Discord",
        hasLink: true,
        link: DISCORD_LINK,
        external: true,
      },
      {
        title: "Telegram",
        hasLink: true,
        link: TELEGRAM_LINK,
        external: true,
      },
      {
        title: "Twitter",
        hasLink: true,
        link: TWITTER_LINK,
        external: true,
      },
      {
        title: "Github",
        hasLink: true,
        link: GITHUB_LINK,
        external: true,
      },
     
    ],
  },
];

export { navMenu, footerMenu };
