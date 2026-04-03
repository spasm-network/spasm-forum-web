export default defineNuxtConfig({
  devServer: {
    port: parseInt(process.env.FRONTEND_DEV_PORT as string)
      || parseInt(process.env.NUXT_PUBLIC_FRONTEND_DEV_PORT as string)
      || 3000
  },

  app: {
    /**
     * Meta is now set by runtime vars INTRO_TITLE, INTRO_ABOUT,
     * so admins can change values via web admin panel and also
     * pass env values for pre-built docker/podman images using
     * NUXT_PUBLIC_ prefix.
     */
    // head: {
    // title: process.env.META_TITLE,
    //   meta: [ ]
    // }
  },

  runtimeConfig: {
    /**
     * Nuxt automatically loads variables that start with NUXT_
     * NUXT_PUBLIC_* - exposed to client + server
     * NUXT_* (without PUBLIC) - server-side only (private)
     */
    /**
     * The order of checking for env vars matters.
     * Most features are enabled by default and require
     * explicit "false" flag to be disables. However, some
     * features are disabled by default e.g., iframes due to
     * security concerns.
     * Normal env vars without NUXT_PUBLIC_ prefix are processed
     * as strings, so we can check whether the value is "false"
     * (string) and act accordingly. 
     * However, "true"/"false" (strings) env variables prefixed
     * with NUXT_PUBLIC_ are automatically converted to boolean.
     * Thus, we first check for normal env variable. If it's
     * undefined, then we assign NUXT_PUBLIC_ variable, which
     * might be boolean `false`.
     * We then assign the final value in useAppConfigStore using
     * parseEnvBool() function.
     * If we would process NUXT_PUBLIC_ first, then it might be
     * explicit `false` boolean, which will be ignored and so
     * the value will be assigned from normal env variable,
     * which probably doesn't exist, so it will be undefined,
     * which will break the logic, because then the default
     * value will be used in the parseEnvBool() function instead
     * of using the original `false` value.
     * NUXT_PUBLIC_ is used to pass env variables during
     * runtime for pre-built docker/podman containers.
     */
    /**
     * apiUrlDockerSsr is used for SSR requests inside Docker
     * containers to reach backend via internal DNS because
     * localhost refers to a frontend container itself,
     * not the host.
     * (eg, http://spasm-backend:5000) instead of external domain
     */
    apiUrlDockerSsr: process.env.NUXT_API_URL_DOCKER_SSR || '',

    public: {
      faviconPath: process.env.FAVICON_BASE
        || process.env.NUXT_PUBLIC_FAVICON_BASE
        || '/favicon.ico',
      faviconTheme: process.env.FAVICON_THEME
        || process.env.NUXT_PUBLIC_FAVICON_THEME
        || 'default',

      apiURL: process.env.API_URL || process.env.NUXT_PUBLIC_API_URL,

      // Testing
      useMockedDataIfBackendIsDown: process.env.USE_MOCKED_DATA_IF_BACKEND_IS_DOWN
        || process.env.NUXT_PUBLIC_USE_MOCKED_DATA_IF_BACKEND_IS_DOWN,

      // App config
      enableAppConfigChanges: process.env.ENABLE_APP_CONFIG_CHANGES || process.env.NUXT_PUBLIC_ENABLE_APP_CONFIG_CHANGES,
      enableAppConfigChangesByAdmin: process.env.ENABLE_APP_CONFIG_CHANGES_BY_ADMIN || process.env.NUXT_PUBLIC_ENABLE_APP_CONFIG_CHANGES_BY_ADMIN,

      // Admin
      enableAdmin: process.env.ENABLE_ADMIN || process.env.NUXT_PUBLIC_ENABLE_ADMIN,
      admins: process.env.ADMINS || process.env.NUXT_PUBLIC_ADMINS,

      // Moderation
      enableModeration: process.env.ENABLE_MODERATION || process.env.NUXT_PUBLIC_ENABLE_MODERATION,
      moderators: process.env.MODERATORS || process.env.NUXT_PUBLIC_MODERATORS,

      // Default intro, contacts, images, buttons
      enableDefaultIntro: process.env.ENABLE_DEFAULT_INTRO || process.env.NUXT_PUBLIC_ENABLE_DEFAULT_INTRO,
      enableDefaultContacts: process.env.ENABLE_DEFAULT_CONTACTS || process.env.NUXT_PUBLIC_ENABLE_DEFAULT_CONTACTS,
      enableDefaultHeaderImage: process.env.ENABLE_DEFAULT_HEADER_IMAGE || process.env.NUXT_PUBLIC_ENABLE_DEFAULT_HEADER_IMAGE,
      defaultHeaderImageLink: process.env.DEFAULT_HEADER_IMAGE_LINK || process.env.NUXT_PUBLIC_DEFAULT_HEADER_IMAGE_LINK,
      enableDefaultButtonPrimary: process.env.ENABLE_DEFAULT_BUTTON_PRIMARY || process.env.NUXT_PUBLIC_ENABLE_DEFAULT_BUTTON_PRIMARY,
      defaultButtonPrimaryText: process.env.DEFAULT_BUTTON_PRIMARY_TEXT || process.env.NUXT_PUBLIC_DEFAULT_BUTTON_PRIMARY_TEXT,
      defaultButtonPrimaryLink: process.env.DEFAULT_BUTTON_PRIMARY_LINK || process.env.NUXT_PUBLIC_DEFAULT_BUTTON_PRIMARY_LINK,
      enableDefaultButtonSecondary: process.env.ENABLE_DEFAULT_BUTTON_SECONDARY || process.env.NUXT_PUBLIC_ENABLE_DEFAULT_BUTTON_SECONDARY,
      defaultButtonSecondaryText: process.env.DEFAULT_BUTTON_SECONDARY_TEXT || process.env.NUXT_PUBLIC_DEFAULT_BUTTON_SECONDARY_TEXT,
      defaultButtonSecondaryLink: process.env.DEFAULT_BUTTON_SECONDARY_LINK || process.env.NUXT_PUBLIC_DEFAULT_BUTTON_SECONDARY_LINK,

      // Custom header image, intro, contacts
      enableCustomIntro: process.env.ENABLE_CUSTOM_INTRO || process.env.NUXT_PUBLIC_ENABLE_CUSTOM_INTRO,
      enableCustomContacts: process.env.ENABLE_CUSTOM_CONTACTS || process.env.NUXT_PUBLIC_ENABLE_CUSTOM_CONTACTS,

      // introTitle: process.env.INTRO_TITLE,
      introTitle: process.env.INTRO_TITLE || process.env.NUXT_PUBLIC_INTRO_TITLE,
      introTitleExtra: process.env.INTRO_TITLE_EXTRA || process.env.NUXT_PUBLIC_INTRO_TITLE_EXTRA,
      introAbout: process.env.INTRO_ABOUT || process.env.NUXT_PUBLIC_INTRO_ABOUT,

      postPlaceholder: process.env.POST_PLACEHOLDER || process.env.NUXT_PUBLIC_POST_PLACEHOLDER,
      commentPlaceholder: process.env.COMMENT_PLACEHOLDER || process.env.NUXT_PUBLIC_COMMENT_PLACEHOLDER,

      ifShowContactsInIntro: process.env.IF_SHOW_CONTACTS_IN_INTRO || process.env.NUXT_PUBLIC_IF_SHOW_CONTACTS_IN_INTRO,
      ifShowIntroTutorial: process.env.IF_SHOW_INTRO_TUTORIAL || process.env.IF_SHOW_INTRO_TUTORIAL,
      ifShowHomeLatestComments: process.env.IF_SHOW_HOME_LATEST_COMMENTS || process.env.NUXT_PUBLIC_IF_SHOW_HOME_LATEST_COMMENTS,

      // Menu
      showNewPostButtonInMenu: process.env.SHOW_NEW_POST_BUTTON_IN_MENU || process.env.NUXT_PUBLIC_SHOW_NEW_POST_BUTTON_IN_MENU,

      // Enable shortened URLs for web3 actions
      enableShortUrlsForWeb3Actions: process.env.ENABLE_SHORT_URLS_FOR_WEB3_ACTIONS || process.env.NUXT_PUBLIC_ENABLE_SHORT_URLS_FOR_WEB3_ACTIONS,
      shortUrlsLengthOfWeb3Ids: process.env.SHORT_URLS_LENGTH_OF_WEB3_IDS || process.env.NUXT_PUBLIC_SHORT_URLS_LENGTH_OF_WEB3_IDS,

      // New web3 actions
      enableNewWeb3ActionsAll: process.env.ENABLE_NEW_WEB3_ACTIONS_ALL || process.env.NUXT_PUBLIC_ENABLE_NEW_WEB3_ACTIONS_ALL,
      enableNewWeb3ActionsPost: process.env.ENABLE_NEW_WEB3_ACTIONS_POST || process.env.NUXT_PUBLIC_ENABLE_NEW_WEB3_ACTIONS_POST,
      enableNewWeb3ActionsReply: process.env.ENABLE_NEW_WEB3_ACTIONS_REPLY || process.env.NUXT_PUBLIC_ENABLE_NEW_WEB3_ACTIONS_REPLY,
      enableNewWeb3ActionsReact: process.env.ENABLE_NEW_WEB3_ACTIONS_REACT || process.env.NUXT_PUBLIC_ENABLE_NEW_WEB3_ACTIONS_REACT,
      enableNewWeb3ActionsModerate: process.env.ENABLE_NEW_WEB3_ACTIONS_MODERATE || process.env.NUXT_PUBLIC_ENABLE_NEW_WEB3_ACTIONS_MODERATE,

      ifAllowGuestLogin: process.env.IF_ALLOW_GUEST_LOGIN || process.env.NUXT_PUBLIC_IF_ALLOW_GUEST_LOGIN,

      enableNewNostrActionsAll: process.env.ENABLE_NEW_NOSTR_ACTIONS_ALL || process.env.NUXT_PUBLIC_ENABLE_NEW_NOSTR_ACTIONS_ALL,
      enableNewEthereumActionsAll: process.env.ENABLE_NEW_ETHEREUM_ACTIONS_ALL || process.env.NUXT_PUBLIC_ENABLE_NEW_ETHEREUM_ACTIONS_ALL,

      // White list
      enableWhitelistForActionPost: process.env.ENABLE_WHITELIST_FOR_ACTION_POST || process.env.NUXT_PUBLIC_ENABLE_WHITELIST_FOR_ACTION_POST,
      whitelistedForActionPost: process.env.WHITELISTED_FOR_ACTION_POST || process.env.NUXT_PUBLIC_WHITELISTED_FOR_ACTION_POST,
      enableWhitelistForActionReply: process.env.ENABLE_WHITELIST_FOR_ACTION_REPLY || process.env.NUXT_PUBLIC_ENABLE_WHITELIST_FOR_ACTION_REPLY,
      whitelistedForActionReply: process.env.WHITELISTED_FOR_ACTION_REPLY || process.env.NUXT_PUBLIC_WHITELISTED_FOR_ACTION_REPLY,
      enableWhitelistForActionReact: process.env.ENABLE_WHITELIST_FOR_ACTION_REACT || process.env.NUXT_PUBLIC_ENABLE_WHITELIST_FOR_ACTION_REACT,
      whitelistedForActionReact: process.env.WHITELISTED_FOR_ACTION_REACT || process.env.NUXT_PUBLIC_WHITELISTED_FOR_ACTION_REACT,

      // Nostr network
      enableNostrNetwork: process.env.ENABLE_NOSTR_NETWORK || process.env.NUXT_PUBLIC_ENABLE_NOSTR_NETWORK,
      enableNostrNetworkFetchProfiles: process.env.ENABLE_NOSTR_NETWORK_FETCH_PROFILES || process.env.NUXT_PUBLIC_ENABLE_NOSTR_NETWORK_FETCH_PROFILES,
      enableNostrNetworkFetchPreferredRelays: process.env.ENABLE_NOSTR_NETWORK_FETCH_PREFERRED_RELAYS || process.env.NUXT_PUBLIC_ENABLE_NOSTR_NETWORK_FETCH_PREFERRED_RELAYS,
      enableNostrNetworkFetchMessages: process.env.ENABLE_NOSTR_NETWORK_FETCH_MESSAGES || process.env.NUXT_PUBLIC_ENABLE_NOSTR_NETWORK_FETCH_MESSAGES,
      enableNostrNetworkUsePreferredRelays: process.env.ENABLE_NOSTR_NETWORK_USE_PREFERRED_RELAYS || process.env.NUXT_PUBLIC_ENABLE_NOSTR_NETWORK_USE_PREFERRED_RELAYS,
      enableNostrDisplayProfilesUsernames: process.env.ENABLE_NOSTR_DISPLAY_PROFILES_USERNAMES || process.env.NUXT_PUBLIC_ENABLE_NOSTR_DISPLAY_PROFILES_USERNAMES,
      enableNostrDisplayProfilesAbouts: process.env.ENABLE_NOSTR_DISPLAY_PROFILES_ABOUTS || process.env.NUXT_PUBLIC_ENABLE_NOSTR_DISPLAY_PROFILES_ABOUTS,
      enableNostrDisplayProfilesWebsites: process.env.ENABLE_NOSTR_DISPLAY_PROFILES_WEBSITES || process.env.NUXT_PUBLIC_ENABLE_NOSTR_DISPLAY_PROFILES_WEBSITES,
      enableNostrDisplayProfilesPictures: process.env.ENABLE_NOSTR_DISPLAY_PROFILES_PICTURES || process.env.NUXT_PUBLIC_ENABLE_NOSTR_DISPLAY_PROFILES_PICTURES,
      enableNostrDisplayProfilesMessages: process.env.ENABLE_NOSTR_DISPLAY_PROFILES_MESSAGES || process.env.NUXT_PUBLIC_ENABLE_NOSTR_DISPLAY_PROFILES_MESSAGES,
      nostrDefaultRelays: process.env.NOSTR_DEFAULT_RELAYS || process.env.NUXT_PUBLIC_NOSTR_DEFAULT_RELAYS,

      // Markdown
      enableMarkdownInPosts: process.env.ENABLE_MARKDOWN_IN_POSTS || process.env.NUXT_PUBLIC_ENABLE_MARKDOWN_IN_POSTS,
      enableMarkdownInComments: process.env.ENABLE_MARKDOWN_IN_COMMENTS || process.env.NUXT_PUBLIC_ENABLE_MARKDOWN_IN_COMMENTS,

      // Images
      enableEmbedImageTagsForAllUsers: process.env.ENABLE_EMBED_IMAGE_TAGS_FOR_ALL_USERS || process.env.NUXT_PUBLIC_ENABLE_EMBED_IMAGE_TAGS_FOR_ALL_USERS,
      enableEmbedImageTagsForFullLineImageLinks: process.env.ENABLE_EMBED_IMAGE_TAGS_FOR_FULL_LINE_IMAGE_LINKS || process.env.NUXT_PUBLIC_ENABLE_EMBED_IMAGE_TAGS_FOR_FULL_LINE_IMAGE_LINKS,
      enableEmbedImageTagsInPosts: process.env.ENABLE_EMBED_IMAGE_TAGS_IN_POSTS || process.env.NUXT_PUBLIC_ENABLE_EMBED_IMAGE_TAGS_IN_POSTS,
      enableEmbedImageTagsInComments: process.env.ENABLE_EMBED_IMAGE_TAGS_IN_COMMENTS || process.env.NUXT_PUBLIC_ENABLE_EMBED_IMAGE_TAGS_IN_COMMENTS,

      // Videos
      enableEmbedVideoTagsForAllUsers: process.env.ENABLE_EMBED_VIDEO_TAGS_FOR_ALL_USERS || process.env.NUXT_PUBLIC_ENABLE_EMBED_VIDEO_TAGS_FOR_ALL_USERS,
      enableEmbedVideoTagsForFullLineVideoLinks: process.env.ENABLE_EMBED_VIDEO_TAGS_FOR_FULL_LINE_VIDEO_LINKS || process.env.ENABLE_EMBED_VIDEO_TAGS_FOR_FULL_LINE_VIDEO_LINKS,
      enableEmbedVideoTagsInPosts: process.env.ENABLE_EMBED_VIDEO_TAGS_IN_POSTS || process.env.NUXT_PUBLIC_ENABLE_EMBED_VIDEO_TAGS_IN_POSTS,
      enableEmbedVideoTagsInComments: process.env.ENABLE_EMBED_VIDEO_TAGS_IN_COMMENTS || process.env.NUXT_PUBLIC_ENABLE_EMBED_VIDEO_TAGS_IN_COMMENTS,

      // Audios
      enableEmbedAudioTagsForAllUsers: process.env.ENABLE_EMBED_AUDIO_TAGS_FOR_ALL_USERS || process.env.NUXT_PUBLIC_ENABLE_EMBED_AUDIO_TAGS_FOR_ALL_USERS,
      enableEmbedAudioTagsForFullLineAudioLinks: process.env.ENABLE_EMBED_AUDIO_TAGS_FOR_FULL_LINE_AUDIO_LINKS || process.env.ENABLE_EMBED_AUDIO_TAGS_FOR_FULL_LINE_AUDIO_LINKS,
      enableEmbedAudioTagsInPosts: process.env.ENABLE_EMBED_AUDIO_TAGS_IN_POSTS || process.env.NUXT_PUBLIC_ENABLE_EMBED_AUDIO_TAGS_IN_POSTS,
      enableEmbedAudioTagsInComments: process.env.ENABLE_EMBED_AUDIO_TAGS_IN_COMMENTS || process.env.NUXT_PUBLIC_ENABLE_EMBED_AUDIO_TAGS_IN_COMMENTS,

      // Iframe tags (warning: manage with caution)
      enableEmbedIframeTagsForSelectedUsers: process.env.ENABLE_EMBED_IFRAME_TAGS_FOR_SELECTED_USERS || process.env.NUXT_PUBLIC_ENABLE_EMBED_IFRAME_TAGS_FOR_SELECTED_USERS,
      enableEmbedIframeTagsForInlineLinks: process.env.ENABLE_EMBED_IFRAME_TAGS_FOR_INLINE_LINKS || process.env.NUXT_PUBLIC_ENABLE_EMBED_IFRAME_TAGS_FOR_INLINE_LINKS,
      enableEmbedIframeTagsForVideos: process.env.ENABLE_EMBED_IFRAME_TAGS_FOR_VIDEOS || process.env.NUXT_PUBLIC_ENABLE_EMBED_IFRAME_TAGS_FOR_VIDEOS,
      enableEmbedIframeTagsForImages: process.env.ENABLE_EMBED_IFRAME_TAGS_FOR_IMAGES || process.env.NUXT_PUBLIC_ENABLE_EMBED_IFRAME_TAGS_FOR_IMAGES,
      enableEmbedIframeTagsForAudio: process.env.ENABLE_EMBED_IFRAME_TAGS_FOR_AUDIO || process.env.NUXT_PUBLIC_ENABLE_EMBED_IFRAME_TAGS_FOR_AUDIO,
      enableEmbedIframeTagsInPosts: process.env.ENABLE_EMBED_IFRAME_TAGS_IN_POSTS || process.env.NUXT_PUBLIC_ENABLE_EMBED_IFRAME_TAGS_IN_POSTS,
      enableEmbedIframeTagsInComments: process.env.ENABLE_EMBED_IFRAME_TAGS_IN_COMMENTS || process.env.NUXT_PUBLIC_ENABLE_EMBED_IFRAME_TAGS_IN_COMMENTS,
      signersAllowedToEmbedIframeTags: process.env.SIGNERS_ALLOWED_TO_EMBED_IFRAME_TAGS || process.env.NUXT_PUBLIC_SIGNERS_ALLOWED_TO_EMBED_IFRAME_TAGS,
      iframeTagsAllowedDomains: process.env.IFRAME_TAGS_ALLOWED_DOMAINS || process.env.NUXT_PUBLIC_IFRAME_TAGS_ALLOWED_DOMAINS,
      iframeTagsAllowedDomainsAny: process.env.IFRAME_TAGS_ALLOWED_DOMAINS_ANY || process.env.NUXT_PUBLIC_IFRAME_TAGS_ALLOWED_DOMAINS_ANY,
      iframeVideoWidth: process.env.IFRAME_VIDEO_WIDTH || process.env.NUXT_PUBLIC_IFRAME_VIDEO_WIDTH,
      iframeVideoHeight: process.env.IFRAME_VIDEO_HEIGHT || process.env.NUXT_PUBLIC_IFRAME_VIDEO_HEIGHT,
      iframeAdditionalParams: process.env.IFRAME_ADDITIONAL_PARAMS || process.env.NUXT_PUBLIC_IFRAME_ADDITIONAL_PARAMS,
      iframeHideOneLineUrl: process.env.IFRAME_HIDE_ONE_LINE_URL || process.env.NUXT_PUBLIC_IFRAME_HIDE_ONE_LINE_URL,

      // Default explorers for Ethereum/Nostr addresses
      defaultExplorerEthereumAddress: process.env.DEFAULT_EXPLORER_ETHEREUM_ADDRESS || process.env.NUXT_PUBLIC_DEFAULT_EXPLORER_ETHEREUM_ADDRESS,
      defaultExplorerNostrAddress: process.env.DEFAULT_EXPLORER_NOSTR_ADDRESS || process.env.NUXT_PUBLIC_DEFAULT_EXPLORER_NOSTR_ADDRESS,

      // Another website links
      anotherWebsiteLink: process.env.ANOTHER_WEBSITE_LINK || process.env.NUXT_PUBLIC_ANOTHER_WEBSITE_LINK,
      torLink: process.env.TOR_LINK || process.env.NUXT_PUBLIC_TOR_LINK,
      ipfsLink: process.env.IPFS_LINK || process.env.NUXT_PUBLIC_IPFS_LINK,
      ipfsHttpGatewayLink: process.env.IPFS_HTTP_GATEWAY_LINK || process.env.NUXT_PUBLIC_IPFS_HTTP_GATEWAY_LINK,

      // Social media links
      nostrLink: process.env.NOSTR_LINK || process.env.NUXT_PUBLIC_NOSTR_LINK,
      sessionLink: process.env.SESSION_LINK || process.env.NUXT_PUBLIC_SESSION_LINK,
      simplexLink: process.env.SIMPLEX_LINK || process.env.NUXT_PUBLIC_SIMPLEX_LINK,
      statusLink: process.env.STATUS_LINK || process.env.NUXT_PUBLIC_STATUS_LINK,
      lensLink: process.env.LENS_LINK || process.env.NUXT_PUBLIC_LENS_LINK,
      farcasterLink: process.env.FARCASTER_LINK || process.env.NUXT_PUBLIC_FARCASTER_LINK,
      blueskyLink: process.env.BLUESKY_LINK || process.env.NUXT_PUBLIC_BLUESKY_LINK,
      hiveLink: process.env.HIVE_LINK || process.env.NUXT_PUBLIC_HIVE_LINK,
      pushLink: process.env.PUSH_LINK || process.env.NUXT_PUBLIC_PUSH_LINK,
      mirrorLink: process.env.MIRROR_LINK || process.env.NUXT_PUBLIC_MIRROR_LINK,
      mastodonLink: process.env.MASTODON_LINK || process.env.NUXT_PUBLIC_MASTODON_LINK,
      matrixLink: process.env.MATRIX_LINK || process.env.NUXT_PUBLIC_MATRIX_LINK,
      discordLink: process.env.DISCORD_LINK || process.env.NUXT_PUBLIC_DISCORD_LINK,
      telegramLink: process.env.TELEGRAM_LINK || process.env.NUXT_PUBLIC_TELEGRAM_LINK,
      twitterLink: process.env.TWITTER_LINK || process.env.NUXT_PUBLIC_TWITTER_LINK,
      redditLink: process.env.REDDIT_LINK || process.env.NUXT_PUBLIC_REDDIT_LINK,
      youtubeLink: process.env.YOUTUBE_LINK || process.env.NUXT_PUBLIC_YOUTUBE_LINK,
      instagramLink: process.env.INSTAGRAM_LINK || process.env.NUXT_PUBLIC_INSTAGRAM_LINK,
      facebookLink: process.env.FACEBOOK_LINK || process.env.NUXT_PUBLIC_FACEBOOK_LINK,
      linkedinLink: process.env.LINKEDIN_LINK || process.env.NUXT_PUBLIC_LINKEDIN_LINK,
      wikipediaLink: process.env.WIKIPEDIA_LINK || process.env.NUXT_PUBLIC_WIKIPEDIA_LINK,
      githubLink: process.env.GITHUB_LINK || process.env.NUXT_PUBLIC_GITHUB_LINK,

      // Messengers
      nostrNpub: process.env.NOSTR_NPUB || process.env.NUXT_PUBLIC_NOSTR_NPUB,
      sessionName: process.env.SESSION_NAME || process.env.NUXT_PUBLIC_SESSION_NAME,
      matrixName: process.env.MATRIX_NAME || process.env.NUXT_PUBLIC_MATRIX_NAME,
      lensName: process.env.LENS_NAME || process.env.NUXT_PUBLIC_LENS_NAME,
      farcasterName: process.env.FARCASTER_NAME || process.env.NUXT_PUBLIC_FARCASTER_NAME,
      blueskyName: process.env.BLUESKY_NAME || process.env.NUXT_PUBLIC_BLUESKY_NAME,
      hiveName: process.env.HIVE_NAME || process.env.NUXT_PUBLIC_HIVE_NAME,
      pushName: process.env.PUSH_NAME || process.env.NUXT_PUBLIC_PUSH_NAME,
      mirrorName: process.env.MIRROR_NAME || process.env.NUXT_PUBLIC_MIRROR_NAME,
      telegramName: process.env.TELEGRAM_NAME || process.env.NUXT_PUBLIC_TELEGRAM_NAME,
      twitterName: process.env.TWITTER_NAME || process.env.NUXT_PUBLIC_TWITTER_NAME,
      redditName: process.env.REDDIT_NAME || process.env.NUXT_PUBLIC_REDDIT_NAME,
      signalNumber: process.env.SIGNAL_NUMBER || process.env.NUXT_PUBLIC_SIGNAL_NUMBER,
      whatsappNumber: process.env.WHATSAPP_NUMBER || process.env.NUXT_PUBLIC_WHATSAPP_NUMBER,
      xmppName: process.env.XMPP_NAME || process.env.NUXT_PUBLIC_XMPP_NAME,

      // Blockchain
      uniswapLink: process.env.UNISWAP_LINK || process.env.NUXT_PUBLIC_UNISWAP_LINK,
      sushiswapLink: process.env.SUSHISWAP_LINK || process.env.NUXT_PUBLIC_SUSHISWAP_LINK,
      etherscanLink: process.env.ETHERSCAN_LINK || process.env.NUXT_PUBLIC_ETHERSCAN_LINK,
      ethvmLink: process.env.ETHVM_LINK || process.env.NUXT_PUBLIC_ETHVM_LINK,
      coingeckoLink: process.env.COINGECKO_LINK || process.env.NUXT_PUBLIC_COINGECKO_LINK,
      coinmarketcapLink: process.env.COINMARKETCAP_LINK || process.env.NUXT_PUBLIC_COINMARKETCAP_LINK,
      dextoolsLink: process.env.DEXTOOLS_LINK || process.env.NUXT_PUBLIC_DEXTOOLS_LINK,
      dexscreenerLink: process.env.DEXSCREENER_LINK || process.env.NUXT_PUBLIC_DEXSCREENER_LINK,
      birdeyeLink: process.env.BIRDEYE_LINK || process.env.NUXT_PUBLIC_BIRDEYE_LINK,
      geckoterminalLink: process.env.GECKOTERMINAL_LINK || process.env.NUXT_PUBLIC_GECKOTERMINAL_LINK,

      // Extra contact links
      extraContactInfo: process.env.EXTRA_CONTACT_INFO || process.env.NUXT_PUBLIC_EXTRA_CONTACT_INFO,

      ifShowDevelopersInfo: process.env.IF_SHOW_DEVELOPERS_INFO || process.env.NUXT_PUBLIC_IF_SHOW_DEVELOPERS_INFO,

      // Categories
      ifShowCategoriesFilter: process.env.IF_SHOW_CATEGORIES_FILTER || process.env.NUXT_PUBLIC_IF_SHOW_CATEGORIES_FILTER,

      envCategories: process.env.CATEGORIES
        || process.env.NUXT_PUBLIC_CATEGORIES
        || "tech,privacy,defi,memes",

      // Authors:
      enableAutoGeneratedNames: process.env.ENABLE_AUTO_GENERATED_NAMES || process.env.NUXT_PUBLIC_ENABLE_AUTO_GENERATED_NAMES,
      enableAutoGeneratedNamesDictionaryTech: process.env.ENABLE_AUTO_GENERATED_NAMES_DICTIONARY_TECH || process.env.NUXT_PUBLIC_ENABLE_AUTO_GENERATED_NAMES_DICTIONARY_TECH,

      // Feed filters
      feedFiltersActivityHot: process.env.FEED_FILTERS_ACTIVITY_HOT || process.env.NUXT_PUBLIC_FEED_FILTERS_ACTIVITY_HOT,
      feedFiltersActivityRising: process.env.FEED_FILTERS_ACTIVITY_RISING || process.env.NUXT_PUBLIC_FEED_FILTERS_ACTIVITY_RISING,

      // Pinned events
      pinnedIds: process.env.PINNED_IDS || process.env.NUXT_PUBLIC_PINNED_IDS,

      // Colors
      colorPrimaryLight: process.env.COLOR_PRIMARY_LIGHT
        || process.env.NUXT_PUBLIC_COLOR_PRIMARY_LIGHT || '#f420af',
      colorPrimaryDark: process.env.COLOR_PRIMARY_DARK
        || process.env.NUXT_PUBLIC_COLOR_PRIMARY_DARK || '#f420af',
      colorBaseLight: process.env.COLOR_BASE_LIGHT
        || process.env.NUXT_PUBLIC_COLOR_BASE_LIGHT || '#000000',
      colorBaseDark: process.env.COLOR_BASE_DARK
        || process.env.NUXT_PUBLIC_COLOR_BASE_DARK || '#d8d8d8',
      colorSecondaryLight: process.env.COLOR_SECONDARY_LIGHT
        || process.env.NUXT_PUBLIC_COLOR_SECONDARY_LIGHT || '#000000',
      colorSecondaryDark: process.env.COLOR_SECONDARY_DARK
        || process.env.NUXT_PUBLIC_COLOR_SECONDARY_DARK || '#ffffff',
      colorHoverLight: process.env.COLOR_HOVER_LIGHT
        || process.env.NUXT_PUBLIC_COLOR_HOVER_LIGHT || '#243746',
      colorHoverDark: process.env.COLOR_HOVER_DARK
        || process.env.NUXT_PUBLIC_COLOR_HOVER_DARK || '#cbd4d1',
      colorNotImportantLight: process.env.COLOR_NOT_IMPORTANT_LIGHT
        || process.env.NUXT_PUBLIC_COLOR_NOT_IMPORTANT_LIGHT || '#9b8bc6',
      colorNotImportantDark: process.env.COLOR_NOT_IMPORTANT_DARK
        || process.env.NUXT_PUBLIC_COLOR_NOT_IMPORTANT_DARK || '#706297',
      colorGreenLight: process.env.COLOR_GREEN_LIGHT
        || process.env.NUXT_PUBLIC_COLOR_GREEN_LIGHT || '#089703',
      colorGreenDark: process.env.COLOR_GREEN_DARK
        || process.env.NUXT_PUBLIC_COLOR_GREEN_DARK || '#0ad203',
      colorRedLight: process.env.COLOR_RED_LIGHT
        || process.env.NUXT_PUBLIC_COLOR_RED_LIGHT || '#ff0a0a',
      colorRedDark: process.env.COLOR_RED_DARK
        || process.env.NUXT_PUBLIC_COLOR_RED_DARK || '#ff0a0a',
      colorOrangeLight: process.env.COLOR_ORANGE_LIGHT
        || process.env.NUXT_PUBLIC_COLOR_ORANGE_LIGHT || '#f4af0c',
      colorOrangeDark: process.env.COLOR_ORANGE_DARK
        || process.env.NUXT_PUBLIC_COLOR_ORANGE_DARK || '#f4af0c',
      colorBlueLight: process.env.COLOR_BLUE_LIGHT
        || process.env.NUXT_PUBLIC_COLOR_BLUE_LIGHT || '#3a3dff',
      colorBlueDark: process.env.COLOR_BLUE_DARK
        || process.env.NUXT_PUBLIC_COLOR_BLUE_DARK || '#3a3dff',
      bgBaseLight: process.env.BG_BASE_LIGHT
        || process.env.NUXT_PUBLIC_BG_BASE_LIGHT || '#fafafa',
      bgBaseDark: process.env.BG_BASE_DARK
        || process.env.NUXT_PUBLIC_BG_BASE_DARK || '#0F0F0F',
      bgSecondaryLight: process.env.BG_SECONDARY_LIGHT
        || process.env.NUXT_PUBLIC_BG_SECONDARY_LIGHT || '#f0f0f0',
      bgSecondaryDark: process.env.BG_SECONDARY_DARK
        || process.env.NUXT_PUBLIC_BG_SECONDARY_DARK || '#181818',
      bgHoverLight: process.env.BG_HOVER_LIGHT
        || process.env.NUXT_PUBLIC_BG_HOVER_LIGHT || '#e3e3e3',
      bgHoverDark: process.env.BG_HOVER_DARK
        || process.env.NUXT_PUBLIC_BG_HOVER_DARK || '#1f1f1f',
      bgDarkLight: process.env.BG_DARK_LIGHT
        || process.env.NUXT_PUBLIC_BG_DARK_LIGHT || '#bbbbbb',
      bgDarkDark: process.env.BG_DARK_DARK
        || process.env.NUXT_PUBLIC_BG_DARK_DARK || '#000000',
      borderColorLight: process.env.BORDER_COLOR_LIGHT
        || process.env.NUXT_PUBLIC_BORDER_COLOR_LIGHT || '#ddd',
      borderColorDark: process.env.BORDER_COLOR_DARK
        || process.env.NUXT_PUBLIC_BORDER_COLOR_DARK || '#312d3e',
    }
  },

  // modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@vite-pwa/nuxt'
  ],

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    config: {},
    injectPosition: 0,
    viewer: true,
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'dark',
  },

  typescript: {
    strict: true
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: process.env.MANIFEST_NAME
        || process.env.NUXT_PUBLIC_MANIFEST_NAME
        || process.env.INTRO_TITLE
        || process.env.NUXT_PUBLIC_INTRO_TITLE
        || "Spasm",
      short_name: process.env.MANIFEST_SHORT_NAME
        || process.env.NUXT_PUBLIC_MANIFEST_SHORT_NAME
        || process.env.INTRO_TITLE
        || process.env.NUXT_PUBLIC_INTRO_TITLE
        || "Spasm",
      background_color: '#000000',
      theme_color: '#000000',
      id: process.env.MANIFEST_ID
        || process.env.NUXT_PUBLIC_MANIFEST_ID
        || process.env.INTRO_TITLE
        || process.env.NUXT_PUBLIC_INTRO_TITLE
        || "Spasm",
      start_url: '.',
      display: 'standalone',
      lang: 'en',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        // {
        //   src: 'pwa-512x512.png',
        //   sizes: '512x512',
        //   type: 'image/png',
        //   purpose: 'any maskable',
        // },
      ],
    },
    workbox: {
      // navigateFallback: '/',
      // globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
      // you don't need to include this: only for testing purposes
      // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
      // periodicSyncForUpdates: 20,
    },
    devOptions: {
      enabled: true,
      type: 'module',
    },
  },

  compatibilityDate: '2026-03-24',
})
