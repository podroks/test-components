import { computed, nextTick, onMounted, onUnmounted, ref, type Ref } from 'vue'

export type Placement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'left-top'
  | 'left-bottom'
  | 'right-top'
  | 'right-bottom'

export function useFloating(
  triggerRef: Ref<HTMLElement | null>,
  floatingRef: Ref<HTMLElement | null>,
  config: {
    placement?: Ref<Placement>
    offsetFromTrigger?: number
    offsetAlignment?: number
    offsetFromWindow?: number
    canUpdatePositioningData?: Ref<boolean>
  },
) {
  let viewportWidth = window.innerWidth
  let viewportHeight = window.innerHeight
  const triggerRefRect = ref<DOMRect | null>(null)
  const floatingRefRect = ref<DOMRect | null>(null)

  function updatePositioningData() {
    if (config.canUpdatePositioningData && !config.canUpdatePositioningData?.value) return
    nextTick(() => {
      if (triggerRef.value && floatingRef.value) {
        viewportWidth = window.innerWidth
        viewportHeight = window.innerHeight
        triggerRefRect.value = triggerRef.value.getBoundingClientRect()
        floatingRefRect.value = floatingRef.value.getBoundingClientRect()
      }
    })
  }

  onMounted(() => {
    updatePositioningData()
    window.addEventListener('resize', updatePositioningData)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updatePositioningData)
  })

  const placement = computed(() => {
    return config.placement?.value ?? 'top'
  })
  const offsetFromTrigger = computed(() => {
    return config.offsetFromTrigger ?? 0
  })
  const offsetFromWindow = computed(() => {
    return config.offsetFromWindow ?? 0
  })
  const offsetAlignment = computed(() => {
    return config.offsetAlignment ?? 0
  })

  const adjustedPlacement = computed(() => {
    const triggerRect = triggerRefRect.value
    const floatingHeight = floatingRefRect.value?.height ?? 0
    const floatingWidth = floatingRefRect.value?.width ?? 0

    if (!triggerRect) return placement.value

    const offsets = offsetFromTrigger.value + offsetFromWindow.value

    const spaceTop = triggerRect.top - floatingHeight - offsets
    const spaceBottom = viewportHeight - triggerRect.bottom - floatingHeight - offsets
    const spaceLeft = triggerRect.left - floatingWidth - offsets
    const spaceRight = viewportWidth - triggerRect.right - floatingWidth - offsets

    const hasSpaceTop = spaceTop >= 0
    const hasSpaceBottom = spaceBottom >= 0
    const hasSpaceLeft = spaceLeft >= 0
    const hasSpaceRight = spaceRight >= 0
    if (placement.value.startsWith('top')) {
      if (!hasSpaceTop && spaceBottom > spaceTop) return placement.value.replace('top', 'bottom')
    } else if (placement.value.startsWith('bottom')) {
      if (!hasSpaceBottom && (hasSpaceTop || spaceTop > spaceBottom))
        return placement.value.replace('bottom', 'top')
    } else if (placement.value.startsWith('left')) {
      if (!hasSpaceLeft && (hasSpaceRight || spaceRight > spaceLeft))
        return placement.value.replace('left', 'right')
    } else if (placement.value.startsWith('right')) {
      if (!hasSpaceRight && (hasSpaceLeft || spaceLeft > spaceRight))
        return placement.value.replace('right', 'left')
    }

    return placement.value
  })

  const top = computed(() => {
    const placement = adjustedPlacement.value
    const triggerRect = triggerRefRect.value
    const floatingHeight = floatingRefRect.value?.height ?? 0

    if (!triggerRect) return 0

    let top: number = Math.max(
      triggerRect.top + triggerRect.height / 2 - floatingHeight / 2,
      offsetFromWindow.value,
    )

    if (placement.startsWith('top')) {
      top = Math.max(
        triggerRect.top - floatingHeight - offsetFromTrigger.value,
        offsetFromWindow.value,
      )
    } else if (placement.startsWith('bottom')) {
      top = Math.min(
        triggerRect.bottom + offsetFromTrigger.value,
        viewportHeight - offsetFromWindow.value,
      )
    } else if (placement.startsWith('left')) {
      if (placement === 'left-top') {
        top = Math.max(triggerRect.top + offsetAlignment.value, 16)
      } else if (placement === 'left-bottom') {
        top = Math.min(
          triggerRect.bottom - floatingHeight - offsetAlignment.value,
          viewportHeight - offsetFromWindow.value,
        )
      }
    } else if (placement.startsWith('right')) {
      if (placement === 'right-top') {
        top = Math.max(triggerRect.top + offsetAlignment.value, 16)
      } else if (placement === 'right-bottom') {
        top = Math.min(
          triggerRect.bottom - floatingHeight - offsetAlignment.value,
          viewportHeight - offsetFromWindow.value,
        )
      }
    }

    return pxToRem(top)
  })

  const left = computed(() => {
    const placement = adjustedPlacement.value
    const triggerRect = triggerRefRect.value
    const floatingWidth = floatingRefRect.value?.width ?? 0

    if (!triggerRect) return 0

    let left: number = triggerRect.left

    if (placement.startsWith('top') || placement.startsWith('bottom')) {
      if (placement.endsWith('left')) {
        left = Math.max(triggerRect.left + offsetAlignment.value, offsetFromWindow.value)
      } else if (placement.endsWith('right')) {
        left = Math.min(
          triggerRect.right - floatingWidth - offsetAlignment.value,
          viewportWidth - offsetFromWindow.value,
        )
      } else {
        left = Math.max(
          triggerRect.left + (triggerRect.width - floatingWidth) / 2,
          offsetFromWindow.value,
        )
      }
    } else if (placement.startsWith('left')) {
      left = Math.max(
        triggerRect.left - floatingWidth - offsetFromTrigger.value,
        offsetFromWindow.value,
      )
    } else if (placement.startsWith('right')) {
      left = Math.min(
        triggerRect.right + offsetFromTrigger.value,
        viewportWidth - offsetFromWindow.value,
      )
    }

    return pxToRem(left)
  })

  const maxHeight = computed(() => {
    const triggerRect = triggerRefRect.value

    if (!triggerRect) return pxToRem(viewportHeight - 2 * offsetFromWindow.value)

    let maxHeight: number

    if (adjustedPlacement.value.startsWith('left') || adjustedPlacement.value.startsWith('right')) {
      if (adjustedPlacement.value.endsWith('top')) {
        maxHeight =
          viewportHeight - triggerRect.top - offsetFromWindow.value - offsetAlignment.value
      } else if (adjustedPlacement.value.endsWith('bottom')) {
        maxHeight = triggerRect.bottom - offsetFromWindow.value - offsetAlignment.value
      } else {
        maxHeight = viewportHeight - 2 * offsetFromWindow.value
      }
    } else {
      maxHeight = Math.min(
        adjustedPlacement.value.startsWith('top')
          ? triggerRect.top - offsetFromWindow.value - offsetFromTrigger.value
          : viewportHeight - triggerRect.bottom - offsetFromWindow.value - offsetFromTrigger.value,
        viewportHeight - 2 * offsetFromWindow.value,
      )
    }

    return pxToRem(maxHeight)
  })

  const maxWidth = computed(() => {
    const triggerRect = triggerRefRect.value

    if (!triggerRect) return pxToRem(viewportWidth - 2 * offsetFromWindow.value)

    let maxWidth: number

    if (adjustedPlacement.value.startsWith('top') || adjustedPlacement.value.startsWith('bottom')) {
      if (adjustedPlacement.value.endsWith('left')) {
        maxWidth = viewportWidth - triggerRect.left - offsetFromWindow.value - offsetAlignment.value
      } else if (adjustedPlacement.value.endsWith('right')) {
        maxWidth = triggerRect.right - offsetFromWindow.value - offsetAlignment.value
      } else {
        maxWidth = viewportWidth - 2 * offsetFromWindow.value
      }
    } else {
      maxWidth = Math.min(
        adjustedPlacement.value.startsWith('left')
          ? triggerRect.left - offsetFromWindow.value - offsetFromTrigger.value
          : viewportWidth - triggerRect.right - offsetFromWindow.value - offsetFromTrigger.value,
        viewportWidth - 2 * offsetFromWindow.value,
      )
    }

    return pxToRem(maxWidth)
  })

  function pxToRem(px: number) {
    return px / 16
  }

  return {
    adjustedPlacement,
    top,
    left,
    maxHeight,
    maxWidth,
    updatePositioningData,
  }
}
