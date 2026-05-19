import json
from pyproj import Transformer

# 設定轉換器：TWD97 (EPSG:3826) 轉 WGS84 (EPSG:4326)
transformer = Transformer.from_crs("EPSG:3826", "EPSG:4326", always_xy=True)

def transform_coordinates(coords):
    # 處理嵌套的座標陣列 (例如 MultiLineString)
    if isinstance(coords[0], list):
        return [transform_coordinates(c) for c in coords]
    else:
        # 進行轉換
        lon, lat = transformer.transform(coords[0], coords[1])
        return [lon, lat]

# 讀取你的 GeoJSON 檔案
with open('data/metro/Taipei_metro.json', 'r', encoding='utf-8') as f:
    geojson = json.load(f)

# 遞迴轉換所有 geometry 中的座標
for feature in geojson['features']:
    feature['geometry']['coordinates'] = transform_coordinates(feature['geometry']['coordinates'])

# 儲存轉換後的檔案
with open('data_wgs84.json', 'w', encoding='utf-8') as f:
    json.dump(geojson, f, ensure_ascii=False, indent=4)

print("轉換完成！已產出 data_wgs84.json")