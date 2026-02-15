# IEM and Full Mode Configuration

The Remote Mixer supports two operational modes that control which functionalities are shown to users in the frontend interface.

## Modes

### Full Mode (default)

Shows all available controls and features. This is the default mode suitable for complete mixer control.

### IEM Mode (In-Ear Monitor)

Shows simplified controls specifically for monitor mixing. This mode is ideal for musicians who need to adjust their in-ear monitor mix without being overwhelmed by all available controls.

## Configuration

To set the mode, edit the `config/remote-mixer-config.js` file:

```javascript
const userConfig = {
  mode: 'iem', // or 'full' (default)
}
```

## Device Controller Integration

Device controllers can specify which categories should be visible in each mode by adding a `modes` property to category configurations:

```typescript
const category: DeviceConfigurationCategory = {
  key: 'monitors',
  label: 'Monitors',
  count: 16,
  modes: ['iem'], // Only visible in IEM mode
  // ... other properties
}
```

If no `modes` property is specified, the category will be visible in all modes.

### Examples

```typescript
// Visible only in Full mode
modes: ['full']

// Visible only in IEM mode
modes: ['iem']

// Visible in both modes (same as omitting the property)
modes: ['iem', 'full']

// Visible in all modes (default behavior)
// modes property not specified
```

### Real-world Example

Here's an example of a device configuration for a Behringer X32 mixer configured for IEM mode:

```typescript
export const deviceConfig: DeviceConfiguration = {
  categories: [
    {
      key: 'ch',
      label: 'Channels',
      count: 32,
      modes: ['full'], // Only show in full mode - too complex for IEM
      // ... other properties
    },
    {
      key: 'bus',
      label: 'Monitor Buses',
      count: 16,
      modes: ['iem', 'full'], // Show in both modes
      // ... other properties
    },
    {
      key: 'dca',
      label: 'DCA Groups',
      count: 8,
      modes: ['full'], // Only show in full mode
      // ... other properties
    },
  ],
}
```

## Frontend Implementation

The frontend automatically filters categories based on the current mode. The filtering happens in the `MainContainer` component, which uses the `useRemoteMixerMode()` hook to get the current mode from the API sync message.
