<template>
  <div class="min-h-[2.6rem] bg-bgSecondary-light dark:bg-bgSecondary-dark">
    <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
      <!-- activities -->
      <span v-if="activities">
        <span v-if="activities[0]" class="float-left ml-1">
          <FeedEventsFiltersMenuButton
            v-for="activity in activities"
            class="first-letter:uppercase"
            :block=false
            :filterName="activity"
            :filterSelected="feedFilters.activity"
            @filter-clicked="filterActivityClicked">
            {{activity}}
          </FeedEventsFiltersMenuButton>
        </span>
      </span>

      <div v-if="ifShowCategoriesFilter">
        <!-- Dropdown toggle button -->
        <button
          @click="toggleCategoriesDropDown()"
          class="z-100 flex items-center float-right mr-2 p-2 px-2 min-w-[185px] bg-bgSecondary-light dark:bg-bgSecondary-dark"
        >
          <span class="mr-1">
            Category: 
            <span class="uppercase text-colorPrimary-light dark:text-colorPrimary-dark">
              {{feedFilters.category}}
            </span>
          </span>
          <IconsTriangle :rotateIf="categoriesDropDownShown" />
        </button>


        <!-- Dropdown menu -->
        <div
          v-show="categoriesDropDownShown"
          class="absolute right-0 top-7 bg-bgSecondary-light dark:bg-bgSecondary-dark rounded-md shadow-md mr-3"
        >

        <!-- categories -->
        <span v-if="categories">
          <span v-if="categories[0]" class="float-right mr-4">
            <FeedEventsFiltersMenuButton
              v-for="category in categories"
              class="uppercase mr-1"
              :block=true
              :filterName="category"
              :filterSelected="feedFilters.category"
              @filter-clicked="filterCategoryClicked"
            >
              {{category}}
            </FeedEventsFiltersMenuButton>
          </span>
        </span>

        </div>

      </div>


    </span>
  </div>
</template>

<script setup lang="ts">
import {FiltersActivity, FiltersCategory} from '@/helpers/interfaces';
const { feedFilters, changeFeedFiltersActivity, changeFeedFiltersCategory } = useFeedEventsFilters()
const ifShowCategoriesFilter = useRuntimeConfig()?.public?.ifShowCategoriesFilter === 'true' ? true : false
const envCategories = useRuntimeConfig()?.public?.envCategories

// state
const categoriesDropDownShown = ref(false)

const activities: FiltersActivity[] = [
  'hot',
  'rising',
  'all',
]

const categories: FiltersCategory[] = [
  ...envCategories,
  'any',
]

// methods
const filterActivityClicked = (newFilter: FiltersActivity):void => {
  changeFeedFiltersActivity(newFilter)
}

const filterCategoryClicked = (newFilter: FiltersCategory):void => {
  changeFeedFiltersCategory(newFilter)
  categoriesDropDownShown.value = false
}

const toggleCategoriesDropDown = () => {
  categoriesDropDownShown.value = !categoriesDropDownShown.value
}

</script>

<style scoped>

</style>
