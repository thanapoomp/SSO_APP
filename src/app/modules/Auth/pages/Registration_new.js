/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useFormik } from "formik";
import { connect } from "react-redux";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { register } from "../_redux/authCrud";
import { TextField, Button } from "@material-ui/core/"
import FormikDropdown from "../../../modules/_FormikUseFormik/components/FormikDropdown";
import * as CONST from "../../../../Constants";
import * as swal from "../../Common/components/SweetAlert";
import Axios from "axios";

const initialValues = {
  sourceid: 0,
  username: "",
  password: "",
  changepassword: "",
  mapperid: ""
};

function Registration_new(props) {
  const api_get_source_url = `${CONST.API_URL}/Auth/source/get`;

  const [sourceList, setSourceList] = React.useState([]);
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const [Classe, setClasse] = useState(false)
  const RegistrationSchema = Yup.object().shape({
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

      if (!values.mapperid) {
        errors.mapperid = "Required field";
      }

      if (!values.sourceid) {
        errors.sourceid = "Required field";
      }

      return errors;
    },
    validationSchema: RegistrationSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      debugger
      enableLoading();
      register(values.mapperid, values.username, values.password, values.sourceid)
        .then((res) => {
          if (res.data.isSuccess) {

            //save redux เหมือน dispatch
            props.register(res.data.data);

            //add clase noti
            setClasse("success")

            //ข้อความ noti
            setStatus("Register Success ");
            disableLoading();
          } else {

            //add clase noti
            setClasse("danger")
            //ข้อความ noti
            setStatus(res.data.message);

            setSubmitting(false);
            disableLoading();
          }
        })
        .catch((error) => {

          //add clase noti
          setClasse("danger")
          setSubmitting(false);

          //ข้อความ noti
          setStatus(error.message);
          disableLoading();
        });
    },
  });

  const loadSource = () => {
    //Load Province
    Axios.get(api_get_source_url)
      .then((res) => {
        if (res.data.isSuccess) {
          setSourceList(res.data.data);
        } else {
          swal.swalError("Error", res.data.message);
        }
      })
      .catch((err) => {
        swal.swalError("Error", err.message);
      });
  };

  React.useEffect(() => {
    loadSource();
  }, []);

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
            {...formik.getFieldProps("mapperid")}
            name="mapperid"
            label="Employee Id"
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

          <FormikDropdown
            formik={formik}
            name="sourceid"
            variant="outlined"
            label=""
            id="demo-simple-select-outlined"
            required
            data={sourceList}
            firstItemText="Select Source"
            valueFieldName="id"
            displayFieldName="sourceName"
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
