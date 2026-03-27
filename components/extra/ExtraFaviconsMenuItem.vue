<template>
  <div
    class="py-1 font-bold text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark cursor-pointer"
  >
    <img
      v-if="imgSrc"
      :src="imgSrc"
      :alt="favicon"
      class="inline pr-1 w-5 h-5 object-contain"
    />
    <span v-else class="w-5 h-5 bg-gray-300 dark:bg-gray-700 rounded-sm"></span>
    <span>{{ favicon }}</span>
  </div>
</template>

<script setup lang="ts">
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

//const props = defineProps<{
//  favicon?: string,
//}>()
const props = defineProps<{
  favicon?: string
}>()

const iconMap = {
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
  roger: faviconRoger,
  // no images for "custom-link" and "default" — fallback used
};

let imgSrc = iconMap[props.favicon] ?? null;
if (props.favicon === "default") {
  imgSrc = '/favicon.ico'
}
</script>
