import { css } from '@linaria/core'
import { DeviceConfigurationCategory, FaderProperty } from '@remote-mixer/types'
import { useEffect, useMemo } from 'react'

import {
  updateIemSendSelection,
  useDeviceConfiguration,
  useIemSendSelection,
  useRemoteMixerMode,
} from '../../api/state'
import { CategoryControl } from '../../controls/category-control'
import { Tabs } from '../containers/tabs'
import { baseline, iconShade } from '../styles'

import { CornerOverlay } from './corner-overlay'
import { showIemSendSelectorDialog } from './iem-view-selector-dialog'
import { IemSendToggle } from './iem-view-toggle'

const mainContainer = css`
  display: flex;
  height: 100%;
`

const content = css`
  flex: 1 1 auto;
  padding: ${baseline(3)};
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;

  @media (min-width: 800px) {
    ::-webkit-scrollbar {
      width: ${baseline()};
      background: ${iconShade(3)};
    }

    ::-webkit-scrollbar-thumb {
      background: ${iconShade(1)};
    }
  }
`

// Helper to get available aux/mix sends from device configuration
function getAvailableSends(
  categories: DeviceConfigurationCategory[]
): FaderProperty[] {
  const sends: FaderProperty[] = []
  const seenKeys = new Set<string>()

  for (const category of categories) {
    if (category.faderProperties) {
      for (const prop of category.faderProperties) {
        // Only include aux/mix sends, not main faders
        if (
          prop.key !== 'value' &&
          (prop.key.startsWith('aux') ||
            prop.key.startsWith('mix') ||
            prop.key.startsWith('mtx'))
        ) {
          if (!seenKeys.has(prop.key)) {
            seenKeys.add(prop.key)
            sends.push(prop)
          }
        }
      }
    }
  }

  return sends
}

export const MainContainer = () => {
  const { categories } = useDeviceConfiguration()
  const mode = useRemoteMixerMode()
  const iemSend = useIemSendSelection()

  // Get available sends for IEM mode
  const availableSends = useMemo(
    () => getAvailableSends(categories),
    [categories]
  )

  // Show send selector dialog on first load in IEM mode
  useEffect(() => {
    if (mode === 'iem' && iemSend === null && availableSends.length > 0) {
      showIemSendSelectorDialog(availableSends).then(selectedSend => {
        if (selectedSend !== null) {
          updateIemSendSelection(selectedSend)
        }
      })
    }
  }, [mode, iemSend, availableSends])

  const visibleCategories = useMemo(() => {
    let filtered = categories.filter(
      category => !category.modes || category.modes.includes(mode)
    )

    // In IEM mode, modify categories to only show the selected send
    if (mode === 'iem' && iemSend) {
      filtered = filtered
        .map(category => {
          // If category has fader properties, filter them
          if (category.faderProperties && category.faderProperties.length > 0) {
            const selectedProp = category.faderProperties.find(
              prop => prop.key === iemSend
            )

            // If this category has the selected send, show only that property
            if (selectedProp) {
              return {
                ...category,
                faderProperties: [selectedProp],
              }
            }

            // If it doesn't have the selected send, hide it
            return null
          }

          // Keep categories without faderProperties (like aux masters)
          return category
        })
        .filter((cat): cat is DeviceConfigurationCategory => cat !== null)
    }

    return filtered
  }, [categories, mode, iemSend])

  return (
    <div className={mainContainer}>
      <div className={content}>
        <Tabs
          tabs={visibleCategories.map(category => ({
            id: category.key,
            label: category.label,
            content: <CategoryControl category={category} />,
          }))}
        />
      </div>
      <CornerOverlay />
      {mode === 'iem' && availableSends.length > 0 && (
        <IemSendToggle availableSends={availableSends} />
      )}
    </div>
  )
}
