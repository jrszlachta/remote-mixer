import { ApiChangeMessage, ApiMetersMessage, RemoteMixerMode } from './api'

export type DeviceChangeMessage = ApiChangeMessage
export type DeviceMetersMessage = ApiMetersMessage
export type DeviceMessage = DeviceChangeMessage | DeviceMetersMessage

export type DeviceMessageListener = (message: DeviceMessage) => void

export interface FaderProperty {
  key: string
  label: string
}

export interface DeviceConfigurationCategory {
  key: string
  label: string
  count: number
  namePrefix?: string
  meters?: boolean
  faderProperties?: FaderProperty[]
  additionalProperties?: string[]
  /**
   * Optional modes in which this category should be visible.
   * If not specified, the category is visible in all modes.
   * - 'iem': Only show in In-Ear Monitor mode
   * - 'full': Only show in Full mode
   */
  modes?: RemoteMixerMode[]
}

export interface DeviceConfiguration {
  categories: DeviceConfigurationCategory[]
  colors?: boolean | string[]
}

export interface DeviceController {
  deviceConfig: DeviceConfiguration
  change(category: string, id: string, property: string, value: unknown): void
  sync?(): void
}

export interface DeviceControllerConstructor {
  new (listener: DeviceMessageListener, options?: any): DeviceController
}
