const baseUrl = process.env.BASE_URL;

const navMenu = [
  {
    title: "Developers",
    hasLink: false,
    submenus: [
      {
        title: "Get Started",
        hasLink: false,
        submenus: [
          {
            title: "Quick Start",
            hasLink: true,
            link: "https://palomachain.github.io/paloma-docs/guide/develop/quick-start/quick-start.html",
            external: true,
          },
          {
            title: "Governance",
            hasLink: true,
            link: "https://palomachain.github.io/paloma-docs/guide/maintain/governance/governance.html",
            external: true,
          },
          {
            title: "Developer Grant Program",
            hasLink: true,
            link: "https://volumefi.notion.site/Build-on-Paloma-Onboarding-Board-28abc84384b54db8a5409fd67d97a457",
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
            link: "https://palomachain.github.io/paloma-docs/guide/maintain/node/set-up-production.html",
            external: true,
          },
          {
            title: "Mint An Egg",
            hasLink: true,
            link: "https://palomachain.github.io/paloma-docs/guide/develop/quick-start/mint-egg.html#send-a-message",
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
    ],
  },
  {
    title: "Applications",
    hasLink: false,
    submenus: [
      {
        title: "pyth Price Feed",
        hasLink: true,
        link: "https://palomachain.github.io/paloma-docs/guide/develop/applications/pyth/pyth-price-feeds.html",
        external: true,
      },
      {
        title: "Compass EVM",
        hasLink: true,
        link: "https://palomachain.github.io/paloma-docs/guide/develop/applications/compass-evm/overview.html",
        external: true,
      },
    ],
  },
  {
    title: "Blog",
    hasLink: true,
    link: `${baseUrl}/blog`,
    external: false,
  },
  {
    title: "Events",
    hasLink: true,
    link: `${baseUrl}/event`,
    external: false,
  },
  {
    title: "Forum",
    hasLink: true,
    link: "https://forum.palomachain.com/",
    external: true,
  },
];

export { navMenu };
