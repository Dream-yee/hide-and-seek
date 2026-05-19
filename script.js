// 初始化地圖，設定中心點與縮放層級
const map = L.map('map').setView([25.048617019723128, 121.51776560191792], 12); // Pingtung, Taiwan

// 加入圖層 (使用 OpenStreetMap)
// 使用 CartoDB 的無標籤底圖 (Positron Lite)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

fetch('data/metro/Taipei_metro_WGS84.json')
    .then(res=>res.json())
    .then(data => {
        L.geoJSON(data, {
                    style: function(feature) {
                        switch (feature.properties.RouteName) {
                            case '信義線': return {color: "#dc143c", weight: 4};
                            case '淡水線': return {color: "#DC143C", weight: 4};
                            case '蘆洲線': return {color: "#FF6347", weight: 4};
                            case '中和線': return {color: "#FF6347", weight: 4};
                            case '新莊線': return {color: "#FF6347", weight: 4};
                            case '板橋線': return {color: "#4169E1", weight: 4};
                            case '南港線': return {color: "#4169E1", weight: 4};
                            case '新店線': return {color: "#228B22", weight: 4};
                            case '松山線': return {color: "#228B22", weight: 4};
                            case '小南門線': return {color: "#228B22", weight: 4};
                            case '碧潭支線': return {color: "#228B22", weight: 4};
                            case '木柵線': return {color: "#CD853F", weight: 4};
                            case '內湖線': return {color: "#CD853F", weight: 4};
                            case '環狀線': return {color: "#f7e293", weight: 4};
                            default: return {color: "#999", weight: 4};
                        }
                    }
            }).addTo(map);
    })

fetch('data/metro/mrt_stations.json')
    .then(res => res.json())
    .then(data => {
        L.geoJSON(data, {
            // 將點位轉為小圓圈
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: 5,
                    fillColor: "#ffffff",
                    color: "#000000a5",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            // 綁定 Popup
            onEachFeature: function (feature, layer) {
                if (feature.properties) {
                    layer.bindPopup(`
                        <b>編號:</b> ${feature.properties.id}<br>
                        <b>站名:</b> ${feature.properties.name}
                    `);
                }
            }
        }).addTo(map);
    });

fetch('data/bus/all_bus_routes.json')
    .then(res => res.json())
    .then(data => {
        L.geoJSON(data, {
                    style: ()=>{return {color: "#55555582", weight: 2}},
                    // style: ()=>{return {color: `#${Math.floor(Math.random() * 16777216).toString(16)}67`, weight: 2}},
                    onEachFeature: function (feature, layer) {
                        if (feature.properties) {
                            layer.bindPopup(`
                                <b>公車:</b> ${feature.properties.model.RouteName}
                            `);
                        }
                    }
            }).addTo(map);
    })

// 執行載入