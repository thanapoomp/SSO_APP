/* eslint-disable no-restricted-imports */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";
import { useSelector } from "react-redux";
import { ROLES } from "../../../../../Constants";
import Hoc from "../../../../../app/modules/Common/components/Hoc";
import DvrIcon from "@material-ui/icons/Dvr";
import Icon from "@material-ui/core/Icon";

export function AsideMenuList({ layoutProps }) {
  const location = useLocation();
  const authReducer = useSelector(({ auth }) => auth);

  const isShowMenu = (roles) => {
    roles = roles === undefined ? [] : roles;
    if (roles.length > 0) {
      // check if route is restricted by role
      let intersection = roles.filter((x) => authReducer.roles.includes(x));
      return intersection.length > 0;
    } else {
      return true;
    }
  };

  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
      : "";
  };

  return (
    <>
      {/* begin::Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/* begin::section */}
        <li className="menu-section ">
          <h4 className="menu-text">Menu</h4>
          <i className="menu-icon flaticon-more-v2"></i>
        </li>
        {/* end:: section */}

        {/*begin::1 Level*/}
        <li
          className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/dashboard">
            <span className="svg-icon menu-icon">
              <DvrIcon></DvrIcon>
            </span>
            <span className="menu-text">dashboard</span>
          </NavLink>
        </li>

        {/* begin::section */}
        {isShowMenu([ROLES.developer]) && (
          <Hoc>
            <li className="menu-section ">
              <h4 className="menu-text">UseFormik</h4>
              <i className="menu-icon flaticon-more-v2"></i>
            </li>

            {/* end:: section */}
            {/*begin::1 newEmployee*/}
            <li
              className={`menu-item ${getMenuItemActive("/useFormik/all", false)}`}
              aria-haspopup="true"
            >
              <NavLink className="menu-link" to="/useFormik/all">
                <span className="svg-icon menu-icon">
                  <Icon>star</Icon>
                </span>
                <span className="menu-text">All</span>
              </NavLink>
            </li>
            {/*End::1 newEmployee*/}


            {/*begin::1 newEmployee*/}
            <li
              className={`menu-item ${getMenuItemActive("/useFormik/textfield", false)}`}
              aria-haspopup="true"
            >
              <NavLink className="menu-link" to="/useFormik/textfield">
                <span className="svg-icon menu-icon">
                  <Icon>star</Icon>
                </span>
                <span className="menu-text">Text field</span>
              </NavLink>
            </li>
            {/*End::1 newEmployee*/}
            {/*begin::1 newEmployee*/}
            <li
              className={`menu-item ${getMenuItemActive("/useFormik/dropdown", false)}`}
              aria-haspopup="true"
            >
              <NavLink className="menu-link" to="/useFormik/dropdown">
                <span className="svg-icon menu-icon">
                  <Icon>star</Icon>
                </span>
                <span className="menu-text">Dropdown</span>
              </NavLink>
            </li>
          </Hoc>
        )}
        {/*End::1 newEmployee*/}

        {/*begin::1 User*/}

        <li className="menu-section ">
          <h4 className="menu-text">User</h4>
          <i className="menu-icon flaticon-more-v2"></i>
        </li>

        {/* end:: section */}
        {/*begin::1 Level*/}
        <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/google-material",
            true
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle" to="/google-material">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Cap-2.svg")} />
            </span>
            <span className="menu-text">User Manager</span>
            <i className="menu-arrow" />
          </NavLink>
          <div className="menu-submenu ">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li
                className="menu-item  menu-item-parent"
                aria-haspopup="true"
              >
                <span className="menu-link">
                  <span className="menu-text">Level 1</span>
                </span>
              </li>

              {/* Inputs */}
              {/*begin::2 Level*/}
              <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/google-material/inputs",
                  true
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/User/AssignRoles"
                >
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Assign Roles </span>
                </NavLink>
              </li>

              <li
                className={`menu-item  ${getMenuItemActive(
                  "/google-material/inputs/autocomplete"
                )}`}
                aria-haspopup="true"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/User/UserTable"
                >
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">User</span>
                </NavLink>
              </li>
              {/*end::2 Level*/}
            </ul>
          </div>
        </li>
        {/*End::1 User*/}
        <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/google-material",
            true
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle" to="/google-material">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Cap-2.svg")} />
            </span>
            <span className="menu-text">Source Manager</span>
            <i className="menu-arrow" />
          </NavLink>
          <div className="menu-submenu ">
            <i className="menu-arrow" />
            {/* end L1 */}
            <ul className="menu-subnav">
              <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/google-material/inputs",
                  true
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/User/SourceTable"
                >
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Source</span>
                </NavLink>
              </li>
              <li
                className={`menu-item  ${getMenuItemActive(
                  "/google-material/inputs/autocomplete"
                )}`}
                aria-haspopup="true"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/User/Source"
                >
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Add Source</span>
                </NavLink>
              </li>
              {/*end::2 Level*/}
            </ul>
          </div>
        </li>

        {/* begin Role */}
        <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/google-material",
            true
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle" to="/google-material">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Cap-2.svg")} />
            </span>
            <span className="menu-text">Roles Manager</span>
            <i className="menu-arrow" />
          </NavLink>
          <div className="menu-submenu ">
            <i className="menu-arrow" />
            {/* end L1 */}
            <ul className="menu-subnav">
              <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/google-material/inputs",
                  true
                )}`}
                aria-haspopup="true"
                data-menu-toggle="hover"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/User/RoleTable"
                >
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Roles</span>
                </NavLink>
              </li>
              <li
                className={`menu-item  ${getMenuItemActive(
                  "/google-material/inputs/autocomplete"
                )}`}
                aria-haspopup="true"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/User/Roles"
                >
                  <i className="menu-bullet menu-bullet-dot">
                    <span />
                  </i>
                  <span className="menu-text">Add Role</span>
                </NavLink>
              </li>
              {/*end::2 Level*/}
            </ul>
          </div>
        </li>
        {/* end Role */}

        {/* End Demo สามารถ comment ทิ้งได้ */}


      </ul>
      {/* end::Menu Nav */}
    </>
  );
}
