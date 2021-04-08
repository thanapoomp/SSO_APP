/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React from 'react'
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { Grid, TextField, Card, CardContent, FormControlLabel, Switch } from "@material-ui/core/";
import { editSource, getSourceByid, disableSource, enableSource } from "../_redux/authCrud";
import * as swal from "../../Common/components/SweetAlert";
import SaveButton from "../../Common/components/Buttons/SaveButton";

function AddSource() {

	const [state, setState] = React.useState({
		checkedA: false,
	});
	const authReducer = useSelector(({ auth }) => auth)

	const history = useHistory();

	const [dataSource, setDataSource] = React.useState({ sourceName: "" })

	let { id } = useParams();
	var sourceId = id;


	React.useEffect(() => {

		if (sourceId === 0) {
			history.push("/User/SourceTable");
		} else {
			handleGet(sourceId)
		}

	}, [sourceId])

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
			sourceName: dataSource.sourceName
		},
		onSubmit: (values, { setSubmitting, resetForm }) => {
			handleSave({ setSubmitting, resetForm }, values);
		},
	});

	//disable enable source
	const handleChange = (event) => {
		setState({ ...state, [event.target.name]: event.target.checked });

		// if (event.target.checked) {

		// 	enableSource(sourceId)
		// 		.then((res) => {
		// 			if (res.data.isSuccess) {

		// 				return true;
		// 			} else {

		// 				swal.swalError("Error", res.data.message);
		// 			}
		// 		})
		// 		.catch((error) => {
		// 			swal.swalError("Error", error.message);
		// 		});

		// } else if (event.target.checked === false) {

		// 	disableSource(sourceId)
		// 		.then((res) => {
		// 			if (res.data.isSuccess) {

		// 				return true;
		// 			} else {

		// 				swal.swalError("Error", res.data.message);
		// 			}
		// 		})
		// 		.catch((error) => {
		// 			swal.swalError("Error", error.message);
		// 		});

		// } else {
		// 	swal.swalError("Error", "Status Undefined");

		// }

	};

	//get source from api
	const handleGet = (id) => {
		getSourceByid(id)
			.then((res) => {
				if (res.data.isSuccess) {

					setDataSource({ ...dataSource, sourceName: res.data.data[0].sourceName });
					setState({ ...state, checkedA: res.data.data[0].isActive })

				} else {
					swal.swalError("Error", res.data.message);
				}
			})
			//network error
			.catch((err) => {
				swal.swalError("Error", err.message);
			});
	}

	const handleSave = ({ setSubmitting, resetForm }, values) => {

		let playload = {
			sourceName: values.sourceName,
			isActive: state.checkedA
		}
		debugger
		editSource(sourceId, playload)
			.then((res) => {
				if (res.data.isSuccess) {
					setSubmitting(false);
					swal.swalSuccess("Success", "").then(() => {
						history.push("/User/SourceTable");
					});
					resetForm(true);
				} else {
					swal.swalError("Error", res.data.message);
				}
			})
			//network error
			.catch((err) => {
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
						<Grid item xs={12} lg={3}>

							<FormControlLabel control={<Switch checked={state.checkedA} onChange={handleChange} name="checkedA" />} label={state.checkedA === true ? "ใช้งาน" : "ยกเลิก"} />
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
