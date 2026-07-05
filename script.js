// 初始化地圖，設定中心點與縮放層級
const map = L.map('map').setView([22.63835, 120.30252], 12); // Pingtung, Taiwan

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

fetch('data/metro/KHGeo.json')
    .then(res => res.json())
    .then(data => {
        L.geoJSON(data, {
            style: function(feature) {
                switch (feature.properties.RouteName) {
                    case '紅線': return {color: "#ff546e", weight: 7};
                    case '橘線': return {color: "#ffa82d", weight: 7};
                    default: return {color: "#999", weight: 7};
                }
            }
        }).addTo(map);
    })

fetch('data/metro/KLRTGeo.json')
    .then(res => res.json())
    .then(data => {
        L.geoJSON(data, {
            style: function(feature) {
                return {color: "#6be05e", weight: 7};
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

        L.geoJSON(turf.buffer(data, 500, { units: 'meters' }), {
            style: {
                fillColor: "#8080803b",
                fillOpacity: 0.6,
                color: "transparent", // 邊框透明
                weight: 0
            }
        }).addTo(map);
    });

// 1. 定義一個涵蓋全球的矩形 (這是挖洞的「紙」)
const worldBounds = turf.polygon([[
    [-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]
]]);

const BUS_COLORS =["#fed410", "#781452", "#613781", "#ba85d0", "#183c58","#bbb93e", "#d58b1a", "#90e87e", "#6349d9", "#48657a","#53976c", "#00cea1", "#a5bafa", "#0e44c8", "#0d7468","#18724b", "#7afde3", "#842514", "#24117d", "#6405ed","#71db54", "#be882e", "#93a712", "#df27b8", "#6b9256", "#082676", "#4838e1", "#efdf2c", "#c62640", "#31b550", "#cf983c", "#768cae", "#bc9329"]
let i = 0;
fetch('data/bus/all_bus_routes.json')
    .then(res => res.json())
    .then(data => {
// 1. 建立 500 公尺緩衝區
        const buffered = turf.buffer(data, 500, { units: 'meters' });

        // 2. 建立「整張地圖」的覆蓋層 (灰色遮罩)
        const maskLayer = L.geoJSON(buffered, {
            style: {
                fillColor: "#ff699b13", // 灰色底色
                fillOpacity: 0,
                color: "#ff699b30", // 邊框透明
                weight: 0
            },
            // 利用 inversion 技巧，讓被選中的地方變透明
            // 其實就是給這些區域加上一個「反轉樣式」
            renderer: L.canvas() // 使用 Canvas 渲染會比較流暢
        }).addTo(map);

        // 3. 處理顏色加深：將 busData 合併成單一 Feature
        // 這樣就不會因為重疊導致顏色變深
        const mergedLines = turf.combine(data); 

        L.geoJSON(mergedLines, {
            style: {
                color: "#ff0000",
                weight: 2,
                opacity: 0 // 統一透明度，不會再有顏色疊加問題
            }
        }).addTo(map);

        L.geoJSON(data, {
                    style: ()=>{i++; return {color: `${BUS_COLORS[i]}67`, weight: 4}},
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