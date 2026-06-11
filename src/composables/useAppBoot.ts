import { onMounted, ref } from 'vue'
import router from '@/router'

const MIN_BOOT_MS = 600
const MAX_BOOT_MS = 4500

function waitForFonts(): Promise<void> {
  if (!document.fonts?.ready) {
    return Promise.resolve()
  }
  return document.fonts.ready.then(() => undefined)
}

export function useAppBoot() {
  const booting = ref(true)

  onMounted(() => {
    const started = performance.now()

    const finish = () => {
      const elapsed = performance.now() - started
      const remaining = Math.max(0, MIN_BOOT_MS - elapsed)

      window.setTimeout(() => {
        booting.value = false
      }, remaining)
    }

    const timeout = window.setTimeout(() => {
      booting.value = false
    }, MAX_BOOT_MS)

    Promise.all([router.isReady(), waitForFonts()])
      .then(finish)
      .catch(finish)
      .finally(() => clearTimeout(timeout))
  })

  return { booting }
}
