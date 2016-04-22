'use strict';

import './dash-filters-styles.postcss';
import React from 'react';
import moment from 'moment';
import filtersModel from '../../scripts/models/filtersModel';

class DashboardFilters extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
  }

  clearRegion() {
    filtersModel.set({
      region: null
    });
  }

  clearSector(sectorSlug) {
    let sectors = filtersModel.get('sectors')
      .filter(sector => sector !== sectorSlug);
    filtersModel.set({
      sectors
    });
  }

  render() {
    let region;
    if(this.props.filters.region) {
      if(!this.props.regions.length) {
        region = (
          <div className="region is-loading">
          </div>
        );
      } else {
        /* We need to make sure that the region prop exists in the collection
         * and then we retrieve the actual name of it */
        const matchedRegions = this.props.regions.filter(region => region.iso === this.props.filters.region);
        if(matchedRegions.length) {
          region = (
            <div className="region">
              <svg className="icon icon-palce">
                <use xlinkHref="#icon-palce"></use>
              </svg>
              <span className="text text-legend-s">{ matchedRegions[0].name }</span>
              <svg className="icon icon-close" onClick={ this.clearRegion.bind(this) }>
                <use xlinkHref="#icon-close"></use>
              </svg>
            </div>
          );
        }
      }
    }

    let sectorsList;
    if(this.props.filters.sectors && this.props.filters.sectors.length) {
      if(!this.props.sectors.length) {
        sectorsList = (
          <div className="sectors is-loading">
          </div>
        );
      } else {
        const sectors = this.props.filters.sectors.map(sector => {
          const matchedSectors = this.props.sectors.filter(o => o.slug === sector);
          if(matchedSectors.length) return matchedSectors[0];
        }).filter(sector => !!sector);

        sectorsList = (
          <div className="sectors">
            <svg className="icon icon-sectors">
              <use xlinkHref="#icon-sectors"></use>
            </svg>
            <div>
            {
              sectors.map(sector => {
                return <div key={ sector.slug } className="text text-legend-s">
                    { sector.name }
                    <svg className="icon icon-close" onClick={ this.clearSector.bind(this, sector.slug) }>
                      <use xlinkHref="#icon-close"></use>
                    </svg>
                  </div>;
              })
            }
            </div>
          </div>
        );
      }
    }

    return (
      <div className="m-dash-filters">
        { region }
        { sectorsList }
     </div>
    );
  }

}

export default DashboardFilters;
