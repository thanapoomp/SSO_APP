import React, { Suspense } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import PrivateRoute from "./modules/Auth/components/PrivateRoute";
import ErrorUnAuthorized from "./modules/Auth/pages/ErrorUnAuthorized";
import DashboardPage from "./pages/DashboardPage";
import TokenHandler from "./modules/Auth/components/TokenHandler";
import { ROLES } from "../Constants";
import UseFormikWithTextField from './modules/_FormikUseFormik/pages/WithTextField'
import UseFormikWithDropdownCascade from './modules/_FormikUseFormik/pages/WithDropdownCascade'
import WithAllComponents from "./modules/_FormikUseFormik/pages/WithAllComponents";
import ChangePassword from "./modules/Auth/pages/ChangePassword";
import UserTable from "./modules/Auth/pages/UserTable";
import AssignRoles from "./modules/Auth/pages/AssignRoles";
import AddSource from "./modules/Auth/pages/AddSource";
import AddRoles from "./modules/Auth/pages/AddRoles";
import EditRoles from "./modules/Auth/pages/EditRoles";
import EditSource from "./modules/Auth/pages/EditSource";
import SourceTable from "./modules/Auth/pages/SourceTable";
import RoleTable from "./modules/Auth/pages/RoleTable";
import AssignRolesV2 from "./modules/Auth/pages/AssignRolesV2";
import AddGroupRole from "./modules/Auth/pages/AddGroupRoleTeamPage";

export default function BasePage(props) {
  // useEffect(() => {
  //   console.log('Base page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact from="/" to="/User/UserTable" />}
        <ContentRoute exact path="/User/UserTable" component={UserTable} />

        {/* Start Demo part สามารถ comment ได้ */}
        {/* <PrivateRoute exact path="/test" roles={[ROLES.admin,ROLES.developer]} component={Test} /> */}
        <PrivateRoute exact path="/useFormik/textfield" roles={[ROLES.developer]} component={UseFormikWithTextField} />
        <PrivateRoute exact path="/useFormik/dropdown" roles={[ROLES.developer]} component={UseFormikWithDropdownCascade} />
        <PrivateRoute exact path="/useFormik/all" roles={[ROLES.developer]} component={WithAllComponents} />
        <PrivateRoute exact path="/User/ChangePassword" component={ChangePassword} />
        <ContentRoute exact path="/User/UserTable" component={UserTable} />
        <PrivateRoute exact path="/User/AddGroupRole" roles={[ROLES.developer, ROLES.admin]} component={AddGroupRole} />
        <PrivateRoute exact path="/User/Source" roles={[ROLES.developer, ROLES.admin]} component={AddSource} />
        <PrivateRoute exact path="/User/Roles" roles={[ROLES.developer, ROLES.admin]} component={AddRoles} />
        <PrivateRoute exact path="/User/EditRoles" roles={[ROLES.developer, ROLES.admin]} component={EditRoles} />
        <PrivateRoute exact path="/User/EditSource" roles={[ROLES.developer, ROLES.admin]} component={EditSource} />
        <ContentRoute exact path="/User/RoleTable" component={RoleTable} />
        <ContentRoute exact path="/User/SourceTable" component={SourceTable} />
        <PrivateRoute exact path="/User/AssignRolesV2" roles={[ROLES.developer, ROLES.admin]} component={AssignRolesV2} />
        {/* End Demo part สามารถ comment ได้ */}

        <Route
          path="/errorUnAuthorized"
          component={ErrorUnAuthorized}
        />

        {/* nothing match - redirect to error */}
        <Redirect to="/error" />
      </Switch>
      <TokenHandler></TokenHandler>
    </Suspense>
  );
}
