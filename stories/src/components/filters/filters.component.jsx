import React from "react";
import { deslugify } from 'utils/stories';

function Filters(props) {
  const {
    categories,
    countries,
    templates,
    query,
    years,
    onFilterChange
  } = props;
  const categoryFilterTitle = query.category ? deslugify(query.category) : 'Select category';
  const countrySelected = query.country && countries.find(c => c.value = query.country)
  const countryFilterTitle = countrySelected ? countrySelected.label : 'Select country';
  return (
    <section className="multi-search-container">
      <input
        id="filterTrigger"
        className="hidden"
        type="checkbox"
        name="filterTrigger"
      />
      <div
        className="multisearch-form box"
      >
        <div className="filters-holder">
          <div className="field">
            <input
              id="formSearch"
              type="search"
              name="q"
              placeholder="Search by..."
              defaultValue={query.q}
              onInput={onFilterChange}
            />
            <button
              id="formSearchSubmit"
              className="search-btn"
              type="button"
              name="formSearchBtn"
              title="Search"
            >
              <i className="icon-search"/>
            </button>
          </div>
          <div className="field select">
            <select
              id="selectCategory"
              title={categoryFilterTitle}
              name="category"
              placeholder="Category"
              value={query.category || ''}
              onChange={onFilterChange}
            >
              <option value={''}>Category</option>
              {
                categories.map(category => (
                  <option value={category.value} key={category.value}>
                    {category.label}
                  </option>
                ))
              }
            </select>
          </div>
          <div className="field select">
            <select
              id="selectCountry"
              title={countryFilterTitle}
              placeholder="Country"
              name="country"
              defaultValue={query.country || ''}
              onChange={onFilterChange}
              >
              <option value={''}>Country</option>
              {
                // Don't know why is not working without the selected attribute in the option
                countries.map(country => (
                  <option selected={query.country === country.value} value={country.value} key={country.value + country.label}>
                    {country.label}
                  </option>
                ))
              }
            </select>
          </div>
          <div className="field select">
            <select
              id="selectYear"
              title="Select Year"
              placeholder="Year"
              name="date_start"
              value={query.date_start || ''}
              onChange={onFilterChange}
            >
              <option value={''}>Year</option>
              {
                years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))
              }
            </select>
          </div>
          <div className="field select">
            <select
              id="storyType"
              title="Templates"
              name="template"
              value={query.template || ''}
              onChange={onFilterChange}
            >
              <option value={''}>All</option>
              {
                templates.map(template => (
                  <option value={template.value} key={template.value}>
                    {template.label}
                  </option>
                ))
              }
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Filters;
