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
import SourceTable from "./modules/Auth/pages/SourceTable";
import RoleTable from "./modules/Auth/pages/RoleTable";
import AssignRolesV2 from "./modules/Auth/pages/AssignRolesV2";

export default function BasePage(props) {
  // useEffect(() => {
  //   console.log('Base page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {<Redirect exact from="/" to="/dashboard" />}
        <ContentRoute exact path="/dashboard" component={DashboardPage} />

        {/* Start Demo part สามารถ comment ได้ */}
        {/* <PrivateRoute exact path="/test" roles={[ROLES.admin,ROLES.developer]} component={Test} /> */}
        <ContentRoute exact path="/useFormik/textfield" component={UseFormikWithTextField} />
        <ContentRoute exact path="/useFormik/dropdown" component={UseFormikWithDropdownCascade} />
        <PrivateRoute exact path="/useFormik/all" roles={[ROLES.developer]} component={WithAllComponents} />
        <PrivateRoute exact path="/User/ChangePassword" roles={[ROLES.developer]} component={ChangePassword} />
        <ContentRoute exact path="/User/UserTable" component={UserTable} />
        <ContentRoute exact path="/User/AssignRoles" component={AssignRoles} />
        <ContentRoute exact path="/User/Source" component={AddSource} />
        <ContentRoute exact path="/User/Roles" component={AddRoles} />
        <ContentRoute exact path="/User/RoleTable" component={RoleTable} />
        <ContentRoute exact path="/User/SourceTable" component={SourceTable} />
        <ContentRoute exact path="/User/AssignRolesV2" component={AssignRolesV2} />
        {/* End Demo part สามารถ comment ได้ */}

        <Route
          path="/errorUnAuthorized"
          component={ErrorUnAuthorized}
        />

        {/* nothing match - redirect to error */}
        <Redirect to="/error"/>
      </Switch>
      <TokenHandler></TokenHandler>
    </Suspense>
  );
}
