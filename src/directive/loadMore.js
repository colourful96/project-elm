import { getStyle } from '@/utils/index.js'

export const vLoadMore = (el, binding) => {
  console.log(el, 'el====  自定义指令')
  let windowHeight = window.screen.height
  let scrollType = el.attributes.type && el.attributes.type.value
  let scrollEl // 滚动容器
  let heightEl //
  let height
  let setTop
  let paddingBottom
  let marginBottom
  let oldScrollTop
  let requestFram
  if (scrollType === 2) {
    scrollEl = el
    heightEl = scrollEl.children[0]
  } else {
    scrollEl = document.body
    heightEl = el
  }
  el.addEventListener(
    'touchstart',
    () => {
      height = heightEl.clientHeight

      setTop = el.offsetTop
      paddingBottom = getStyle(el, 'paddingBottom')
      marginBottom = getStyle(el, 'marginBottom')
    },
    false,
  )
  el.addEventListener(
    'touchmove',
    () => {
      loadMore()
    },
    false,
  )
  el.addEventListener('touchend', () => {
    oldScrollTop = scrollEl.scrollTop
    moveEnd()
  })

  const moveEnd = () => {
    requestFram = requestAnimationFrame(() => {
      if (scrollEl.scrollTop !== oldScrollTop) {
        oldScrollTop = scrollEl.scrollTop
        moveEnd()
      } else {
        cancelAnimationFrame(requestFram)
        height = heightEl.clientHeight
        loadMore()
      }
    })
  }

  const loadMore = () => {
    if (scrollEl.scrollTop + windowHeight >= height + setTop + paddingBottom + marginBottom) {
      binding.value()
    }
  }
}
