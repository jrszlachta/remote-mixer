import { css } from '@linaria/core'
import { FaderProperty } from '@remote-mixer/types'

import { updateIemSendSelection, useIemSendSelection } from '../../api/state'
import { iconAccount } from '../icons'
import { Icon } from '../icons/icon'
import { hasActiveOverlays } from '../overlays/overlay'
import { baseline, iconShade, zCornerOverlay } from '../styles'

import { showIemSendSelectorDialog } from './iem-view-selector-dialog'

const topRightOverlay = css`
  position: absolute;
  z-index: ${zCornerOverlay};
  transform: translate3d(0, 0, 0);
  top: 0;
  right: 0;
`

const toggleContainer = css`
  display: flex;
  align-items: center;
  gap: ${baseline()};
  cursor: pointer;
  padding: ${baseline(2)};
  border: none;
  background: transparent;

  &:hover .send-label {
    color: ${iconShade(0)};
  }

  &:hover .icon-account path {
    fill: ${iconShade(0)};
  }

  &:active {
    opacity: 0.7;
  }
`

const iconWrapper = css`
  fill: ${iconShade(1)};

  path {
    transition: fill 0.15s ease;
  }
`

const sendLabel = css`
  font-size: 0.9em;
  color: ${iconShade(1)};
  font-weight: 500;
  user-select: none;
  transition: color 0.15s ease;
`

export interface IemSendToggleProps {
  availableSends: FaderProperty[]
}

export function IemSendToggle({ availableSends }: IemSendToggleProps) {
  const currentSendKey = useIemSendSelection()

  const handleSendToggle = async () => {
    if (hasActiveOverlays()) return
    const selectedSend = await showIemSendSelectorDialog(availableSends)
    if (selectedSend !== null) {
      updateIemSendSelection(selectedSend)
    }
  }

  const currentSendLabel = currentSendKey
    ? availableSends.find(send => send.key === currentSendKey)?.label
    : null

  return (
    <div className={topRightOverlay}>
      <button className={toggleContainer} onClick={handleSendToggle}>
        {currentSendLabel && (
          <span className={`${sendLabel} send-label`}>{currentSendLabel}</span>
        )}
        <Icon
          className={`${iconWrapper} icon-account`}
          icon={iconAccount}
          shade={1}
        />
      </button>
    </div>
  )
}
