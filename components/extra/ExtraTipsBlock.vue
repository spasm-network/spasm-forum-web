<template>
  <div
    class="overflow-auto overflow-wrap break-words "
    v-if="isArrayWithValues(event?.tips)"
  >
    <div
      class="text-base text-colorNotImportant-light dark:text-colorNotImportant-dark"
    >
      <span v-if="showTipsText" class="font-bold">
        Tips:
      </span>

      <!-- Show tickers with icons first, then tickers without icons -->
      <span
        v-if="isArrayWithValues(event?.tips)"
        v-for="tip in event.tips"
      >
        <span
          v-if="tip?.currency?.ticker && typeof(tip?.currency?.ticker) === 'string'"
          class="hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
        >
          <!-- With icons -->
          <span
            v-if="tickersWithIcons.includes(tip?.currency?.ticker.toLowerCase())"
            @click="clickedTicker(tip?.currency?.ticker)"
            :class="{ 'text-colorPrimary-light dark:text-colorPrimary-dark': currentTicker === tip?.currency?.ticker.toLowerCase() }"
          >
            <span
              v-if="tip?.address && typeof(tip?.address) === 'string'"
              class="cursor-pointer"
            >
              <span
                v-if="tickersWithIcons.includes('xmr') && tip?.currency?.ticker?.toLowerCase() === 'xmr'"
                title="Monero"
              >
                <IconsCryptoMonero class="mx-1 custom-icons-large" />
              </span>
              <span
                v-else-if="tickersWithIcons.includes('zec') && tip?.currency?.ticker?.toLowerCase() === 'zec'"
                title="Zcash"
              >
                <IconsCryptoZcash class="mx-1 custom-icons-large" />
              </span>
              <span
                v-else-if="tickersWithIcons.includes('eth') && tip?.currency?.ticker?.toLowerCase() === 'eth'"
                title="Ether"
              >
                <IconsCryptoEthereum class="mx-1 custom-icons-large" />
              </span>
              <span
                v-else-if="tickersWithIcons.includes('btc') && tip?.currency?.ticker?.toLowerCase() === 'btc'"
                title="Bitcoin"
              >
                <IconsCryptoBitcoin class="mx-0 custom-icons-xxl" />
              </span>
              <span
                v-else-if="tickersWithIcons.includes('sol') && tip?.currency?.ticker?.toLowerCase() === 'sol'"
                title="Solana"
              >
                <IconsCryptoSolana class="mx-1 custom-icons-large" />
              </span>
              <span
                class="mx-1"
                v-else="true"
              >
                {{ tip?.currency?.ticker.toUpperCase() }}
              </span>
            </span>
          </span>
        </span>
      </span>


      <!-- Now, tickers without icons -->
      <span
        v-if="allowOtherTickers && isArrayWithValues(event?.tips)"
        v-for="tip in event?.tips"
      >
        <span
          v-if="tip?.currency?.ticker && typeof(tip?.currency?.ticker) === 'string'"
          class="hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
        >
          <!-- Without icons -->
          <span
            @click="clickedTicker(tip?.currency?.ticker)"
            v-if="!tickersWithIcons.includes(tip?.currency?.ticker.toLowerCase())"
            :class="{ 'text-colorPrimary-light dark:text-colorPrimary-dark': currentTicker === tip?.currency?.ticker.toLowerCase() }"
          >
            <span
              v-if="tip?.address && typeof(tip?.address) === 'string'"
              class="cursor-pointer"
            >
              <span class="mx-1" >
                {{ tip?.currency?.ticker.toUpperCase() }}
              </span>
            </span>
          </span>
        </span>
      </span>
    </div>
    <div
      v-if="isArrayWithValues(event?.tips)"
      v-for="tip in event.tips"
    >
      <div
        v-if="tip?.address && tip?.currency?.ticker && typeof(tip?.currency?.ticker) === 'string'"
        class="my-1"
        :title="copyToClipboardTitle" 
      >
        <div
          v-if="tip?.currency?.ticker?.toLowerCase() === currentTicker"
        >
          <div>
            <span
              v-if="typeof(tip?.currency?.ticker) === 'string'"
              class="text-colorNotImportant-light dark:text-colorNotImportant-dark font-bold"
            >
              {{ tip?.currency?.ticker?.toUpperCase() }}:
            </span>
            <span
              class="hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark cursor-pointer"
              @click="copyToClipboardClicked(tip?.address)"
            >
              {{ tip?.address }}
            </span>
            <button class="ml-1">
              <IconsCopyToClipboard
                v-if="showCopyToClipboard && !showCopyToClipboardSuccess"
                @click="copyToClipboardClicked(tip?.address)"
                class="custom-icons-large lg:custom-icons pb-1 text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark cursor-pointer"
              />
              <IconsCheck
                v-if="showCopyToClipboard && showCopyToClipboardSuccess"
                class="custom-icons-large lg:custom-icons pb-1 text-colorGreen-light dark:text-colorGreen-dark"
              />
            </button>
          </div>
          <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
            You can tip the author to this address.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { spasm } from 'spasm.js'
import {
  SpasmEventV2,
} from '@/helpers/interfaces'
const {
  copyToClipboard,
  isArrayWithValues
} = useUtils()

const props = withDefaults(
  defineProps<{
    event?: SpasmEventV2
    showTipsText: boolean
    showCopyToClipboard: boolean
    allowOtherTickers: boolean
    tickersWithIcons: string[]
  }>(),
  {
    showTipsText: false,
    showCopyToClipboard: true,
    allowOtherTickers: true,
    tickersWithIcons: ["xmr", "zec", "eth", "btc", "sol"]
  }
)

const currentTicker = ref<string>("0001000")

const clickedTicker = (newVal: string) => {
  if (!newVal) return
  if (typeof(newVal) !== "string") return
  const val = newVal.toLowerCase()
  if (currentTicker.value && currentTicker.value === val) {
    currentTicker.value = "0001000"
  } else { currentTicker.value = val }
}

const copyToClipboardTitle = ref("Click to copy")
const showCopyToClipboardSuccess = ref(false)

const copyToClipboardClicked = (value: string | number | undefined): void => {
  copyToClipboard(value)
  copyToClipboardTitle.value = "Copied"
  showCopyToClipboardSuccess.value = true
  setTimeout(() => (
    copyToClipboardTitle.value = "Click to copy",
    showCopyToClipboardSuccess.value = false
  ), 2000)
}

</script>

<style scoped>
</style>
