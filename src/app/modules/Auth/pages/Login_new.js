import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { TextField } from "@material-ui/core/";
import * as Yup from "yup";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { login, getUserByToken, getExp, getRoles } from "../_redux/authCrud";

/*
  INTL (i18n) docs:
  https://github.com/formatjs/react-intl/blob/master/docs/Components.md#formattedmessage
*/

/*
  Formik+YUP:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
*/

const initialValues = {
  username: "",
  password: "",
};

function Login_new(props) {
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const LoginSchema = Yup.object().shape({
    username: Yup.string().required(
      intl.formatMessage({
        id: "AUTH.VALIDATION.REQUIRED_FIELD",
      })
    ),
    password: Yup.string()
      .min(4, "Minimum 4 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
  });

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const formik = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    enableReinitialize: true,
    validate: (values) => {
      const errors = {};

      return errors;
    },
    onSubmit: (values, { setStatus, setSubmitting }) => {
      enableLoading();
      login(values.username, values.password)
        .then((res) => {
          if (res.data.isSuccess) {
            // debugger
            //Success
            disableLoading();

            let loginDetail = {}

            //get token
            loginDetail.authToken = res.data.data

            //get user
            loginDetail.user = getUserByToken(res.data.data)

            // get exp
            loginDetail.exp = getExp(res.data.data);

            //get roles
            loginDetail.roles = getRoles(res.data.data)

            props.login(loginDetail);

          } else {
            //Failed
            disableLoading();
            setSubmitting(false);
            setStatus(
              intl.formatMessage({
                id: "AUTH.VALIDATION.INVALID_LOGIN",
              })
            );
          }
        })
        .catch((error) => {
          disableLoading();
          setSubmitting(false);
          setStatus(error.message);
        });
    },
  });

  return (
    <div className="login-form login-signin" id="kt_login_signin_form">
      {/* begin::Head */}
      <div className="position-absolute top-0 right-0 text-right mt-5 mb-15 mb-lg-0 flex-column-auto justify-content-center py-5 px-10">
        <span className="font-weight-bold text-dark-50">
          Don't have an account yet?
        </span>
        <Link
          to="/auth/registration"
          className="font-weight-bold ml-2"
          id="kt_login_signup"
        >
          Sign Up!
        </Link>
      </div>
      <div className="text-center mb-10 mb-lg-20">
        <h3 className="font-size-h1">
          <FormattedMessage id="AUTH.LOGIN.TITLE" />
        </h3>
        <p className="text-muted font-weight-bold">
          Enter your username and password
        </p>
      </div>
      {/* end::Head */}

      {/*begin::Form*/}
      <form
        onSubmit={formik.handleSubmit}
        className="form fv-plugins-bootstrap fv-plugins-framework"
      >
        {formik.status && (
          <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
            <div className="alert-text font-weight-bold">{formik.status}</div>
          </div>
        )}

        <div className="form-group fv-plugins-icon-container">
          <TextField
            {...formik.getFieldProps("username")}
            name="username"
            label="Username"
            variant="outlined"
            size="small"
            required
            fullWidth
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.username}
            error={(formik.errors.username && formik.touched.username)}
            helperText={(formik.errors.username && formik.touched.username) && formik.errors.username}
          />
        </div>
        <div className="form-group fv-plugins-icon-container">
          <TextField
            {...formik.getFieldProps("password")}
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            size="small"
            required
            fullWidth
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.password}
            error={(formik.errors.password && formik.touched.password)}
            helperText={(formik.errors.password && formik.touched.password) && formik.errors.password}
          />
        </div>
        <div className="form-group d-flex flex-wrap justify-content-between align-items-center">
          <Link
            to="/auth/forgot-password"
            className="text-dark-50 text-hover-primary my-3 mr-2"
            id="kt_login_forgot"
          >
            <FormattedMessage id="AUTH.GENERAL.FORGOT_BUTTON" />
          </Link>
          <button
            id="kt_login_signin_submit"
            type="submit"
            disabled={formik.isSubmitting}
            className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}
          >
            <span>Sign In</span>
            {loading && <span className="ml-3 spinner spinner-white"></span>}
          </button>
        </div>
      </form>
      {/*end::Form*/}
    </div>
  );
}

export default injectIntl(connect(null, auth.actions)(Login_new));
