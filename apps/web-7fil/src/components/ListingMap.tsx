'use client'
import { useEffect, useRef } from 'react'
import type { MapPin } from '../lib/api'
import { formatPrice } from '../lib/utils'

interface Props {
  pins: MapPin[]
  onPinClick?: (id: string) => void
}

export function ListingMap({ pins, onPinClick }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current || !process.env.NEXT_PUBLIC_MAPBOX_TOKEN) return

    let map: mapboxgl.Map | null = null

    import('mapbox-gl').then((mapboxgl) => {
      mapboxgl.default.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

      map = new mapboxgl.default.Map({
        container: mapRef.current!,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [35.24, 38.96],
        zoom: 5.5,
      })

      map.addControl(new mapboxgl.default.NavigationControl(), 'top-right')

      map.on('load', () => {
        if (!map) return

        // Pin verisi GeoJSON olarak ekle
        map.addSource('pins', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: pins.map((p) => ({
              type: 'Feature',
              geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
              properties: {
                id: p.id,
                title: p.title,
                price: p.price,
                currency: p.currency,
                listingType: p.listingType,
              },
            })),
          },
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50,
        })

        // Cluster circle
        map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'pins',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': '#2d6a6a',
            'circle-radius': ['step', ['get', 'point_count'], 20, 10, 30, 100, 40],
            'circle-opacity': 0.9,
          },
        })

        // Cluster count
        map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'pins',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-size': 13,
          },
          paint: { 'text-color': '#fff' },
        })

        // Tekil pin
        map.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'pins',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#c9a84c',
            'circle-radius': 8,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff',
          },
        })

        // Pin tıklaması
        map.on('click', 'unclustered-point', (e) => {
          const feature = e.features?.[0]
          if (!feature) return
          const props = feature.properties as MapPin & { id: string }
          const coords = (feature.geometry as GeoJSON.Point).coordinates as [number, number]

          new mapboxgl.default.Popup({ closeButton: false, offset: 16 })
            .setLngLat(coords)
            .setHTML(`
              <div class="p-2 min-w-[160px]">
                <p class="font-semibold text-ink text-sm line-clamp-2">${props.title}</p>
                <p class="text-gold font-bold mt-1">${formatPrice(props.price, props.currency)}</p>
                <a href="/ilan/${props.id}" class="mt-2 block text-xs text-teal hover:underline">Detayı Gör →</a>
              </div>
            `)
            .addTo(map!)

          onPinClick?.(props.id)
        })

        map.on('mouseenter', 'unclustered-point', () => { map!.getCanvas().style.cursor = 'pointer' })
        map.on('mouseleave', 'unclustered-point', () => { map!.getCanvas().style.cursor = '' })
      })
    })

    return () => { map?.remove() }
  }, [pins, onPinClick])

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div className="w-full h-full bg-cream flex items-center justify-center rounded-xl text-muted text-sm">
        Harita için NEXT_PUBLIC_MAPBOX_TOKEN gerekli
      </div>
    )
  }

  return <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden" />
}
