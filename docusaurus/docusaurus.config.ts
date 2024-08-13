import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Gallifrey Rules',
  tagline: 'A modern robust framework for handling real-time events',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://gallifrey-rules.dev',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'ralphv', // Usually your GitHub org/user name.
  projectName: 'gallifrey-rules', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        gtag: {
          trackingID: 'G-J2CJB8T7GK',
          anonymizeIP: false,
        },
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/gallifrey-rules-social-card.jpg',
    navbar: {
      title: 'Gallifrey Rules',
      logo: {
        alt: 'Gallifrey Rules Logo',
        src: 'img/gallifrey-rules-25.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Getting Started',
        },
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          href: '/docs/advanced/scheduled-events',
          position: 'left',
          label: 'Advanced',
        },
        {
          href: 'https://github.com/ralphv/gallifrey-rules/discussions',
          label: 'Discussions',
          position: 'left',
        },
        {
          href: 'https://github.com/ralphv/gallifrey-rules',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Intro',
              to: '/docs/intro',
            },
            {
              label: 'Getting Started',
              to: '/docs/getting-started/',
            },
            {
              label: 'Advanced',
              to: '/docs/advanced/scheduled-events',
            },
            {
              label: 'Sample Application',
              href: 'https://github.com/ralphv/gallifrey-rules-sample/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/gallifrey-rules',
            },
            {
              label: 'Discussions',
              href: 'https://github.com/ralphv/gallifrey-rules/discussions',
            },
            {
              label: 'Issues',
              href: 'https://github.com/ralphv/gallifrey-rules/issues',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/ralphv/gallifrey-rules',
            },
            {
              label: 'GitHub Sample App',
              href: 'https://github.com/ralphv/gallifrey-rules-sample',
            },
            {
              label: 'npm',
              href: 'https://www.npmjs.com/package/gallifrey-rules',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Gallifrey Rules. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    algolia: {
      // The application ID provided by Algolia
      appId: 'G6TTVFX2JY',

      // Public API key: it is safe to commit it
      apiKey: '53d14b91a487b53c7b5e8d1e6386c257',

      indexName: 'gallifrey-rules',

      // Optional: see doc section below
      contextualSearch: true,

      // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
      externalUrlRegex: 'external\\.com|domain\\.com',

      // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
      //replaceSearchResultPathname: {
      //  from: '/docs/', // or as RegExp: /\/docs\//
      //  to: '/',
      //},

      // Optional: Algolia search parameters
      searchParameters: {},

      // Optional: path for search page that enabled by default (`false` to disable it)
      searchPagePath: 'search',

      // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
      insights: false,

      //... other Algolia params
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
