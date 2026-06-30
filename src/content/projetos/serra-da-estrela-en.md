---
title: "Serra da Estrela"
subtitle: "Portugal"
eyebrow: "Climate change · mainland Portugal"
coords: "40°19'N · 7°37'W · Portugal"
summary: "Analysis of long climate series (1950–2018) cross-referenced with remote sensing of the 2022 wildfire on Serra da Estrela. Links warming and drying trends to wildfire risk."
status: "completed"
order: 2
lang: "en"
stats:
  - value: "+0.31 °C"
    label: "Increase per decade (1950–2018)"
  - value: "30,610 ha"
    label: "Area with detected vegetation loss (2022)"
  - value: "−469 mm"
    label: "Rainfall decrease over 70 years"
tools: ["Google Earth Engine", "Python", "Sentinel-2", "NDVI", "scipy", "Climate series"]
visual: "geothermal"
---

Serra da Estrela is the highest point in mainland Portugal (1,993 m). In August 2022, a wildfire devastated more than 30,000 hectares of forest. This study investigates whether long-term climate trends created favourable conditions for the event.

Data from the Penhas Douradas meteorological station (alt. 1,388 m, no. 568), managed by IPMA, provide a long, consistent series of temperature and precipitation that makes it possible to quantify the mountain's climatic trajectory.

## Research question

Do the temperature and precipitation trends on Serra da Estrela since 1950 indicate a worsening of wildfire risk conditions?

## Methodology

- Climate data: IPMA Long Series, Penhas Douradas station (no. 568, alt. 1,388 m), 1950–2018
- Trend: linear regression (scipy.stats) in Python
- Fire detection: Sentinel-2 MSI, NDVI before (summer 2021) vs. after (autumn 2022) in GEE
- Burnt area: NDVI difference greater than 0.2

## Results

<figure class="proj-figure">
<img src="/images/grafico_serra_estrela.png" alt="Annual temperature and precipitation at Penhas Douradas, 1950 to 2018, with warming and drying trends" loading="lazy" />
<figcaption>Mean annual temperature and annual precipitation at Penhas Douradas (alt. 1,388 m), 1950–2018. Trends: +0.31 °C/decade and −67 mm/decade.</figcaption>
</figure>

<figure class="proj-figure">
<img src="/images/mapa_incendio_serra_estrela.png" alt="NDVI comparison before and after the 2022 wildfire on Serra da Estrela" loading="lazy" />
<figcaption>NDVI before (summer 2021) and after (autumn 2022) the fire. Area with detected vegetation loss: 30,610 ha.</figcaption>
</figure>

### Climate trends (1950–2018)

| Variable | Trend | Estimated total (70 years) |
|----------|-------|---------------------------|
| Temperature | +0.31 °C/decade | +2.2 °C |
| Precipitation | −67 mm/decade | −469 mm |

The year 2017 (Pedrógão Grande fire) was the warmest in the series (11.3 °C) and one of the driest (752 mm). The 2022 fire occurred under similar climate conditions: high temperature and below-average precipitation.

### Remote sensing of the 2022 fire

Area with detected vegetation loss (NDVI before − after > 0.2): **306,103,243 m² ≈ 30,610 hectares**.

## Limitations

The available climate series runs to 2018. The years 2019–2022 are not included in the calculated trend. The NDVI threshold may include water stress beyond the area actually burnt. The 50 km buffer includes zones outside the real fire perimeter.

<details>
<summary>View code — Climate trend (Python)</summary>

```python
# Python — climate trend Serra da Estrela
import pandas as pd
import matplotlib.pyplot as plt
from scipy import stats

temp = pd.read_csv('temperatura_penhas_douradas.csv', sep=',', encoding='latin-1')
prec = pd.read_csv('precipitacao_penhas_douradas.csv', sep=',', encoding='latin-1')

slope_temp,_,_,p_temp,_ = stats.linregress(temp['year'], temp['tmed'])
slope_prec,_,_,p_prec,_ = stats.linregress(prec['year'], prec['Annual'])
print(f'Temperature: +{slope_temp*10:.2f}C/decade (p={p_temp:.4f})')
print(f'Precipitation: {slope_prec*10:.1f}mm/decade (p={p_prec:.4f})')
```

</details>

<details>
<summary>View code — Fire detection (Google Earth Engine)</summary>

```javascript
// GEE — Serra da Estrela fire before/after
Map.setOptions('SATELLITE');
var serra = ee.Geometry.Point([-7.55, 40.32]);

var before = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(serra).filterDate('2021-06-01','2021-08-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20)).median();
var after = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(serra).filterDate('2022-09-01','2022-11-30')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20)).median();

var ndvi_before = before.normalizedDifference(['B8','B4']);
var ndvi_after = after.normalizedDifference(['B8','B4']);
var difference = ndvi_before.subtract(ndvi_after);

var burntArea = difference.gt(0.2);
var areaCalc = ee.Image.pixelArea().mask(burntArea).reduceRegion({
  reducer: ee.Reducer.sum(), geometry: serra.buffer(50000), scale: 10, maxPixels: 1e10
});
print('Area with vegetation loss (m²):', areaCalc);
```

</details>
