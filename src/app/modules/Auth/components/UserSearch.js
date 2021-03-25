/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-imports */
import React from "react";
import { useFormik } from "formik";
import { Grid, Button } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import FormikTextField from "../../../modules/_FormikUseFormik/components/FormikTextField";
import FormikDropdown from "../../../modules/_FormikUseFormik/components/FormikDropdown";
import * as CONST from "../../../../Constants";
import Axios from "axios";

function UserSearch(props) {
	const api_get_source_url = `${CONST.API_URL}/Auth/source/get`;
	const [sourceList, setSourceList] = React.useState([]);

	const [dataFilter, setDataFilter] = React.useState({
		page: 1,
		recordsPerPage: 10,
		orderingField: "",
		ascendingOrder: true,
		searchValues: {
			userName: "",
			sourceName: 0,
			mapperId: ""
		}
	});

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			sourceName: 0,
			userName: "",
			mapperId: ""
		},
		validate: (values) => {
			const errors = {};

			return errors;
		},

		onSubmit: (values, { setSubmitting }) => {
			// console.log("add stock", values);
			props.submit(values);
			setSubmitting(false);
		},
	});

	React.useEffect(() => {
		loadSource();
	}, []);

	const loadSource = () => {
		//Load Province
		Axios.get(api_get_source_url)
			.then((res) => {
				if (res.data.isSuccess) {
					setSourceList(res.data.data);
					console.log(res.data.data);
				} else {
					alert(res.data.message);
				}
			})
			.catch((err) => {
				alert(err.message);
			});
	};

	return (
		<form onSubmit={formik.handleSubmit}>
			<Grid container spacing={3}>
				<Grid item xs={12} lg={3}>
					<FormikTextField formik={formik} name="userName" label="userName" />
				</Grid>
				<Grid item xs={12} lg={3}>
					<FormikTextField formik={formik} name="mapperId" label="mapperId" />
				</Grid>
				<Grid item xs={12} lg={3}>
					<FormikDropdown
						formik={formik}
						name="sourceName"
						variant="standard"
						label=""
						required
						data={sourceList}
						firstItemText="Select Source"
						valueFieldName="sourceName"
						displayFieldName="sourceName"
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

export default UserSearch;