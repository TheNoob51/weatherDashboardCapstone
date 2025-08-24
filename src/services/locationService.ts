interface LocationResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  localNames?: { [key: string]: string };
}

interface SearchLocation {
  id: string;
  name: string;
  displayName: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

class LocationService {
  private apiKey = 'a4138b895f333ca8ccb2a890434e74b6';
  private geocodingUrl = 'https://api.openweathermap.org/geo/1.0';

  async searchLocations(query: string, limit: number = 5): Promise<SearchLocation[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      const response = await fetch(
        `${this.geocodingUrl}/direct?q=${encodeURIComponent(query.trim())}&limit=${limit}&appid=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data: LocationResult[] = await response.json();

      return data.map((location, index) => {
        // Create a display name with city, state (if available), and country
        let displayName = location.name;
        if (location.state) {
          displayName += `, ${location.state}`;
        }
        displayName += `, ${location.country}`;

        return {
          id: `${location.lat}-${location.lon}-${index}`,
          name: location.name,
          displayName,
          country: location.country,
          state: location.state,
          lat: location.lat,
          lon: location.lon,
        };
      });
    } catch (error) {
      console.error('Error searching locations:', error);
      throw error;
    }
  }

  async reverseGeocode(lat: number, lon: number): Promise<SearchLocation | null> {
    try {
      const response = await fetch(
        `${this.geocodingUrl}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Reverse geocoding API error: ${response.status}`);
      }

      const data: LocationResult[] = await response.json();
      
      if (data.length === 0) {
        return null;
      }

      const location = data[0];
      let displayName = location.name;
      if (location.state) {
        displayName += `, ${location.state}`;
      }
      displayName += `, ${location.country}`;

      return {
        id: `${location.lat}-${location.lon}-0`,
        name: location.name,
        displayName,
        country: location.country,
        state: location.state,
        lat: location.lat,
        lon: location.lon,
      };
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }

  // Get popular cities for initial suggestions
  getPopularCities(): SearchLocation[] {
    return [
      {
        id: 'popular-nyc',
        name: 'New York',
        displayName: 'New York, NY, US',
        country: 'US',
        state: 'NY',
        lat: 40.7128,
        lon: -74.0060,
      },
      {
        id: 'popular-london',
        name: 'London',
        displayName: 'London, GB',
        country: 'GB',
        lat: 51.5074,
        lon: -0.1278,
      },
      {
        id: 'popular-tokyo',
        name: 'Tokyo',
        displayName: 'Tokyo, JP',
        country: 'JP',
        lat: 35.6762,
        lon: 139.6503,
      },
      {
        id: 'popular-paris',
        name: 'Paris',
        displayName: 'Paris, FR',
        country: 'FR',
        lat: 48.8566,
        lon: 2.3522,
      },
      {
        id: 'popular-sydney',
        name: 'Sydney',
        displayName: 'Sydney, NSW, AU',
        country: 'AU',
        state: 'NSW',
        lat: -33.8688,
        lon: 151.2093,
      },
    ];
  }
}

export const locationService = new LocationService();
export type { SearchLocation };