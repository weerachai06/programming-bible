import { NextResponse } from 'next/server'

export interface Weather {
  id: number
  city: string
  country: string
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  windDirection: string
  pressure: number
  visibility: number
  uvIndex: number
  condition: string
  description: string
  icon: string
  timestamp: string
  forecast: {
    day: string
    high: number
    low: number
    condition: string
    icon: string
  }[]
}

const cities = [
  { name: 'New York', country: 'USA' },
  { name: 'London', country: 'UK' },
  { name: 'Tokyo', country: 'Japan' },
  { name: 'Sydney', country: 'Australia' },
  { name: 'Paris', country: 'France' },
  { name: 'Berlin', country: 'Germany' },
  { name: 'Bangkok', country: 'Thailand' },
  { name: 'Singapore', country: 'Singapore' },
]

const conditions = [
  { condition: 'Sunny', icon: '☀️', description: 'Clear sky' },
  { condition: 'Partly Cloudy', icon: '⛅', description: 'Partly cloudy' },
  { condition: 'Cloudy', icon: '☁️', description: 'Overcast' },
  { condition: 'Rainy', icon: '🌧️', description: 'Light rain' },
  { condition: 'Stormy', icon: '⛈️', description: 'Thunderstorm' },
  { condition: 'Snowy', icon: '❄️', description: 'Snow' },
  { condition: 'Foggy', icon: '🌫️', description: 'Fog' },
]

const windDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']

const generateMockWeather = (count: number): Weather[] => {
  return Array.from({ length: count }, (_, i) => {
    const city = cities[i % cities.length]
    const weather = conditions[Math.floor(Math.random() * conditions.length)]
    const temperature = Math.floor(Math.random() * 40 - 10) // -10 to 30°C

    return {
      id: i + 1,
      city: city.name,
      country: city.country,
      temperature,
      feelsLike: temperature + Math.floor(Math.random() * 6 - 3), // ±3°C difference
      humidity: Math.floor(Math.random() * 60 + 30), // 30-90%
      windSpeed: Math.floor(Math.random() * 30 + 5), // 5-35 km/h
      windDirection:
        windDirections[Math.floor(Math.random() * windDirections.length)],
      pressure: Math.floor(Math.random() * 100 + 980), // 980-1080 hPa
      visibility: Math.floor(Math.random() * 20 + 5), // 5-25 km
      uvIndex: Math.floor(Math.random() * 12), // 0-11
      condition: weather.condition,
      description: weather.description,
      icon: weather.icon,
      timestamp: new Date().toISOString(),
      forecast: Array.from({ length: 5 }, (_, day) => {
        const forecastWeather =
          conditions[Math.floor(Math.random() * conditions.length)]
        return {
          day: new Date(
            Date.now() + (day + 1) * 24 * 60 * 60 * 1000
          ).toLocaleDateString('en-US', { weekday: 'short' }),
          high: temperature + Math.floor(Math.random() * 10 - 5),
          low: temperature - Math.floor(Math.random() * 10 + 5),
          condition: forecastWeather.condition,
          icon: forecastWeather.icon,
        }
      }),
    }
  })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const count = parseInt(searchParams.get('count') || '8')
  const city = searchParams.get('city')
  const delay = parseInt(searchParams.get('delay') || '300')

  // Simulate network delay
  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay))
  }

  let weather = generateMockWeather(count)

  // Filter by city if specified
  if (city) {
    weather = weather.filter(w =>
      w.city.toLowerCase().includes(city.toLowerCase())
    )
  }

  console.log(
    `🌤️ API: Generating ${weather.length} weather reports with ${delay}ms delay`
  )

  return NextResponse.json(
    {
      data: weather,
      meta: {
        timestamp: new Date().toISOString(),
        count: weather.length,
        delay,
        filter: city ? { city } : null,
        cache: 'miss',
      },
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5 minutes cache
        'X-API-Type': 'weather',
      },
    }
  )
}
