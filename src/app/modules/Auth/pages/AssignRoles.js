/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { useFormik } from "formik";
import { Grid, Button, Card, CardHeader, Checkbox, Divider, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import FormikDropdown from "../../../modules/_FormikUseFormik/components/FormikDropdown";
import { login, getUserByToken, getExp, getRoles, getUserById } from "../_redux/authCrud";
import * as CONST from "../../../../Constants";
import Axios from "axios";

var flatten = require("flat");

function AssignRoles() {

	const api_get_role_url = `${CONST.API_URL}/Auth/role/get`;
	const api_get_user_url = `${CONST.API_URL}/Auth/user/getuser`;

	const [checked, setChecked] = React.useState([]);
	const [left, setLeft] = React.useState([]);
	const [right, setRight] = React.useState([]);

	const [user, setUser] = React.useState([]);
	const [userid, setUserid] = React.useState([]);

	const leftChecked = intersection(checked, left);
	const rightChecked = intersection(checked, right);

	const handleToggle = (value) => () => {
		debugger
		console.log(value)
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		setChecked(newChecked);
		console.log("newChecked", newChecked);
		console.log("currentIndex", currentIndex);
	};

	function not(a, b) {
		return a.filter((value) => b.indexOf(value) === -1);
	}

	function intersection(a, b) {
		return a.filter((value) => b.indexOf(value) !== -1);
	}

	function union(a, b) {
		return [...a, ...not(b, a)];
	}

	const handleCheckedRight = () => {
		setRight(right.concat(leftChecked));
		setLeft(not(left, leftChecked));
		setChecked(not(checked, leftChecked));
	};

	const handleCheckedLeft = () => {
		setLeft(left.concat(rightChecked));
		setRight(not(right, rightChecked));
		setChecked(not(checked, rightChecked));
	};

	const numberOfChecked = (items) => intersection(checked, items).length;

	const handleToggleAll = (items) => () => {
		if (numberOfChecked(items) === items.length) {
			setChecked(not(checked, items));
		} else {
			setChecked(union(checked, items));
		}
	};

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			user: 0

		},

		validate: (values) => {
			const errors = {};

			if (!values.source) {
				errors.source = "Required field";
			}

			return errors;
		},
		onSubmit: (values, { setStatus, setSubmitting }) => {
			login()
				.then((res) => {
					if (res.data.isSuccess) {
						debugger


					} else {
						//Failed
						setSubmitting(false);
						setStatus(res.data.message
						);
					}
				})
				.catch((error) => {
					setSubmitting(false);
					setStatus(error.message);
				});
		},

	});

	const loadRole = () => {
		//Load Role
		Axios.get(api_get_role_url)
			.then((res) => {
				if (res.data.isSuccess) {
					setLeft(res.data.data);
					console.log(res.data.data);
				} else {
					alert(res.data.message);
				}
			})
			.catch((err) => {
				alert(err.message);
			});
	};

	const loadUser = () => {
		//Load User
		Axios.get(api_get_user_url)
			.then((res) => {
				if (res.data.isSuccess) {
					setUser(res.data.data);
				} else {
					alert(res.data.message);
				}
			})
			.catch((err) => {
				alert(err.message);
			});
	};

	const getUser = (id) => {
		//Load User
		getUserById(id)
			.then((res) => {
				if (res.data.isSuccess) {
					debugger
					let flatData = [];
					res.data.data.forEach((element) => {
						flatData.push(flatten(element));
					});
					console.log(flatData);
					setRight(res.data.data);
				} else {
					alert(res.data.message);
				}
			})
			.catch((err) => {
				alert(err.message);
			});
	};

	React.useEffect(() => {
		if (formik.values.user !== 0) {
			getUser(formik.values.user);
		}
	}, [formik.values.user]);

	React.useEffect(() => {
		loadRole();
		loadUser();
	}, []);

	return (
		<Grid spacing={2} container
			direction="row"
			justify="center"
			alignItems="center" >
			<Grid item xs={12} md={3} lg={3}>
				<Card style={{ width: 280, height: 300, overflow: 'auto' }}>
					<CardHeader
						avatar={
							<Checkbox
								onClick={handleToggleAll(left)}
								checked={numberOfChecked(left) === left.length && left.length !== 0}
								indeterminate={numberOfChecked(left) !== left.length && numberOfChecked(left) !== 0}
								disabled={left.length === 0}
								inputProps={{ 'aria-label': 'all items selected' }}
							/>
						}
						title="Roles"
						subheader={`${numberOfChecked(left)}/${left.length} selected`}
					/>
					<Divider />
					<List dense component="div" role="list">
						{left.map((value) => {
							const labelId = `transfer-list-all-item-${value.id}-label`;

							return (
								<ListItem key={value.id} role="listitem" button onClick={handleToggle(value)}>
									<ListItemIcon>
										<Checkbox
											checked={checked.indexOf(value) !== -1}
											tabIndex={-1}
											disableRipple
											inputProps={{ 'aria-labelledby': labelId }}
										/>
									</ListItemIcon>
									<ListItemText id={labelId} primary={`${value.roleName}`} />
								</ListItem>
							);
						})}
						<ListItem />
					</List>
				</Card>
			</Grid>
			<Grid item xs={12} lg={1} container
				direction="column" style={{ marginLeft: 25 }}>
				<Button
					variant="outlined"
					size="small"
					onClick={handleCheckedRight}
					disabled={leftChecked.length === 0}
					aria-label="move selected right"
					style={{ marginBottom: 10 }}
				>
					&gt;
          			</Button>
				<Button
					variant="outlined"
					size="small"
					onClick={handleCheckedLeft}
					disabled={rightChecked.length === 0}
					aria-label="move selected left"
				>
					&lt;
          			</Button>
			</Grid>
			<Grid spacing={2} item xs={12} lg={1} container
				direction="column" style={{ marginRight: 30 }}>
				<Card>
					<FormikDropdown
						formik={formik}
						name="user"
						variant="outlined"
						label=""
						required
						data={user}
						firstItemText="Select User"
						valueFieldName="id"
						displayFieldName="userName"
					/>
				</Card>
			</Grid>
			<Grid item xs={12} lg={3}>
				<Card style={{ width: 280, height: 300, overflow: 'auto' }}>
					<CardHeader
						avatar={
							<Checkbox
								onClick={handleToggleAll(right)}
								checked={numberOfChecked(right) === right.length && right.length !== 0}
								indeterminate={numberOfChecked(right) !== right.length && numberOfChecked(right) !== 0}
								disabled={right.length === 0}
								inputProps={{ 'aria-label': 'all items selected' }}
							/>
						}
						title="Roles"
						subheader={`${numberOfChecked(right)}/${right.length} selected`}
					/>
					<Divider />
					<List dense component="div" role="list">
						{right.map((value) => {
							const labelId = `transfer-list-all-item-${value.role.id}-label`;

							return (
								<ListItem key={value.role.id} role="listitem" button onClick={handleToggle(value)}>
									<ListItemIcon>
										<Checkbox
											checked={checked.indexOf(value) !== -1}
											tabIndex={-1}
											disableRipple
											inputProps={{ 'aria-labelledby': labelId }}
										/>
									</ListItemIcon>
									<ListItemText id={labelId} primary={value.role.roleName} />
								</ListItem>
							);
						})}
						<ListItem />
					</List>
				</Card>
			</Grid>
		</Grid>
	)
}

export default AssignRoles
