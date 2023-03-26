import { useEffect, useState } from 'react'
import $ from 'jquery'

const useObserver = (): number => {
  const [observerTick, setObserverTick] = useState(0)

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      const isMutable = !mutations.some(mutation => {
        if (mutation.target) {
          return $(mutation.target).attr('id') === 'root-quick-command' || $(mutation.target).parents('#root-quick-command').length > 0
        }

        return false
      })

      if (isMutable) {
        setObserverTick(observerTick + 1)
      }
    })

    observer.observe(document.body, { childList:true, subtree:true })
  })

  return observerTick
}

export default useObserver