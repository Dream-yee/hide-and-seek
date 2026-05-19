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
                            case '信義線': return {color: "#dc143c", weight: 6};
                            case '淡水線': return {color: "#DC143C", weight: 6};
                            case '蘆洲線': return {color: "#FF6347", weight: 6};
                            case '中和線': return {color: "#FF6347", weight: 6};
                            case '新莊線': return {color: "#FF6347", weight: 6};
                            case '板橋線': return {color: "#4169E1", weight: 6};
                            case '南港線': return {color: "#4169E1", weight: 6};
                            case '新店線': return {color: "#228B22", weight: 6};
                            case '松山線': return {color: "#228B22", weight: 6};
                            case '小南門線': return {color: "#228B22", weight: 6};
                            case '碧潭支線': return {color: "#228B22", weight: 6};
                            case '木柵線': return {color: "#CD853F", weight: 6};
                            case '內湖線': return {color: "#CD853F", weight: 6};
                            case '環狀線': return {color: "#f7e293", weight: 6};
                            default: return {color: "#999", weight: 6};
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

// 1. 定義一個涵蓋全球的矩形 (這是挖洞的「紙」)
const worldBounds = turf.polygon([[
    [-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]
]]);

const BUS_COLORS =["#fed410", "#781452", "#613781", "#ba85d0", "#183c58","#bbb93e", "#d58b1a", "#90e87e", "#6349d9", "#48657a","#53976c", "#afd4cc", "#a5bafa", "#0e44c8", "#0d7468","#18724b", "#7afde3", "#842514", "#24117d", "#6405ed","#bae5cf"]
let i = 0;
fetch('data/bus/all_bus_routes.json')
    .then(res => res.json())
    .then(data => {

        // // 2. 產生 500 公尺的緩衝區
        // // 單位 "meters", 注意：Turf 預設輸入是經緯度
        // const buffered = turf.buffer(data, 500, { units: 'meters' });

        // // 3. 從世界矩形中扣除這些緩衝區
        // const mask = turf.difference(turf.featureCollection([
        //     turf.feature(worldBounds),
        //     buffered
        // ]));
        // // 4. 將遮罩渲染為半透明灰色
        // L.geoJSON(buffered, {
        //     style: {
        //         fillColor: "#8080803b",
        //         fillOpacity: 0.6,
        //         color: "transparent", // 邊框透明
        //         weight: 0
        //     }
        // }).addTo(map);

        L.geoJSON(data, {
                    style: ()=>{i++; return {color: `${BUS_COLORS[i]}`, weight: 2}},
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