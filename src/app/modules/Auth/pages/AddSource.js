/* eslint-disable no-unused-vars */
import React from 'react'
import { useFormik } from "formik";
import { Grid, TextField, Card, CardContent } from "@material-ui/core/";
import { addSource } from "../_redux/authCrud";
import * as swal from "../../../modules/Common/components/SweetAlert";
import SaveButton from '../../Common/components/Buttons/SaveButton'

function AddSource() {
	const formik = useFormik({
		enableReinitialize: true,
		validate: (values) => {
			const errors = {};
			if (!values.sourceName) {
				errors.sourceName = "required";
			}
			return errors;
		},
		initialValues: {
			sourceName: "",
		},
		onSubmit: (values, { setSubmitting, resetForm }) => {
			handleSave({ setSubmitting, resetForm }, values);
		},
	});

	const handleSave = ({ setSubmitting, resetForm }, values) => {

		addSource(values.sourceName)
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
								name="sourceName"
								label="Source Name"
								required
								fullWidth
								onBlur={formik.handleBlur}
								onChange={formik.handleChange}
								value={formik.values.sourceName}
								error={(formik.errors.sourceName && formik.touched.sourceName)}
								helperText={(formik.errors.sourceName && formik.touched.sourceName) && formik.errors.sourceName}
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

export default AddSource
