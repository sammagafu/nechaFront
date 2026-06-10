import { onUnmounted, ref } from 'vue'
import router from '@/router'

export function useRouteLoading() {
  const navigating = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  const removeBefore = router.beforeEach((to, from, next) => {
    if (to.fullPath !== from.fullPath) {
      clearTimeout(timer)
      navigating.value = true
    }
    next()
  })

  const removeAfter = router.afterEach(() => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      navigating.value = false
    }, 280)
  })

  onUnmounted(() => {
    clearTimeout(timer)
    removeBefore()
    removeAfter()
  })

  return { navigating }
}
