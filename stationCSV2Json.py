import csv
import json
import re

def convert_csv_to_geojson(csv_file_path, json_file_path):
    features = []
    
    with open(csv_file_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # 處理座標字串: "{121.579501,24.998205}" -> 121.579501, 24.998205
            coords = re.findall(r"[\d\.]+", row['StationPosition'])
            lon, lat = float(coords[0]), float(coords[1])
            
            # 建立 GeoJSON Feature
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [lon, lat]
                },
                "properties": {
                    "id": row['StationID'],
                    "name": row['StationName'].replace("'", "").replace("{", "").replace("}", "")
                }
            }
            features.append(feature)
            
    geojson = {"type": "FeatureCollection", "features": features}
    
    with open(json_file_path, 'w', encoding='utf-8') as f:
        json.dump(geojson, f, ensure_ascii=False, indent=2)

# 執行轉換
convert_csv_to_geojson('data/metro/臺北捷運車站資料服務_NEW.csv', 'mrt_stations.json')
print("轉換完成！已產出 mrt_stations.json")