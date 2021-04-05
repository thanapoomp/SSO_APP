/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React from 'react'
import { useFormik } from "formik";
import { Grid, TextField, Card, CardContent } from "@material-ui/core/";
import { addRoles } from "../_redux/authCrud";
import * as swal from "../../Common/components/SweetAlert";
import SaveButton from '../../Common/components/Buttons/SaveButton'

function AddRoles(props) {

	const validateLastName = (input) => {

		return input.charAt(0) === input.charAt(0).toUpperCase()
	}

	const formik = useFormik({
		enableReinitialize: true,
		validate: (values) => {
			const errors = {};
			if (!values.roleName) {
				errors.roleName = "required";
			}

			if (!validateLastName(values.roleName)) {

				errors.roleName = "First Upper Case";
			}
			return errors;
		},
		initialValues: {
			roleName: "",
		},
		onSubmit: (values, { setSubmitting, resetForm }) => {
			handleSave({ setSubmitting, resetForm }, values);
		},
	});

	const handleSave = ({ setSubmitting, resetForm }, values) => {

		addRoles(values.roleName)
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
								name="roleName"
								label="Role Name"
								required
								fullWidth
								onBlur={formik.handleBlur}
								onChange={formik.handleChange}
								value={formik.values.roleName}
								error={(formik.errors.roleName && formik.touched.roleName)}
								helperText={(formik.errors.roleName && formik.touched.roleName) && formik.errors.roleName}
							/>
						</Grid>
						<Grid
							container
							direction="row"
							justify="center"
							alignItems="center"
						>
							<Grid item xs={12} lg={3} >
								<SaveButton type="submit" color="primary" fullWidth variant="contained" style={{ marginTop: 10 }}>Submit</SaveButton>
							</Grid>
						</Grid>
					</Grid>
				</CardContent>
			</Card>
		</form>
	)
}

export default AddRoles
