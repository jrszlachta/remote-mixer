import { css } from '@linaria/core'
import { FaderProperty } from '@remote-mixer/types'

import { IemSendSelection } from '../../hooks/settings'
import { Button } from '../buttons/button'
import { showDialog } from '../overlays/dialog'
import { baseline, textShade } from '../styles'

const container = css`
  text-align: center;
  padding: ${baseline(2)};
  padding-right: ${baseline(7.5)};
  max-width: 600px;
`

const title = css`
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: ${baseline(3)};
  color: ${textShade(0)};
`

const subtitle = css`
  font-size: 0.9em;
  margin-bottom: ${baseline(2)};
  color: ${textShade(1)};
`

const sendGrid = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: ${baseline(2)};
  margin-top: ${baseline(2)};
`

const sendButton = css`
  display: block !important;
  margin: 0 !important;
  width: 100%;
`

interface IemSendSelectorContentProps {
  availableSends: FaderProperty[]
  onSelect: (send: IemSendSelection) => void
}

function IemSendSelectorContent({
  availableSends,
  onSelect,
}: IemSendSelectorContentProps) {
  return (
    <div className={container}>
      <div className={title}>Select Your Monitor Send</div>
      <div className={subtitle}>
        Choose which aux or mix send you want to control
      </div>
      <div className={sendGrid}>
        {availableSends.map(send => (
          <Button
            key={send.key}
            onDown={() => onSelect(send.key)}
            className={sendButton}
          >
            {send.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

export async function showIemSendSelectorDialog(
  availableSends: FaderProperty[],
  dismissible: boolean = true
): Promise<IemSendSelection | null> {
  return new Promise<IemSendSelection | null>(resolve => {
    let closeHandler: ((value: any) => void) | null = null

    const handleSelect = (send: IemSendSelection) => {
      resolve(send)
      if (closeHandler) {
        closeHandler(true)
      }
    }

    showDialog(
      <IemSendSelectorContent
        availableSends={availableSends}
        onSelect={handleSelect}
      />,
      [],
      {
        showCloseButton: dismissible,
        closeOnBackDrop: dismissible,
      },
      handler => {
        closeHandler = handler
      }
    ).then(result => {
      if (!result) {
        resolve(null)
      }
    })
  })
}
