import { useEffect, useRef } from 'react'
import { Paper } from '@mui/material'
import L from 'leaflet'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface MapViewProps {
  restaurantLat?: number
  restaurantLng?: number
  deliveryLat?: number
  deliveryLng?: number
  agentLat?: number
  agentLng?: number
}

export default function MapView({ restaurantLat, restaurantLng, deliveryLat, deliveryLng, agentLat, agentLng }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const center: [number, number] = [restaurantLat || 40.7128, restaurantLng || -74.006]
    const map = L.map(mapRef.current).setView(center, 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map)

    if (restaurantLat && restaurantLng) {
      L.marker([restaurantLat, restaurantLng]).addTo(map).bindPopup('Restaurant')
    }
    if (deliveryLat && deliveryLng) {
      L.marker([deliveryLat, deliveryLng], { icon: L.divIcon({ className: 'delivery-marker', html: '📍', iconSize: [24, 24] }) })
        .addTo(map).bindPopup('Delivery Location')
    }
    if (agentLat && agentLng) {
      const agentMarker = L.marker([agentLat, agentLng], {
        icon: L.divIcon({ className: 'agent-marker', html: '🛵', iconSize: [24, 24] }),
      }).addTo(map).bindPopup('Delivery Agent')
      mapInstanceRef.current = { map, agentMarker }
    } else {
      mapInstanceRef.current = { map }
    }

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  useEffect(() => {
    if (mapInstanceRef.current?.agentMarker && agentLat && agentLng) {
      mapInstanceRef.current.agentMarker.setLatLng([agentLat, agentLng])
    }
  }, [agentLat, agentLng])

  return (
    <Paper sx={{ height: 300, width: '100%', overflow: 'hidden' }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
    </Paper>
  )
}
