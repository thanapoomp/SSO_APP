/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React from 'react'
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { Grid, TextField, Card, CardContent, Button } from "@material-ui/core/";
import { editSource, getSourceByid } from "../_redux/authCrud";
import * as swal from "../../Common/components/SweetAlert";
import SaveButton from "../../Common/components/Buttons/SaveButton";

function AddSource() {

	const authReducer = useSelector(({ auth }) => auth)
	var sourceName = authReducer.editSourceName;
	var sourceId = authReducer.editSourceId;

	const history = useHistory();

	const [roleName, setRoleName] = React.useState([]);

	React.useEffect(() => {

		if (sourceId === 0) {
			history.push("/User/SourceTable");
		}

	}, [authReducer.editSourceId])

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
			sourceName: authReducer.editSourceName
		},
		onSubmit: (values, { setSubmitting, resetForm }) => {
			handleSave({ setSubmitting, resetForm }, values);
		},
	});

	const handleSave = ({ setSubmitting, resetForm }, values) => {

		let playload = {
			sourceName: values.sourceName
		}

		editSource(sourceId, playload)
			.then((res) => {
				if (res.data.isSuccess) {
					setSubmitting(false);
					swal.swalSuccess("Success", `success.`);
					history.push("/User/SourceTable");
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
	let { id } = useParams();

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
