export function generateAdvisories(forecast, language, crops = []) {
    const advisories = [];
    const isBangla = language === 'ban';

    const hasCrops = crops.length > 0;
    const hasOpenStorage = crops.some(c => c.storageType === 'Open Area');
    const hasJuteBags = crops.some(c => c.storageType === 'Jute Bag Stack');
    const hasSilo = crops.some(c => c.storageType === 'Silo');
    

    const recentlyHarvested = crops.filter(c => {
        const daysSinceHarvest = Math.floor((new Date() - new Date(c.harvestDate)) / (1000 * 60 * 60 * 24));
        return daysSinceHarvest >= 0 && daysSinceHarvest <= 30;
    });
    
    const readyToHarvest = crops.filter(c => {
        const daysUntilHarvest = Math.floor((new Date(c.harvestDate) - new Date()) / (1000 * 60 * 60 * 24));
        return daysUntilHarvest >= 0 && daysUntilHarvest <= 7;
    });

    // 1. HEAVY RAIN WARNING (>70% for multiple days)
    const heavyRainDays = forecast.filter(day => day.rainChance > 70);
    if (heavyRainDays.length >= 2) {
        let messageBn = `⚠️ আগামী ${heavyRainDays.length} দিন ভারী বৃষ্টি ${heavyRainDays[0].rainChance}%`;
        let messageEn = `⚠️ Heavy rain ${heavyRainDays[0].rainChance}% for next ${heavyRainDays.length} days`;
        
        if (readyToHarvest.length > 0) {
            messageBn += `\n• আপনার ${readyToHarvest.length} ব্যাচ ধান এখনই কেটে নিন`;
            messageEn += `\n• Harvest your ${readyToHarvest.length} rice batches immediately`;
        }
        if (hasOpenStorage) {
            messageBn += `\n• খোলা জায়গায় রাখা ধান দ্রুত ঢেকে দিন (ত্রিপল/পলিথিন)\n• ভেজা হলে পচে যাবে`;
            messageEn += `\n• Cover rice in open storage immediately (tarpaulin)\n• Will spoil if wet`;
        }
        if (hasJuteBags) {
            messageBn += `\n• চটের বস্তা উঁচু জায়গায় সরান\n• মেঝে থেকে ইট দিয়ে উঁচু করুন`;
            messageEn += `\n• Move jute bags to higher ground\n• Elevate with bricks from floor`;
        }
        messageBn += `\n• নিচু জমিতে পানি জমতে পারে\n• সার প্রয়োগ স্থগিত রাখুন`;
        messageEn += `\n• Expect waterlogging in low areas\n• Postpone fertilizer application`;
        
        advisories.push({
            type: 'heavy_rain',
            priority: 'critical',
            messageBn,
            messageEn,
            icon: '🌧️',
            actions: ['harvest', 'cover_crops', 'drainage_check', 'protect_storage'],
            affectedCrops: readyToHarvest.length + (hasOpenStorage ? 1 : 0)
        });
    }

    // 2. MODERATE RAIN (40-70%)
    const moderateRainDays = forecast.filter(day => day.rainChance >= 40 && day.rainChance <= 70);
    if (moderateRainDays.length >= 2 && heavyRainDays.length < 2) {
        advisories.push({
            type: 'moderate_rain',
            priority: 'high',
            messageBn: `🌦️ আগামী ${moderateRainDays.length} দিন মাঝারি বৃষ্টি ${moderateRainDays[0].rainChance}%\n• পাকা ধান থাকলে কাটার প্রস্তুতি নিন\n• সেচ দেওয়ার প্রয়োজন নেই\n• রোগ ও পোকার আক্রমণ বাড়তে পারে`,
            messageEn: `🌦️ Moderate rain ${moderateRainDays[0].rainChance}% for ${moderateRainDays.length} days\n• Prepare to harvest ripe rice\n• No irrigation needed\n• Monitor for pest and disease`,
            icon: '🌦️',
            actions: ['prepare_harvest', 'pest_monitoring']
        });
    }

    // 3. LIGHT RAIN (20-40%)
    const lightRainDays = forecast.filter(day => day.rainChance >= 20 && day.rainChance < 40);
    if (lightRainDays.length >= 3) {
        advisories.push({
            type: 'light_rain',
            priority: 'medium',
            messageBn: `☁️ হালকা বৃষ্টির সম্ভাবনা ${lightRainDays[0].rainChance}%\n• ফসলে সেচের প্রয়োজন কম\n• আগাছা পরিষ্কার করার ভালো সময়\n• জৈব সার দেওয়া যেতে পারে`,
            messageEn: `☁️ Light rain possible ${lightRainDays[0].rainChance}%\n• Reduced irrigation needed\n• Good time for weeding\n• Can apply organic fertilizer`,
            icon: '☁️',
            actions: ['reduce_irrigation', 'weeding']
        });
    }

    // 4. EXTREME HEAT (>35°C)
    const extremeHeatDays = forecast.filter(day => day.tempMax > 35);
    if (extremeHeatDays.length > 0) {
        advisories.push({
            type: 'extreme_heat',
            priority: 'high',
            messageBn: `🔥 তীব্র গরম ${extremeHeatDays[0].tempMax}°C\n• সকাল ও বিকেলে ঢেচ দিন (দুপুরে নয়)\n• খড় বা পলিথিন দিয়ে মাটি ঢেকে দিন\n• পানি ধরে রাখার ব্যবস্থা করুন\n• ফসল পুড়ে যেতে পারে - নজর রাখুন`,
            messageEn: `🔥 Extreme heat ${extremeHeatDays[0].tempMax}°C\n• Water in morning & evening (avoid noon)\n• Mulch soil with straw or plastic\n• Maintain water retention\n• Monitor for heat stress`,
            icon: '🔥',
            actions: ['increase_watering', 'mulching', 'shade_crops']
        });
    }

    // 5. HIGH TEMPERATURE (30-35°C)
    const highTempDays = forecast.filter(day => day.tempMax >= 30 && day.tempMax <= 35);
    if (highTempDays.length >= 3 && extremeHeatDays.length === 0) {
        advisories.push({
            type: 'high_temp',
            priority: 'medium',
            messageBn: `🌡️ উষ্ণ আবহাওয়া ${highTempDays[0].tempMax}°C\n• নিয়মিত সেচ দিন\n• বিকেল ৪-৬টার মধ্যে পানি দিন\n• গাছের গোড়ায় পানি ধরে রাখুন`,
            messageEn: `🌡️ Warm weather ${highTempDays[0].tempMax}°C\n• Regular irrigation needed\n• Water between 4-6 PM\n• Maintain soil moisture`,
            icon: '🌡️',
            actions: ['regular_irrigation', 'evening_watering']
        });
    }

    // 6. COLD WEATHER (<15°C)
    const coldDays = forecast.filter(day => day.tempMin < 15);
    if (coldDays.length >= 2) {
        advisories.push({
            type: 'cold',
            priority: 'medium',
            messageBn: `🥶 ঠান্ডা আবহাওয়া ${coldDays[0].tempMin}°C\n• শীতজনিত রোগ থেকে ফসল রক্ষা করুন\n• কুয়াশায় ছত্রাক হতে পারে\n• সকালে পাতায় ঔষধ স্প্রে করুন\n• সেচ কমিয়ে দিন`,
            messageEn: `🥶 Cold weather ${coldDays[0].tempMin}°C\n• Protect crops from cold damage\n• Fog may cause fungal disease\n• Spray fungicide in morning\n• Reduce irrigation`,
            icon: '🥶',
            actions: ['fungicide_spray', 'reduce_watering', 'frost_protection']
        });
    }

    // 7. HIGH HUMIDITY (>80%)
    const highHumidityDays = forecast.filter(day => day.humidity > 80);
    if (highHumidityDays.length >= 3) {
        let messageBn = `💧 উচ্চ আর্দ্রতা ${highHumidityDays[0].humidity}%\n• ছত্রাক ও রোগের ঝুঁকি বেশি`;
        let messageEn = `💧 High humidity ${highHumidityDays[0].humidity}%\n• Increased risk of fungal diseases`;
        
        if (hasCrops && (hasJuteBags || hasOpenStorage)) {
            messageBn += `\n• আপনার সংরক্ষিত ধানে ছাতা পড়তে পারে\n• বায়ু চলাচল বাড়ান\n• স্যাঁতসেঁতে ব্যাগ আলাদা করুন`;
            messageEn += `\n• Your stored rice may develop fungus\n• Improve air circulation\n• Separate damp bags`;
        }
        messageBn += `\n• ছত্রাকনাশক স্প্রে করুন\n• গাছের মধ্যে বায়ু চলাচল বাড়ান\n• অতিরিক্ত পানি দেবেন না`;
        messageEn += `\n• Apply fungicide spray\n• Improve air circulation\n• Avoid overwatering`;
        
        advisories.push({
            type: 'high_humidity',
            priority: (hasJuteBags || hasOpenStorage) ? 'high' : 'medium',
            messageBn,
            messageEn,
            icon: '💧',
            actions: ['fungicide_application', 'improve_ventilation', 'check_storage']
        });
    }

    // 8. STRONG WIND (>15 km/h)
    const strongWindDays = forecast.filter(day => day.windSpeed > 15);
    if (strongWindDays.length > 0) {
        advisories.push({
            type: 'strong_wind',
            priority: 'high',
            messageBn: `💨 প্রবল বাতাস ${strongWindDays[0].windSpeed} km/h\n• ফসল ভালোভাবে বেঁধে দিন\n• গাছে খুঁটি দিয়ে সাপোর্ট দিন\n• ঢিলা মাটি শক্ত করে দিন\n• ছাদের টিন/চালা বাঁধুন`,
            messageEn: `💨 Strong wind ${strongWindDays[0].windSpeed} km/h\n• Secure crops firmly\n• Support plants with stakes\n• Firm up loose soil\n• Secure shed roofs`,
            icon: '💨',
            actions: ['stake_plants', 'secure_structures', 'firm_soil']
        });
    }

    // 9. MODERATE WIND (8-15 km/h)
    const moderateWindDays = forecast.filter(day => day.windSpeed >= 8 && day.windSpeed <= 15);
    if (moderateWindDays.length >= 3 && strongWindDays.length === 0) {
        advisories.push({
            type: 'moderate_wind',
            priority: 'low',
            messageBn: `🌬️ মাঝারি বাতাস ${moderateWindDays[0].windSpeed} km/h\n• লম্বা গাছে হালকা সাপোর্ট দিন\n• কীটনাশক স্প্রে এড়িয়ে চলুন\n• পরাগায়নের জন্য ভালো`,
            messageEn: `🌬️ Moderate wind ${moderateWindDays[0].windSpeed} km/h\n• Light support for tall plants\n• Avoid pesticide spraying\n• Good for pollination`,
            icon: '🌬️',
            actions: ['light_support']
        });
    }

    // 10. PERFECT DRYING WEATHER
    const perfectDryingDays = forecast.filter(day => 
        day.rainChance < 20 && 
        day.tempMax >= 28 && 
        day.tempMax <= 35 && 
        day.humidity < 70
    );
    if (perfectDryingDays.length >= 2) {
        let messageBn = `☀️ আগামী ${perfectDryingDays.length} দিন শুকানোর আদর্শ আবহাওয়া`;
        let messageEn = `☀️ Perfect drying weather for ${perfectDryingDays.length} days`;
        
        if (recentlyHarvested.length > 0) {
            messageBn += `\n• আপনার ${recentlyHarvested.length} ব্যাচ ধান এখনই শুকান (১২-১৪% আর্দ্রতা)`;
            messageEn += `\n• Dry your ${recentlyHarvested.length} rice batches now (12-14% moisture)`;
        }
        messageBn += `\n• ধান মাড়াই ও শুকানোর উত্তম সময়\n• বীজ শুকিয়ে সংরক্ষণ করুন\n• রোদে ফসল মেলে দিন`;
        messageEn += `\n• Best time for threshing & drying rice\n• Dry and store seeds\n• Sun-dry harvested crops`;
        
        if (hasOpenStorage) {
            messageBn += `\n• খোলা জায়গার ধান ছড়িয়ে রোদে দিন`;
            messageEn += `\n• Spread rice from open storage in sun`;
        }
        
        advisories.push({
            type: 'perfect_drying',
            priority: recentlyHarvested.length > 0 ? 'high' : 'low',
            messageBn,
            messageEn,
            icon: '☀️',
            actions: ['thresh_rice', 'dry_seeds', 'sun_dry_crops'],
            affectedCrops: recentlyHarvested.length
        });
    }

    // 11. IDEAL PLANTING CONDITIONS
    const idealPlantingDays = forecast.filter(day => 
        day.rainChance >= 20 && 
        day.rainChance <= 50 && 
        day.tempMax >= 25 && 
        day.tempMax <= 32 &&
        day.humidity >= 60 &&
        day.humidity <= 80
    );
    if (idealPlantingDays.length >= 3) {
        advisories.push({
            type: 'ideal_planting',
            priority: 'low',
            messageBn: `🌱 আগামী ${idealPlantingDays.length} দিন চারা রোপণের আদর্শ সময়\n• নতুন চারা রোপণ করুন\n• বীজ বপনের ভালো সময়\n• মাটি আর্দ্র ও নরম থাকবে\n• সার প্রয়োগ করা যাবে`,
            messageEn: `🌱 Ideal planting weather for ${idealPlantingDays.length} days\n• Plant new seedlings\n• Good time for sowing seeds\n• Soil will be moist and soft\n• Can apply fertilizers`,
            icon: '🌱',
            actions: ['plant_seedlings', 'sow_seeds', 'apply_fertilizer']
        });
    }

    // 12. FOGGY CONDITIONS
    const foggyDays = forecast.filter(day => 
        day.tempMin < 18 && 
        day.humidity > 85 && 
        (day.condition === 'Mist' || day.condition === 'Fog')
    );
    if (foggyDays.length >= 2) {
        advisories.push({
            type: 'fog',
            priority: 'medium',
            messageBn: `🌫️ কুয়াশার সম্ভাবনা\n• ব্লাস্ট রোগের ঝুঁকি বেশি\n• সকালে ছত্রাকনাশক স্প্রে করুন\n• পাতায় জমা পানি ঝরিয়ে দিন\n• বায়ু চলাচল বাড়ান`,
            messageEn: `🌫️ Foggy conditions expected\n• High risk of blast disease\n• Spray fungicide in morning\n• Shake off water from leaves\n• Improve air circulation`,
            icon: '🌫️',
            actions: ['fungicide_spray', 'disease_monitoring']
        });
    }

    // 13. CLOUDY WEATHER (low light)
    const cloudyDays = forecast.filter(day => 
        day.condition === 'Clouds' && 
        day.rainChance < 40
    );
    if (cloudyDays.length >= 4) {
        advisories.push({
            type: 'cloudy',
            priority: 'low',
            messageBn: `☁️ আগামী ${cloudyDays.length} দিন মেঘলা থাকবে\n• সালোকসংশ্লেষণ কমবে\n• বৃদ্ধি একটু ধীর হতে পারে\n• রোগ পর্যবেক্ষণ বাড়ান\n• অতিরিক্ত সার দেবেন না`,
            messageEn: `☁️ Cloudy for next ${cloudyDays.length} days\n• Reduced photosynthesis\n• Growth may slow slightly\n• Increase disease monitoring\n• Avoid excess fertilizer`,
            icon: '☁️',
            actions: ['monitor_growth', 'disease_watch']
        });
    }

    // 14. GENERAL GOOD WEATHER (no issues)
    if (advisories.length === 0) {
        const goodDays = forecast.filter(day => 
            day.rainChance < 30 && 
            day.tempMax >= 22 && 
            day.tempMax <= 35 &&
            day.windSpeed < 10
        );
        if (goodDays.length >= 3) {
            advisories.push({
                type: 'good_weather',
                priority: 'info',
                messageBn: `✅ আগামী ${goodDays.length} দিন আবহাওয়া অনুকূল\n• স্বাভাবিক কৃষিকাজ চালিয়ে যান\n• নিয়মিত পরিচর্যা করুন\n• আগাছা পরিষ্কার করুন\n• জমি পরিদর্শন করুন`,
                messageEn: `✅ Favorable weather for next ${goodDays.length} days\n• Continue normal farming activities\n• Regular crop care\n• Clear weeds\n• Inspect fields`,
                icon: '✅',
                actions: ['routine_maintenance', 'weeding', 'field_inspection']
            });
        }
    }

    const priorityOrder = { critical: 1, high: 2, medium: 3, low: 4, info: 5 };
    advisories.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return advisories;
}
