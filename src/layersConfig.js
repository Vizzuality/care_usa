'use strict';

const layersConfig = {
  donations: {
    sql: "with r as (SELECT count(iso), iso FROM care_donors group by iso) SELECT r.count, r.iso, s.the_geom_webmercator FROM r inner join borders_care s on r.iso=s.iso" ,
    cartoCss: "#care_donors{marker-fill-opacity: 0.9;marker-line-color: #FFF;marker-line-width: 1;marker-line-opacity: 1;marker-placement: point;marker-type: ellipse;marker-width: 10;marker-fill: #FF6600;marker-allow-overlap: true;}"
  },
  projects: {
   sql: "SELECT s.the_geom, s.the_geom_webmercator, r.country, r.sum_c_c_n_peo, year FROM care_projects r inner join borders_care s on s.iso=r.iso where year = 2014 order by sum_c_c_n_peo desc" ,
   cartoCss: "#care_projects{ polygon-fill: #FFFFB2; polygon-opacity: 0.8; line-color: #FFF; line-width: 0.5; line-opacity: 1; } #care_projects [ sum_c_c_n_peo <= 1073767] { polygon-fill: #B10026; } #care_projects [ sum_c_c_n_peo <= 37118] { polygon-fill: #E31A1C; } #care_projects [ sum_c_c_n_peo <= 13599] { polygon-fill: #FC4E2A; } #care_projects [ sum_c_c_n_peo <= 7769] { polygon-fill: #FD8D3C; } #care_projects [ sum_c_c_n_peo <= 4443] { polygon-fill: #FEB24C; } #care_projects [ sum_c_c_n_peo <= 1842] { polygon-fill: #FED976; } #care_projects [ sum_c_c_n_peo <= 572] { polygon-fill: #FFFFB2; }"
  }
}


export default layersConfig;
