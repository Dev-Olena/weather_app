// Запит на сервер
export async function fetchWeatherData (endpoint, city, apiKey) {
   const requestUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apiKey}&units=metric&lang=uk`;
   try {
       const response = await fetch(requestUrl);
       if(!response.ok) {
           const error = await response.json();
           if(response.status >= 500) {
               throw new Error('Сервер тимчасово недоступний, спробуйте пізніше')
           }
           throw new Error(error.message || 'Не вдалося отримати дані')
       }
       return response.json();
   } catch (error) {
       console.log(error)
       if(error.message === 'Failed to fetch') {
           throw new Error('Проблеми з підключенням до сервера')
       }
       if(error.message ==='city not found') {
           throw new Error('Місто не знайдено, перевірте правильність написання')
       }
       throw error;
   }
}