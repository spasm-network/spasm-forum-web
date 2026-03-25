<template>
  <div class="p-3 mb-12">
    <p class="text-2xl mb-5">Contacts</p>
      <DefaultContacts v-if="enableDefaultContacts" />
      <CustomContacts v-if="enableCustomContacts" />

    <div v-if="ifShowDevelopersInfo">
      <p class="mt-5 text-colorNotImportant-light dark:text-colorNotImportant-dark">For developers:</p>
      <div>
        This forum is powered by
        <a href="https://spasm.network" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Spasm
        </a>
        <a href="https://github.com/spasm-network" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          (git)
        </a>
          <IconsRocket class="custom-icons" />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import {useAppConfigStore} from '@/stores/useAppConfigStore'
const appConfig = useAppConfigStore()?.getAppConfig
const ifShowDevelopersInfo = appConfig?.ifShowDevelopersInfo
const enableDefaultContacts = appConfig?.enableDefaultContacts
const enableCustomContacts = appConfig?.enableCustomContacts
</script>

<style scoped>

</style>
