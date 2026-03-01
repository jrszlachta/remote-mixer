import { StateCategoryEntry } from '@remote-mixer/types'

import { sendApiMessage } from '../api/api-wrapper'
import {
  useBypassIemMode,
  useDeviceCategory,
  useEntryState,
  useRemoteMixerMode,
} from '../api/state'
import { useMeter } from '../hooks/meter'
import { Button } from '../ui/buttons/button'
import { Entry } from '../ui/containers/entry'
import { Fader } from '../ui/controls/fader/fader'
import { iconDetails } from '../ui/icons'
import { Icon } from '../ui/icons/icon'

import { showEntryDialog } from './entry-dialog/entry-dialog'

export interface EntryControlProps {
  category: string
  id: string
  property?: string
}

export function EntryControl({
  category,
  id,
  property = 'value',
}: EntryControlProps) {
  const state = useEntryState(category, id) ?? ({} as StateCategoryEntry)
  const categoryInfo = useDeviceCategory(category)
  const mode = useRemoteMixerMode()
  const bypassIemMode = useBypassIemMode()
  const effectiveMode = bypassIemMode ? 'full' : mode

  function change(changedProperty: string, value: any) {
    sendApiMessage({
      type: 'change',
      category,
      id,
      property: changedProperty,
      value,
    })
  }

  const meterRef = useMeter(categoryInfo, id)

  return (
    <Entry inactive={!state.on}>
      {effectiveMode !== 'iem' && (
        <Button onDown={() => change('on', !state.on)} active={state.on}>
          {state.on ? 'ON' : 'OFF'}
        </Button>
      )}
      <Fader
        value={state[property] ?? 0}
        onChange={value => change(property, value)}
        max={255}
        step={1}
        label={(categoryInfo.namePrefix ?? '') + id}
        subLabel={state.name}
        color={state.color ?? undefined}
        meterRef={meterRef}
      />
      {effectiveMode !== 'iem' && (
        <Icon
          icon={iconDetails}
          hoverable
          padding
          onClick={() => showEntryDialog({ category, id })}
        />
      )}
    </Entry>
  )
}
