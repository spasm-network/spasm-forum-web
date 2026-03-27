<template>
  <div class="text-base bg-bgBase-light dark:bg-bgBase-dark text-colorBase-light dark:text-colorBase-dark">
    <div class="max-w-[1920px] m-auto"
      :key="componentKey"
      >
      <!--
        VitePwaManifest is wrapped with <client-only> tags
        to prevent hydration mismatches.
        Another safeguard is a unique componentKey.
      -->
      <client-only>
        <VitePwaManifest />
      </client-only>

      <div class="Navbar">
        <Navbar class="fixed bottom-0 w-screen" />
      </div>

      <ExtraNotification />

      <div class="grid grid-cols-11">
        <Feed class="lg:border-r border-borderColor-light dark:border-borderColor-dark h-screen overflow-scroll col-span-11 lg:col-span-4"
          :class="[isFeedShown ? 'block' : 'hidden lg:block']" />
        <Info class="w-screen h-screen overflow-scroll col-span-7 lg:w-full"
          :class="[!isFeedShown ? 'block' : 'hidden lg:block']" >
          <slot />
        </Info>
      </div>

      <ExtraWeb3Modal v-if="isWeb3ModalShown"/>
      <ExtraQrCodeModal v-if="isQrCodeModalShown"/>
      <ExtraFollowModal v-if="isFollowModalShown"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useAppConfigStore} from '@/stores/useAppConfigStore'
import faviconSpasm from "@/assets/favicons/spasm.ico"
import faviconMonero from "@/assets/favicons/monero.ico"
import faviconZcash from "@/assets/favicons/zcash.ico"
import faviconEthereum from "@/assets/favicons/ethereum.ico"
import faviconBitcoin from "@/assets/favicons/bitcoin.ico"
import faviconSolana from "@/assets/favicons/solana.ico"
import faviconCampfire from "@/assets/favicons/campfire.ico"
import faviconChat from "@/assets/favicons/chat.ico"
import faviconCube from "@/assets/favicons/cube.ico"
import faviconResearch from "@/assets/favicons/research.ico"
import faviconRocket from "@/assets/favicons/rocket.ico"
import faviconRoger from "@/assets/favicons/roger.ico"

const {isFeedShown} = useFeed()
const {
  isWeb3ModalShown, isQrCodeModalShown,
  setConnectedAddress, isFollowModalShown
} = useWeb3()
const {
  logExecution
} = useUtils()

// Always use the latest app config from database
await useAppConfigStore()?.fetchAndUpdateAppConfig()
const appConfig = useAppConfigStore()?.getAppConfig

// componentKey is added as an extra safeguard against
// hydration mismatches. The idea is that an element
// should be re-generated if the key is different,
// e.g. if different versions have been generated
// on the server and client sides. 
const componentKey = ref(new Date().toISOString())

const onAccountsChanged = async (accounts?: string[]) => {
  /* console.log("onAccountsChanged called") */
  /* console.log("accounts:", accounts) */
  if (Array.isArray(accounts) && typeof(accounts?.[0]) === 'string') {
    setConnectedAddress(accounts[0])
  } else {
    setConnectedAddress('')
  }
}

/* const onDisconnect = async (code, reason) => {                                 */
/*   console.log("onDisconnect called")                                           */
/*   console.log(`Ethereum Provider connection closed: ${reason}. Code: ${code}`) */
/* }                                                                              */

const setListeners = (bool: boolean) => {
  if (window?.ethereum) {
    if (bool) {
      // TODO: use provider instead of window.ethereum
      window.ethereum.on('accountsChanged', onAccountsChanged)
      /* window.ethereum.on('disconnect', onDisconnect) */
      /* console.log('listeners set') */
    } else {
      window.ethereum.removeListener('accountsChanged', onAccountsChanged)
      /* window.ethereum.removeListener('disconnect', onDisconnect) */
      /* console.log('listeners removed') */
    }
  }
}

onMounted(async () => {
  /* console.log("onMounted") */
  setListeners(true)
})

onUnmounted(() => {
  setListeners(false)
})

let faviconPath =
  useRuntimeConfig()?.public?.faviconPath || '/favicon.ico'

type FaviconKey =
  | "spasm" | "monero" | "zcash" | "ethereum" | "bitcoin" | "solana"
  | "custom-link" | "default"
  | "campfire" | "chat" | "cube" | "research" | "rocket" | "roger"

const faviconMap: Record<Exclude<FaviconKey, "custom-link">, string> = {
  default: "/favicon.ico",
  spasm: faviconSpasm,
  monero: faviconMonero,
  zcash: faviconZcash,
  ethereum: faviconEthereum,
  bitcoin: faviconBitcoin,
  solana: faviconSolana,
  campfire: faviconCampfire,
  chat: faviconChat,
  cube: faviconCube,
  research: faviconResearch,
  rocket: faviconRocket,
  roger: faviconRoger
}

function isFaviconKey(v: unknown): v is FaviconKey {
  return typeof v === "string" && [
    "spasm","monero","zcash","ethereum","bitcoin","solana",
    "custom-link","default","campfire","chat","cube",
    "research","rocket","roger"
  ].includes(v)
}

const faviconTheme = appConfig?.faviconTheme
if (isFaviconKey(faviconTheme)) {
  if (faviconTheme === "custom-link") {
    if (
      appConfig?.faviconLink &&
      typeof(appConfig?.faviconLink) === "string"
    ) {
      faviconPath = appConfig.faviconLink
    } else {
      faviconPath = faviconMap.default
    }
  } else {
    faviconPath = faviconMap[faviconTheme]
  }
} else {
  faviconPath = faviconMap.default
}

useHead({
  title: appConfig?.introTitle,
  meta: [
    { name: 'description', content: appConfig?.introTitle },
    { name: 'apple-mobile-web-app-title', content:appConfig?.introTitle },
    { name: 'og:title', property: 'og:title', content:appConfig?.introTitle },
    { name: 'og:site_name', property: 'og:site_name', content:appConfig?.introTitle },
    { name: 'og:description', property: 'og:description', content:appConfig?.introAbout },
  ],
  link: [
    // { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'icon', type: 'image/x-icon', href: faviconPath },
    { rel: 'shortcut icon', href: faviconPath },
    { rel: 'apple-touch-icon', href: faviconPath, sizes: '512x512' },
  ],
  style: [{
    innerHTML: `:root {
      --color-primary-light: ${appConfig?.colorPrimaryLight || "#f420af"};
      --color-primary-dark: ${appConfig?.colorPrimaryDark || "#f420af"};
      --color-base-light: ${appConfig?.colorBaseLight || "#000000"};
      --color-base-dark: ${appConfig?.colorBaseDark || "#d8d8d8"};
      --color-secondary-light: ${appConfig?.colorSecondaryLight || "#000000"};
      --color-secondary-dark: ${appConfig?.colorSecondaryDark || "#ffffff"};
      --color-hover-light: ${appConfig?.colorHoverLight || "#243746"};
      --color-hover-dark: ${appConfig?.colorHoverDark || "#cbd4d1"};
      --color-not-important-light: ${appConfig?.colorNotImportantLight || "#9b8bc6"};
      --color-not-important-dark: ${appConfig?.colorNotImportantDark || "#706297"};
      --color-green-light: ${appConfig?.colorGreenLight || "#089703"};
      --color-green-dark: ${appConfig?.colorGreenDark || "#0ad203"};
      --color-red-light: ${appConfig?.colorRedLight || "#ff0a0a"};
      --color-red-dark: ${appConfig?.colorRedDark || "#ff0a0a"};
      --color-orange-light: ${appConfig?.colorOrangeLight || "#f4af0c"};
      --color-orange-dark: ${appConfig?.colorOrangeDark || "#f4af0c"};
      --color-blue-light: ${appConfig?.colorBlueLight || "#3a3dff"};
      --color-blue-dark: ${appConfig?.colorBlueDark || "#3a3dff"};
      --bg-base-light: ${appConfig?.bgBaseLight || "#fafafa"};
      --bg-base-dark: ${appConfig?.bgBaseDark || "#0F0F0F"};
      --bg-secondary-light: ${appConfig?.bgSecondaryLight || "#f0f0f0"};
      --bg-secondary-dark: ${appConfig?.bgSecondaryDark || "#181818"};
      --bg-hover-light: ${appConfig?.bgHoverLight || "#e3e3e3"};
      --bg-hover-dark: ${appConfig?.bgHoverDark || "#1f1f1f"};
      --bg-dark-light: ${appConfig?.bgDarkLight || "#bbbbbb"};
      --bg-dark-dark: ${appConfig?.bgDarkDark || "#000000"};
      --border-color-light: ${appConfig?.borderColorLight || "#dddddd"};
      --border-color-dark: ${appConfig?.borderColorDark || "#312d3e"};
    }`
  }]
})
</script>

<style scoped>
/* disable scrollbar in Chrome, Safari, Brave */
::-webkit-scrollbar {
  display: none;
}
</style>
