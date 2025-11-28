import { useEffect, useState } from 'react'
import { syncAPI } from '../services/api'
import { useToast } from '../context/ToastContext'

export const useOfflineSync = () => {
  const [isSyncing, setIsSyncing] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)
  const { showSuccess, showError, showInfo } = useToast()

  // Check pending crops count
  const checkPendingCrops = () => {
    const pending = JSON.parse(localStorage.getItem('pendingCrops') || '[]')
    setPendingCount(pending.length)
    return pending
  }

  // Sync offline data
  const syncOfflineData = async () => {
    const pending = checkPendingCrops()
    
    if (pending.length === 0) {
      return { success: true, count: 0 }
    }

    setIsSyncing(true)
    
    try {
      const response = await syncAPI.syncOfflineData({ crops: pending })
      
      if (response.data.success) {
        // Clear localStorage
        localStorage.removeItem('pendingCrops')
        setPendingCount(0)
        
        const syncedCount = response.data.synced || 0
        const failedCount = response.data.failed || 0
        
        if (syncedCount > 0) {
          showSuccess(`Synced ${syncedCount} offline crop${syncedCount > 1 ? 's' : ''}!`)
        }
        
        if (failedCount > 0) {
          showError(`Failed to sync ${failedCount} crop${failedCount > 1 ? 's' : ''}`)
        }
        
        return { success: true, count: syncedCount }
      }
    } catch (error) {
      console.error('Sync error:', error)
      showError('Failed to sync offline data')
      return { success: false, count: 0 }
    } finally {
      setIsSyncing(false)
    }
  }

  // Listen for online event
  useEffect(() => {
    const handleOnline = async () => {
      const pending = checkPendingCrops()
      
      if (pending.length > 0) {
        showInfo(`You're back online! Syncing ${pending.length} pending crop${pending.length > 1 ? 's' : ''}...`)
        
        // Wait a bit for connection to stabilize
        setTimeout(() => {
          syncOfflineData()
        }, 1000)
      }
    }

    const handleOffline = () => {
      showInfo('You are offline. Data will be saved locally and synced when online.')
    }

    // Check initial state
    if (!navigator.onLine) {
      checkPendingCrops()
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Check pending on mount
  useEffect(() => {
    checkPendingCrops()
  }, [])

  return {
    isSyncing,
    pendingCount,
    syncOfflineData,
    checkPendingCrops
  }
}
