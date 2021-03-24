/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { useFormik } from "formik";
import { Grid, Button, Card, CardHeader, Checkbox, Divider, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import FormikDropdown from "../../../modules/_FormikUseFormik/components/FormikDropdown";
import { login, getUserByToken, getExp, getRoles } from "../_redux/authCrud";
import * as CONST from "../../../../Constants";
import Axios from "axios";

function AssignRoles() {

	const api_get_role_url = `${CONST.API_URL}/Auth/role/get`;
	const api_get_user_url = `${CONST.API_URL}/Auth/user/getuser`;

	const [checked, setChecked] = React.useState([]);
	const [left, setLeft] = React.useState([]);
	const [right, setRight] = React.useState([]);
	const [user, setUser] = React.useState([]);

	const leftChecked = intersection(checked, left);
	const rightChecked = intersection(checked, right);

	const handleToggle = (value) => () => {
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		setChecked(newChecked);
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
		//Load Role
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

	React.useEffect(() => {
		loadRole();
		loadUser();
	}, []);

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

	const customList = (title, items) => (
		<Card style={{ width: 280, height: 300, overflow: 'auto' }}>
			<CardHeader
				avatar={
					<Checkbox
						onClick={handleToggleAll(items)}
						checked={numberOfChecked(items) === items.length && items.length !== 0}
						indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
						disabled={items.length === 0}
						inputProps={{ 'aria-label': 'all items selected' }}
					/>
				}
				title={title}
				subheader={`${numberOfChecked(items)}/${items.length} selected`}
			/>
			<Divider />
			<List dense component="div" role="list">
				{items.map((value) => {
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
	);

	const formik = useFormik({
		initialValues: {
			user: 0
		},
		enableReinitialize: true,
		validate: (values) => {
			const errors = {};

			if (!values.source) {
				errors.source = "Required field";
			}

			return errors;
		},
		onSubmit: (values, { setStatus, setSubmitting }) => {
			login(values.username, values.password, values.source)
				.then((res) => {
					if (res.data.isSuccess) {
						debugger
						//Success

						let loginDetail = {}

						//get token
						loginDetail.authToken = res.data.data;

						//get user
						loginDetail.user = getUserByToken(res.data.data);

						// get exp
						loginDetail.exp = getExp(res.data.data);

						//get roles
						loginDetail.roles = getRoles(res.data.data);

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
	return (
		<Grid spacing={2} container
			direction="row"
			justify="center"
			alignItems="center" >
			<Grid item xs={12} lg={3}>
				{customList('Role', left)}
			</Grid>
			<Grid item xs={12} lg={1} container
				direction="column">
				<Button
					variant="outlined"
					size="small"
					onClick={handleCheckedRight}
					disabled={leftChecked.length === 0}
					aria-label="move selected right"
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
				direction="column" style={{marginRight:20}}>
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
				{customList('Role', right)}
			</Grid>
		</Grid>
	)
}

export default AssignRoles
