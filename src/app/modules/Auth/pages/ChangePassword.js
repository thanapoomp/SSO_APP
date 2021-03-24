import React from 'react'
import { useFormik } from "formik";
import { Grid, TextField, Card, CardContent, Button } from "@material-ui/core/";
import { useSelector } from "react-redux";
import { changePassword } from "../_redux/authCrud";
import * as swal from "../../Common/components/SweetAlert";

function ChangePassword(props) {
	const authReducer = useSelector(({ auth }) => auth)

	const formik = useFormik({
		enableReinitialize: true,
		validate: (values) => {
			const errors = {};
			if (!values.password) {
				errors.password = "required";
			}

			if (!values.cfPassword) {
				errors.cfPassword = "required";
			}

			if (!values.newPassword) {
				errors.newPassword = "required";
			}

			if (!values.cfNewPassword) {
				errors.cfNewPassword = "required";
			}
			return errors;
		},
		initialValues: {
			password: "",
			cfPassword: "",
			newPassword: "",
			cfNewPassword: "",
		},
		onSubmit: (values, { setSubmitting, resetForm }) => {
			handleSave({ setSubmitting, resetForm }, values);
		},
	});

	const handleSave = ({ setSubmitting }, values) => {
		debugger
		setSubmitting(false);
		// console.log(authReducer);
		// console.log(values);

		let obj = {
			oldPassword: values.password,
			oldConfirmPassword: values.cfPassword,
			newPassword: values.newPassword,
			newConfirmPassword: values.cfNewPassword,
		}
		changePassword(obj)
			.then((res) => {
				if (res.data.isSuccess) {
					swal.swalSuccess("Success", `${res.data.data} success.`);
					console.log(res.data);
				} else {
					swal.swalError("Error", res.data.message);
				}
			})
			.catch((err) => {
				//network error
				swal.swalError("Error", err.message);
			});
	}

	return (
		<form onSubmit={formik.handleSubmit}>
			<Card>
				<CardContent>
					<Grid container spacing={3}>
						<Grid item xs={12} lg={3}>
							<TextField
								name="password"
								label="Password"
								required
								fullWidth
								onBlur={formik.handleBlur}
								onChange={formik.handleChange}
								value={formik.values.password}
								error={(formik.errors.password && formik.touched.password)}
								helperText={(formik.errors.password && formik.touched.password) && formik.errors.password}
							/>
						</Grid>

						<Grid item xs={12} lg={3}>
							<TextField
								name="cfPassword"
								label="ConfirmPassword"
								required
								fullWidth
								onBlur={formik.handleBlur}
								onChange={formik.handleChange}
								value={formik.values.cfPassword}
								error={(formik.errors.cfPassword && formik.touched.cfPassword)}
								helperText={(formik.errors.cfPassword && formik.touched.cfPassword) && formik.errors.cfPassword}
							/>
						</Grid>

						<Grid item xs={12} lg={3}>
							<TextField
								name="newPassword"
								label="New Password"
								required
								fullWidth
								onBlur={formik.handleBlur}
								onChange={formik.handleChange}
								value={formik.values.newPassword}
								error={(formik.errors.newPassword && formik.touched.newPassword)}
								helperText={(formik.errors.newPassword && formik.touched.newPassword) && formik.errors.newPassword}
							/>
						</Grid>

						<Grid item xs={12} lg={3}>
							<TextField
								name="cfNewPassword"
								label="Confirm New Password"
								required
								fullWidth
								onBlur={formik.handleBlur}
								onChange={formik.handleChange}
								value={formik.values.cfNewPassword}
								error={(formik.errors.cfNewPassword && formik.touched.cfNewPassword)}
								helperText={(formik.errors.cfNewPassword && formik.touched.cfNewPassword) && formik.errors.cfNewPassword}
							/>
						</Grid>
						<Grid item xs={12} lg={3}>
							<Button type="submit" color="primary" fullWidth variant="contained" style={{ marginTop: 10 }}>Submit</Button>
						</Grid>
					</Grid>
				</CardContent>
			</Card>
		</form>
	)
}

export default ChangePassword
