<template>
  <div v-if="imageUrl" class="mb-4">
    <img :src="imageUrl" alt="Header Image" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {useAppConfigStore} from '@/stores/useAppConfigStore'
const appConfig = useAppConfigStore()?.getAppConfig

const defaultHeaderImageLink = appConfig?.defaultHeaderImageLink

// Define the possible image paths
const possiblePaths = [
  '/header.jpeg',
  // '/header.png',
  // '/header.jpg',
  // '/header.webp',
  // '/header.svg',
]

const imageUrl = ref(null)

// Function to check if a resource exists using fetch
const checkResourceExists = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    // Check if the response is successful (status in the range 200-299)
    return response.ok
  } catch (error) {
    // This will catch network errors (e.g., CORS, DNS failure),
    // but not 404s from the same origin.
    return false
  }
}

// Main function
const findExistingImage = async () => {
  try {
    if (
      defaultHeaderImageLink &&
      typeof(defaultHeaderImageLink) === "string"
    ) {
      imageUrl.value = defaultHeaderImageLink
    } else {
      for (const path of possiblePaths) {
        const exists = await checkResourceExists(path)
        if (exists) {
          imageUrl.value = path
          return
        }
      }
    }
    // If no image is found, imageUrl remains null
    return
  } catch (error) {
    return
  }
}

onMounted(() => {
  findExistingImage()
})
</script>
