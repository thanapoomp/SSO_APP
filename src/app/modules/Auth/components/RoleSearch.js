/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-imports */
import React from "react";
import { useFormik } from "formik";
import { Grid, Button } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import FormikTextField from "../../_FormikUseFormik/components/FormikTextField";
import FormikDropdown from "../../../modules/_FormikUseFormik/components/FormikDropdown";

function RoleSearch(props) {

	const [isActive, setIsActive] = React.useState(
		[
			{
				id: 1,
				name: 'false',
			},
			{
				id: 2,
				name: 'true'
			}
		]

	)

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			roleName: "",
			isActive: ""
		},
		validate: (values) => {
			const errors = {};

			return errors;
		},

		onSubmit: (values, { setSubmitting }) => {

			props.submit(values);
			setSubmitting(false);
		},
	});

	return (
		<form onSubmit={formik.handleSubmit}>
			<Grid container spacing={3}>
				<Grid item xs={12} lg={3}>
					<FormikTextField formik={formik} name="roleName" label="RoleName" />
				</Grid>
				<Grid item xs={12} lg={3}>
					<FormikDropdown
						formik={formik}
						name="isActive"
						variant="standard"
						label="IsActive"
						required
						data={isActive}
						firstItemText="All"
						valueFieldName="name"
						displayFieldName="name"
					/>
				</Grid>
				<Grid item xs={12} lg={3}>
					<Button
						fullWidth
						style={{ marginTop: 6, marginRight: 100 }}
						variant="contained"
						color="primary"
						onClick={formik.handleSubmit}
						startIcon={<SearchIcon color="action" />}
					>
						Search
		        </Button>
				</Grid>
			</Grid>
		</form>

	);
}

export default RoleSearch;