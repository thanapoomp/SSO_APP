/* eslint-disable no-unused-vars */
import React from 'react'
import { useFormik } from "formik";
import { Grid, TextField, Card, CardContent, Button } from "@material-ui/core/";
import { addRoles } from "../_redux/authCrud";
import * as swal from "../../Common/components/SweetAlert";

function AddRoles() {
	const formik = useFormik({
		enableReinitialize: true,
		validate: (values) => {
			const errors = {};
			if (!values.rolesName) {
				errors.rolesName = "required";
			}
			return errors;
		},
		initialValues: {
			rolesName: "",
		},
		onSubmit: (values, { setSubmitting, resetForm }) => {
			handleSave({ setSubmitting, resetForm }, values);
		},
	});

	const handleSave = ({ setSubmitting, resetForm}, values) => {
		debugger
		addRoles(values.rolesName)
			.then((res) => {
				if (res.data.isSuccess) {
					setSubmitting(false);
					swal.swalSuccess("Success", `success.`)
					resetForm(true);
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
								name="rolesName"
								label="Roles Name"
								required
								fullWidth
								onBlur={formik.handleBlur}
								onChange={formik.handleChange}
								value={formik.values.rolesName}
								error={(formik.errors.rolesName && formik.touched.rolesName)}
								helperText={(formik.errors.rolesName && formik.touched.rolesName) && formik.errors.rolesName}
							/>
						</Grid>
						<Grid
							container
							direction="row"
							justify="center"
							alignItems="center"
						>
							<Grid item xs={12} lg={3} >
								<Button type="submit" color="primary" fullWidth variant="contained" style={{ marginTop: 10 }}>Submit</Button>
							</Grid>
						</Grid>
					</Grid>
				</CardContent>
			</Card>
		</form>
	)
}

export default AddRoles
