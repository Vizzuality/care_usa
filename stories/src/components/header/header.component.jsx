import React from "react";
import { NavLink } from 'redux-first-router-link';
import cx from 'classnames';

function Header (props) {
  const { links, openMobileMenu, closeMobileMenu, open } = props;
  return (
    <header id="home" className="main-head-holder">
      <div className="main-head  container">
        <div className="logo-wrap">
          <a className="logo">
            <span className="hidden">CARE USA</span>
            <img
              alt="Care"
              src="/images/care-logo.png"
              title="Care-logo"
            />
          </a>
        </div>
        <section className={cx(['mob-menu', { active: open }])}>
          {!open &&
            <div className="open" onClick={openMobileMenu}>
              <span/>
            </div>
          }
          {open &&
            <div className="close" onClick={closeMobileMenu}>
              <span/>
            </div>
          }
        </section>
        <nav className="main-menu">
          <ul className="main-menu-list">
            <li className="menu-list-item">
              <NavLink
                to={links.map}
                className="menu-link"
              >
                MAP OF IMPACT
              </NavLink>
            </li>
            <li className="menu-list-item">
              <NavLink
                strict={false}
                to={links.stories}
                className="menu-link"
                isActive={(match, location) => location.type === 'location/STORIES' || location.type === 'location/HOME'}
              >
                STORIES
              </NavLink>
            </li>
            <li className="menu-list-item">
              <NavLink
                to={links.about}
                className="menu-link"
              >
                ABOUT
              </NavLink>
            </li>
            <li className="menu-list-item">
              <NavLink
                to={links.donate}
                className="menu-link button"
              >
                DONATE
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
