'use strict';


const layersConfig = {
  amountOfMoney: {
    title: 'Amount of Money',
    sql: "SELECT * FROM care_donors_v02" ,
    cartoCss: "#care_donors_v02{  marker-fill-opacity: 0.7;  marker-line-color: #FFF;  marker-line-width: 0;  marker-line-opacity: 1;  marker-width: 3.5;  marker-fill: rgb(193,230,226);  marker-allow-overlap: true;  marker-comp-op: darken;  [zoom>7]{marker-width: 7;}}#care_donors_v02 [ amount <= 1000000] {   marker-fill: rgb(34,50,58);  }#care_donors_v02 [ amount <= 1000] {   marker-fill: rgb(91,135,153);}#care_donors_v02 [ amount <= 500] {   marker-fill: rgb(143,188,196);}#care_donors_v02 [ amount <= 100] {   marker-fill: rgb(193,230,226);}",
    legend: { "type": "choroplet", "buckets": [{ "literal":"$0 - 100", "color":"#dffdfb"}, { "literal":"$100 - 500", "color":"#97c9cf"}, { "literal":"$500 - 1000", "color":"#639aa8"}, { "literal":"More than $1000", "color":"#28434b"}] }
  },
  donorsNumber: {
    title: 'Number of donors',
    sql: "with r as (SELECT count(country_iso), country_iso FROM care_donors_v02 group by country_iso) SELECT r.count, r.country_iso, s.the_geom_webmercator FROM r inner join borders_care s on r.country_iso=s.iso " ,
    cartoCss: "#care_donors_v02{  polygon-fill: #e3e8e4;  polygon-opacity: 1;  line-color: #FFF;  line-width: 0.5;  line-opacity: 0.5;}#care_donors_v02 [ count <= 376008] {   polygon-fill: rgb(61,88,16);}#care_donors_v02 [ count <= 3000] {   polygon-fill: rgb(127,150,57);}#care_donors_v02 [ count <= 1500] {   polygon-fill: rgb(167,198,93);}#care_donors_v02 [ count <= 250] {   polygon-fill: rgb(207,230,141);}#care_donors_v02 [ count <= 50] {   polygon-fill:  #e3efc2;}",
    legend: { "type": "choroplet", "buckets": [{ "literal":"0 - 1000", "color":"#d6e7a6"}, { "literal":"1000 - 5000", "color":"#b3cc7b"}, { "literal":"5000 - 10000", "color":"#8fa455"}, { "literal":"More than 10000 people", "color":"#4a6822"}] }
  },
  projects: {
    title: 'projects',
    sql: "with r as (SELECT total_peo,w_g_reached, case total_peo WHEN 0 THEN 0 else round((w_g_reached/total_peo)::numeric, 4) end  w_ratio, iso, year, country FROM care_projects where total_peo<>0 and iso !='') SELECT s.the_geom, s.the_geom_webmercator, r.country, r.w_ratio, r.year FROM  r left join borders_care s on s.iso=r.iso where year = '2014' order by w_ratio desc" ,
    cartoCss: "#care_projects {  polygon-pattern-file: url(https://s3.amazonaws.com/com.cartodb.users-assets.production/production/simbiotica/assets/2014060408171614_2.jpg);   polygon-opacity: 0.7;  polygon-fill:rgb(201,200,182);   line-color: #FFF;   line-width: 0.5;   line-opacity: 1;  polygon-pattern-opacity: 0.7;}#care_projects[w_ratio>0.5] {   polygon-fill: rgb(240,213,104);}",
    legend: { "type": "choroplet", "buckets": [{ "literal":"All Projects", "color":"#ddd"}, { "literal":"Women’s empowerment projects", "color":"#ffcd47"}] }
  }
}


export default layersConfig;
