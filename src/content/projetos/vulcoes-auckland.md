---
title: "Vulcões de Auckland"
subtitle: "Nova Zelândia"
eyebrow: "Restauro ecológico · Tāmaki Makaurau"
coords: "36°52'S · 174°47'E · Nova Zelândia"
summary: "Análise do ganho de vegetação nativa em três vulcões urbanos de Auckland (2000–2023), associado aos programas de restauro ecológico de Tāmaki Makaurau. +312 hectares em 23 anos."
status: "concluído"
order: 3
stats:
  - value: "+312 ha"
    label: "Ganho de vegetação nos 3 vulcões (2000–2023)"
  - value: "+150%"
    label: "Aumento médio de cobertura vegetal"
  - value: "3"
    label: "Vulcões monitorizados (de 53 no campo)"
tools: ["Google Earth Engine", "Python", "Landsat", "Sentinel-2", "NDVI", "iNaturalist"]
visual: "satellite-grid"
---

O campo vulcânico de Auckland tem 53 cones, muitos protegidos como reservas naturais. Desde os anos 2000, programas de restauro (remoção de espécies invasoras, replantação de nativas, controlo de predadores) têm sido implementados sob o nome Tāmaki Makaurau Restoration Plan.

Este estudo analisa três vulcões com programas de restauro documentados: One Tree Hill/Maungakiekie, Mt Eden/Maungawhau e Mt Wellington/Maungarei. Quantifica a recuperação da cobertura vegetal entre 2000 e 2023.

## Pergunta de investigação

A vegetação nativa nos vulcões de Auckland aumentou entre 2000 e 2023 como resultado dos programas de restauro?

## Metodologia

- Plataforma: Google Earth Engine
- Imagens: Landsat 5 TM (2000), Sentinel-2 MSI (2023)
- Três vulcões: One Tree Hill/Maungakiekie, Mt Eden/Maungawhau, Mt Wellington/Maungarei
- Buffer de 800 m por cone; NDVI limiar 0,2; área via pixelArea

## Resultados

<figure class="proj-figure">
<img src="/images/grafico_vulcoes_auckland.png" alt="Recuperação da vegetação nativa em três vulcões de Auckland, 2000 a 2023, ganho total de 312 hectares" loading="lazy" />
<figcaption>Cobertura vegetal densa em 2000 e 2023, por vulcão. Ganho total: +312,5 ha (+150% em 23 anos).</figcaption>
</figure>

<figure class="proj-figure">
<img src="/images/mapa_vulcoes_auckland_comparacao.png" alt="Comparação de NDVI dos vulcões de Auckland entre 2000 e 2023" loading="lazy" />
<figcaption>NDVI comparativo nos três vulcões, 2000 vs. 2023. Verde escuro indica ganho de cobertura vegetal.</figcaption>
</figure>

| Vulcão | 2000 (ha) | 2023 (ha) | Ganho (ha) | Aumento |
|--------|-----------|-----------|------------|---------|
| One Tree Hill / Maungakiekie | 71,7 | 173,8 | +102,1 | +142% |
| Mt Eden / Maungawhau | 90,2 | 183,3 | +93,1 | +103% |
| Mt Wellington / Maungarei | 46,2 | 163,5 | +117,3 | +254% |
| **Total** | **208,1** | **520,6** | **+312,5** | **+150%** |

Mt Wellington registou o maior aumento proporcional (+254%), coincidindo com o início do programa de restauro intensiva na reserva. O ganho total de **312,5 hectares** em 23 anos representa uma das recuperações de vegetação nativa urbana mais expressivas da Oceania.

## Limitações

Comparação entre sensores de resolução diferente (Landsat 30 m / Sentinel 10 m). O limiar NDVI não distingue espécies nativas de invasoras: a confirmação de recuperação de vegetação nativa específica requer validação de campo. Componente iNaturalist em desenvolvimento.

<details>
<summary>Ver código — Três vulcões, comparação 2000/2023 (Google Earth Engine)</summary>

```javascript
// GEE — vulcões de Auckland, comparação lado a lado
Map.setOptions('SATELLITE');

var oneTreeHill = ee.Geometry.Point([174.7833, -36.8833]).buffer(800);
var mtEden      = ee.Geometry.Point([174.7667, -36.8767]).buffer(800);
var mtWellington= ee.Geometry.Point([174.8333, -36.8983]).buffer(800);

function getNDVI(colecao, bounds, bandaInfra, bandaVerm, ini, fim, campNuvem, limNuvem) {
  return colecao.filterBounds(bounds).filterDate(ini, fim)
    .filter(ee.Filter.lt(campNuvem, limNuvem)).median().clip(bounds)
    .normalizedDifference([bandaInfra, bandaVerm]);
}

var l5 = ee.ImageCollection('LANDSAT/LT05/C02/T1_L2');
var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED');
var areaPixel = ee.Image.pixelArea();
function calcArea(ndvi, geom, escala) {
  return areaPixel.mask(ndvi.gt(0.2)).reduceRegion({
    reducer: ee.Reducer.sum(), geometry: geom, scale: escala
  });
}

var oth00 = getNDVI(l5, oneTreeHill, 'SR_B4','SR_B3','1998-01-01','2003-12-31','CLOUD_COVER',20);
var oth23 = getNDVI(s2, oneTreeHill, 'B8','B4','2022-01-01','2023-12-31','CLOUDY_PIXEL_PERCENTAGE',10);
var mte00 = getNDVI(l5, mtEden, 'SR_B4','SR_B3','1998-01-01','2003-12-31','CLOUD_COVER',20);
var mte23 = getNDVI(s2, mtEden, 'B8','B4','2022-01-01','2023-12-31','CLOUDY_PIXEL_PERCENTAGE',10);
var mtw00 = getNDVI(l5, mtWellington, 'SR_B4','SR_B3','1998-01-01','2003-12-31','CLOUD_COVER',20);
var mtw23 = getNDVI(s2, mtWellington, 'B8','B4','2022-01-01','2023-12-31','CLOUDY_PIXEL_PERCENTAGE',10);

print('One Tree Hill 2000:', calcArea(oth00, oneTreeHill, 30));
print('One Tree Hill 2023:', calcArea(oth23, oneTreeHill, 10));
print('Mt Eden 2000:', calcArea(mte00, mtEden, 30));
print('Mt Eden 2023:', calcArea(mte23, mtEden, 10));
print('Mt Wellington 2000:', calcArea(mtw00, mtWellington, 30));
print('Mt Wellington 2023:', calcArea(mtw23, mtWellington, 10));

var pal = {min:-0.2,max:0.8,palette:['red','yellow','lightgreen','darkgreen']};
var esquerda = ui.Map(); var direita = ui.Map();
esquerda.addLayer(oth00, pal, 'OTH 2000');
esquerda.addLayer(mte00, pal, 'Eden 2000');
esquerda.addLayer(mtw00, pal, 'Wellington 2000');
direita.addLayer(oth23, pal, 'OTH 2023');
direita.addLayer(mte23, pal, 'Eden 2023');
direita.addLayer(mtw23, pal, 'Wellington 2023');
var centro = ee.Geometry.Point([174.7833, -36.8833]);
esquerda.centerObject(centro, 13); direita.centerObject(centro, 13);
ui.root.widgets().reset([ui.SplitPanel(esquerda, direita)]);
```

</details>

<details>
<summary>Ver código — Gráfico comparativo (Python)</summary>

```python
# Python — gráfico comparativo Auckland
import matplotlib.pyplot as plt
import numpy as np

vulcoes = ['One Tree Hill', 'Mt Eden', 'Mt Wellington']
area_2000 = [71.7, 90.2, 46.2]
area_2023 = [173.8, 183.3, 163.5]
x = np.arange(len(vulcoes)); largura = 0.35

fig, ax = plt.subplots(figsize=(10, 6))
b00 = ax.bar(x - largura/2, area_2000, largura, label='2000', color='orange', alpha=0.8)
b23 = ax.bar(x + largura/2, area_2023, largura, label='2023', color='darkgreen', alpha=0.8)
for b in list(b00)+list(b23):
    ax.text(b.get_x()+b.get_width()/2, b.get_height()+2, f'{b.get_height():.1f}ha',
            ha='center', fontsize=9)
ax.text(1, 220, 'Ganho total nos 3 vulcoes: +312 hectares (+150% em 23 anos)',
        ha='center', fontsize=10, color='darkgreen',
        bbox=dict(boxstyle='round', facecolor='lightgreen', alpha=0.3))
ax.set_ylabel('Área de vegetação densa (hectares)')
ax.set_title('Recuperação da vegetação nativa nos vulcões de Auckland (2000-2023)')
ax.set_xticks(x); ax.set_xticklabels(vulcoes); ax.legend(); ax.grid(True, alpha=0.3, axis='y')
plt.tight_layout()
plt.savefig('grafico_vulcoes_auckland.png', dpi=300, bbox_inches='tight')
plt.show()
```

</details>
