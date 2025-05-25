# GoogleMap Component

A React component that displays interactive maps without requiring API keys. Uses OpenStreetMap as the primary map service to avoid iframe embedding restrictions.

## Features

- ✅ No API keys required
- ✅ Works with addresses or coordinates
- ✅ Fallback error handling
- ✅ Link to open in Google Maps
- ✅ Responsive design
- ✅ No iframe embedding restrictions

## Usage

```tsx
import GoogleMap from '../components/ui/GoogleMap';

// With address
<GoogleMap 
  address="123 Main St, New York, NY" 
  height="300px"
  className="rounded-lg"
/>

// With coordinates
<GoogleMap 
  latitude={40.7128} 
  longitude={-74.0060}
  height="300px"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `address` | `string` | - | Street address to display |
| `latitude` | `number` | - | Latitude coordinate |
| `longitude` | `number` | - | Longitude coordinate |
| `height` | `string` | `"300px"` | Height of the map container |
| `className` | `string` | `""` | Additional CSS classes |

## Implementation Details

- Uses OpenStreetMap for the main map display
- Provides a "View in Google Maps" link for full functionality
- Graceful error handling with fallback UI
- Location marker overlay for addresses
- Interactive map with click-to-zoom functionality

## Migration from Google Maps iframe

This component replaces the previous Google Maps iframe implementation that was causing the "Can't Open This Page" error in Zen browser and other browsers with strict iframe policies.

### Before:
```tsx
<iframe 
  src={property.google_maps_url} 
  width="100%" 
  height="100%" 
  style={{ border: 0 }} 
  allowFullScreen 
/>
```

### After:
```tsx
<GoogleMap 
  address={property.address}
  height="240px"
  className="rounded-lg"
/>
```
