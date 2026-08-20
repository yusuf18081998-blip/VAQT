import { ALL_WORLD_CITIES, WorldCityData } from '../data/worldCities';

export interface UserLocationInfo {
  city: string;
  country: string;
  timeZone: string;
  flag: string;
  latitude?: number;
  longitude?: number;
  source: 'gps' | 'timezone' | 'manual';
}

// Brauzer Timezone asosida shahar topish
export function detectTimezoneLocation(): UserLocationInfo {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Tashkent';
    
    // Ma'lumotlar bazasidan mos shaharni qidirish
    const matchedCity = ALL_WORLD_CITIES.find(
      (c) => c.timeZone.toLowerCase() === tz.toLowerCase()
    );

    if (matchedCity) {
      return {
        city: matchedCity.name,
        country: matchedCity.country,
        timeZone: matchedCity.timeZone,
        flag: matchedCity.flag,
        source: 'timezone',
      };
    }

    // Agar ro'yxatda aniq chiqmasa, nomini formatlash (masalan: Asia/Tashkent -> Tashkent)
    const parts = tz.split('/');
    const rawCity = parts[parts.length - 1].replace(/_/g, ' ');
    return {
      city: rawCity,
      country: parts[0] || 'Dunyo',
      timeZone: tz,
      flag: '🌐',
      source: 'timezone',
    };
  } catch {
    return {
      city: 'Toshkent',
      country: 'Oʻzbekiston',
      timeZone: 'Asia/Tashkent',
      flag: '🇺🇿',
      source: 'manual',
    };
  }
}

// Brauzer GPS / Geolocation orqali aniqlash
export async function requestGpsLocation(): Promise<UserLocationInfo> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(detectTimezoneLocation());
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const fallback = detectTimezoneLocation();

        try {
          // OpenStreetMap Nominatim orqali bepul tezkor reverse-geocoding
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=uz,en`,
            { headers: { 'User-Agent': 'VaqtApp/1.0' } }
          );
          if (res.ok) {
            const data = await res.json();
            const address = data.address || {};
            const city =
              address.city ||
              address.town ||
              address.village ||
              address.state ||
              fallback.city;
            const country = address.country || fallback.country;
            const countryCode = (address.country_code || '').toUpperCase();

            // Bayroq emojisini generatsiya qilish
            let flag = fallback.flag;
            if (countryCode && countryCode.length === 2) {
              const codePoints = countryCode
                .split('')
                .map((char: string) => 127397 + char.charCodeAt(0));
              flag = String.fromCodePoint(...codePoints);
            }

            resolve({
              city,
              country,
              timeZone: fallback.timeZone,
              flag,
              latitude,
              longitude,
              source: 'gps',
            });
            return;
          }
        } catch {
          // Xatolik bo'lsa fallback timezone ishlatiladi
        }

        resolve({
          ...fallback,
          latitude,
          longitude,
          source: 'gps',
        });
      },
      (error) => {
        console.warn('Geolocation rad etildi yoki xatolik:', error.message);
        resolve(detectTimezoneLocation());
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  });
}
