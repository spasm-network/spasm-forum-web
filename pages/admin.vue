<template>
  <div class="overflow-auto overflow-wrap break-words">
    <div class="mt-4">
      <div class="my-4">
        <div>
          Connected address:
          <nuxt-link :to="`/authors/${connectedAddress}`"
            class="text-colorPrimary-light dark:text-colorPrimary-dark hover:underline">
            {{connectedAddress}}
          </nuxt-link>
          <ExtraAddressIcons
            v-if="connectedAddress"
            :key="connectedAddress"
            :value="connectedAddress"
            :showCopyToClipboard="true"
            :showQrCode="true"
            :showExternalWebsite="true"
          />
        </div>
        <div
          class="mb-6"
          v-if="connectedAddress &&
           typeof(connectedAddress) === 'string' &&
           isInList(connectedAddress, appConfig?.admins)"
        >
          <div>
            You're an admin on this instance.
          </div>
          <div class="mb-4">
            You can change settings and save them by signing an admin event with your private key.
          </div>
          <button
            @click="saveAppConfig()"
            class="inline px-6 lg:min-w-[200px] min-h-[40px] text-colorPrimary-light dark:text-colorPrimary-dark border-2 border-colorPrimary-light dark:border-colorPrimary-dark rounded-lg hover:bg-bgHover-light dark:hover:bg-bgHover-dark"
          >
            Save app config
          </button>
        </div>
        <div
          v-else-if="connectedAddress &&
           typeof(connectedAddress) === 'string' &&
           !isInList(connectedAddress, appConfig?.admins)"
        >
          <div>
            You're not an admin on this instance.
          </div>
          <div class="mb-4">
            You can play around with theme, favicons, etc., but only admins can save config.
          </div>
        </div>
        <div v-else>
          <div>
            Connect your extension with admin keys to save config changes.
          </div>
          <div>
            <div>
              There are many Ethereum and Nostr apps, here are a few examples:
            </div>
            <div>
              <div>
                <span class="text-colorNotImportant-light dark:colorNotImportant-dark">
                  Firefox:
                </span>
                <span>
                  nos2x-fox, MetaMask
                </span>
              </div>
              <div>
                <span class="text-colorNotImportant-light dark:colorNotImportant-dark">
                  Chrome/Brave:
                </span>
                <span>
                  Rabby, MetaMask, nos2x
                </span>
              </div>
              <div>
                <span class="text-colorNotImportant-light dark:colorNotImportant-dark">
                  Tor Browser:
                </span>
                <span>
                  nos2-fox
                </span>
              </div>
              <div>
                <span class="text-colorNotImportant-light dark:colorNotImportant-dark">
                  Desktop:
                </span>
                <span>
                  Status app
                </span>
              </div>
              <div>
                <span class="text-colorNotImportant-light dark:colorNotImportant-dark">
                  Mobile:
                </span>
                <span>
                  MetaMask
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          :class="[isResponseError ? 'text-colorRed-light dark:text-colorRed-dark' : 'text-colorGreen-light dark:text-colorGreen-dark']"
        >
          {{ responseMessage }}
        </div>
      </div>

      <!-- Theme -->
      <div>
        <span class="text-2xl text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark cursor-pointer" @click="toggleTheme">
        Theme
        <IconsTriangle :rotateIf="showTheme" />
        </span>
      </div>

      <div v-if="showTheme" class="pl-4 pt-4 custom-admin-web-panel-section">
        <!-- Favicons -->
        <div class="mt-0 mb-4">
          <!-- Favicons dropdown toggle button -->
          <div class="mt-2">
            <span
              @click="toggleFaviconDropDown()"
              class="cursor-pointer"
            >
              Favicon: 
              <span class="font-bold text-colorPrimary-light dark:text-colorPrimary-dark">
                {{ faviconTheme }}
              </span>
              <IconsTriangle :rotateIf="faviconDropDownShown" />
            </span>
          </div>

          <!-- Favicons dropdown menu -->
          <div
            v-show="faviconDropDownShown"
            class="ml-16 pl-1 py-1 bg-bgSecondary-light dark:bg-bgSecondary-dark rounded-md shadow-md w-28"
          >
            <span v-if="favicons">
              <span v-if="favicons[0]">
                <ExtraFaviconsMenuItem
                  v-for="favicon in favicons"
                  :key="favicon"
                  :favicon="favicon"
                  @click="selectFavicon(favicon)"
                />
              </span>
            </span>
          </div>

          <div v-if="faviconTheme === 'custom-link'" class="ml-5">
            Favicon custom-link:
            <input v-model="faviconLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials">
            <div class="text-colorNotImportant-light text-colorNotImportant-dark">
              (Save and refresh the page to see new custom favicon)
            </div>
          </div>
        </div>

        <div>
          <!-- Themes dropdown toggle button -->
          <div class="mt-3 mb-0">
            <span class="mr-2">Colors:</span>
            <span
              @click="toggleThemeDropDown()"
              class="text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer"
            >
              <span class="font-bold text-colorPrimary-light dark:text-colorPrimary-dark">
                {{ theme }}
              </span>
              <IconsTriangle :rotateIf="themeDropDownShown" />
            </span>
          </div>

          <!-- Themes dropdown menu -->
          <div
            v-show="themeDropDownShown"
            class="ml-16 pl-1 py-1 bg-bgSecondary-light dark:bg-bgSecondary-dark rounded-md shadow-md w-28"
          >
            <span v-if="themes">
              <span v-if="themes[0]" class="">
                <div
                  v-for="theme in themes"
                  class="py-1 font-bold text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark cursor-pointer"
                  @click="selectTheme(theme)"
                >
                  {{ theme }}
                </div>
              </span>
            </span>
          </div>

          <div class="mt-2 mb-2">
            <span class="ml-0 text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" @click="resetColorsToSavedTheme" >
              <IconsReset class="custom-icons" />
              Reset theme
            </span>
          </div>
        </div>


        <div>
          <span class="hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark cursor-pointer" @click="toggleAdvancedColors">
          Advanced colors
          <IconsTriangle :rotateIf="showAdvancedColors" />
          </span>
        </div>

        <div v-if="showAdvancedColors" class="pl-4">
          <div class="mt-2 ml-5">
            <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
              For each color you can specify values for dark and light themes
            </div>
            <div class="mt-2 mb-2">
              <span class="ml-0 text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" @click="setColorsToNull" >
                <IconsReset class="custom-icons" />
                Click to delete all custom colors
                <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
                  (don't forget to save config)
                </span>
              </span>
            </div>
            <!-- Primary Colors -->
            <div>Primary color (light): <input v-model="colorPrimaryLight" type="color" placeholder="enter value (e.g., #f420af)" class="custom-color-picker"> {{colorPrimaryLight}}</div>
            <div>Primary color (dark): <input v-model="colorPrimaryDark" type="color" placeholder="enter value (e.g., #f420af)" class="custom-color-picker"> {{colorPrimaryDark}}</div>

            <!-- Base Colors -->
            <div>Base color (light): <input v-model="colorBaseLight" type="color" class="custom-color-picker"> {{colorBaseLight}}</div>
            <div>Base color (dark): <input v-model="colorBaseDark" type="color" class="custom-color-picker"> {{colorBaseDark}}</div>

            <!-- Secondary Colors -->
            <div>Secondary color (light): <input v-model="colorSecondaryLight" type="color" class="custom-color-picker"> {{colorSecondaryLight}}</div>
            <div>Secondary color (dark): <input v-model="colorSecondaryDark" type="color" class="custom-color-picker"> {{colorSecondaryDark}}</div>

            <!-- Hover Colors -->
            <div>Hover color (light): <input v-model="colorHoverLight" type="color" class="custom-color-picker"> {{colorHoverLight}}</div>
            <div>Hover color (dark): <input v-model="colorHoverDark" type="color" class="custom-color-picker"> {{colorHoverDark}}</div>

            <!-- Not Important Colors -->
            <div>Not important color (light): <input v-model="colorNotImportantLight" type="color" class="custom-color-picker"> {{colorNotImportantLight}}</div>
            <div>Not important color (dark): <input v-model="colorNotImportantDark" type="color" class="custom-color-picker"> {{colorNotImportantDark}}</div>

            <!-- Green Colors -->
            <div>Green color (light): <input v-model="colorGreenLight" type="color" class="custom-color-picker"> {{colorGreenLight}}</div>
            <div>Green color (dark): <input v-model="colorGreenDark" type="color" class="custom-color-picker">{{colorGreenDark}}</div>

            <!-- Red Colors -->
            <div>Red color (light): <input v-model="colorRedLight" type="color" class="custom-color-picker"> {{colorRedLight}}</div>
            <div>Red color (dark): <input v-model="colorRedDark" type="color" class="custom-color-picker"> {{colorRedDark}}</div>

            <!-- Orange Colors -->
            <div>Orange color (light): <input v-model="colorOrangeLight" type="color" class="custom-color-picker"> {{colorOrangeLight}}</div>
            <div>Orange color (dark): <input v-model="colorOrangeDark" type="color" class="custom-color-picker"> {{colorOrangeDark}}</div>

            <!-- Blue Colors -->
            <div>Blue color (light): <input v-model="colorBlueLight" type="color" class="custom-color-picker"> {{colorBlueLight}}</div>
            <div>Blue color (dark): <input v-model="colorBlueDark" type="color" class="custom-color-picker"> {{colorBlueDark}}</div>

            <!-- Background Colors -->
            <div>Background Base (light): <input v-model="bgBaseLight" type="color" class="custom-color-picker"> {{bgBaseLight}}</div>
            <div>Background Base (dark): <input v-model="bgBaseDark" type="color" class="custom-color-picker"> {{bgBaseDark}}</div>

            <div>Background Secondary (light): <input v-model="bgSecondaryLight" type="color" class="custom-color-picker"> {{bgSecondaryLight}}</div>
            <div>Background Secondary (dark): <input v-model="bgSecondaryDark" type="color" class="custom-color-picker"> {{bgSecondaryDark}}</div>

            <div>Background Hover (light): <input v-model="bgHoverLight" type="color" class="custom-color-picker"> {{bgHoverLight}}</div>
            <div>Background Hover (dark): <input v-model="bgHoverDark" type="color" class="custom-color-picker"> {{bgHoverDark}}</div>

            <div>Background Dark (light): <input v-model="bgDarkLight" type="color" class="custom-color-picker"> {{bgDarkLight}}</div>
            <div>Background Dark (dark): <input v-model="bgDarkDark" type="color" class="custom-color-picker"> {{bgDarkDark}}</div>

            <!-- Border Colors -->
            <div>Border color (light): <input v-model="borderColorLight" type="color" class="custom-color-picker"> {{borderColorLight}}</div>
            <div>Border color (dark): <input v-model="borderColorDark" type="color" class="custom-color-picker"> {{borderColorDark}}</div>

            <div class="mt-2 mb-2">
              <span class="ml-0 text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" @click="resetColorsToSavedTheme" >
                <IconsReset class="custom-icons" />
                Reset colors
              </span>
            </div>
          </div>
        </div>


        <div class="mt-2 mb-6">
          <span class="ml-0 text-xl text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" @click="toggleTheme" >
          hide section
          <IconsTriangle :rotateIf="showTheme" />
          </span>
        </div>
      </div>


      <!-- Home page -->
      <div>
        <span class="text-2xl text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" @click="toggleHomePage" >
        Home page
        <IconsTriangle :rotateIf="showHomePage" />
        </span>
      </div>

      <div v-if="showHomePage" class="pl-4 custom-admin-web-panel-section">
        <div class="pl-0 mt-2">
          <div class="pl-0 mt-2">
            <input v-model="enableDefaultHeaderImage" type="checkbox" >
            Enable header image
          </div>
          <div v-if="enableDefaultHeaderImage">
            <div class="ml-5">
              Header image link:
              <input v-model="defaultHeaderImageLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials">
            </div>
            <div class="ml-5 text-colorNotImportant-light text-colorNotImportant-dark">
              Option 1: add full URL to image file (.jpeg, .jpg, .png, .webp, .svg) <br>
              Option 2: leave URL field blank and upload your jpeg image to <code>frontend/public/header.jpeg</code> (only jpeg supported, docker/podman deployment not supported).
            </div>
          </div>
        </div>
        <div class="pl-0 mt-4">
          <input v-model="enableDefaultIntro" type="checkbox" >
          Enable intro section: title, extra, about
          <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
            (also used for meta)
          </span>
          <div v-if="enableDefaultIntro" class="ml-5">
            <div>
              Intro title
              <input v-model="introTitle" type="text" placeholder="enter intro title (e.g., Spasm)" class="custom-admin-input-socials">
            </div>
            <div>
              Intro title extra
              <input v-model="introTitleExtra" type="text" placeholder="enter intro title extra (e.g., forum)" class="custom-admin-input-socials">
            </div>
            <div>
              Intro about
              <input v-model="introAbout" type="text" placeholder="enter intro about (e.g., Unplug from slave tech!)" class="custom-admin-input-socials">
            </div>
          </div>
        </div>
        <div class="pl-0 mt-4">
          <input v-model="enableDefaultContacts" type="checkbox" >
          Enable contacts
          <div v-if="enableDefaultContacts" class="ml-5 pl-0">
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
            Enable button primary
          </div>
          <div v-if="enableDefaultButtonPrimary">
            <div class="ml-5">Primary button link: <input v-model="defaultButtonPrimaryLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
            <div class="ml-5">Primary button text: <input v-model="defaultButtonPrimaryText" type="text" placeholder="enter button text (e.g., Get started)" class="custom-admin-input-socials"></div>
          </div>
          <div class="mt-2 pl-0">
            <input v-model="enableDefaultButtonSecondary" type="checkbox" >
            Enable button secondary
          </div>
          <div v-if="enableDefaultButtonSecondary">
            <div class="ml-5">Secondary button link: <input v-model="defaultButtonSecondaryLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
            <div class="ml-5">Secondary button text: <input v-model="defaultButtonSecondaryText" type="text" placeholder="enter button text (e.g., Read docs)" class="custom-admin-input-socials"></div>
          </div>
        </div>
        <div class="mt-2 pl-0">
          <input v-model="ifShowIntroTutorial" type="checkbox" >
          Show intro tutorial
          <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
            (tutorial like "connect your wallet, read what you sign, etc.")
          </span>
        </div>
        <div class="mt-2 pl-0">
          <input v-model="ifShowHomeLatestComments" type="checkbox" >
          Show latest comments
        </div>
        <h5 class="mt-4">Custom pages</h5>
        <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
          (not supported via docker/podman deployment)
        </span>
        <div class="ml-5">
          <div class="pl-0">
            <input v-model="enableCustomIntro" type="checkbox" >
            Enable custom intro page
          </div>
          <div class="pl-0">
            <input v-model="enableCustomContacts" type="checkbox" >
            Enable custom contacts page
          </div>
        </div>

        <div class="mt-2 mb-6">
          <span class="ml-4 text-xl text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" @click="toggleHomePage" >
          hide section
          <IconsTriangle :rotateIf="showHomePage" />
          </span>
        </div>
      </div>


      <!-- Social media links -->
      <div>
        <span class="text-2xl text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark cursor-pointer" @click="toggleSocialMediaLinks">
        Social media links
        <IconsTriangle :rotateIf="showSocialMediaLinks" />
        </span>
      </div>

      <div v-if="showSocialMediaLinks" class="pl-4 pt-4 custom-admin-web-panel-section">
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
        <div>Git: <input v-model="gitLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Forgejo: <input v-model="forgejoLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Gitea: <input v-model="giteaLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Radicle: <input v-model="radicleLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>GitLab: <input v-model="gitlabLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Codeberg: <input v-model="codebergLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>Bitbucket: <input v-model="bitbucketLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
        <div>GitHub: <input v-model="githubLink" type="text" placeholder="enter full link with https://" class="custom-admin-input-socials"></div>
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

      <div v-if="showSocialMediaNames" class="pl-4 pt-4 custom-admin-web-panel-section">
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

      <div v-if="showBlockchainLinks" class="pl-4 pt-4 custom-admin-web-panel-section">
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

      <div v-if="showFeedSettings" class="pl-5 custom-admin-web-panel-section">
        <h5 class="mt-2">Feed activity filters</h5>
        <div class="ml-5">
          <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
            Hot/rising activity filter is based on reaction volume (upvote, downvote, etc.).
          </div>
          <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
            Consider increasing thresholds if your instance has many users eligible to submit reactions.
          </div>
          <div>The amount of reactions for "Hot" filter: <input v-model="feedFiltersActivityHot" type="number" placeholder="choose a number" class="custom-admin-input-socials-tiny"></div>
          <div>The amount of reactions for "Rising" filter: <input v-model="feedFiltersActivityRising" type="number" placeholder="choose a number" class="custom-admin-input-socials-tiny"></div>
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
            class="block p-1 bg-bgBase-light dark:bg-bgBase-dark border-bgSecondary-light dark:border-bgSecondary-dark w-[90%] max-w-[700px] h-24 lg:h-24 focus:outline-none rounded-b-lg border-2"
          />
        </div>

        <div class="mt-2 mb-6">
          <span class="ml-4 text-xl text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" @click="toggleFeedSettings" >
          hide section
          <IconsTriangle :rotateIf="showFeedSettings" />
          </span>
        </div>
      </div>


      <!-- OTHER -->
      <div>
        <span class="text-2xl text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark cursor-pointer" @click="toggleOther">
        Other
        <IconsTriangle :rotateIf="showOther" />
        </span>
      </div>

      <div v-if="showOther" class="pt-4 pl-5 custom-admin-web-panel-section">
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


      <!-- NEW CONTENT -->
      <div>
        <span class="text-2xl text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark cursor-pointer" @click="toggleNewContent">
        New Content
        <IconsTriangle :rotateIf="showNewContent" />
        </span>
      </div>

      <div v-if="showNewContent" class="custom-admin-web-panel-section">
        <div class="hidden mt-2 pl-4">
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
            <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
              (uses browser-generated temporary Ethereum keys)
            </span>
          </div>
        </div>
        <div class="mt-4 pl-4">
          Enable private keys:
          <div class="ml-5">
            <div>
              <input
                v-model="enableNewEthereumActionsAll"
                type="checkbox"
              >
              Ethereum
            </div>
            <div>
              <input
                v-model="enableNewNostrActionsAll"
                type="checkbox"
              >
              Nostr
            </div>
          </div>
        </div>
        <div class="mt-4 pl-4">
          Enable new actions:
          <div class="ml-5">
            <div>
              <input
                v-model="enableNewWeb3ActionsAll"
                type="checkbox"
              >
              all
              <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
                (you still need to enable all actions individually)
              </span>
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
              <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
                (comments)
              </span>
            </div>
            <div>
              <input
                v-model="enableNewWeb3ActionsReact"
                type="checkbox"
              >
              react
              <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
                (upvote, downvote, etc.)
              </span>
            </div>
            <div>
              <input
                v-model="enableNewWeb3ActionsOther"
                type="checkbox"
              >
              other
              <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
                (any non-standard event)
              </span>
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
              <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
                (comments)
              </span>
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
              <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
                (upvote, downvote, etc.)
              </span>
              ({{ count(whitelistedForActionReact) }})
              <textarea
                v-model="whitelistedForActionReact"
                placeholder="0x123456789,npub123456789"
                class="block p-1 bg-bgBase-light dark:bg-bgBase-dark border-bgSecondary-light dark:border-bgSecondary-dark w-[90%] max-w-[700px] h-60 lg:h-36 focus:outline-none rounded-b-lg border-2"
              />
            </div>
            <div class="mt-4">
              <input
                v-model="enableWhitelistForActionOther"
                type="checkbox"
              >
              enable whitelist for new other actions
              <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
                (any non-standard event)
              </span>
              ({{ count(whitelistedForActionOther) }})
              <textarea
                v-model="whitelistedForActionOther"
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


      <!-- MEDIA CONTENT -->
      <div>
        <span class="text-2xl text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark cursor-pointer" @click="toggleMediaContent">
        Media content
        <IconsTriangle :rotateIf="showMediaContent" />
        </span>
      </div>

      <div v-if="showMediaContent" class="custom-admin-web-panel-section">
        <div class="mt-2 pl-4">
          <div class="mt-2 pl-0">

            <!-- Markdown -->
            <div class="mt-2 pl-0">
              <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
                Markdown must be allowed to auto-embed images, videos, and audios
              </span>
              <div class="mt-2 pl-0">
                <input
                  v-model="enableMarkdownInPosts"
                  type="checkbox"
                >
                allow markdown in posts
              </div>
              <div class="mt-2 pl-0">
                <input
                  v-model="enableMarkdownInComments"
                  type="checkbox"
                >
                allow markdown in comments
              </div>
            </div>

            <!-- Images -->
            <div v-if="enableMarkdownInPosts || enableMarkdownInComments" class="mt-2 pl-5">
              <div class="mt-2 pl-0">
                <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
                  Images
                </span>
                <div class="mt-2 pl-0">
                  <input
                    v-model="enableEmbedImageTagsForAllUsers"
                    type="checkbox"
                  >
                  auto-embed images
                </div>
                <div v-if="enableEmbedImageTagsForAllUsers" class="mt-0 pl-5">
                  <div class="mt-2 pl-0">
                    <input
                      v-model="enableEmbedImageTagsInPosts"
                      type="checkbox"
                    >
                    in posts
                  </div>
                  <div class="mt-2 pl-0">
                    <input
                      v-model="enableEmbedImageTagsInComments"
                      type="checkbox"
                    >
                    in comments
                  </div>
                  <div class="mt-2 pl-0">
                    <input
                      v-model="enableEmbedImageTagsForFullLineImageLinks"
                      type="checkbox"
                    >
                    full-line links
                  </div>
                </div>
              </div>

              <!-- Videos -->
              <div class="mt-2 pl-0">
                <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
                  Videos
                </span>
                <div class="mt-2 pl-0">
                  <input
                    v-model="enableEmbedVideoTagsForAllUsers"
                    type="checkbox"
                  >
                  auto-embed videos
                </div>
                <div v-if="enableEmbedVideoTagsForAllUsers" class="mt-2 pl-5">
                  <div class="mt-2 pl-0">
                    <input
                      v-model="enableEmbedVideoTagsInPosts"
                      type="checkbox"
                    >
                    in posts
                  </div>
                  <div class="mt-2 pl-0">
                    <input
                      v-model="enableEmbedVideoTagsInComments"
                      type="checkbox"
                    >
                    in comments
                  </div>
                  <div class="mt-2 pl-0">
                    <input
                      v-model="enableEmbedVideoTagsForFullLineVideoLinks"
                      type="checkbox"
                    >
                    full-line links
                  </div>
                </div>
              </div>

              <!-- Audios -->
              <div class="mt-2 pl-0">
                <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
                  Audios
                </span>
                <div class="mt-2 pl-0">
                  <input
                    v-model="enableEmbedAudioTagsForAllUsers"
                    type="checkbox"
                  >
                  auto-embed audios
                </div>
                <div v-if="enableEmbedAudioTagsForAllUsers" class="mt-2 pl-5">
                  <div class="mt-2 pl-0">
                    <input
                      v-model="enableEmbedAudioTagsInPosts"
                      type="checkbox"
                    >
                    in posts
                  </div>
                  <div class="mt-2 pl-0">
                    <input
                      v-model="enableEmbedAudioTagsInComments"
                      type="checkbox"
                    >
                    in comments
                  </div>
                  <div class="mt-2 pl-0">
                    <input
                      v-model="enableEmbedAudioTagsForFullLineAudioLinks"
                      type="checkbox"
                    >
                    full-line links
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-2 mb-6">
          <span class="ml-4 text-xl text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" @click="toggleMediaContent" >
          hide section
          <IconsTriangle :rotateIf="showMediaContent" />
          </span>
        </div>
      </div>


      <!-- RSS FEED CHANNEL -->
      <div>
        <span class="text-2xl text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark cursor-pointer" @click="toggleRssFeedChannel">
        RSS Channel
        <IconsTriangle :rotateIf="showRssFeedChannel" />
        </span>
      </div>

      <div v-if="showRssFeedChannel" class="custom-admin-web-panel-section">
        <div class="mt-2 pl-4">
          <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
            Configure your RSS channel so users can follow your instance with legacy tech
          </span>
          <div class="mt-2 pl-0">
            <input
              v-model="enableRssFeedChannel"
              type="checkbox"
            >
            enable RSS channel

            <div v-if="enableRssFeedChannel" class="pl-4 mt-2">
              <div>
                channel title:
                <input v-model="rssFeedChannelTitle" type="text" placeholder="Spasm forum" class="custom-admin-input-socials">
              </div>
              <div>
                forum link:
                <input v-model="rssFeedChannelLink" type="text" placeholder="https://forum.spasm.network" class="custom-admin-input-socials">
              </div>
              <div>
                description:
                <input v-model="rssFeedChannelDescription" type="text" placeholder="Unplug from slave tech!" class="custom-admin-input-socials">
              </div>
              <div>
                image link:
                <input v-model="rssFeedChannelImageLink" type="text" placeholder="https://spasm.network/image.jpeg" class="custom-admin-input-socials">
              </div>
            </div>
          </div>
        </div>

        <div class="mt-2 mb-6">
          <span class="ml-4 text-xl text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" @click="toggleRssFeedChannel" >
          hide section
          <IconsTriangle :rotateIf="showRssFeedChannel" />
          </span>
        </div>
      </div>


      <!-- FEDERATION -->
      <div>
        <span class="text-2xl text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark cursor-pointer" @click="toggleFederation">
        Federation
        <IconsTriangle :rotateIf="showFederation" />
        </span>
      </div>

      <div v-if="showFederation" class="custom-admin-web-panel-section">
        <div class="mt-2 pl-4">
          <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
            You can enable federation to automatically fetch events (posts, comments) from other instances.
          </span>
          <div class="mt-2 pl-0">
            <input
              v-model="enableSpasmModule"
              type="checkbox"
            >
            enable federation

            <div v-if="enableSpasmModule" class="pl-4 mt-2">
              <input
                v-model="enableFederationDefaultLists"
                type="checkbox"
              >
              enable default federation lists:

              <div v-if="enableFederationDefaultLists" class="pl-4 mt-2">
                <input
                  v-model="enableFederationDefaultListOfficial"
                  type="checkbox"
                >
                spasm
              </div>
              <div v-if="enableFederationDefaultLists" class="pl-4 mt-2">
                <input
                  v-model="enableFederationDefaultListCrypto"
                  type="checkbox"
                >
                crypto
              </div>
              <div v-if="enableFederationDefaultLists" class="pl-4 mt-2">
                <input
                  v-model="enableFederationDefaultListPrivacy"
                  type="checkbox"
                >
                privacy
              </div>
              <div v-if="enableFederationDefaultLists" class="pl-4 mt-2">
                <input
                  v-model="enableFederationDefaultListTech"
                  type="checkbox"
                >
                tech
              </div>
              <div v-if="enableFederationDefaultLists" class="pl-4 mt-2">
                <input
                  v-model="enableFederationDefaultListPolitics"
                  type="checkbox"
                >
                politics
              </div>

            </div>
          </div>
        </div>

        <div class="mt-2 mb-6">
          <span class="ml-4 text-xl text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" @click="toggleFederation" >
          hide section
          <IconsTriangle :rotateIf="showFederation" />
          </span>
        </div>
      </div>


      <!-- RESPONSE -->
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
import {
  useNotificationStore
} from '@/stores/useNotificationStore'

// Importing favicon paths to simply update the browser favicon
// for a user to see the change. However, these favicons are
// not actually saved in the appConfig event.
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

const appConfig = useAppConfigStore()?.getAppConfig
const notificationStore = useNotificationStore()
const { isInList } = useNostr()

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
const showTheme = ref<boolean>(false)
const showAdvancedColors = ref<boolean>(false)
const showSocialMediaLinks = ref<boolean>(false)
const showSocialMediaNames = ref<boolean>(false)
const showBlockchainLinks = ref<boolean>(false)
const showFeedSettings = ref<boolean>(false)
const showOther = ref<boolean>(false)
const showNewContent = ref<boolean>(false)
const showMediaContent = ref<boolean>(false)
const showRssFeedChannel = ref<boolean>(false)
const showFederation = ref<boolean>(false)
const toggleHomePage = () => {
  showHomePage.value = !showHomePage.value
}
const toggleTheme = () => {
  showTheme.value = !showTheme.value
}
const toggleAdvancedColors = () => {
  showAdvancedColors.value = !showAdvancedColors.value
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
const toggleMediaContent = () => {
  showMediaContent.value = !showMediaContent.value
}
const toggleRssFeedChannel = () => {
  showRssFeedChannel.value = !showRssFeedChannel.value
}
const toggleFederation = () => {
  showFederation.value = !showFederation.value
}

const favicons = [
  "custom-link",
  "spasm", "monero", "zcash", "ethereum", "bitcoin", "solana",
  "campfire", "chat", "cube", "research", "rocket", "roger",
  "default",
]

const faviconDropDownShown = ref(false)
const toggleFaviconDropDown = () => {
  faviconDropDownShown.value = !faviconDropDownShown.value
}

const selectFavicon = (newFavicon: string): void => {
  faviconTheme.value = newFavicon.toLowerCase()
  toggleFaviconDropDown()

  type FaviconKey =
    | "spasm" | "monero" | "zcash"
    | "ethereum" | "bitcoin" | "solana"
    | "custom-link" | "default"
    | "campfire" | "chat" | "cube"
    | "research" | "rocket" | "roger"
  const faviconMap: Record<FaviconKey, string> = {
    spasm: faviconSpasm,
    monero: faviconMonero,
    zcash: faviconZcash,
    ethereum: faviconEthereum,
    bitcoin: faviconBitcoin,
    solana: faviconSolana,
    "custom-link": faviconLink,
    campfire: faviconCampfire,
    chat: faviconChat,
    cube: faviconCube,
    research: faviconResearch,
    rocket: faviconRocket,
    roger: faviconRoger,
    default: "/favicon.ico"
  }

  function isFaviconKey(s: string): s is FaviconKey {
    return [
      "spasm","monero","zcash","ethereum","bitcoin","solana",
      "custom-link","default","campfire","chat","cube",
      "research","rocket","roger"
    ].includes(s)
  }

  if (isFaviconKey(newFavicon)) {
    const path = faviconMap[newFavicon]
    updateFaviconInBrowserTab(path)
  } else {
    updateFaviconInBrowserTab(faviconMap.default)
  }
}

const ensureHtmlLink = (
  selector: string, createAttrs: Partial<HTMLLinkElement>
) => {
  let link = document.head.querySelector(selector) as HTMLLinkElement | null
  if (!link) {
    link = document.createElement('link')
    Object.assign(link, createAttrs)
    document.head.appendChild(link)
  }
  return link
}

const updateFaviconInBrowserTab = (
  faviconValue?: string
) => {
  if (!faviconValue || typeof(faviconValue) !== "string") return
  const href = faviconValue

  const icon = ensureHtmlLink("link[rel='icon']", { rel: 'icon', type: 'image/x-icon' })
  icon.type = 'image/x-icon'
  icon.href = href

  const shortcut = ensureHtmlLink("link[rel='shortcut icon']", { rel: 'shortcut icon' })
  shortcut.href = href

  const apple = ensureHtmlLink("link[rel='apple-touch-icon'][sizes='512x512']", {
    rel: 'apple-touch-icon',
    sizes: '512x512',
  })
  apple.href = href
}

const themes = ["Spasm", "DarkVegas", "Neon", "Greeny", "Custom"]
const theme = ref<string>("Custom")
const themeDropDownShown = ref(false)
const toggleThemeDropDown = () => {
  themeDropDownShown.value = !themeDropDownShown.value
}

const selectTheme = (newTheme: string): void => {
  theme.value = newTheme
  toggleThemeDropDown()
  if (newTheme === "Spasm") {
    setThemeSpasm()
  }
  if (newTheme === "DarkVegas") {
    setThemeDarkVegas()
  }
  if (newTheme === "Neon") {
    setThemeNeon()
  }
  if (newTheme === "Greeny") {
    setThemeGreeny()
  }
  if (newTheme === "Custom") {
    resetColorsToSavedTheme()
  }
}

// Theme
// Colors
const resetColorsToSavedTheme = () => {
  colorPrimaryLight.value = savedTheme.colorPrimaryLight
  colorPrimaryDark.value = savedTheme.colorPrimaryDark
  colorBaseLight.value = savedTheme.colorBaseLight
  colorBaseDark.value = savedTheme.colorBaseDark
  colorSecondaryLight.value = savedTheme.colorSecondaryLight
  colorSecondaryDark.value = savedTheme.colorSecondaryDark
  colorHoverLight.value = savedTheme.colorHoverLight
  colorHoverDark.value = savedTheme.colorHoverDark
  colorNotImportantLight.value = savedTheme.colorNotImportantLight
  colorNotImportantDark.value = savedTheme.colorNotImportantDark
  colorGreenLight.value = savedTheme.colorGreenLight
  colorGreenDark.value = savedTheme.colorGreenDark
  colorRedLight.value = savedTheme.colorRedLight
  colorRedDark.value = savedTheme.colorRedDark
  colorOrangeLight.value = savedTheme.colorOrangeLight
  colorOrangeDark.value = savedTheme.colorOrangeDark
  colorBlueLight.value = savedTheme.colorBlueLight
  colorBlueDark.value = savedTheme.colorBlueDark
  bgBaseLight.value = savedTheme.bgBaseLight
  bgBaseDark.value = savedTheme.bgBaseDark
  bgSecondaryLight.value = savedTheme.bgSecondaryLight
  bgSecondaryDark.value = savedTheme.bgSecondaryDark
  bgHoverLight.value = savedTheme.bgHoverLight
  bgHoverDark.value = savedTheme.bgHoverDark
  bgDarkLight.value = savedTheme.bgDarkLight
  bgDarkDark.value = savedTheme.bgDarkDark
  borderColorLight.value = savedTheme.borderColorLight
  borderColorDark.value = savedTheme.borderColorDark
  theme.value = "Custom"
}

const setColorsToNull = () => {
  colorPrimaryLight.value = null
  colorPrimaryDark.value = null
  colorBaseLight.value = null
  colorBaseDark.value = null
  colorSecondaryLight.value = null
  colorSecondaryDark.value = null
  colorHoverLight.value = null
  colorHoverDark.value = null
  colorNotImportantLight.value = null
  colorNotImportantDark.value = null
  colorGreenLight.value = null
  colorGreenDark.value = null
  colorRedLight.value = null
  colorRedDark.value = null
  colorOrangeLight.value = null
  colorOrangeDark.value = null
  colorBlueLight.value = null
  colorBlueDark.value = null
  bgBaseLight.value = null
  bgBaseDark.value = null
  bgSecondaryLight.value = null
  bgSecondaryDark.value = null
  bgHoverLight.value = null
  bgHoverDark.value = null
  bgDarkLight.value = null
  bgDarkDark.value = null
  borderColorLight.value = null
  borderColorDark.value = null
}

const setColorsToDefault = () => {
  colorPrimaryLight.value = '#f420af'
  colorPrimaryDark.value = '#f420af'
  colorBaseLight.value = '#000000'
  colorBaseDark.value = '#d8d8d8'
  colorSecondaryLight.value = '#000000'
  colorSecondaryDark.value = '#ffffff'
  colorHoverLight.value = '#243746'
  colorHoverDark.value = '#cbd4d1'
  colorNotImportantLight.value = '#9b8bc6'
  colorNotImportantDark.value = '#706297'
  colorGreenLight.value = '#089703'
  colorGreenDark.value = '#0ad203'
  colorRedLight.value = '#ff0a0a'
  colorRedDark.value = '#ff0a0a'
  colorOrangeLight.value = '#f4af0c'
  colorOrangeDark.value = '#f4af0c'
  colorBlueLight.value = '#3a3dff'
  colorBlueDark.value = '#3a3dff'
  bgBaseLight.value = '#fafafa'
  bgBaseDark.value = '#0F0F0F'
  bgSecondaryLight.value = '#f0f0f0'
  bgSecondaryDark.value = '#181818'
  bgHoverLight.value = '#e3e3e3'
  bgHoverDark.value = '#1f1f1f'
  bgDarkLight.value = '#bbbbbb'
  bgDarkDark.value = '#000000'
  borderColorLight.value = '#dddddd'
  borderColorDark.value = '#312d3e'
}

const setThemeSpasm = () => {
  setColorsToDefault()
  colorPrimaryLight.value = "#f420af"
  colorPrimaryDark.value = "#f420af"
}

const setThemeDarkVegas = () => {
  setColorsToDefault()
  colorPrimaryLight.value = "#ff0000"
  colorPrimaryDark.value = "#ff0000"
  bgBaseLight.value = "#f6f5f4"
  bgBaseDark.value = "#000000"
  bgSecondaryLight.value = "#eeeeee"
  bgSecondaryDark.value = "#080808"
}


const setThemeNeon = () => {
  setColorsToDefault()
  colorPrimaryLight.value = "#f420af"
  colorPrimaryDark.value = "#f420af"
  colorBaseLight.value = "#613583"
  colorBaseDark.value = "#f5c211"
  colorNotImportantLight.value = "#1a5fb4"
  colorNotImportantDark.value = "#1a5fb4"
  bgBaseLight.value = "#f6f5f4"
  bgBaseDark.value = "#000000"
  bgSecondaryLight.value = "#eeeeee"
  bgSecondaryDark.value = "#080808"
}

const setThemeGreeny = () => {
  setColorsToDefault()
  colorPrimaryLight.value = "#e5c46b"
  colorPrimaryDark.value = "#e5c46b"
  colorNotImportantLight.value = "#4fb848"
  colorNotImportantDark.value = "#4fb848"
  bgBaseDark.value = "#161616"
  bgSecondaryDark.value = "#1a1a1a"
}

const applyTheme = () => {
  const root = document.documentElement;
  root.style.setProperty('--color-primary-light', colorPrimaryLight.value || '#f420af')
  root.style.setProperty('--color-primary-dark', colorPrimaryDark.value || '#f420af')
  root.style.setProperty('--color-base-light', colorBaseLight.value || '#000000')
  root.style.setProperty('--color-base-dark', colorBaseDark.value || '#d8d8d8')
  root.style.setProperty('--color-secondary-light', colorSecondaryLight.value || '#000000')
  root.style.setProperty('--color-secondary-dark', colorSecondaryDark.value || '#ffffff')
  root.style.setProperty('--color-hover-light', colorHoverLight.value || '#243746')
  root.style.setProperty('--color-hover-dark', colorHoverDark.value || '#cbd4d1')
  root.style.setProperty('--color-not-important-light', colorNotImportantLight.value || '#9b8bc6')
  root.style.setProperty('--color-not-important-dark', colorNotImportantDark.value || '#706297')
  root.style.setProperty('--color-green-light', colorGreenLight.value || '#089703')
  root.style.setProperty('--color-green-dark', colorGreenDark.value || '#0ad203')
  root.style.setProperty('--color-red-light', colorRedLight.value || '#ff0a0a')
  root.style.setProperty('--color-red-dark', colorRedDark.value || '#ff0a0a')
  root.style.setProperty('--color-orange-light', colorOrangeLight.value || '#f4af0c')
  root.style.setProperty('--color-orange-dark', colorOrangeDark.value || '#f4af0c')
  root.style.setProperty('--color-blue-light', colorBlueLight.value || '#3a3dff')
  root.style.setProperty('--color-blue-dark', colorBlueDark.value || '#3a3dff')
  root.style.setProperty('--bg-base-light', bgBaseLight.value || '#fafafa')
  root.style.setProperty('--bg-base-dark', bgBaseDark.value || '#0F0F0F')
  root.style.setProperty('--bg-secondary-light', bgSecondaryLight.value || '#f0f0f0')
  root.style.setProperty('--bg-secondary-dark', bgSecondaryDark.value || '#181818')
  root.style.setProperty('--bg-hover-light', bgHoverLight.value || '#e3e3e3')
  root.style.setProperty('--bg-hover-dark', bgHoverDark.value || '#1f1f1f')
  root.style.setProperty('--bg-dark-light', bgDarkLight.value || '#bbbbbb')
  root.style.setProperty('--bg-dark-dark', bgDarkDark.value || '#000000')
  root.style.setProperty('--border-color-light', borderColorLight.value || '#ddd')
  root.style.setProperty('--border-color-dark', borderColorDark.value || '#312d3e')
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
const enableNewEthereumActionsAll =
  ref<boolean>(appConfig?.enableNewEthereumActionsAll)
const enableNewNostrActionsAll =
  ref<boolean>(appConfig?.enableNewNostrActionsAll)
const enableNewWeb3ActionsPost =
  ref<boolean>(appConfig?.enableNewWeb3ActionsPost)
const enableNewWeb3ActionsReply =
  ref<boolean>(appConfig?.enableNewWeb3ActionsReply)
const enableNewWeb3ActionsReact =
  ref<boolean>(appConfig?.enableNewWeb3ActionsReact)
const enableNewWeb3ActionsOther =
  ref<boolean>(appConfig?.enableNewWeb3ActionsOther)
const enableNewWeb3ActionsModerate =
  ref<boolean>(appConfig?.enableNewWeb3ActionsModerate)
const enableModeration =
  ref<boolean>(appConfig?.enableModeration)
const enableMarkdownInPosts =
  ref<boolean>(appConfig?.enableMarkdownInPosts)
const enableMarkdownInComments =
  ref<boolean>(appConfig?.enableMarkdownInComments)
const enableEmbedImageTagsForAllUsers =
  ref<boolean>(appConfig?.enableEmbedImageTagsForAllUsers)
const enableEmbedImageTagsForFullLineImageLinks =
  ref<boolean>(appConfig?.enableEmbedImageTagsForFullLineImageLinks)
const enableEmbedImageTagsInPosts =
  ref<boolean>(appConfig?.enableEmbedImageTagsInPosts)
const enableEmbedImageTagsInComments =
  ref<boolean>(appConfig?.enableEmbedImageTagsInComments)
const enableEmbedVideoTagsForAllUsers =
  ref<boolean>(appConfig?.enableEmbedVideoTagsForAllUsers)
const enableEmbedVideoTagsForFullLineVideoLinks =
  ref<boolean>(appConfig?.enableEmbedVideoTagsForFullLineVideoLinks)
const enableEmbedVideoTagsInPosts =
  ref<boolean>(appConfig?.enableEmbedVideoTagsInPosts)
const enableEmbedVideoTagsInComments =
  ref<boolean>(appConfig?.enableEmbedVideoTagsInComments)
const enableEmbedAudioTagsForAllUsers =
  ref<boolean>(appConfig?.enableEmbedAudioTagsForAllUsers)
const enableEmbedAudioTagsForFullLineAudioLinks =
  ref<boolean>(appConfig?.enableEmbedAudioTagsForFullLineAudioLinks)
const enableEmbedAudioTagsInPosts =
  ref<boolean>(appConfig?.enableEmbedAudioTagsInPosts)
const enableEmbedAudioTagsInComments =
  ref<boolean>(appConfig?.enableEmbedAudioTagsInComments)
const enableWhitelistForActionPost =
  ref<boolean>(appConfig?.enableWhitelistForActionPost)
const enableWhitelistForActionReply =
  ref<boolean>(appConfig?.enableWhitelistForActionReply)
const enableWhitelistForActionReact =
  ref<boolean>(appConfig?.enableWhitelistForActionReact)
const enableWhitelistForActionOther =
  ref<boolean>(appConfig?.enableWhitelistForActionOther)

// Federation
const enableSpasmModule =
  ref<boolean>(appConfig?.enableSpasmModule)
const enableSpasmSourcesUpdates =
  ref<boolean>(appConfig?.enableSpasmSourcesUpdates)
const enableFederationDefaultLists =
  ref<boolean>(appConfig?.enableFederationDefaultLists)
const enableFederationDefaultListOfficial =
  ref<boolean>(appConfig?.enableFederationDefaultListOfficial)
const enableFederationDefaultListCrypto =
  ref<boolean>(appConfig?.enableFederationDefaultListCrypto)
const enableFederationDefaultListPrivacy =
  ref<boolean>(appConfig?.enableFederationDefaultListPrivacy)
const enableFederationDefaultListTech =
  ref<boolean>(appConfig?.enableFederationDefaultListTech)
const enableFederationDefaultListPolitics =
  ref<boolean>(appConfig?.enableFederationDefaultListPolitics)

// Federation
const enableRssFeedChannel =
  ref<boolean>(appConfig?.enableRssFeedChannel)

// Arrays
const moderators =
  ref<string[]>(appConfig?.moderators)
const whitelistedForActionPost =
  ref<string[]>(appConfig?.whitelistedForActionPost)
const whitelistedForActionReply =
  ref<string[]>(appConfig?.whitelistedForActionReply)
const whitelistedForActionReact =
  ref<string[]>(appConfig?.whitelistedForActionReact)
const whitelistedForActionOther =
  ref<string[]>(appConfig?.whitelistedForActionOther)
const pinnedIds =
  ref<string[]>(appConfig?.pinnedIds)
const envCategories =
  ref<string[]>(appConfig?.envCategories)

// Strings
// Strings-default-intro
const faviconTheme =
  ref<string>(appConfig?.faviconTheme)
const faviconLink =
  ref<string>(appConfig?.faviconLink)
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
// Colors
const colorPrimaryLight = ref<string>(appConfig?.colorPrimaryLight)
const colorPrimaryDark = ref<string>(appConfig?.colorPrimaryDark)
const colorBaseLight = ref<string>(appConfig?.colorBaseLight)
const colorBaseDark = ref<string>(appConfig?.colorBaseDark)
const colorSecondaryLight = ref<string>(appConfig?.colorSecondaryLight)
const colorSecondaryDark = ref<string>(appConfig?.colorSecondaryDark)
const colorHoverLight = ref<string>(appConfig?.colorHoverLight)
const colorHoverDark = ref<string>(appConfig?.colorHoverDark)
const colorNotImportantLight = ref<string>(appConfig?.colorNotImportantLight)
const colorNotImportantDark = ref<string>(appConfig?.colorNotImportantDark)
const colorGreenLight = ref<string>(appConfig?.colorGreenLight)
const colorGreenDark = ref<string>(appConfig?.colorGreenDark)
const colorRedLight = ref<string>(appConfig?.colorRedLight)
const colorRedDark = ref<string>(appConfig?.colorRedDark)
const colorOrangeLight = ref<string>(appConfig?.colorOrangeLight)
const colorOrangeDark = ref<string>(appConfig?.colorOrangeDark)
const colorBlueLight = ref<string>(appConfig?.colorBlueLight)
const colorBlueDark = ref<string>(appConfig?.colorBlueDark)
const bgBaseLight = ref<string>(appConfig?.bgBaseLight)
const bgBaseDark = ref<string>(appConfig?.bgBaseDark)
const bgSecondaryLight = ref<string>(appConfig?.bgSecondaryLight)
const bgSecondaryDark = ref<string>(appConfig?.bgSecondaryDark)
const bgHoverLight = ref<string>(appConfig?.bgHoverLight)
const bgHoverDark = ref<string>(appConfig?.bgHoverDark)
const bgDarkLight = ref<string>(appConfig?.bgDarkLight)
const bgDarkDark = ref<string>(appConfig?.bgDarkDark)
const borderColorLight = ref<string>(appConfig?.borderColorLight)
const borderColorDark = ref<string>(appConfig?.borderColorDark)
const savedTheme = {
  colorPrimaryLight: appConfig?.colorPrimaryLight,
  colorPrimaryDark: appConfig?.colorPrimaryDark,
  colorBaseLight: appConfig?.colorBaseLight,
  colorBaseDark: appConfig?.colorBaseDark,
  colorSecondaryLight: appConfig?.colorSecondaryLight,
  colorSecondaryDark: appConfig?.colorSecondaryDark,
  colorHoverLight: appConfig?.colorHoverLight,
  colorHoverDark: appConfig?.colorHoverDark,
  colorNotImportantLight: appConfig?.colorNotImportantLight,
  colorNotImportantDark: appConfig?.colorNotImportantDark,
  colorGreenLight: appConfig?.colorGreenLight,
  colorGreenDark: appConfig?.colorGreenDark,
  colorRedLight: appConfig?.colorRedLight,
  colorRedDark: appConfig?.colorRedDark,
  colorOrangeLight: appConfig?.colorOrangeLight,
  colorOrangeDark: appConfig?.colorOrangeDark,
  colorBlueLight: appConfig?.colorBlueLight,
  colorBlueDark: appConfig?.colorBlueDark,
  bgBaseLight: appConfig?.bgBaseLight,
  bgBaseDark: appConfig?.bgBaseDark,
  bgSecondaryLight: appConfig?.bgSecondaryLight,
  bgSecondaryDark: appConfig?.bgSecondaryDark,
  bgHoverLight: appConfig?.bgHoverLight,
  bgHoverDark: appConfig?.bgHoverDark,
  bgDarkLight: appConfig?.bgDarkLight,
  bgDarkDark: appConfig?.bgDarkDark,
  borderColorLight: appConfig?.borderColorLight,
  borderColorDark: appConfig?.borderColorDark
}
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
const gitLink = ref<string>(appConfig?.gitLink)
const forgejoLink = ref<string>(appConfig?.forgejoLink)
const giteaLink = ref<string>(appConfig?.giteaLink)
const radicleLink = ref<string>(appConfig?.radicleLink)
const gitlabLink = ref<string>(appConfig?.gitlabLink)
const codebergLink = ref<string>(appConfig?.codebergLink)
const bitbucketLink = ref<string>(appConfig?.bitbucketLink)
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
// RSS feed channel
const rssFeedChannelTitle = ref<string>(appConfig?.rssFeedChannelTitle)
const rssFeedChannelLink = ref<string>(appConfig?.rssFeedChannelLink)
const rssFeedChannelDescription = ref<string>(appConfig?.rssFeedChannelDescription)
const rssFeedChannelImageLink = ref<string>(appConfig?.rssFeedChannelImageLink)

// Numbers
const shortUrlsLengthOfWeb3Ids = ref<number>(appConfig?.shortUrlsLengthOfWeb3Ids)
const feedFiltersActivityHot = ref<number>(appConfig?.feedFiltersActivityHot)
const feedFiltersActivityRising = ref<number>(appConfig?.feedFiltersActivityRising)

const isResponseError = ref<boolean>(false)
const responseMessage = ref<boolean>('')

watch(
  () => [
    colorPrimaryDark.value, colorPrimaryLight.value,
    colorBaseDark.value, colorBaseLight.value,
    colorSecondaryDark.value, colorSecondaryLight.value,
    colorHoverDark.value, colorHoverLight.value,
    colorNotImportantDark.value, colorNotImportantLight.value,
    colorGreenDark.value, colorGreenLight.value,
    colorRedDark.value, colorRedLight.value,
    colorOrangeDark.value, colorOrangeLight.value,
    colorBlueDark.value, colorBlueLight.value,
    bgBaseDark.value, bgBaseLight.value,
    bgSecondaryDark.value, bgSecondaryLight.value,
    bgHoverDark.value, bgHoverLight.value,
    bgDarkDark.value, bgDarkLight.value,
    borderColorDark.value, borderColorLight.value
  ], async () => {
    applyTheme()
  }
)

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
    newAppConfig.enableNewEthereumActionsAll =
      enableNewEthereumActionsAll.value
    newAppConfig.enableNewNostrActionsAll =
      enableNewNostrActionsAll.value
    newAppConfig.enableNewWeb3ActionsPost =
      enableNewWeb3ActionsPost.value
    newAppConfig.enableNewWeb3ActionsReply =
      enableNewWeb3ActionsReply.value
    newAppConfig.enableNewWeb3ActionsReact =
      enableNewWeb3ActionsReact.value
    newAppConfig.enableNewWeb3ActionsOther =
      enableNewWeb3ActionsOther.value
    newAppConfig.enableNewWeb3ActionsModerate =
      enableNewWeb3ActionsModerate.value
    newAppConfig.enableModeration =
      enableModeration.value
    newAppConfig.enableMarkdownInPosts =
      enableMarkdownInPosts.value
    newAppConfig.enableMarkdownInComments =
      enableMarkdownInComments.value
    newAppConfig.enableEmbedImageTagsForAllUsers =
      enableEmbedImageTagsForAllUsers.value
    newAppConfig.enableEmbedImageTagsForFullLineImageLinks =
      enableEmbedImageTagsForFullLineImageLinks.value
    newAppConfig.enableEmbedImageTagsInPosts =
      enableEmbedImageTagsInPosts.value
    newAppConfig.enableEmbedImageTagsInComments =
      enableEmbedImageTagsInComments.value
    newAppConfig.enableEmbedVideoTagsForAllUsers =
      enableEmbedVideoTagsForAllUsers.value
    newAppConfig.enableEmbedVideoTagsForFullLineVideoLinks =
      enableEmbedVideoTagsForFullLineVideoLinks.value
    newAppConfig.enableEmbedVideoTagsInPosts =
      enableEmbedVideoTagsInPosts.value
    newAppConfig.enableEmbedVideoTagsInComments =
      enableEmbedVideoTagsInComments.value
    newAppConfig.enableEmbedAudioTagsForAllUsers =
      enableEmbedAudioTagsForAllUsers.value
    newAppConfig.enableEmbedAudioTagsForFullLineAudioLinks =
      enableEmbedAudioTagsForFullLineAudioLinks.value
    newAppConfig.enableEmbedAudioTagsInPosts =
      enableEmbedAudioTagsInPosts.value
    newAppConfig.enableEmbedAudioTagsInComments =
      enableEmbedAudioTagsInComments.value
    newAppConfig.enableWhitelistForActionPost =
      enableWhitelistForActionPost.value
    newAppConfig.enableWhitelistForActionReply =
      enableWhitelistForActionReply.value
    newAppConfig.enableWhitelistForActionReact =
      enableWhitelistForActionReact.value
    newAppConfig.enableWhitelistForActionOther =
      enableWhitelistForActionOther.value

    // Federation
    newAppConfig.enableSpasmModule =
      enableSpasmModule.value
    newAppConfig.enableSpasmSourcesUpdates =
      enableSpasmSourcesUpdates.value
    newAppConfig.enableFederationDefaultLists =
      enableFederationDefaultLists.value
    newAppConfig.enableFederationDefaultListOfficial =
      enableFederationDefaultListOfficial.value
    newAppConfig.enableFederationDefaultListCrypto =
      enableFederationDefaultListCrypto.value
    newAppConfig.enableFederationDefaultListPrivacy =
      enableFederationDefaultListPrivacy.value
    newAppConfig.enableFederationDefaultListTech =
      enableFederationDefaultListTech.value
    newAppConfig.enableFederationDefaultListPolitics =
      enableFederationDefaultListPolitics.value

    // RSS feed channel
    newAppConfig.enableRssFeedChannel =
      enableRssFeedChannel.value

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
    if (typeof(whitelistedForActionOther.value) === "string") {
      newAppConfig.whitelistedForActionOther =
        splitIntoArray(whitelistedForActionOther.value)
    } else if (Array.isArray(whitelistedForActionOther.value)) {
      newAppConfig.whitelistedForActionOther =
        whitelistedForActionOther.value
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
    type KeyString = typeof fields[number]

    const fields = [
      // Strings - intro - home
      "faviconTheme", "faviconLink",
      "defaultHeaderImageLink",
      "introTitle", "introTitleExtra", "introAbout",
      "postPlaceholder", "commentPlaceholder",
      "defaultButtonPrimaryText", "defaultButtonPrimaryLink",
      "defaultButtonSecondaryText", "defaultButtonSecondaryLink",
      // Colors
      "colorPrimaryDark", "colorPrimaryLight",
      "colorBaseDark", "colorBaseLight",
      "colorSecondaryDark", "colorSecondaryLight",
      "colorHoverDark", "colorHoverLight",
      "colorNotImportantDark", "colorNotImportantLight",
      "colorGreenDark", "colorGreenLight",
      "colorRedDark", "colorRedLight",
      "colorOrangeDark", "colorOrangeLight",
      "colorBlueDark", "colorBlueLight",
      "bgBaseDark", "bgBaseLight",
      "bgSecondaryDark", "bgSecondaryLight",
      "bgHoverDark", "bgHoverLight",
      "bgDarkDark", "bgDarkLight",
      "borderColorDark", "borderColorLight",
      // Strings - socials
      "anotherWebsiteLink", "ipfsLink", "torLink",
      "ipfsHttpGatewayLink", "nostrLink", "sessionLink",
      "simplexLink", "statusLink", "lensLink", "farcasterLink",
      "blueskyLink", "hiveLink", "pushLink", "mirrorLink",
      "mastodonLink", "matrixLink", "discordLink", "telegramLink",
      "twitterLink", "redditLink", "youtubeLink", "instagramLink",
      "facebookLink", "linkedinLink", "wikipediaLink",
      "gitLink", "forgejoLink", "giteaLink", "radicleLink",
      "gitlabLink", "codebergLink", "bitbucketLink", "githubLink",
      "nostrNpub", "sessionName", "matrixName",
      "lensName", "farcasterName", "blueskyName", "hiveName",
      "pushName", "mirrorName", "telegramName", "twitterName",
      "redditName", "signalNumber", "whatsappNumber", "xmppName",
      "uniswapLink", "sushiswapLink",
      "etherscanLink", "ethvmLink",
      "coingeckoLink", "coinmarketcapLink", "dextoolsLink",
      "dexscreenerLink", "birdeyeLink", "geckoterminalLink",
      "extraContactInfo",
      // RSS feed channel
      "rssFeedChannelTitle",
      "rssFeedChannelLink",
      "rssFeedChannelDescription",
      "rssFeedChannelImageLink"
    ] as const

    const refMap: Record<KeyString, { value: unknown }> = {
      // Strings - intro - home
      faviconTheme, faviconLink,
      defaultHeaderImageLink,
      introTitle, introTitleExtra, introAbout,
      postPlaceholder, commentPlaceholder,
      defaultButtonPrimaryText, defaultButtonPrimaryLink,
      defaultButtonSecondaryText, defaultButtonSecondaryLink,
      // Colors
      colorPrimaryDark, colorPrimaryLight,
      colorBaseDark, colorBaseLight,
      colorSecondaryDark, colorSecondaryLight,
      colorHoverDark, colorHoverLight,
      colorNotImportantDark, colorNotImportantLight,
      colorGreenDark, colorGreenLight,
      colorRedDark, colorRedLight,
      colorOrangeDark, colorOrangeLight,
      colorBlueDark, colorBlueLight,
      bgBaseDark, bgBaseLight,
      bgSecondaryDark, bgSecondaryLight,
      bgHoverDark, bgHoverLight,
      bgDarkDark, bgDarkLight,
      borderColorDark, borderColorLight,
      // Strings - socials
      anotherWebsiteLink, ipfsLink, torLink, ipfsHttpGatewayLink,
      nostrLink, sessionLink, simplexLink, statusLink,
      lensLink, farcasterLink, blueskyLink, hiveLink,
      pushLink, mirrorLink, mastodonLink, matrixLink,
      discordLink, telegramLink, twitterLink, redditLink,
      youtubeLink, instagramLink, facebookLink, linkedinLink,
      wikipediaLink,
      gitLink, forgejoLink, giteaLink, radicleLink, gitlabLink,
      codebergLink, bitbucketLink, githubLink,
      nostrNpub, sessionName,
      matrixName, lensName, farcasterName, blueskyName,
      hiveName, pushName, mirrorName, telegramName, twitterName,
      redditName, signalNumber, whatsappNumber,
      xmppName, uniswapLink, sushiswapLink,
      etherscanLink, ethvmLink,
      coingeckoLink, coinmarketcapLink, dextoolsLink,
      dexscreenerLink, birdeyeLink, geckoterminalLink,
      extraContactInfo,
      // RSS feed channel
      rssFeedChannelTitle,
      rssFeedChannelLink,
      rssFeedChannelDescription,
      rssFeedChannelImageLink
    }

    for (const key of fields) {
      const v = refMap[key].value
      if (typeof v === "string") {
        newAppConfig[key] = v as any
      }
    }

    // Numbers
    const numberFields = [
      "shortUrlsLengthOfWeb3Ids",
      "feedFiltersActivityHot",
      "feedFiltersActivityRising"
    ] as const

    type NumKey = typeof numberFields[number]

    // Map field names to their ref objects
    // (each ref has a .value)
    const numRefMap: Record<NumKey, { value: unknown }> = {
      shortUrlsLengthOfWeb3Ids,
      feedFiltersActivityHot,
      feedFiltersActivityRising
    }

    // Copy only defined, finite numbers (accept numeric
    // strings but do NOT convert null/undefined)
    for (const key of numberFields) {
      const raw = numRefMap[key].value
      if (raw == null) continue

      const num = typeof raw === "number" ? raw : Number(raw)
      if (Number.isFinite(num)) {
        newAppConfig[key] = num
      }
    }

    if (!hasValue(newAppConfig)) { return }
    const text = JSON.stringify(newAppConfig)

    notificationStore.showNotification(
      "Submitting",
      "note", 3000
    )
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
        notificationStore.showNotification(
          "Something went wrong",
          "error", 6000
        )
        return
      } else if (res.toLowerCase().startsWith("success")) {
        await useAppConfigStore()?.fetchAndUpdateAppConfig()
        notificationStore.showNotification(
          'Success: config is saved', 'success', 8000
        )
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
