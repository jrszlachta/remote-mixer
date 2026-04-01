import { useContext } from 'react'

import { SettingsContext, SettingsWithUpdate } from '../settings'

export function useSettings(): SettingsWithUpdate {
  return useContext(SettingsContext)
}

export type IemSendSelection = string

interface IemSendSelectionStorage {
  send: IemSendSelection
  timestamp: number
}

const iemSendStorageKey = 'remoteMixerIemSend'
const iemSendTTL = 24 * 60 * 60 * 1000

export function getIemSendSelection(): IemSendSelection | null {
  try {
    const stored = localStorage[iemSendStorageKey]
    if (!stored) return null

    const selection: IemSendSelectionStorage = JSON.parse(stored)
    const now = Date.now()

    if (now - selection.timestamp > iemSendTTL) {
      clearIemSendSelection()
      return null
    }

    return selection.send
  } catch (error) {
    console.error('Error reading IEM send selection:', error)
    return null
  }
}

export function setIemSendSelection(send: IemSendSelection): void {
  const selection: IemSendSelectionStorage = {
    send,
    timestamp: Date.now(),
  }
  localStorage[iemSendStorageKey] = JSON.stringify(selection)
}

export function clearIemSendSelection(): void {
  delete localStorage[iemSendStorageKey]
}
