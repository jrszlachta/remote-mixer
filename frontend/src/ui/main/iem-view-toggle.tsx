import { css } from '@linaria/core'
import { FaderProperty } from '@remote-mixer/types'

import { updateIemSendSelection } from '../../api/state'
import { iconAccount } from '../icons'
import { Icon } from '../icons/icon'
import { hasActiveOverlays } from '../overlays/overlay'
import { baseline, zCornerOverlay } from '../styles'

import { showIemSendSelectorDialog } from './iem-view-selector-dialog'

const topRightOverlay = css`
  position: absolute;
  z-index: ${zCornerOverlay};
  transform: translate3d(0, 0, 0);
  top: 0;
  right: 0;
`

const cornerIcon = css`
  padding: ${baseline(2)};
`

export interface IemSendToggleProps {
  availableSends: FaderProperty[]
}

export function IemSendToggle({ availableSends }: IemSendToggleProps) {
  const handleSendToggle = async () => {
    if (hasActiveOverlays()) return
    const selectedSend = await showIemSendSelectorDialog(availableSends)
    if (selectedSend !== null) {
      updateIemSendSelection(selectedSend)
    }
  }

  return (
    <div className={topRightOverlay}>
      <Icon
        className={cornerIcon}
        icon={iconAccount}
        hoverable
        onClick={handleSendToggle}
      />
    </div>
  )
}
