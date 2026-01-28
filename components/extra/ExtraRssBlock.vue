<template>
  <div class="overflow-auto overflow-wrap break-words" >
    <div
      class="cursor-pointer text-base text-colorNotImportant-light dark:text-colorNotImportant-dark"
      @click="toggleRss()"
    >
      <span v-if="showRssIcon">
        <IconsRss />
      </span>
      <span>
        RSS
      </span>
      <svg
        :class="{ 'rotate-180': rssShown }"
        class="inline w-5 h-5" viewBox="0 0 20 20" fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </div>

    <div class="mb-8" v-if="rssShown" >
      <div class="mt-2 mb-2 text-colorNotImportant-light dark:text-colorNotImportant-dark">
        Customize your feed:
      </div>

      <!-- Activity -->
      <div v-if="showActivityFilter">
        <!-- Dropdown toggle button -->
        <div
          @click="toggleActivityDropDown()"
          class="text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer"
        >
          <svg
            :class="{ 'rotate-180': activityDropDownShown }"
            class="inline w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
          <span>
            <span class="ml-2 font-bold text-colorBase-light dark:text-colorBase-dark">
              {{ activity }}
            </span>
          </span>
        </div>

        <!-- Dropdown menu -->
        <div
          v-show="activityDropDownShown"
          class="ml-6 pl-1 py-1 bg-bgSecondary-light dark:bg-bgSecondary-dark rounded-md shadow-md w-20"
        >
          <span v-if="activities">
            <span v-if="activities[0]" class="">
              <div
                v-for="activity in activities"
                class="py-1 font-bold text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark cursor-pointer"
                @click="selectActivity(activity)"
              >
                {{ activity }}
              </div>
            </span>
          </span>
        </div>
      </div>

      <!-- Posts -->
      <div class="mt-2 font-bold">
        <span>
          <input
            class="m-1 cursor-pointer"
            v-model="enablePosts"
            type="checkbox"
          >
        </span>
        <span @click="toggleEnablePosts()" class="cursor-pointer">
          posts
        </span>
      </div>
      <div class="mt-2 font-bold">
        <span>
          <input
            class="m-1 cursor-pointer"
            v-model="enableComments"
            type="checkbox"
          >
        </span>
        <span @click="toggleEnableComments()" class="cursor-pointer">
          comments
        </span>
      </div>
      <div
        class="mt-2 font-bold"
        v-if="showSignerFilter && (hasValue(spasm.getVerifiedSigners(event)) || signer)"
      >
        <input
          class="m-1 cursor-pointer"
          v-model="enableThisAuthor"
          type="checkbox"
        >
        <span @click="toggleEnableThisAuthor()" class="cursor-pointer">
          by this author only
        </span>
      </div>
      <div
        class="mt-2 font-bold"
        v-if="showCategoryFilter && hasValue(event?.categories)"
      >
        <input
          class="m-1 cursor-pointer"
          v-model="enableThisCategory"
          type="checkbox"
        >
        <span @click="toggleEnableThisCategory()" class="cursor-pointer">
          in this category only
        </span>
      </div>
      <div
        @click="copyToClipboardClicked(finalUrl)"
        class="mt-4 mb-4 text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark cursor-pointer"
      >
        <div class="font-bold">
          Click here to copy your final RSS feed link
          <button @click="copyToClipboardClicked(finalUrl)" :title="copyToClipboardTitle" class="ml-1">
            <IconsCopyToClipboard
              v-if="showCopyToClipboard && !showCopyToClipboardSuccess"
              class="custom-icons-large lg:custom-icons pb-1"
            />
            <IconsCheck
              v-if="showCopyToClipboard && showCopyToClipboardSuccess"
              class="custom-icons-large lg:custom-icons pb-1 text-colorGreen-light dark:text-colorGreen-dark"
            />
          </button>
        </div>
      </div>
      <div>
        <a :href="finalUrl" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark">
          {{ finalUrl }}
          <IconsExternalWebsite
            class="custom-icons-large lg:custom-icons pb-1"
          />
        </a>
      </div>

      <div class="mt-4 text-colorNotImportant-light dark:text-colorNotImportant-dark">
        <div>
          Best viewed on these RSS apps:
        </div>
        <div>
          Android:
          <a href="https://capyreader.com/" target="_blank">
            Capy Reader
            <IconsExternalWebsite class="custom-icons w-4 pb-1" />
          </a>
        </div>
        <div>
          Podcasts:
          <a href="https://antennapod.org/" target="_blank">
            AntennaPod
            <IconsExternalWebsite class="custom-icons w-4 pb-1" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { spasm } from 'spasm.js'
import {
  SpasmEventV2,
  SpasmEventCategoryV2
} from '@/helpers/interfaces'
import {useAppConfigStore} from '@/stores/useAppConfigStore'
const { apiUrl } = useAppConfigStore()?.getAppConfig
const {
  hasValue,
  copyToClipboard,
  isArrayWithValues
} = useUtils()

const props = withDefaults(
  defineProps<{
    event?: SpasmEventV2
    activity?: string
    signer?: string
    showRssIcon?: boolean
    showActivityFilter?: boolean
    showCopyToClipboard?: boolean
    showSignerFilter?: boolean
    showCategoryFilter?: boolean
    enablePosts?: boolean
    enableComments?: boolean
  }>(),
  {
    activity: "all",
    showRssIcon: true,
    showActivityFilter: true,
    showCopyToClipboard: true,
    showSignerFilter: false,
    showCategoryFilter: false,
    enablePosts: true,
    enableComments: false
  }
)

const activities = ["hot", "rising", "all"]

const enablePosts = ref<boolean>(props?.enablePosts)
const enableComments = ref<boolean>(props?.enableComments)
const enableThisAuthor = ref<boolean>(true)
const enableThisCategory = ref<boolean>(false)
const baseUrl = ref<string>(apiUrl + "/api/events?format=rss")
const finalUrl = ref<string>(baseUrl.value)

const copyToClipboardTitle = ref("Click to copy")
const showCopyToClipboardSuccess = ref(false)

const rssShown = ref(false)
const toggleRss = () => { rssShown.value = !rssShown.value }

const activityDropDownShown = ref(false)
const toggleActivityDropDown = () => {
  activityDropDownShown.value = !activityDropDownShown.value
}

const activity = ref<string>(props?.activity || "hot")

const selectActivity = (newActivity: string): void => {
  activity.value = newActivity
  toggleActivityDropDown()
}

const calculateFinalUrl = (): void => {
  let tempUrl = baseUrl.value
  if (activity.value && typeof(activity.value) === "string") {
    tempUrl += "&activity=" + activity.value
  }
  if (enablePosts.value) {
    tempUrl += "&action=post"
  }
  if (enableComments.value) {
    tempUrl += "&action=reply"
  }
  if (enableThisAuthor.value) {
    if (props?.signer && typeof(props?.signer) === "string") {
      tempUrl += "&signer=" + props?.signer
    } else {
      const signers: (string | number)[] =
        // For nostr addresses use npubs instead of hex
        // because signer's pubkey is added to channel title.
        spasm.getVerifiedSigners(props?.event, "npub")
        // spasm.getVerifiedSigners(props?.event)
      if (signers && isArrayWithValues(signers)) {
        signers.forEach(signer => {
          tempUrl += "&signer=" + signer
        })
      }
    }
  }
  if (enableThisCategory.value) {
    const categories: SpasmEventCategoryV2[] =
      props?.event?.categories
    if (categories && isArrayWithValues(categories)) {
      categories.forEach(category => {
        if (
          category && "name" in category &&
          category.name && typeof(category.name) === "string"
        ) {
          tempUrl += "&category=" + category.name
        }
      })
    }
  }
  finalUrl.value = tempUrl
}

calculateFinalUrl()

// methods
const copyToClipboardClicked = (value: string | number | undefined): void => {
  copyToClipboard(value)
  copyToClipboardTitle.value = "Copied"
  showCopyToClipboardSuccess.value = true
  setTimeout(() => (
    copyToClipboardTitle.value = "Click to copy",
    showCopyToClipboardSuccess.value = false
  ), 2000)
}

const toggleEnablePosts = () => {
  enablePosts.value = !enablePosts.value
}
const toggleEnableComments = () => {
  enableComments.value = !enableComments.value
}
const toggleEnableThisAuthor = () => {
  enableThisAuthor.value = !enableThisAuthor.value
}
const toggleEnableThisCategory = () => {
  enableThisCategory.value = !enableThisCategory.value
}

watch(
  () => [
    enablePosts.value, enableComments.value,
    enableThisAuthor.value, enableThisCategory.value,
    activity.value
  ], async () => {
    calculateFinalUrl()
  }
)

</script>

<style scoped>
</style>
