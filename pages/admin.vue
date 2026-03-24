<template>
  <div>
    <div class="mt-4">
      <!-- TODO Refactor or delete after testing -->
      <div class="my-4">
        <div
          :class="[isResponseError ? 'text-colorRed-light dark:text-colorRed-dark' : 'text-colorGreen-light dark:text-colorGreen-dark']"
        >
          {{ responseMessage }}
        </div>
        <div
          class="mb-16"
          v-if="connectedAddress &&
           typeof(connectedAddress) === 'string' &&
           isInList(connectedAddress, appConfig?.admins)"
        >
          <button
            @click="saveAppConfig()"
            class="inline px-6 lg:min-w-[200px] min-h-[40px] text-colorPrimary-light dark:text-colorPrimary-dark border-2 border-colorPrimary-light dark:border-colorPrimary-dark rounded-lg hover:bg-bgHover-light dark:hover:bg-bgHover-dark"
          >
            Save app config
          </button>
        </div>
      </div>

      <div>
        <span class="text-2xl text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" @click="toggleHomePage" >
        Home page
        <IconsTriangle :rotateIf="showHomePage" />
        </span>
      </div>

      <div v-if="showHomePage" class="pl-4">
        <div class="pl-0 mt-2">
          <div class="pl-0 mt-0">
            <input v-model="enableDefaultHeaderImage" type="checkbox" >
            Enable default header image
          </div>
          <div class="ml-5">
            Default header image link:
            <input v-model="defaultHeaderImageLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials">
          </div>
          <div class="ml-5 text-colorNotImportant-light text-colorNotImportant-dark">
            Option 1: add full URL to image file (.jpeg, .jpg, .png, .webp, .svg) <br>
            Option 2: leave URL field blank and upload your jpeg image to <code>frontend/public/header.jpeg</code> (only jpeg supported, docker/podman deployment not supported).
          </div>
        </div>
        <div class="pl-0 mt-4">
          <input v-model="enableDefaultIntro" type="checkbox" >
          Enable default intro section: title, extra, about (description)
          <div class="ml-5">
            <div>
              Intro title
              <input v-model="introTitle" type="text" placeholder="type intro title (e.g., Spasm)" class="custom-admin-input-socials">
            </div>
            <div>
              Intro title extra
              <input v-model="introTitleExtra" type="text" placeholder="type intro title extra (e.g., forum)" class="custom-admin-input-socials">
            </div>
            <div>
              Intro about
              <input v-model="introAbout" type="text" placeholder="type intro about (e.g., Get latest Spasm news)" class="custom-admin-input-socials">
            </div>
          </div>
        </div>
        <div class="pl-0 mt-4">
          <input v-model="enableDefaultContacts" type="checkbox" >
          Enable default contacts
          <div class="ml-5 pl-0">
            <input v-model="ifShowContactsInIntro" type="checkbox" >
            And show contacts in intro section
            <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
              (if disabled, contacts will be shown only at
              <nuxt-link
                class="cursor-pointer text-colorPrimary-light dark:text-colorPrimary-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
                :to="`/contacts`"
              >
                /contacts
              </nuxt-link>
              page)
            </span>
          </div>
        </div>
        <div class="mt-6">
          <div class="pl-0">
            <input v-model="enableDefaultButtonPrimary" type="checkbox" >
            Enable default button primary
          </div>
          <div class="ml-5">Primary button link: <input v-model="defaultButtonPrimaryLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
          <div class="ml-5">Primary button text: <input v-model="defaultButtonPrimaryText" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
          <div class="pl-0">
            <input v-model="enableDefaultButtonSecondary" type="checkbox" >
            Enable default button secondary
          </div>
          <div class="ml-5">Secondary button link: <input v-model="defaultButtonSecondaryLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
          <div class="ml-5">Secondary button text: <input v-model="defaultButtonSecondaryText" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        </div>
        <div class="pl-0">
          <input v-model="enableCustomIntro" type="checkbox" >
          Enable custom intro
          <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
            (not supported via docker/podman deployment)
          </span>
        </div>
        <div class="pl-0">
          <input v-model="enableCustomContacts" type="checkbox" >
          Enable custom contacts
          <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
            (not supported via docker/podman deployment)
          </span>
        </div>
        <div class="pl-0">
          <input v-model="ifShowIntroTutorial" type="checkbox" >
          Show intro tutorial
          <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
            (tutorial like "connect your wallet, read what you sign, etc.")
          </span>
        </div>
        <div class="pl-0">
          <input v-model="ifShowHomeLatestComments" type="checkbox" >
          Show latest comments
        </div>

        <div class="mt-2 mb-6">
          <span class="ml-4 text-xl text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" @click="toggleHomePage" >
          hide section
          <IconsTriangle :rotateIf="showHomePage" />
          </span>
        </div>
      </div>


      <div>
        <span class="text-2xl text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark cursor-pointer" @click="toggleSocialMediaLinks">
        Social media links
        <IconsTriangle :rotateIf="showSocialMediaLinks" />
        </span>
      </div>

      <div v-if="showSocialMediaLinks" class="pl-4">
        <div>Another website: <input v-model="anotherWebsiteLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>IPFS: <input v-model="ipfsLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Tor: <input v-model="torLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>IPFS HTTP gateway link: <input v-model="ipfsHttpGatewayLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Nostr: <input v-model="nostrLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Session: <input v-model="sessionLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>SimpleX: <input v-model="simplexLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Status: <input v-model="statusLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Lens: <input v-model="lensLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Farcaster: <input v-model="farcasterLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Bluesky: <input v-model="blueskyLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Hive: <input v-model="hiveLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Push: <input v-model="pushLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Mirror: <input v-model="mirrorLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Mastodon: <input v-model="mastodonLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Matrix: <input v-model="matrixLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Discord: <input v-model="discordLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Telegram: <input v-model="telegramLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Twitter: <input v-model="twitterLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Reddit: <input v-model="redditLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Youtube: <input v-model="youtubeLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Instagram: <input v-model="instagramLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Facebook: <input v-model="facebookLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>LinkedIn: <input v-model="linkedinLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Wikipedia: <input v-model="wikipediaLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Github: <input v-model="githubLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div class="mt-2 mb-6">
          <span class="ml-4 text-xl text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" @click="toggleSocialMediaLinks" >
          hide section
          <IconsTriangle :rotateIf="showSocialMediaLinks" />
          </span>
        </div>
      </div>


      <div>
        <span class="text-2xl text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark cursor-pointer" @click="toggleSocialMediaNames">
        Social media names
        <IconsTriangle :rotateIf="showSocialMediaNames" />
        </span>
      </div>

      <div v-if="showSocialMediaNames" class="pl-4">
        <div>Nostr npub: <input v-model="nostrNpub" type="text" placeholder="enter npub" class="custom-admin-input-socials"></div>
        <div>Session: <input v-model="sessionName" type="text" placeholder="enter username" class="custom-admin-input-socials"></div>
        <div>Matrix: <input v-model="matrixName" type="text" placeholder="enter username" class="custom-admin-input-socials"></div>
        <div>Lens: <input v-model="lensName" type="text" placeholder="enter username" class="custom-admin-input-socials"></div>
        <div>Farcaster: <input v-model="farcasterName" type="text" placeholder="enter username" class="custom-admin-input-socials"></div>
        <div>Bluesky:: <input v-model="blueskyName" type="text" placeholder="enter username" class="custom-admin-input-socials"></div>
        <div>Hive: <input v-model="hiveName" type="text" placeholder="enter username" class="custom-admin-input-socials"></div>
        <div>Push: <input v-model="pushName" type="text" placeholder="enter username" class="custom-admin-input-socials"></div>
        <div>Mirror: <input v-model="mirrorName" type="text" placeholder="enter username" class="custom-admin-input-socials"></div>
        <div>Telegram: <input v-model="telegramName" type="text" placeholder="enter username" class="custom-admin-input-socials"></div>
        <div>Twitter: <input v-model="twitterName" type="text" placeholder="enter username" class="custom-admin-input-socials"></div>
        <div>Reddit: <input v-model="redditName" type="text" placeholder="enter username" class="custom-admin-input-socials"></div>
        <div>Signal: <input v-model="signalNumber" type="text" placeholder="enter username or number" class="custom-admin-input-socials"></div>
        <div>Whatsapp: <input v-model="whatsappNumber" type="text" placeholder="enter number" class="custom-admin-input-socials"></div>
        <div>XMPP: <input v-model="xmppName" type="text" placeholder="enter username" class="custom-admin-input-socials"></div>
        <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">Note: extra info supports markdown, but not <code>\n</code></div>
        <div>Extra info: <textarea v-model="extraContactInfo" placeholder="enter any extra info (markdown links supported)" class="block p-1 bg-bgBase-light dark:bg-bgBase-dark border-bgSecondary-light dark:border-bgSecondary-dark w-[90%] max-w-[700px] h-60 lg:h-36 focus:outline-none rounded-b-lg border-2"/></div>
        <div class="mt-2 mb-6">
          <span class="ml-4 text-xl text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" @click="toggleSocialMediaNames" >
          hide section
          <IconsTriangle :rotateIf="showSocialMediaNames" />
          </span>
        </div>
      </div>


      <div>
        <span class="text-2xl text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark cursor-pointer" @click="toggleBlockchainLinks">
        Blockchain links
        <IconsTriangle :rotateIf="showBlockchainLinks" />
        </span>
      </div>

      <div v-if="showBlockchainLinks" class="pl-4">
        <div>Uniswap: <input v-model="uniswapLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Sushiswap: <input v-model="sushiswapLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Etherscan: <input v-model="etherscanLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Ethvm: <input v-model="ethvmLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Coingecko: <input v-model="coingeckoLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Coinmarketcap: <input v-model="coinmarketcapLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Dextools: <input v-model="dextoolsLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Dexscreener: <input v-model="dexscreenerLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Birdeye: <input v-model="birdeyeLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>GeckoTerminal: <input v-model="geckoterminalLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div class="mt-2 mb-6">
          <span class="ml-4 text-xl text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" @click="toggleBlockchainLinks" >
          hide section
          <IconsTriangle :rotateIf="showBlockchainLinks" />
          </span>
        </div>
      </div>

      <div>
        <span class="text-2xl text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark cursor-pointer" @click="toggleFeedSettings">
        Feed settings
        <IconsTriangle :rotateIf="showFeedSettings" />
        </span>
      </div>

      <div v-if="showFeedSettings" class="ml-5">
        <h5 class="mt-4">Feed activity filters</h5>
        <div class="ml-5">
          <div>The amount of reactions for "Hot" filter: <input v-model="feedFiltersActivityHot" type="number" placeholder="choose a number" class="custom-admin-input-socials"></div>
          <div>The amount of reactions for "Rising" filter: <input v-model="feedFiltersActivityRising" type="number" placeholder="choose a number" class="custom-admin-input-socials"></div>
        </div>
        <h5 class="mt-2">Feed categories filters</h5>
        <div class="mt-2 ml-5">
          <input
            v-model="ifShowCategoriesFilter"
            type="checkbox"
          >
          show categories filter
        </div>
        <div class="mt-4 ml-5">
          Categories ({{ count(envCategories) }})
          <textarea
            v-model="envCategories"
            placeholder="defi,privacy,tech,memes"
            class="block p-1 bg-bgBase-light dark:bg-bgBase-dark border-bgSecondary-light dark:border-bgSecondary-dark w-[90%] max-w-[700px] h-30 lg:h-36 focus:outline-none rounded-b-lg border-2"
          />
        </div>

        <div class="mt-2 mb-6">
          <span class="ml-4 text-xl text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" @click="toggleFeedSettings" >
          hide section
          <IconsTriangle :rotateIf="showFeedSettings" />
          </span>
        </div>
      </div>


      <div>
        <span class="text-2xl text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark cursor-pointer" @click="toggleOther">
        Other
        <IconsTriangle :rotateIf="showOther" />
        </span>
      </div>

      <div v-if="showOther" class="mt-2 ml-5">
        <div>
          <input
            v-model="enableShortUrlsForWeb3Actions"
            type="checkbox"
          >
          enable short URLs for Spasm IDs (recommended length is 30+ chars)
          <div class="ml-5">Short URL length: <input v-model="shortUrlsLengthOfWeb3Ids" type="number" placeholder="choose a number" class="custom-admin-input-socials"></div>
        </div>
        <div class="pl-0 mt-4">
          <input v-model="ifShowDevelopersInfo" type="checkbox" >
          Show developers info at
          <nuxt-link
            class="cursor-pointer text-colorPrimary-light dark:text-colorPrimary-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
            :to="`/contacts`"
          >
            /contacts
          </nuxt-link>
          page
          <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
            (powered by Spasm)
          </span>
        </div>
        <div class="mt-2 mb-6">
          <span class="ml-4 text-xl text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" @click="toggleOther" >
          hide section
          <IconsTriangle :rotateIf="showOther" />
          </span>
        </div>
      </div>


      <div>
        <span class="text-2xl text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark cursor-pointer" @click="toggleNewContent">
        New Content
        <IconsTriangle :rotateIf="showNewContent" />
        </span>
      </div>

      <div v-if="showNewContent">
        <div class="hidden mt-4 pl-4">
          RSS module:
          <div class="pl-4">
            <input
              v-model="allowNewEventsWithoutSignature"
              type="checkbox"
            >
            allow new events without signature
            (e.g., RSS posts)
          </div>
        </div>
        <div class="mt-4 pl-4">
          Pinned events at the top of the news feed:
          <div>
            List of Spasm IDs of pinned events
            ({{ count(pinnedIds) }})
              <textarea
                v-model="pinnedIds"
                placeholder="0x123456789"
                class="block p-1 bg-bgBase-light dark:bg-bgBase-dark border-bgSecondary-light dark:border-bgSecondary-dark w-[90%] max-w-[700px] h-60 lg:h-36 focus:outline-none rounded-b-lg border-2"
              />
          </div>
        </div>
        <div class="mt-4 pl-4">
          Connect button:
          <div class="ml-5">
            <input
              v-model="ifAllowGuestLogin"
              type="checkbox"
            >
            allow "log in as guest"
          </div>
        </div>
        <div class="mt-4 pl-4">
          Enable new actions:
          <div class="pl-4">
            <div>
              <input
                v-model="enableNewWeb3ActionsAll"
                type="checkbox"
              >
              all
              (you still need to enable all actions individually)
            </div>
            <div>
              <input
                v-model="enableNewWeb3ActionsPost"
                type="checkbox"
              >
              post
            </div>
            <div>
              <input
                v-model="enableNewWeb3ActionsReply"
                type="checkbox"
              >
              reply
              (comments)
            </div>
            <div>
              <input
                v-model="enableNewWeb3ActionsReact"
                type="checkbox"
              >
              react
              (upvote, downvote, etc.)
            </div>
            <div>
              <input
                v-model="enableNewWeb3ActionsModerate"
                type="checkbox"
              >
              moderate
            </div>
          </div>
        </div>
        <div class="mt-4 pl-4">
          <input
            v-model="enableModeration"
            type="checkbox"
          >
          Enable moderation
          <div>
            List of moderators
            ({{ count(moderators) }})
              <textarea
                v-model="moderators"
                placeholder="0x123456789,npub123456789"
                class="block p-1 bg-bgBase-light dark:bg-bgBase-dark border-bgSecondary-light dark:border-bgSecondary-dark w-[90%] max-w-[700px] h-60 lg:h-36 focus:outline-none rounded-b-lg border-2"
              />
          </div>
        </div>
        <div class="mt-4 pl-4">
          <h6>Whitelists for new actions</h6>
          <div class="pl-2">
            <div>
              <input
                v-model="enableWhitelistForActionPost"
                type="checkbox"
              >
              enable whitelist for new posts
              ({{ count(whitelistedForActionPost) }})
              <textarea
                v-model="whitelistedForActionPost"
                placeholder="0x123456789,npub123456789"
                class="block p-1 bg-bgBase-light dark:bg-bgBase-dark border-bgSecondary-light dark:border-bgSecondary-dark w-[90%] max-w-[700px] h-60 lg:h-36 focus:outline-none rounded-b-lg border-2"
              />
            </div>
            <div class="mt-4">
              <input
                v-model="enableWhitelistForActionReply"
                type="checkbox"
              >
              enable whitelist for new replies
              (comments)
              ({{ count(whitelistedForActionReply) }})
              <textarea
                v-model="whitelistedForActionReply"
                placeholder="0x123456789,npub123456789"
                class="block p-1 bg-bgBase-light dark:bg-bgBase-dark border-bgSecondary-light dark:border-bgSecondary-dark w-[90%] max-w-[700px] h-60 lg:h-36 focus:outline-none rounded-b-lg border-2"
              />
            </div>
            <div class="mt-4">
              <input
                v-model="enableWhitelistForActionReact"
                type="checkbox"
              >
              enable whitelist for new reactions
              (upvote, downvote, etc.)
              ({{ count(whitelistedForActionReact) }})
              <textarea
                v-model="whitelistedForActionReact"
                placeholder="0x123456789,npub123456789"
                class="block p-1 bg-bgBase-light dark:bg-bgBase-dark border-bgSecondary-light dark:border-bgSecondary-dark w-[90%] max-w-[700px] h-60 lg:h-36 focus:outline-none rounded-b-lg border-2"
              />
            </div>
          </div>
        </div>
        <div class="mt-2 mb-6">
          <span class="ml-4 text-xl text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" @click="toggleNewContent" >
          hide section
          <IconsTriangle :rotateIf="showNewContent" />
          </span>
        </div>
      </div>
      <div class="my-4">
        <div
          :class="[isResponseError ? 'text-colorRed-light dark:text-colorRed-dark' : 'text-colorGreen-light dark:text-colorGreen-dark']"
        >
          {{ responseMessage }}
        </div>
        <div
          class="mb-16"
          v-if="connectedAddress &&
           typeof(connectedAddress) === 'string' &&
           isInList(connectedAddress, appConfig?.admins)"
        >
          <button
            @click="saveAppConfig()"
            class="inline px-6 lg:min-w-[200px] min-h-[40px] text-colorPrimary-light dark:text-colorPrimary-dark border-2 border-colorPrimary-light dark:border-colorPrimary-dark rounded-lg hover:bg-bgHover-light dark:hover:bg-bgHover-dark"
          >
            Save app config
          </button>
        </div>
      </div>
    </div>

    <div class="mb-32"></div>
  </div>
</template>

<script setup lang="ts">
import { AppConfig } from '@/helpers/interfaces';
import {useAppConfigStore} from '@/stores/useAppConfigStore'
const { isInList } = useNostr()
const appConfig = useAppConfigStore()?.getAppConfig

// Always show the latest app config when loading the admin page
await useAppConfigStore()?.fetchAndUpdateAppConfig()

const {
  connectedAddress,
  submitSingleSignedEventV2
} = useWeb3()
const {
  hasValue, splitIntoArray
} = useUtils()

const showHomePage = ref<boolean>(false)
const showSocialMediaLinks = ref<boolean>(false)
const showSocialMediaNames = ref<boolean>(false)
const showBlockchainLinks = ref<boolean>(false)
const showFeedSettings = ref<boolean>(false)
const showOther = ref<boolean>(false)
const showNewContent = ref<boolean>(false)
const toggleHomePage = () => {
  showHomePage.value = !showHomePage.value
}
const toggleSocialMediaLinks = () => {
  showSocialMediaLinks.value = !showSocialMediaLinks.value
}
const toggleSocialMediaNames = () => {
  showSocialMediaNames.value = !showSocialMediaNames.value
}
const toggleBlockchainLinks = () => {
  showBlockchainLinks.value = !showBlockchainLinks.value
}
const toggleFeedSettings = () => {
  showFeedSettings.value = !showFeedSettings.value
}
const toggleOther = () => {
  showOther.value = !showOther.value
}
const toggleNewContent = () => {
  showNewContent.value = !showNewContent.value
}

const count = (list: any): number => {
  if (!list) return 0
  if (Array.isArray(list) && list.length) {
    return list.length
  }
  if (typeof(list) === "string") {
    if (typeof(list.split(',')?.length) === "number") {
      return list.split(',').length
    }
  }
  return 0
}

// Booleans
const enableShortUrlsForWeb3Actions =
  ref<boolean>(appConfig?.enableShortUrlsForWeb3Actions)
const allowNewEventsWithoutSignature =
  ref<boolean>(appConfig?.allowNewEventsWithoutSignature)
// Booleans-default-intro
const enableDefaultIntro =
  ref<boolean>(appConfig?.enableDefaultIntro)
const enableDefaultContacts =
  ref<boolean>(appConfig?.enableDefaultContacts)
const ifShowDevelopersInfo =
  ref<boolean>(appConfig?.ifShowDevelopersInfo)
const enableDefaultHeaderImage =
  ref<boolean>(appConfig?.enableDefaultHeaderImage)
const enableDefaultButtonPrimary =
  ref<boolean>(appConfig?.enableDefaultButtonPrimary)
const enableDefaultButtonSecondary =
  ref<boolean>(appConfig?.enableDefaultButtonSecondary)
const enableCustomIntro =
  ref<boolean>(appConfig?.enableCustomIntro)
const enableCustomContacts =
  ref<boolean>(appConfig?.enableCustomContacts)
const ifShowContactsInIntro =
  ref<boolean>(appConfig?.ifShowContactsInIntro)
const ifShowIntroTutorial =
  ref<boolean>(appConfig?.ifShowIntroTutorial)
const ifShowHomeLatestComments =
  ref<boolean>(appConfig?.ifShowHomeLatestComments)
// Booleans-other
const ifShowCategoriesFilter =
  ref<boolean>(appConfig?.ifShowCategoriesFilter)
const ifAllowGuestLogin =
  ref<boolean>(appConfig?.ifAllowGuestLogin)
const enableNewWeb3ActionsAll =
  ref<boolean>(appConfig?.enableNewWeb3ActionsAll)
const enableNewWeb3ActionsPost =
  ref<boolean>(appConfig?.enableNewWeb3ActionsPost)
const enableNewWeb3ActionsReply =
  ref<boolean>(appConfig?.enableNewWeb3ActionsReply)
const enableNewWeb3ActionsReact =
  ref<boolean>(appConfig?.enableNewWeb3ActionsReact)
const enableNewWeb3ActionsModerate =
  ref<boolean>(appConfig?.enableNewWeb3ActionsModerate)
const enableModeration =
  ref<boolean>(appConfig?.enableModeration)
const enableWhitelistForActionPost =
  ref<boolean>(appConfig?.enableWhitelistForActionPost)
const enableWhitelistForActionReply =
  ref<boolean>(appConfig?.enableWhitelistForActionReply)
const enableWhitelistForActionReact =
  ref<boolean>(appConfig?.enableWhitelistForActionReact)

// Arrays
const moderators =
  ref<string[]>(appConfig?.moderators)
const whitelistedForActionPost =
  ref<string[]>(appConfig?.whitelistedForActionPost)
const whitelistedForActionReply =
  ref<string[]>(appConfig?.whitelistedForActionReply)
const whitelistedForActionReact =
  ref<string[]>(appConfig?.whitelistedForActionReact)
const pinnedIds =
  ref<string[]>(appConfig?.pinnedIds)
const envCategories =
  ref<string[]>(appConfig?.envCategories)

// Strings
// Strings-default-intro
const defaultHeaderImageLink =
  ref<string>(appConfig?.defaultHeaderImageLink)
const introTitle =
  ref<string>(appConfig?.introTitle)
const introTitleExtra =
  ref<string>(appConfig?.introTitleExtra)
const introAbout =
  ref<string>(appConfig?.introAbout)
const postPlaceholder =
  ref<string>(appConfig?.postPlaceholder)
const commentPlaceholder =
  ref<string>(appConfig?.commentPlaceholder)
const defaultButtonPrimaryText =
  ref<string>(appConfig?.defaultButtonPrimaryText)
const defaultButtonPrimaryLink =
  ref<string>(appConfig?.defaultButtonPrimaryLink)
const defaultButtonSecondaryText =
  ref<string>(appConfig?.defaultButtonSecondaryText)
const defaultButtonSecondaryLink =
  ref<string>(appConfig?.defaultButtonSecondaryLink)
// Strings-socials
const anotherWebsiteLink = ref<string>(appConfig?.anotherWebsiteLink)
const ipfsLink = ref<string>(appConfig?.ipfsLink)
const torLink = ref<string>(appConfig?.torLink)
const ipfsHttpGatewayLink = ref<string>(appConfig?.ipfsHttpGatewayLink)
const nostrLink = ref<string>(appConfig?.nostrLink)
const sessionLink = ref<string>(appConfig?.sessionLink)
const simplexLink = ref<string>(appConfig?.simplexLink)
const statusLink = ref<string>(appConfig?.statusLink)
const lensLink = ref<string>(appConfig?.lensLink)
const farcasterLink = ref<string>(appConfig?.farcasterLink)
const blueskyLink = ref<string>(appConfig?.blueskyLink)
const hiveLink = ref<string>(appConfig?.hiveLink)
const pushLink = ref<string>(appConfig?.pushLink)
const mirrorLink = ref<string>(appConfig?.mirrorLink)
const mastodonLink = ref<string>(appConfig?.mastodonLink)
const matrixLink = ref<string>(appConfig?.matrixLink)
const discordLink = ref<string>(appConfig?.discordLink)
const telegramLink = ref<string>(appConfig?.telegramLink)
const twitterLink = ref<string>(appConfig?.twitterLink)
const redditLink = ref<string>(appConfig?.redditLink)
const youtubeLink = ref<string>(appConfig?.youtubeLink)
const instagramLink = ref<string>(appConfig?.instagramLink)
const facebookLink = ref<string>(appConfig?.facebookLink)
const linkedinLink = ref<string>(appConfig?.linkedinLink)
const wikipediaLink = ref<string>(appConfig?.wikipediaLink)
const githubLink = ref<string>(appConfig?.githubLink)
const nostrNpub = ref<string>(appConfig?.nostrNpub)
const sessionName = ref<string>(appConfig?.sessionName)
const matrixName = ref<string>(appConfig?.matrixName)
const lensName = ref<string>(appConfig?.lensName)
const farcasterName = ref<string>(appConfig?.farcasterName)
const blueskyName = ref<string>(appConfig?.blueskyName)
const hiveName = ref<string>(appConfig?.hiveName)
const pushName = ref<string>(appConfig?.pushName)
const mirrorName = ref<string>(appConfig?.mirrorName)
const telegramName = ref<string>(appConfig?.telegramName)
const twitterName = ref<string>(appConfig?.twitterName)
const redditName = ref<string>(appConfig?.redditName)
const signalNumber = ref<string>(appConfig?.signalNumber)
const whatsappNumber = ref<string>(appConfig?.whatsappNumber)
const xmppName = ref<string>(appConfig?.xmppName)
const uniswapLink = ref<string>(appConfig?.uniswapLink)
const sushiswapLink = ref<string>(appConfig?.sushiswapLink)
const etherscanLink = ref<string>(appConfig?.etherscanLink)
const ethvmLink = ref<string>(appConfig?.ethvmLink)
const coingeckoLink = ref<string>(appConfig?.coingeckoLink)
const coinmarketcapLink = ref<string>(appConfig?.coinmarketcapLink)
const dextoolsLink = ref<string>(appConfig?.dextoolsLink)
const dexscreenerLink = ref<string>(appConfig?.dexscreenerLink)
const birdeyeLink = ref<string>(appConfig?.birdeyeLink)
const geckoterminalLink = ref<string>(appConfig?.geckoterminalLink)
const extraContactInfo = ref<string>(appConfig?.extraContactInfo)

// Numbers
const shortUrlsLengthOfWeb3Ids = ref<number>(appConfig?.shortUrlsLengthOfWeb3Ids)
const feedFiltersActivityHot = ref<number>(appConfig?.feedFiltersActivityHot)
const feedFiltersActivityRising = ref<number>(appConfig?.feedFiltersActivityRising)

const isResponseError = ref<boolean>(false)
const responseMessage = ref<boolean>('')

const saveAppConfig = async () => {
  try {
    isResponseError.value = false
    responseMessage.value = ''

    const newAppConfig: AppConfig = {}
    newAppConfig.enableShortUrlsForWeb3Actions =
      enableShortUrlsForWeb3Actions.value
    newAppConfig.allowNewEventsWithoutSignature =
      allowNewEventsWithoutSignature.value
    // Booleans-default-intro
    newAppConfig.enableDefaultIntro =
      enableDefaultIntro.value
    newAppConfig.enableDefaultContacts =
      enableDefaultContacts.value
    newAppConfig.ifShowDevelopersInfo =
      ifShowDevelopersInfo.value
    newAppConfig.enableDefaultHeaderImage =
      enableDefaultHeaderImage.value
    newAppConfig.enableDefaultButtonPrimary =
      enableDefaultButtonPrimary.value
    newAppConfig.enableDefaultButtonSecondary =
      enableDefaultButtonSecondary.value
    // Booleans-custom-intro
    newAppConfig.enableCustomIntro =
      enableCustomIntro.value
    newAppConfig.enableCustomContacts =
      enableCustomContacts.value
    newAppConfig.ifShowContactsInIntro =
      ifShowContactsInIntro.value
    newAppConfig.ifShowIntroTutorial =
      ifShowIntroTutorial.value
    newAppConfig.ifShowHomeLatestComments =
      ifShowHomeLatestComments.value
    // Booleans-others
    newAppConfig.ifShowCategoriesFilter =
      ifShowCategoriesFilter.value
    newAppConfig.ifAllowGuestLogin =
      ifAllowGuestLogin.value
    newAppConfig.enableNewWeb3ActionsAll =
      enableNewWeb3ActionsAll.value
    newAppConfig.enableNewWeb3ActionsPost =
      enableNewWeb3ActionsPost.value
    newAppConfig.enableNewWeb3ActionsReply =
      enableNewWeb3ActionsReply.value
    newAppConfig.enableNewWeb3ActionsReact =
      enableNewWeb3ActionsReact.value
    newAppConfig.enableNewWeb3ActionsModerate =
      enableNewWeb3ActionsModerate.value
    newAppConfig.enableModeration =
      enableModeration.value
    newAppConfig.enableWhitelistForActionPost =
      enableWhitelistForActionPost.value
    newAppConfig.enableWhitelistForActionReply =
      enableWhitelistForActionReply.value
    newAppConfig.enableWhitelistForActionReact =
      enableWhitelistForActionReact.value

    // Arrays
    if (typeof(moderators.value) === "string") {
      newAppConfig.moderators =
        splitIntoArray(moderators.value)
    } else if (Array.isArray(moderators.value)) {
      newAppConfig.moderators = moderators.value
    }
    if (typeof(whitelistedForActionPost.value) === "string") {
      newAppConfig.whitelistedForActionPost =
        splitIntoArray(whitelistedForActionPost.value)
    } else if (Array.isArray(whitelistedForActionPost.value)) {
      newAppConfig.whitelistedForActionPost =
        whitelistedForActionPost.value
    }
    if (typeof(whitelistedForActionReply.value) === "string") {
      newAppConfig.whitelistedForActionReply =
        splitIntoArray(whitelistedForActionReply.value)
    } else if (Array.isArray(whitelistedForActionReply.value)) {
      newAppConfig.whitelistedForActionReply =
        whitelistedForActionReply.value
    }
    if (typeof(whitelistedForActionReact.value) === "string") {
      newAppConfig.whitelistedForActionReact =
        splitIntoArray(whitelistedForActionReact.value)
    } else if (Array.isArray(whitelistedForActionReact.value)) {
      newAppConfig.whitelistedForActionReact =
        whitelistedForActionReact.value
    }
    if (typeof(pinnedIds.value) === "string") {
      newAppConfig.pinnedIds =
        splitIntoArray(pinnedIds.value)
    } else if (Array.isArray(pinnedIds.value)) {
      newAppConfig.pinnedIds =
        pinnedIds.value
    }
    if (typeof(envCategories.value) === "string") {
      newAppConfig.envCategories =
        splitIntoArray(envCategories.value)
    } else if (Array.isArray(envCategories.value)) {
      newAppConfig.envCategories =
        envCategories.value
    }

    // Strings
    // Strings-intro-home
    if (typeof(defaultHeaderImageLink.value) === "string") {
      newAppConfig.defaultHeaderImageLink = defaultHeaderImageLink.value
    }
    if (typeof(introTitle.value) === "string") {
      newAppConfig.introTitle = introTitle.value
    }
    if (typeof(introTitleExtra.value) === "string") {
      newAppConfig.introTitleExtra = introTitleExtra.value
    }
    if (typeof(introAbout.value) === "string") {
      newAppConfig.introAbout = introAbout.value
    }
    if (typeof(postPlaceholder.value) === "string") {
      newAppConfig.postPlaceholder = postPlaceholder.value
    }
    if (typeof(commentPlaceholder.value) === "string") {
      newAppConfig.commentPlaceholder = commentPlaceholder.value
    }
    if (typeof(defaultButtonPrimaryText.value) === "string") {
      newAppConfig.defaultButtonPrimaryText = defaultButtonPrimaryText.value
    }
    if (typeof(defaultButtonPrimaryLink.value) === "string") {
      newAppConfig.defaultButtonPrimaryLink = defaultButtonPrimaryLink.value
    }
    if (typeof(defaultButtonSecondaryText.value) === "string") {
      newAppConfig.defaultButtonSecondaryText = defaultButtonSecondaryText.value
    }
    if (typeof(defaultButtonSecondaryLink.value) === "string") {
      newAppConfig.defaultButtonSecondaryLink = defaultButtonSecondaryLink.value
    }
    // Strings-socials
    if (typeof(anotherWebsiteLink.value) === "string") {
      newAppConfig.anotherWebsiteLink = anotherWebsiteLink.value
    }
    if (typeof(ipfsLink.value) === "string") {
      newAppConfig.ipfsLink = ipfsLink.value
    }
    if (typeof(torLink.value) === "string") {
      newAppConfig.torLink = torLink.value
    }
    if (typeof(ipfsHttpGatewayLink.value) === "string") {
      newAppConfig.ipfsHttpGatewayLink = ipfsHttpGatewayLink.value
    }
    if (typeof(nostrLink.value) === "string") {
      newAppConfig.nostrLink = nostrLink.value
    }
    if (typeof(sessionLink.value) === "string") {
      newAppConfig.sessionLink = sessionLink.value
    }
    if (typeof(simplexLink.value) === "string") {
      newAppConfig.simplexLink = simplexLink.value
    }
    if (typeof(statusLink.value) === "string") {
      newAppConfig.statusLink = statusLink.value
    }
    if (typeof(lensLink.value) === "string") {
      newAppConfig.lensLink = lensLink.value
    }
    if (typeof(farcasterLink.value) === "string") {
      newAppConfig.farcasterLink = farcasterLink.value
    }
    if (typeof(blueskyLink.value) === "string") {
      newAppConfig.blueskyLink = blueskyLink.value
    }
    if (typeof(hiveLink.value) === "string") {
      newAppConfig.hiveLink = hiveLink.value
    }
    if (typeof(pushLink.value) === "string") {
      newAppConfig.pushLink = pushLink.value
    }
    if (typeof(mirrorLink.value) === "string") {
      newAppConfig.mirrorLink = mirrorLink.value
    }
    if (typeof(mastodonLink.value) === "string") {
      newAppConfig.mastodonLink = mastodonLink.value
    }
    if (typeof(matrixLink.value) === "string") {
      newAppConfig.matrixLink = matrixLink.value
    }
    if (typeof(discordLink.value) === "string") {
      newAppConfig.discordLink = discordLink.value
    }
    if (typeof(telegramLink.value) === "string") {
      newAppConfig.telegramLink = telegramLink.value
    }
    if (typeof(twitterLink.value) === "string") {
      newAppConfig.twitterLink = twitterLink.value
    }
    if (typeof(redditLink.value) === "string") {
      newAppConfig.redditLink = redditLink.value
    }
    if (typeof(youtubeLink.value) === "string") {
      newAppConfig.youtubeLink = youtubeLink.value
    }
    if (typeof(instagramLink.value) === "string") {
      newAppConfig.instagramLink = instagramLink.value
    }
    if (typeof(facebookLink.value) === "string") {
      newAppConfig.facebookLink = facebookLink.value
    }
    if (typeof(linkedinLink.value) === "string") {
      newAppConfig.linkedinLink = linkedinLink.value
    }
    if (typeof(wikipediaLink.value) === "string") {
      newAppConfig.wikipediaLink = wikipediaLink.value
    }
    if (typeof(githubLink.value) === "string") {
      newAppConfig.githubLink = githubLink.value
    }
    if (typeof(nostrNpub.value) === "string") {
      newAppConfig.nostrNpub = nostrNpub.value
    }
    if (typeof(sessionName.value) === "string") {
      newAppConfig.sessionName = sessionName.value
    }
    if (typeof(matrixName.value) === "string") {
      newAppConfig.matrixName = matrixName.value
    }
    if (typeof(lensName.value) === "string") {
      newAppConfig.lensName = lensName.value
    }
    if (typeof(farcasterName.value) === "string") {
      newAppConfig.farcasterName = farcasterName.value
    }
    if (typeof(blueskyName.value) === "string") {
      newAppConfig.blueskyName = blueskyName.value
    }
    if (typeof(hiveName.value) === "string") {
      newAppConfig.hiveName = hiveName.value
    }
    if (typeof(pushName.value) === "string") {
      newAppConfig.pushName = pushName.value
    }
    if (typeof(mirrorName.value) === "string") {
      newAppConfig.mirrorName = mirrorName.value
    }
    if (typeof(telegramName.value) === "string") {
      newAppConfig.telegramName = telegramName.value
    }
    if (typeof(twitterName.value) === "string") {
      newAppConfig.twitterName = twitterName.value
    }
    if (typeof(redditName.value) === "string") {
      newAppConfig.redditName = redditName.value
    }
    if (typeof(signalNumber.value) === "string") {
      newAppConfig.signalNumber = signalNumber.value
    }
    if (typeof(whatsappNumber.value) === "string") {
      newAppConfig.whatsappNumber = whatsappNumber.value
    }
    if (typeof(xmppName.value) === "string") {
      newAppConfig.xmppName = xmppName.value
    }
    if (typeof(uniswapLink.value) === "string") {
      newAppConfig.uniswapLink = uniswapLink.value
    }
    if (typeof(sushiswapLink.value) === "string") {
      newAppConfig.sushiswapLink = sushiswapLink.value
    }
    if (typeof(etherscanLink.value) === "string") {
      newAppConfig.etherscanLink = etherscanLink.value
    }
    if (typeof(ethvmLink.value) === "string") {
      newAppConfig.ethvmLink = ethvmLink.value
    }
    if (typeof(coingeckoLink.value) === "string") {
      newAppConfig.coingeckoLink = coingeckoLink.value
    }
    if (typeof(coinmarketcapLink.value) === "string") {
      newAppConfig.coinmarketcapLink = coinmarketcapLink.value
    }
    if (typeof(dextoolsLink.value) === "string") {
      newAppConfig.dextoolsLink = dextoolsLink.value
    }
    if (typeof(dexscreenerLink.value) === "string") {
      newAppConfig.dexscreenerLink = dexscreenerLink.value
    }
    if (typeof(birdeyeLink.value) === "string") {
      newAppConfig.birdeyeLink = birdeyeLink.value
    }
    if (typeof(geckoterminalLink.value) === "string") {
      newAppConfig.geckoterminalLink = geckoterminalLink.value
    }
    if (typeof(extraContactInfo.value) === "string") {
      newAppConfig.extraContactInfo = extraContactInfo.value
    }

    // Numbers
    if (typeof(shortUrlsLengthOfWeb3Ids.value) === "number") {
      newAppConfig.shortUrlsLengthOfWeb3Ids =
        shortUrlsLengthOfWeb3Ids.value
    } else if (Number(shortUrlsLengthOfWeb3Ids.value)) {
      newAppConfig.shortUrlsLengthOfWeb3Ids =
        Number(shortUrlsLengthOfWeb3Ids.value)
    }
    if (typeof(feedFiltersActivityHot.value) === "number") {
      newAppConfig.feedFiltersActivityHot =
        feedFiltersActivityHot.value
    } else if (Number(feedFiltersActivityHot.value)) {
      newAppConfig.feedFiltersActivityHot =
        Number(feedFiltersActivityHot.value)
    }
    if (typeof(feedFiltersActivityRising.value) === "number") {
      newAppConfig.feedFiltersActivityRising =
        feedFiltersActivityRising.value
    } else if (Number(feedFiltersActivityRising.value)) {
      newAppConfig.feedFiltersActivityRising =
        Number(feedFiltersActivityRising.value)
    }

    if (!hasValue(newAppConfig)) { return }
    const text = JSON.stringify(newAppConfig)

    const response = await submitSingleSignedEventV2(
      'app-config-dr', text, '', ''
    )
    if (!response) {
      responseMessage.value = 'Something went wrong. Try again.'
      isResponseError.value = true
      return
    }
    const {res} = response
    if (res && typeof(res) === "string") {
      responseMessage.value = res
      if (res.toLowerCase().startsWith("error")) {
        isResponseError.value = true
        return
      } else if (res.toLowerCase().startsWith("success")) {
        await useAppConfigStore()?.fetchAndUpdateAppConfig()
        return
      }
    }

  } catch (error) {
    console.error('Error saving app config:', error)
    responseMessage.value = 'Something went wrong...'
    isResponseError.value = true
    return
  }
}
</script>
