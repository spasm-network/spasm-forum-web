<template>
  <div v-if="enableNewWeb3ActionsAll && enableNewWeb3ActionsReact">
    <div v-if="event">
      <InfoEventReactionsBarButton
        :target="event?.ids?.[0]?.value?.toString()"
        :count="spasm.getTotalOfReaction(event, 'bullish')"
        :reaction="reactions[0]"
        :text="false"
        :icon-bullish="true"
        :parentEvent="event"
      />
      <InfoEventReactionsBarButton
        :target="event?.ids?.[0]?.value?.toString()"
        :count="spasm.getTotalOfReaction(event, 'bearish')"
        :reaction="reactions[1]"
        :text="false"
        :icon-bearish="true"
        :parentEvent="event"
      />
      <InfoEventReactionsBarButton
        :target="event?.ids?.[0]?.value?.toString()"
        :count="spasm.getTotalOfReaction(event, 'important')"
        :reaction="reactions[2]"
        :text="false"
        :icon-important="true"
        :parentEvent="event"
      />
      <InfoEventReactionsBarButton
        :target="event?.ids?.[0]?.value?.toString()"
        :count="spasm.getTotalOfReaction(event, 'scam')"
        :reaction="reactions[3]"
        :text="false"
        :icon-scam="true"
        :parentEvent="event"
      />
      <InfoEventReactionsBarButton
        :target="event?.ids?.[0]?.value?.toString()"
        :count="spasm.getTotalOfReaction(event, 'upvote')"
        :reaction="reactions[4]"
        :text="false"
        :icon-upvote="true"
        :parentEvent="event"
      />
      <InfoEventReactionsBarButton
        :target="event?.ids?.[0]?.value?.toString()"
        :count="spasm.getTotalOfReaction(event, 'downvote')"
        :reaction="reactions[5]"
        :text="false"
        :icon-downvote="true"
        :parentEvent="event"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {SpasmEventV2} from '@/helpers/interfaces'
import { spasm } from 'spasm.js'
import {useAppConfigStore} from '@/stores/useAppConfigStore'

const appConfig = useAppConfigStore()?.getAppConfig
const enableNewWeb3ActionsAll: boolean =
  appConfig?.enableNewWeb3ActionsAll
const enableNewWeb3ActionsReact: boolean =
  appConfig?.enableNewWeb3ActionsReact

defineProps<{
  event?: SpasmEventV2
}>()

const reactions = ['Bullish', 'Bearish', 'Important', 'Scam', 'Upvote', 'Downvote']

</script>

<style scoped></style>

