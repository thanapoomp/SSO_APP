/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { Grid, Button, Card, CardHeader, Checkbox, Divider, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import * as CONST from "../../../../Constants";
import Axios from "axios";

function AssignRoles() {

	const api_get_role_url = `${CONST.API_URL}/Auth/role/get`;

	const [checked, setChecked] = React.useState([]);
	const [left, setLeft] = React.useState([]);
	const [right, setRight] = React.useState([]);

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

	React.useEffect(() => {
		loadRole();
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
	return (
		<Grid container spacing={2} justify="center" alignItems="center" >
			<Grid item>{customList('Role', left)}</Grid>
			<Grid item>
				<Grid container direction="column" alignItems="center">
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
			</Grid>
			<Grid item>{customList('Role', right)}</Grid>
		</Grid>
	)
}

export default AssignRoles
