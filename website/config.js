const config = {
  gatsby: {
    pathPrefix: '/',
    siteUrl: 'https://hypocube.space/',
    gaTrackingId: null,
    trailingSlash: false,
  },
  header: {
    logo: 'https://www.caydenberg.io/favicon.png',
    logoLink: 'https://hypocube.space/',
    title: 'Hypocube Docs',
    githubUrl: 'https://github.com/CAYdenberg/hypocube',
    helpUrl: '',
    tweetText: '',
    social: `<li>
		    <a href="https://twitter.com/CAYdenberg" target="_blank" rel="noopener">
		      <div class="twitterBtn">
		        <img src='https://graphql-engine-cdn.hasura.io/learn-hasura/assets/homepage/twitter-brands-block.svg' alt={'Twitter'}/>
		      </div>
		    </a>
		  </li>`,
    links: [{ text: '', link: '' }],
    search: {
      enabled: false,
      indexName: '',
      algoliaAppId: process.env.GATSBY_ALGOLIA_APP_ID,
      algoliaSearchKey: process.env.GATSBY_ALGOLIA_SEARCH_KEY,
      algoliaAdminKey: process.env.ALGOLIA_ADMIN_KEY,
    },
  },
  sidebar: {
    forcedNavOrder: ['/introduction', '/codeblock'],
    collapsedNav: [],
    links: [{ text: 'GitHub', link: 'https://github.com/CAYdenberg/hypocube' }],
    frontline: false,
    ignoreIndex: true,
  },
  siteMetadata: {
    title: 'Hypocube Docs',
    description: 'Composable, responsive, React-based data visualization',
    ogImage: null,
    docsLocation:
      'https://github.com/CAYdenberg/hypocube/tree/main/website/content',
    favicon: 'https://www.caydenberg.io/favicon.png',
  },
  pwa: {
    enabled: false, // disabling this will also remove the existing service worker.
    manifest: {},
  },
};

module.exports = config;
