//  Іконка для погоди
export function getWeatherIcon (id) {
    switch (true) {
        case id <= 232: return 'thunderstorm.png';
        case id <= 321: return 'drizzle.png';
        case id <= 531: return 'rain.png';
        case id <= 622: return 'snow.png';
        case id <= 781: return 'atmosphere.png';
        case id === 800: return 'clear.png';
        case id <= 802: return 'cloudy.png';
        default: return 'clouds.png';
    }
 }
