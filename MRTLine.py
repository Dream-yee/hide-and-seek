import json
import re

def parse_multilinestring(wkt_string):
    """
    從 MULTILINESTRING 字串中提取座標
    範例輸入: MULTILINESTRING((x1 y1, x2 y2), (x3 y3, x4 y4))
    """
    # 移除開頭的 'MULTILINESTRING(' 和結尾的 ')'
    content = re.sub(r'LINESTRING\s*\(', '', wkt_string)
    content = content.rstrip(')')
    
    # 分割每一條線 (如果只有一條線，這步依然有效)
    # 這裡假設括號結構是規範的
    lines = content.split('),(')
    
    geojson_coordinates = []
    for line in lines:
        line = line.replace('(', '').replace(')', '')
        # 將座標點拆分為列表
        coords = [list(map(float, p.split())) for p in line.split(',')]
        geojson_coordinates.append(coords)
        
    return geojson_coordinates

def convert_to_geojson(data_list):
    """
    將列表中的每個項目轉換為 GeoJSON FeatureCollection
    """
    features = []
    
    for item in data_list:
        geom_wkt = item.get("Geometry", "")
        if not geom_wkt:
            continue
            
        coords = parse_multilinestring(geom_wkt)
        
        feature = {
            "type": "Feature",
            "properties": {
                "stroke": "#ff0000",  # 紅色
                "stroke-width": 2,
                "stroke-opacity": 1
            },
            "geometry": {
                "type": "MultiLineString",
                "coordinates": coords
            }
        }
        features.append(feature)
        
    return {
        "type": "FeatureCollection",
        "features": features
    }

# --- 使用範例 ---

with open('data/metro/KLRT.json', 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

geojson_data = convert_to_geojson(raw_data)

with open('data/metro/KLRTGeo.json', 'w', encoding='utf-8') as f:
    json.dump(geojson_data, f, ensure_ascii=False, indent=4)