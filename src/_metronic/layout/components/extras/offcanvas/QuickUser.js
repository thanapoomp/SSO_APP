/* eslint-disable no-restricted-imports */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,no-undef */
import React from "react";
import SVG from "react-inlinesvg";
import { useHistory } from "react-router-dom";
import { toAbsoluteUrl } from "../../../../_helpers";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

export function QuickUser() {
  const authReducer = useSelector(({ auth }) => auth)
  const history = useHistory();

  const logoutClick = () => {
    const toggle = document.getElementById("kt_quick_user_toggle");
    if (toggle) {
      toggle.click();
    }
    history.push("/logout");
  };

  const roles = () => {
    let objRoles = [];
    if (authReducer.roles) {
      Object.keys(authReducer.roles).forEach(function (key) {
        objRoles.push(`${authReducer.roles[key]},`);
      });
      return (objRoles);
    }
    return;
  }

  return (
    <div id="kt_quick_user" className="offcanvas offcanvas-right offcanvas p-10">
      <div className="offcanvas-header d-flex align-items-center justify-content-between pb-5">
        <h3 className="font-weight-bold m-0">
          User Profile
            <small className="text-muted font-size-sm ml-2"></small>
        </h3>
        <a
          href="#"
          className="btn btn-xs btn-icon btn-light btn-hover-primary"
          id="kt_quick_user_close"
        >
          <i className="ki ki-close icon-xs text-muted" />
        </a>
      </div>

      <div
        className="offcanvas-content pr-5 mr-n5"
      >
        <div className="d-flex align-items-center mt-5">
          <div
            className="symbol symbol-100 mr-5"
          >
            <div className="symbol-label" style={{
              backgroundImage: `url(${toAbsoluteUrl(
                "/media/users/default.jpg"
              )})`
            }} />
            <i className="symbol-badge bg-success" />
          </div>
          <div className="d-flex flex-column">
            <a
              href="#"
              className="font-weight-bold font-size-h5 text-dark-75 text-hover-primary"
            >
              {authReducer.user}
            </a>
            <div className="text-muted mt-1">User : {authReducer.user}</div>
            <div className="text-muted mt-1">Roles : {roles()}</div>
            <div className="navi mt-2">
              <a href="#" className="navi-item">
                <span className="navi-link p-0 pb-2">
                  <span className="navi-icon mr-1">
                    <span className="svg-icon-lg svg-icon-primary">
                      <SVG
                        src={toAbsoluteUrl(
                          "/media/svg/icons/Communication/Mail-notification.svg"
                        )}
                      ></SVG>
                    </span>
                  </span>
                  <span className="navi-text text-muted text-hover-primary">
                    jm@softplus.com
                  </span>
                </span>
              </a>
            </div>
            {/* <Link to="/logout" className="btn btn-light-primary btn-bold">
                Sign Out
              </Link> */}
            <button className="btn btn-light-danger btn-bold" onClick={logoutClick}>Sign out</button>
          </div>
        </div>

        <div className="separator separator-dashed mt-8 mb-5" />

        <div className="navi navi-spacer-x-0 p-0">

          <NavLink to="/User/ChangePassword" className="navi-item">

            <div className="navi-link">
              <div className="symbol symbol-40 bg-light mr-3">
                <div className="symbol-label">
                  <span className="svg-icon svg-icon-md svg-icon-success">
                    <SVG
                      src={toAbsoluteUrl(
                        "/media/svg/icons/General/Lock.svg"
                      )}
                    ></SVG>
                  </span>
                </div>
              </div>
              <div className="navi-text">
                <div className="font-weight-bold">ChangePassword</div>
                <div className="text-muted">
                  Account settings and more
                    {" "}
                  <span className="label label-light-danger label-inline font-weight-bold">
                    update
                  </span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>

        <div className="separator separator-dashed my-7"></div>
      </div>
    </div >
  );
}
