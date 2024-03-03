<template>
  <div class="layout-pool">
    <div 
      class="layout-item"
      v-for="(slide,index) in localMobanLayouts" 
      :key="slide.id"
      @click="selectSlideTemplate(index)"
    >
      <ThumbnailSlide class="thumbnail" :slide="slide" :size="180" />
    </div>
    <pre>{{ JSON.stringify(localMobanLayouts) }}</pre>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import type { Slide } from '@/types/slides'
import { fetchMoban } from '@/api/moban' 
import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'

const localMobanLayouts = ref<Slide[]>([]) // 创建一个本地状态来存储模板

onMounted(async () => {
  localMobanLayouts.value = await fetchMoban() // 在组件挂载时获取模板
})

const emit = defineEmits<{
  (event: 'select', payload: Slide[]): void;
}>()

const selectSlideTemplate = (index: number) => {
  const selectedTemplate = localMobanLayouts.value[index]
  if (selectedTemplate) {
    emit('select', [].concat(localMobanLayouts.value))
  }
}
</script>


<style lang="scss" scoped>
.layout-pool {
  width: 100%;
  height: 500px;
  padding: 2px;
  margin-right: -12px;
  padding-right: 12px;
  overflow: auto;

  @include flex-grid-layout();
}
.layout-item {
  @include flex-grid-layout-children(4, 25%);

	margin-bottom: 20px;
  // &:nth-last-child(2), &:last-child {
  //   margin-bottom: 0;
  // }

  .thumbnail {
    outline: 2px solid $borderColor;
    transition: outline $transitionDelay;
    cursor: pointer;

    &:hover {
      outline-color: $themeColor;
    }
  }
}
</style>