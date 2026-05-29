import { nextTick, onBeforeUnmount, onMounted, readonly, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

type FooterAwareBottomOffsetOptions = {
  baseOffset?: number
  footerGap?: number
  scrollRootId?: string
  footerId?: string
  watchRoute?: boolean
}

const isClient = () => typeof window !== 'undefined' && typeof document !== 'undefined'

export const useFooterAwareBottomOffset = (
  options: FooterAwareBottomOffsetOptions = {},
) => {
  const {
    baseOffset = 12,
    footerGap = 0,
    scrollRootId = 'site-main-scroll',
    footerId = 'site-footer',
    watchRoute = true,
  } = options

  const route = useRoute()
  const bottomOffset = ref(baseOffset)

  let scrollRoot: HTMLElement | null = null
  let footer: HTMLElement | null = null

  const updateBottomOffset = () => {
    if (!scrollRoot || !footer) {
      bottomOffset.value = baseOffset
      return
    }

    const rootRect = scrollRoot.getBoundingClientRect()
    const footerRect = footer.getBoundingClientRect()
    const overlap = rootRect.bottom - footerRect.top

    if (overlap > 0) {
      bottomOffset.value = baseOffset + overlap + footerGap
    } else {
      bottomOffset.value = baseOffset
    }
  }

  const teardown = () => {
    scrollRoot?.removeEventListener('scroll', updateBottomOffset)

    if (isClient()) {
      window.removeEventListener('resize', updateBottomOffset)
    }
  }

  const refresh = async () => {
    if (!isClient()) {
      bottomOffset.value = baseOffset
      return
    }

    await nextTick()

    teardown()

    scrollRoot = document.getElementById(scrollRootId)
    footer = document.getElementById(footerId)

    scrollRoot?.addEventListener('scroll', updateBottomOffset, { passive: true })
    window.addEventListener('resize', updateBottomOffset)

    updateBottomOffset()
  }

  onMounted(() => {
    refresh()
  })

  onBeforeUnmount(() => {
    teardown()
  })

  if (watchRoute) {
    watch(
      () => route.path,
      async () => {
        await refresh()
      },
    )
  }

  return {
    bottomOffset: readonly(bottomOffset),
    refresh,
  }
}
