import json
import glob
import os

def merge_geojson_files(input_folder, output_file):
    merged_features = []
    
    # 搜尋該資料夾下所有 .json 檔案
    search_path = os.path.join(input_folder, "*.json")
    files = glob.glob(search_path)
    
    print(f"找到 {len(files)} 個檔案，正在合併中...")
    
    for file_path in files:
        with open(file_path, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
                # 將該檔案內的 features 加入列表
                if "features" in data:
                    merged_features.extend(data["features"])
            except json.JSONDecodeError:
                print(f"警告：無法讀取檔案 {file_path}")

    # 建立最終的 GeoJSON 結構
    result = {
        "type": "FeatureCollection",
        "features": merged_features
    }
    
    # 寫入合併後的檔案
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
        
    print(f"合併完成！已儲存至: {output_file}")
    print(f"總共包含 {len(merged_features)} 個 features")

# 執行合併
merge_geojson_files('data/bus', 'data/bus/all_bus_routes.json')