import { useCallback, useState } from 'react'

const useCustom = () => {
  const [isSeidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(!isSeidebarOpen)
  }, [isSeidebarOpen])

  return {
    data: {
      isSeidebarOpen,
    },
    methods: {
      toggleSidebar,
    },
  }
}

export default useCustom
