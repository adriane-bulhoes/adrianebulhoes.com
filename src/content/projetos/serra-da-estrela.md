---
title: "Serra da Estrela"
subtitle: "Portugal"
eyebrow: "Alterações climáticas · Portugal continental"
coords: "40°19'N · 7°37'W · Portugal"
summary: "Análise de séries climáticas longas (1950–2018) cruzada com detecção remota do incêndio de 2022 na Serra da Estrela. Liga tendências de aquecimento e secura ao risco de incêndio florestal."
status: "concluído"
order: 2
stats:
  - value: "+0,31 °C"
    label: "Aumento por década (1950–2018)"
  - value: "30.610 ha"
    label: "Área com perda de vegetação detectada (2022)"
  - value: "−469 mm"
    label: "Queda de precipitação em 70 anos"
tools: ["Google Earth Engine", "Python", "Sentinel-2", "NDVI", "scipy", "Séries climáticas"]
visual: "geothermal"
---

A Serra da Estrela é o ponto mais alto de Portugal continental (1993 m). Em Agosto de 2022, um incêndio devastou mais de 30.000 hectares de floresta. Este estudo investiga se tendências climáticas de longo prazo criaram condições favoráveis ao evento.

Os dados da estação meteorológica das Penhas Douradas (alt. 1388 m, nº 568), gerida pelo IPMA, fornecem uma série longa e consistente de temperatura e precipitação que permite quantificar a trajectória climática da serra.

## Pergunta de investigação

As tendências de temperatura e precipitação na Serra da Estrela desde 1950 indicam um agravamento das condições de risco de incêndio?

## Metodologia

- Dados climáticos: IPMA Séries Longas, estação Penhas Douradas (nº 568, alt. 1388 m), 1950–2018
- Tendência: regressão linear (scipy.stats) em Python
- Detecção do incêndio: Sentinel-2 MSI, NDVI antes (verão 2021) vs. depois (outono 2022) no GEE
- Área queimada: diferença de NDVI superior a 0,2

## Resultados

<figure class="proj-figure">
<img src="/images/grafico_serra_estrela.png" alt="Temperatura e precipitação anuais em Penhas Douradas, 1950 a 2018, com tendências de aquecimento e redução de chuva" loading="lazy" />
<figcaption>Temperatura média anual e precipitação anual em Penhas Douradas (alt. 1388 m), 1950–2018. Tendências: +0,31 °C/década e −67 mm/década.</figcaption>
</figure>

<figure class="proj-figure">
<img src="/images/mapa_incendio_serra_estrela.png" alt="Comparação de NDVI antes e depois do incêndio de 2022 na Serra da Estrela" loading="lazy" />
<figcaption>NDVI antes (verão 2021) e depois (outono 2022) do incêndio. Área com perda de vegetação detectada: 30.610 ha.</figcaption>
</figure>

### Tendências climáticas (1950–2018)

| Variável | Tendência | Total estimado (70 anos) |
|----------|-----------|--------------------------|
| Temperatura | +0,31 °C/década | +2,2 °C |
| Precipitação | −67 mm/década | −469 mm |

O ano de 2017 (incêndio de Pedrógão Grande) foi o mais quente da série (11,3 °C) e um dos mais secos (752 mm). O incêndio de 2022 ocorreu em condições climáticas similares: temperatura alta e precipitação abaixo da média.

### Detecção remota do incêndio 2022

Área com perda de vegetação detectada (NDVI antes − depois > 0,2): **306.103.243 m² ≈ 30.610 hectares**.

## Limitações

A série climática disponível vai até 2018. Os anos 2019–2022 não estão incluídos na tendência calculada. O limiar NDVI pode incluir stress hídrico além da área efectivamente queimada. O buffer de 50 km inclui zonas fora do perímetro real do incêndio.

<details>
<summary>Ver código — Tendência climática (Python)</summary>

```python
# Python — tendência climática Serra da Estrela
import pandas as pd
import matplotlib.pyplot as plt
from scipy import stats

temp = pd.read_csv('temperatura_penhas_douradas.csv', sep=',', encoding='latin-1')
prec = pd.read_csv('precipitacao_penhas_douradas.csv', sep=',', encoding='latin-1')
temp.columns = temp.columns.str.strip().str.replace('﻿', '')
prec.columns = prec.columns.str.strip().str.replace('﻿', '')

temp['year'] = temp['date'].str.split('/').str[1].astype(int)
temp_anual = temp.groupby('year')['tmed'].mean().reset_index()
prec_anual = prec[['year', 'Annual']].dropna()

anos_extra_temp = pd.DataFrame({'year':[2017,2018], 'tmed':[11.3,9.6]})
anos_extra_prec = pd.DataFrame({'year':[2017,2018], 'Annual':[752.0,1636.0]})
temp_anual = pd.concat([temp_anual, anos_extra_temp]).drop_duplicates('year').reset_index(drop=True)
prec_anual = pd.concat([prec_anual, anos_extra_prec]).drop_duplicates('year').reset_index(drop=True)

temp_anual = temp_anual[temp_anual['year']>=1950].sort_values('year')
prec_anual = prec_anual[prec_anual['year']>=1950].sort_values('year')

slope_temp,_,_,p_temp,_ = stats.linregress(temp_anual['year'], temp_anual['tmed'])
slope_prec,_,_,p_prec,_ = stats.linregress(prec_anual['year'], prec_anual['Annual'])
print(f'Temperatura: +{slope_temp*10:.2f}C/decada (p={p_temp:.4f})')
print(f'Precipitacao: {slope_prec*10:.1f}mm/decada (p={p_prec:.4f})')

trend_temp = slope_temp*temp_anual['year'] + stats.linregress(temp_anual['year'],temp_anual['tmed']).intercept
fig,(ax1,ax2) = plt.subplots(2,1,figsize=(12,9))
ax1.plot(temp_anual['year'], temp_anual['tmed'], color='darkred', linewidth=1.2, alpha=0.7)
ax1.plot(temp_anual['year'], trend_temp, color='black', linewidth=2, linestyle='--',
         label=f'Tendencia: +{slope_temp*10:.2f}C/decada')
ax1.set_ylabel('Temperatura média (°C)'); ax1.legend(); ax1.grid(True, alpha=0.3)
ax1.set_title('Temperatura média anual - Penhas Douradas (1950-2018)')
ax2.bar(prec_anual['year'], prec_anual['Annual'], color='steelblue', alpha=0.6)
ax2.set_ylabel('Precipitação anual (mm)'); ax2.grid(True, alpha=0.3)
ax2.set_title('Precipitação anual - Penhas Douradas (1950-2018)')
plt.tight_layout()
plt.savefig('grafico_serra_estrela.png', dpi=300, bbox_inches='tight')
plt.show()
```

</details>

<details>
<summary>Ver código — Detecção do incêndio (Google Earth Engine)</summary>

```javascript
// GEE — incêndio Serra da Estrela antes/depois
Map.setOptions('SATELLITE');
var serra = ee.Geometry.Point([-7.55, 40.32]);

var antes = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(serra).filterDate('2021-06-01','2021-08-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20)).median();
var depois = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(serra).filterDate('2022-09-01','2022-11-30')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20)).median();

var ndvi_antes = antes.normalizedDifference(['B8','B4']);
var ndvi_depois = depois.normalizedDifference(['B8','B4']);
var diferenca = ndvi_antes.subtract(ndvi_depois);

var areaQueimada = diferenca.gt(0.2);
var areaCalc = ee.Image.pixelArea().mask(areaQueimada).reduceRegion({
  reducer: ee.Reducer.sum(), geometry: serra.buffer(50000), scale: 10, maxPixels: 1e10
});
print('Área com perda de vegetação (m²):', areaCalc);

var esquerda = ui.Map(); var direita = ui.Map();
var pal = {min:-0.2,max:0.8,palette:['red','yellow','lightgreen','darkgreen']};
esquerda.addLayer(ndvi_antes, pal, 'NDVI antes 2021');
direita.addLayer(ndvi_depois, pal, 'NDVI depois 2022');
esquerda.centerObject(serra, 11); direita.centerObject(serra, 11);
ui.root.widgets().reset([ui.SplitPanel(esquerda, direita)]);
```

</details>
