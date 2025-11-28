import axios from "axios";
import { redis } from "../lib/redis.lib.js";
const etclCache = new Map();
const sensorDataCache = new Map();


const RISK_THRESHOLDS = {
    temperature: { low: 25, medium: 30, high: 35 },
    moisture: { low: 14, medium: 18, high: 22 },
    humidity: { low: 60, medium: 75, high: 85 }
};

const STORAGE_FACTORS = {
    "Silo": 1.5,
    "Jute Bag Stack": 1.0,
    "Open Area": 0.6
};


export function generateMockSensorData(cropId, days = 7) {
    const cacheKey = `${cropId}-${days}`;
    

    if (sensorDataCache.has(cacheKey)) {
        const cached = sensorDataCache.get(cacheKey);
        
        if (Date.now() - cached.timestamp < 600000) {
            return cached.data;
        } else {
            sensorDataCache.delete(cacheKey);
        }
    }
   
    const totalReadings = days * 4; 
    const sensorData = new Array(totalReadings);
    const baseTemp = 25 + Math.random() * 10;
    const baseMoisture = 12 + Math.random() * 8;
    
    let index = 0;
    for (let i = 0; i < days; i++) {
        for (let hour = 0; hour < 24; hour += 6) {
            sensorData[index] = {
                cropId,
                timestamp: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000 + hour * 60 * 60 * 1000),
                temperature: baseTemp + (Math.random() - 0.5) * 6,
                moisture: baseMoisture + (Math.random() - 0.5) * 4,
                humidity: 60 + Math.random() * 30
            };
            index++;
        }
    }
    
    sensorDataCache.set(cacheKey, {
        data: sensorData,
        timestamp: Date.now()
    });
    

    if (sensorDataCache.size > 100) {
        const firstKey = sensorDataCache.keys().next().value;
        sensorDataCache.delete(firstKey);
    }
    
    return sensorData;
}


export function calculateETCL(sensorData, weatherForecast, storageType, cropId) {
    const weatherKey = weatherForecast.slice(0, 3).map(w => `${w.tempMax}-${w.humidity}-${w.rainChance}`).join('|');
    const sensorKey = sensorData.length > 0 ? 
        `${sensorData[sensorData.length - 1].temperature.toFixed(1)}-${sensorData[sensorData.length - 1].moisture.toFixed(1)}` : 
        'no-data';
    const cacheKey = `etcl:${cropId}:${storageType}:${sensorKey}:${weatherKey}`;
    
    
    if (etclCache.has(cacheKey)) {
        const cached = etclCache.get(cacheKey);
        if (Date.now() - cached.timestamp < 300000) { 
            return cached.result;
        } else {
            etclCache.delete(cacheKey);
        }
    }
    
    let baseETCL = 168; 
    let riskScore = 0;
    let riskFactors = [];
    
    
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    let recentData = [];
    let tempSum = 0, moistureSum = 0, humiditySum = 0;
    
    
    for (let i = sensorData.length - 1; i >= 0; i--) {
        const readingTime = new Date(sensorData[i].timestamp).getTime();
        if (readingTime >= oneDayAgo) {
            recentData.push(sensorData[i]);
            tempSum += sensorData[i].temperature;
            moistureSum += sensorData[i].moisture;
            humiditySum += sensorData[i].humidity;
        } else {
            break; 
        }
    }
    
    if (recentData.length === 0) {
        const result = {
            etcl: baseETCL,
            riskLevel: 'Unknown',
            riskScore: 0,
            factors: ['No recent sensor data available']
        };
        
        
        etclCache.set(cacheKey, { result, timestamp: Date.now() });
        return result;
    }
    
    const avgTemp = tempSum / recentData.length;
    const avgMoisture = moistureSum / recentData.length;
    const avgHumidity = humiditySum / recentData.length;
    
    
    if (avgTemp >= RISK_THRESHOLDS.temperature.high) {
        riskScore += 40;
        riskFactors.push(`High temperature (${avgTemp.toFixed(1)}°C)`);
        baseETCL *= 0.4; 
    } else if (avgTemp >= RISK_THRESHOLDS.temperature.medium) {
        riskScore += 20;
        riskFactors.push(`Elevated temperature (${avgTemp.toFixed(1)}°C)`);
        baseETCL *= 0.7;
    }
    
    
    if (avgMoisture >= RISK_THRESHOLDS.moisture.high) {
        riskScore += 35;
        riskFactors.push(`High moisture content (${avgMoisture.toFixed(1)}%)`);
        baseETCL *= 0.3;
    } else if (avgMoisture >= RISK_THRESHOLDS.moisture.medium) {
        riskScore += 15;
        riskFactors.push(`Elevated moisture (${avgMoisture.toFixed(1)}%)`);
        baseETCL *= 0.6;
    }
    
    
    if (avgHumidity >= RISK_THRESHOLDS.humidity.high) {
        riskScore += 25;
        riskFactors.push(`High ambient humidity (${avgHumidity.toFixed(1)}%)`);
        baseETCL *= 0.5;
    } else if (avgHumidity >= RISK_THRESHOLDS.humidity.medium) {
        riskScore += 10;
        riskFactors.push(`Moderate humidity (${avgHumidity.toFixed(1)}%)`);
        baseETCL *= 0.8;
    }
    
    
    const upcomingWeather = weatherForecast.slice(0, 3);
    
    
    for (let i = 0; i < upcomingWeather.length; i++) {
        const day = upcomingWeather[i];
        const dayWeight = 1 - (i * 0.2);
        
        
        const rainRisk = day.rainChance > 70 ? 20 : day.rainChance > 40 ? 10 : 0;
        const humidityRisk = day.humidity > 80 ? 15 : 0;
        const tempRisk = day.tempMax > 35 ? 15 : 0;
        
        riskScore += (rainRisk + humidityRisk + tempRisk) * dayWeight;
        
        
        if (rainRisk === 20) {
            riskFactors.push(`High rain probability (${day.rainChance}%) on ${day.date}`);
            baseETCL *= 0.6;
        } else if (rainRisk === 10) {
            riskFactors.push(`Moderate rain chance (${day.rainChance}%) on ${day.date}`);
            baseETCL *= 0.8;
        }
        
        if (humidityRisk > 0) {
            riskFactors.push(`High forecast humidity (${day.humidity}%) on ${day.date}`);
            baseETCL *= 0.7;
        }
        
        if (tempRisk > 0) {
            riskFactors.push(`High forecast temperature (${day.tempMax}°C) on ${day.date}`);
            baseETCL *= 0.6;
        }
    }
    
  
    const storageFactor = STORAGE_FACTORS[storageType] || 1.0;
    baseETCL *= storageFactor;
    
    if (storageFactor < 1.0) {
        riskFactors.push(`Poor storage conditions (${storageType})`);
        riskScore += 15;
    } else if (storageFactor > 1.0) {
        riskFactors.push(`Good storage protection (${storageType})`);
    }
    

    const riskLevels = ['Low', 'Medium', 'High', 'Critical'];
    const riskLevelIndex = riskScore >= 70 ? 3 : riskScore >= 40 ? 2 : riskScore >= 20 ? 1 : 0;
    
    const result = {
        etcl: Math.max(6, Math.round(baseETCL)),
        riskLevel: riskLevels[riskLevelIndex],
        riskScore: Math.round(riskScore),
        factors: riskFactors,
        currentConditions: {
            temperature: parseFloat(avgTemp.toFixed(1)),
            moisture: parseFloat(avgMoisture.toFixed(1)),
            humidity: parseFloat(avgHumidity.toFixed(1))
        }
    };
    
 
    etclCache.set(cacheKey, { result, timestamp: Date.now() });
    

    if (etclCache.size > 200) {
        const firstKey = etclCache.keys().next().value;
        etclCache.delete(firstKey);
    }
    
    return result;
}


export function generateRiskSummary(prediction, weatherForecast, cropType) {
    const { etcl, riskLevel, factors, currentConditions } = prediction;
    
    let summary = "";
    let recommendations = [];
    
 
    if (riskLevel === 'Critical') {
        summary = `🔴 CRITICAL RISK of Aflatoxin Mold Development (ETCL: ${etcl} hours). `;
        recommendations.push("Immediate action required: Move crop to dry, well-ventilated storage");
        recommendations.push("Consider emergency drying procedures");
    } else if (riskLevel === 'High') {
        summary = `🟠 HIGH RISK of Aflatoxin Mold (ETCL: ${etcl} hours). `;
        recommendations.push("Urgent: Improve ventilation and monitor closely");
        recommendations.push("Prepare for indoor storage if rain is forecast");
    } else if (riskLevel === 'Medium') {
        summary = `🟡 MODERATE RISK detected (ETCL: ${Math.round(etcl/24)} days). `;
        recommendations.push("Monitor conditions regularly");
        recommendations.push("Ensure adequate ventilation");
    } else {
        summary = `🟢 LOW RISK - Conditions are favorable (ETCL: ${Math.round(etcl/24)} days). `;
        recommendations.push("Continue current storage practices");
        recommendations.push("Regular monitoring recommended");
    }
  
    const highRainDays = weatherForecast.filter(day => day.rainChance > 60);
    const highHumidityDays = weatherForecast.filter(day => day.humidity > 80);
    
    if (highRainDays.length > 0) {
        summary += `Weather forecast shows ${highRainDays.length} days with high rain probability, increasing drying risks. `;
        recommendations.push("Prepare covered/indoor storage areas");
    }
    
    if (highHumidityDays.length > 0) {
        summary += `High humidity expected for ${highHumidityDays.length} days, requiring enhanced aeration. `;
        recommendations.push("Increase ventilation during high humidity periods");
    }
    
    
    summary += `Current conditions: ${currentConditions.temperature}°C, ${currentConditions.moisture}% moisture, ${currentConditions.humidity}% humidity.`;
    
    return {
        summary,
        recommendations,
        timeframe: etcl < 48 ? 'Immediate (within 48 hours)' : etcl < 168 ? 'Short-term (this week)' : 'Medium-term (next week)'
    };
}


export async function getWeatherForPrediction(user) {
    try {
        const cacheKey = `weather:${user.district}`;
        const compressionKey = `weather:compressed:${user.district}`;
        

        let cached = await redis.get(compressionKey);
        if (cached) {
            try {
                const weatherData = JSON.parse(cached);
                return weatherData.forecast;
            } catch (e) {

                cached = await redis.get(cacheKey);
                if (cached) {
                    const weatherData = JSON.parse(cached);
                    return weatherData.forecast;
                }
            }
        }
        

        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (!apiKey) {
            throw new Error('Weather API key not configured');
        }
        
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${user.latitude}&lon=${user.longitude}&appid=${apiKey}&units=metric&lang=en`;
        const response = await axios.get(url);
        
        
        const dailyForecasts = processForecastData(response.data.list);
        

        const weatherData = {
            success: true,
            location: { district: user.district, lat: user.latitude, lon: user.longitude },
            forecast: dailyForecasts,
            fetchedAt: new Date().toISOString()
        };
        
 
        const pipeline = redis.pipeline();
        pipeline.set(cacheKey, JSON.stringify(weatherData), 'EX', 14400);
        pipeline.set(compressionKey, JSON.stringify(weatherData), 'EX', 14400);
        await pipeline.exec();
        
        return dailyForecasts;
    } catch (error) {
        console.error('Error fetching weather for prediction:', error.message);
        return generateMockWeatherForecast();
    }
}

export function processForecastData(forecastList) {
    const dailyData = {};

    forecastList.forEach(item => {
        const date = item.dt_txt.split(' ')[0]; 

        if (!dailyData[date]) {
            dailyData[date] = {
                date: date,
                temps: [],
                humidity: [],
                rainProb: [],
                weather: [],
                windSpeed: []
            };
        }

        dailyData[date].temps.push(item.main.temp);
        dailyData[date].humidity.push(item.main.humidity);
        dailyData[date].rainProb.push((item.pop || 0) * 100); 
        dailyData[date].weather.push(item.weather[0]);
        dailyData[date].windSpeed.push(item.wind.speed);
    });

    return Object.keys(dailyData).slice(0, 7).map(date => {
        const day = dailyData[date];
        return {
            date: date,
            tempMax: Math.round(Math.max(...day.temps)),
            tempMin: Math.round(Math.min(...day.temps)),
            tempAvg: Math.round(day.temps.reduce((a, b) => a + b, 0) / day.temps.length),
            humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
            rainChance: Math.round(Math.max(...day.rainProb)),
            windSpeed: Math.round(day.windSpeed.reduce((a, b) => a + b, 0) / day.windSpeed.length),
            condition: day.weather[0].main,
            description: day.weather[0].description,
            icon: day.weather[0].icon
        };
    });
}

export function generateMockWeatherForecast() {
    const forecast = [];
    const baseTemp = 28 + Math.random() * 8;
    
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        
        forecast.push({
            date: date.toISOString().split('T')[0],
            tempMax: Math.round(baseTemp + (Math.random() - 0.5) * 6),
            tempMin: Math.round(baseTemp - 5 + (Math.random() - 0.5) * 4),
            tempAvg: Math.round(baseTemp + (Math.random() - 0.5) * 4),
            humidity: Math.round(65 + Math.random() * 25),
            rainChance: Math.round(Math.random() * 80),
            windSpeed: Math.round(5 + Math.random() * 10),
            condition: Math.random() > 0.7 ? 'Rain' : Math.random() > 0.5 ? 'Clouds' : 'Clear',
            description: 'Mock weather data',
            icon: '01d'
        });
    }
    
    return forecast;
}
