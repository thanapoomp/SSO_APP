import React, { useState } from "react";
import { useFormik } from "formik";
import { connect } from "react-redux";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { register } from "../_redux/authCrud";
import { TextField, Button } from "@material-ui/core/"

const initialValues = {
  fullname: "",
  sourceid: "a4f9ad8a-0109-4c27-ace4-dcff6e5691d4",
  username: "",
  password: "",
  changepassword: "",
  mapperid: "000"
};

function Registration_new(props) {
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const [Classe, setClasse] = useState(false)
  const RegistrationSchema = Yup.object().shape({
    fullname: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    username: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    password: Yup.string()
      .min(3, "Minimum 4 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    changepassword: Yup.string()
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      )
      .when("password", {
        is: (val) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref("password")],
          "Password and Confirm Password didn't match"
        ),
      }),
  });

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validate: (values) => {
      const errors = {};

      return errors;
    },
    validationSchema: RegistrationSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      debugger
      enableLoading();
      register(values.mapperid, values.username, values.password, values.sourceid)
        .then((res) => {
          if (res.data.isSuccess) {

            props.register(res.data.data);
            setClasse("success")
            setStatus("Register Success ");
            disableLoading();
          } else {
            setClasse("danger")
            setSubmitting(false);
            setStatus(res.data.message);
            disableLoading();
          }
        })
        .catch((error) => {
          setClasse("danger")
          disableLoading();
          setSubmitting(false);
          setStatus(error.message);
        });
    },
  });

  return (
    <div className="login-form login-signin" style={{ display: "block" }}>
      <div className="text-center mb-10 mb-lg-20">
        <h3 className="font-size-h1">
          <FormattedMessage id="AUTH.REGISTER.TITLE" />
        </h3>
        <p className="text-muted font-weight-bold">
          Enter your details to create your account
        </p>
      </div>

      <form
        id="kt_login_signin_form"
        className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp"
        onSubmit={formik.handleSubmit}
      >
        {/* begin: Alert */}
        {formik.status && (
          <div className={`mb-10 alert alert-custom alert-light-${Classe} alert-dismissible`}>
            <div className="alert-text font-weight-bold">{formik.status}</div>
          </div>
        )}
        {/* end: Alert */}

        {/* begin: Fullname */}
        <div className="form-group fv-plugins-icon-container">
          <TextField
            {...formik.getFieldProps("fullname")}
            name="fullname"
            label="Full name"
            variant="outlined"
            size="small"
            required
            fullWidth
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.fullname}
            error={(formik.errors.fullname && formik.touched.fullname)}
            helperText={(formik.errors.fullname && formik.touched.fullname) && formik.errors.fullname}
          />
        </div>
        {/* end: Fullname */}

        {/* begin: Username */}
        <div className="form-group fv-plugins-icon-container">
          <TextField
            {...formik.getFieldProps("username")}
            name="username"
            label="User name"
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
        {/* end: Username */}

        {/* begin: mapperid */}
        <div className="form-group fv-plugins-icon-container">
          <TextField
            {...formik.getFieldProps("username")}
            name="mapperid"
            label="mapperId"
            variant="outlined"
            size="small"
            required
            fullWidth
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.mapperid}
            error={(formik.errors.mapperid && formik.touched.mapperid)}
            helperText={(formik.errors.mapperid && formik.touched.mapperid) && formik.errors.mapperid}
          />
        </div>
        {/* end: mapperid */}

        {/* begin: sourceId */}
        <div className="form-group fv-plugins-icon-container">
          <TextField
            {...formik.getFieldProps("username")}
            name="sourceid"
            label="sourceId"
            variant="outlined"
            size="small"
            required
            fullWidth
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.sourceid}
            error={(formik.errors.sourceid && formik.touched.sourceid)}
            helperText={(formik.errors.sourceid && formik.touched.sourceid) && formik.errors.sourceid}
          />
        </div>
        {/* end: sourceId */}

        {/* begin: Password */}
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
        {/* end: Password */}

        {/* begin: Confirm Password */}
        <div className="form-group fv-plugins-icon-container">
          <TextField
            {...formik.getFieldProps("changepassword")}
            name="changepassword"
            label="Confirm Password"
            type="password"
            variant="outlined"
            size="small"
            required
            fullWidth
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.changepassword}
            error={(formik.errors.changepassword && formik.touched.changepassword)}
            helperText={(formik.errors.changepassword && formik.touched.changepassword) && formik.errors.changepassword}
          />
        </div>
        {/* end: Confirm Password */}

        <div className="form-group d-flex flex-wrap flex-center">
          <Button
            type="submit"
            onClick={formik.handleSubmit}
            disabled={formik.isSubmitting}
            className="btn btn-light-primary font-weight-bold px-9 py-4 my-3 mx-4"
          >
            <span>Submit</span>
            {loading && <span className="ml-3 spinner spinner-white"></span>}
          </Button>

          <Link to="/auth/login">
            <button
              type="button"
              className="btn btn-light-primary font-weight-bold px-9 py-4 my-3 mx-4"
            >
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default injectIntl(connect(null, auth.actions)(Registration_new));
