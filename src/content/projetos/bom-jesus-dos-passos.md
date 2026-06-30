---
title: "Bom Jesus"
subtitle: "dos Passos"
eyebrow: "Projecto principal · Salvador, Bahia"
coords: "12°57'S · 38°37'W · Brasil"
summary: "Análise multitemporal da cobertura de mangue na Ilha de Bom Jesus dos Passos, Baía de Todos os Santos, Bahia (1990–2023). Documenta a perda de vegetação costeira nativa e cruza os resultados com o processo do Ministério Público Federal."
status: "concluído"
order: 1
stats:
  - value: "6,3 ha"
    label: "Perda líquida de vegetação 1990–2023"
  - value: "9,3 ha"
    label: "Mangue específico classificado (2021-23)"
  - value: "125.000 m²"
    label: "APP impactadas documentadas pelo MPF"
tools: ["Google Earth Engine", "Python", "Landsat", "Sentinel-2", "NDVI", "Random Forest"]
visual: "mangrove"
---

A Ilha de Bom Jesus dos Passos (~2 km², 12°57'S 38°37'W) é habitada por uma comunidade tradicional de pescadores e marisqueiros. O mangue que a bordeia é Área de Preservação Permanente protegida pelo Código Florestal (Lei 12.651/2012). Entre 2000 e 2023, intervenções urbanísticas (calçadões, muros de contenção, pontões) impactaram o ecossistema. O MPF documentou mais de **125.000 m² de APP impactadas**.

## Pergunta de investigação

Qual foi a variação da cobertura de vegetação densa na ilha entre 1990 e 2023, e em que medida coincide com a destruição documentada juridicamente?

## Metodologia

- Plataforma: Google Earth Engine
- Imagens: Landsat 5 TM (1990–2010), Landsat 8 OLI (2015), Sentinel-2 MSI (2021–2023)
- Composição por mediana, filtro de nuvens (Landsat &lt;30%, Sentinel &lt;20%), época seca
- NDVI = (NIR − Red)/(NIR + Red); limiar 0,2 (Landsat) e 0,4 (Sentinel)
- Série: 1990, 1995, 2000, 2005, 2008, 2010, 2015, 2021-23
- Change detection binário 1990 vs. 2021-23
- Classificação supervisionada Random Forest (50 árvores, 5 classes) para o compósito de 2021-23

## Resultados

<figure class="proj-figure">
<img src="/images/grafico_manguezais_bom_jesus.png" alt="Variação da cobertura vegetal densa na Ilha de Bom Jesus dos Passos, 1990 a 2023" loading="lazy" />
<figcaption>Série temporal da cobertura vegetal densa, 1990–2023. Perda líquida de 6,3 ha (≈ 20% do valor inicial).</figcaption>
</figure>

<figure class="proj-figure proj-figure-placeholder">
<div class="proj-img-placeholder" role="img" aria-label="Mapa NDVI da Ilha de Bom Jesus dos Passos">
<span>Imagem em preparação</span>
<code>mapa_ndvi_bom_jesus.png</code>
</div>
<figcaption>Mapa NDVI da Ilha de Bom Jesus dos Passos (a inserir após reexportação sem pins).</figcaption>
</figure>

<figure class="proj-figure proj-figure-placeholder">
<div class="proj-img-placeholder" role="img" aria-label="Classificação supervisionada da cobertura da Ilha de Bom Jesus dos Passos">
<span>Imagem em preparação</span>
<code>mapa_classificacao_bom_jesus.png</code>
</div>
<figcaption>Classificação supervisionada da cobertura terrestre, 2021-23. Cinco classes: mangue, água, construção, vegetação, areia (a inserir após reexportação sem pins).</figcaption>
</figure>

| Ano | Área (ha) |
|-----|-----------|
| 1990 | 30,4 |
| 1995 | 26,8 |
| 2000 | 28,2 |
| 2005 | 19,2 |
| 2008 | 21,9 |
| 2010 | 24,7 |
| 2015 | 20,4 |
| 2021–23 | 24,1 |

Perda líquida 1990–2021-23: **6,3 hectares** (cerca de 20% do inicial). Mangue específico classificado (2021-23): 9,3 hectares. O change detection identifica perda concentrada nas bordas costeiras sudeste (Rua do Brito); ganho de vegetação no interior indica substituição de ecossistema nativo por cobertura antrópica.

*Nota: o último ponto da série corresponde a uma composição mediana de imagens Sentinel-2 do período 2021-2023, usada por ausência de cobertura sem nuvens num único ano.*

## Limitações

Comparação entre sensores distintos (Landsat 30 m / Sentinel 10 m). O limiar NDVI não distingue mangue de outra vegetação densa na série temporal. Validação com MapBiomas inviável: resolução insuficiente para a escala da ilha. Classificação supervisionada limitada a 2023.

<details>
<summary>Ver código — Google Earth Engine (JavaScript)</summary>

```javascript
// GEE — Manguezais de Bom Jesus dos Passos
Map.setOptions('SATELLITE');
var area = Ilha; // polígono desenhado sobre a ilha

function calcularArea(ano, colecao, bandaInfra, bandaVerm, limiar, escala, nuvens, campoNuvem) {
  var foto = colecao
    .filterBounds(area)
    .filterDate(ano+'-06-01', (ano+1)+'-06-30')
    .filter(ee.Filter.lt(campoNuvem, nuvens))
    .median()
    .clip(area);
  var ndvi = foto.normalizedDifference([bandaInfra, bandaVerm]);
  var vegetacao = ndvi.gt(limiar);
  var areaCalc = ee.Image.pixelArea().mask(vegetacao).reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: area,
    scale: escala
  });
  return areaCalc;
}

var l5 = ee.ImageCollection('LANDSAT/LT05/C02/T1_L2');
var l8 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2');
var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED');

print('1990:', calcularArea(1990, l5, 'SR_B4', 'SR_B3', 0.2, 30, 30, 'CLOUD_COVER'));
print('1995:', calcularArea(1995, l5, 'SR_B4', 'SR_B3', 0.2, 30, 30, 'CLOUD_COVER'));
print('2000:', calcularArea(2000, l5, 'SR_B4', 'SR_B3', 0.2, 30, 30, 'CLOUD_COVER'));
print('2005:', calcularArea(2005, l5, 'SR_B4', 'SR_B3', 0.2, 30, 30, 'CLOUD_COVER'));
print('2008:', calcularArea(2008, l5, 'SR_B4', 'SR_B3', 0.2, 30, 30, 'CLOUD_COVER'));
print('2010:', calcularArea(2010, l5, 'SR_B4', 'SR_B3', 0.2, 30, 30, 'CLOUD_COVER'));
print('2015:', calcularArea(2015, l8, 'SR_B5', 'SR_B4', 0.2, 30, 30, 'CLOUD_COVER'));
// NOTA: o valor rotulado "2023" usa a composição Sentinel-2 de 2021-2023
// (a função filtra a partir de 2021). É o ponto Sentinel da série temporal.
print('2023:', calcularArea(2021, s2, 'B8', 'B4', 0.4, 10, 20, 'CLOUDY_PIXEL_PERCENTAGE'));

// Change detection 1990 vs 2023 (composição Sentinel 2021-2023)
var foto1990 = l5.filterBounds(area).filterDate('1990-06-01','1991-06-30')
  .filter(ee.Filter.lt('CLOUD_COVER',30)).median().clip(area);
var foto2023 = s2.filterBounds(area).filterDate('2021-01-01','2023-12-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20)).median().clip(area);
var ndvi1990 = foto1990.normalizedDifference(['SR_B4','SR_B3']);
var ndvi2023 = foto2023.normalizedDifference(['B8','B4']);
var veg1990 = ndvi1990.gt(0.2);
var veg2023 = ndvi2023.gt(0.2);
var change = veg1990.multiply(2).add(veg2023); // 0=sem veg,1=ganho,2=perda,3=manteve
Map.centerObject(area, 15);
Map.addLayer(change, {min:0,max:3,palette:['white','red','green','yellow']}, 'Change detection 1990-2023');

// Classificação supervisionada Random Forest (2023)
var imgClass = s2.filterBounds(area).filterDate('2021-01-01','2023-12-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20)).median().clip(area);
var bandas = imgClass.select(['B2','B3','B4','B8','B11','B12']);
var pontosTreino = mangue.merge(agua).merge(construcao).merge(vegetacao).merge(areia);
var treino = bandas.sampleRegions({collection: pontosTreino, properties:['label'], scale:10});
var classificador = ee.Classifier.smileRandomForest(50).train({
  features: treino, classProperty:'label',
  inputProperties:['B2','B3','B4','B8','B11','B12']
});
var classificado = bandas.classify(classificador);
Map.addLayer(classificado, {min:0,max:4,palette:['darkgreen','blue','red','lightgreen','yellow']}, 'Classificação 2023');

var soMangue = classificado.eq(0);
var areaMangueClass = ee.Image.pixelArea().mask(soMangue).reduceRegion({
  reducer: ee.Reducer.sum(), geometry: area, scale: 10
});
print('Área manguezal classificado 2023 (m²):', areaMangueClass);
```

</details>

<details>
<summary>Ver código — Série temporal (Python)</summary>

```python
# Python — gráfico da série temporal
import matplotlib.pyplot as plt

anos = [1990, 1995, 2000, 2005, 2008, 2010, 2015, 2023]
areas = [304489, 267845, 281805, 191941, 218987, 246906, 204155, 240993]
areas_ha = [a/10000 for a in areas]

fig, ax = plt.subplots(figsize=(10, 6))
ax.plot(anos, areas_ha, color='darkgreen', linewidth=2.5, marker='o', markersize=8)
ax.fill_between(anos, areas_ha, alpha=0.15, color='green')
ax.axhline(y=areas_ha[0], color='gray', linestyle='--', linewidth=1, alpha=0.5)
ax.annotate('Início obras\nFundação Baía Viva', xy=(2000, areas_ha[1]),
            xytext=(1995, 22), fontsize=9, color='darkred',
            arrowprops=dict(arrowstyle='->', color='darkred'))
ax.annotate('Maior perda\nacumulada', xy=(2005, areas_ha[3]),
            xytext=(2006, 8), fontsize=9, color='darkred',
            arrowprops=dict(arrowstyle='->', color='darkred'))
ax.annotate('Processo MPF\n125.000 m2', xy=(2023, areas_ha[7]),
            xytext=(2018, 28), fontsize=9, color='navy',
            arrowprops=dict(arrowstyle='->', color='navy'))
ax.set_xlabel('Ano'); ax.set_ylabel('Área de vegetação densa (hectares)')
ax.set_title('Variação da cobertura vegetal densa\nIlha de Bom Jesus dos Passos, Bahia (1990-2023)')
ax.set_xticks(anos); ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig('grafico_manguezais_bom_jesus.png', dpi=300, bbox_inches='tight')
plt.show()
```

</details>
