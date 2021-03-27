/* eslint-disable no-restricted-imports */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import SourceTables from "mui-datatables";
import { disableSource, getSourceFilter, enableSource } from "../_redux/authCrud";
import { Grid, Typography, FormControlLabel, Switch, CircularProgress, Card, CardContent } from "@material-ui/core";
import * as swal from "../../Common/components/SweetAlert";
import UserSearch from "../components/UserSearch";
import EditButton from '../../Common/components/Buttons/EditButton';

var flatten = require("flat");
require("dayjs/locale/th");
var dayjs = require("dayjs");
dayjs.locale("th");

function SourceTable() {

	const [data, setData] = React.useState([]);
	const [totalRecords, setTotalRecords] = React.useState(0);
	const [isLoading, setIsLoading] = React.useState(true);

	const [sourceId, setSourceId] = React.useState({
		edit: 0,
	});


	const [dataFilter, setDataFilter] = React.useState({
		page: 1,
		recordsPerPage: 10,
		orderingField: "",
		ascendingOrder: true,
		searchValues: {
			sourceName: ""
		}
	});

	React.useEffect(() => {
		//load data from api
		loadData();
	}, [dataFilter]);

	const handleEdit = (id) => {
		alert(id);
		setSourceId({ ...sourceId, edit: id });
	};

	const loadData = () => {
		debugger
		getSourceFilter(
			dataFilter.orderingField,
			dataFilter.ascendingOrder,
			dataFilter.page,
			dataFilter.recordsPerPage,
			dataFilter.searchValues.sourceName,
		)
			.then((res) => {

				if (res.data.isSuccess) {
					//flatten data
					// if (res.data.totalAmountRecords > 0) {
					let flatData = [];
					res.data.data.forEach((element) => {
						flatData.push(flatten(element));
					});
					setData(flatData);
					// }
					setTotalRecords(res.data.totalAmountRecords);
				} else {
					alert(res.data.message);
				}
			})
			.catch((err) => {
				alert(err.message);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const options = {

		filter: false,
		print: false,
		download: false,
		search: false,
		selectableRows: "none",
		serverSide: true,
		count: totalRecords,
		page: dataFilter.page - 1,
		rowsPerPage: dataFilter.recordsPerPage,
		onTableChange: (action, tableState) => {
			switch (action) {
				case "changePage":
					setDataFilter({ ...dataFilter, page: tableState.page + 1 });
					break;
				case "sort":
					setDataFilter({
						...dataFilter,
						orderingField: `${tableState.sortOrder.name}`,
						ascendingOrder:
							tableState.sortOrder.direction === "asc" ? true : false,
					});
					break;
				case "changeRowsPerPage":
					setDataFilter({
						...dataFilter,
						recordsPerPage: tableState.rowsPerPage,
					});
					break;
				default:
			}
		},
	};

	//disable source enable source
	const handleChange = (id, status) => {
		debugger
		if (id) {
			if (status) {
				disableSource(id)
					.then((res) => {
						if (res.data.isSuccess) {

							return true;
						} else {

							swal.swalError("Error", res.data.message);
						}
					})
					.catch((error) => {
						swal.swalError("Error", error.message);
					})
					.finally(() => {
						loadData();
					});

			} else {

				enableSource(id)
					.then((res) => {
						if (res.data.isSuccess) {

							return true;
						} else {

							swal.swalError("Error", res.data.message);
						}
					})
					.catch((error) => {
						swal.swalError("Error", error.message);
					})
					.finally(() => {
						loadData();
					});
			}
		}
	}

	const handleSearchUser = (values) => {

		setDataFilter({
			...dataFilter,
			page: 1,
			searchValues: values
		});
	}

	const columns = [
		{
			name: "id",
			label: "Roles",
			options: {
				sort: false,
				customHeadLabelRender: (columnMeta, updateDirection) => (
					<Grid style={{ textAlign: "center" }}>
						{columnMeta.label}
					</Grid>
				),
				customBodyRender: (value) => (
					<Grid style={{ textAlign: "center" }}>
						{value}
					</Grid>
				)
			},
		},
		{
			name: "name",
			label: "RoleName",
			options: {
				sort: false,
				customHeadLabelRender: (columnMeta, updateDirection) => (
					<Grid style={{ textAlign: "center" }}>
						{columnMeta.label}
					</Grid>
				),
				customBodyRender: (value) => (
					<Grid style={{ textAlign: "center" }}>
						{value}
					</Grid>
				)
			},
		},
		{
			name: "createdById",
			label: "createdBy",
			options: {
				sort: false,
				customHeadLabelRender: (columnMeta, updateDirection) => (
					<Grid style={{ textAlign: "center" }}>
						{columnMeta.label}
					</Grid>
				),
				customBodyRender: (value) => (
					<Grid style={{ textAlign: "center" }}>
						{value}
					</Grid>
				)
			},
		},
		{
			name: "createdDate",
			options: {
				sort: false,
				customBodyRenderLite: (dataIndex, rowIndex) => {
					return (
						<Grid
							style={{ padding: 0, margin: 0 }}
							container
							direction="row"
							justify="flex-start"
							alignItems="center"
						>
							{dayjs(data[dataIndex].createdDate).format("DD/MM/YYYY")}
						</Grid>
					);
				},
			},
		},
		{
			name: "",
			label: "isActive",
			options: {
				sort: false,
				customHeadLabelRender: (columnMeta, updateDirection) => (
					<Grid style={{ textAlign: "left" }}>
						{columnMeta.label}
					</Grid>
				),
				customBodyRenderLite: (dataIndex, rowIndex) => {
					return (
						<Grid style={{ padding: 0, margin: 0, textAlign: "left" }}>
							<FormControlLabel control={<Switch checked={data[dataIndex].isActive} onChange={() => { handleChange(data[dataIndex].id, data[dataIndex].isActive) }} name="checkedA" />} />
							{data[dataIndex].isActive === true ? (
								<span>true</span>
							) : (
								<span>false</span>
							)}
						</Grid>
					);
				},
			},
		},
		{
			name: "",
			options: {
				filter: false,
				sort: false,
				empty: true,
				hight: 2,
				customBodyRenderLite: (dataIndex, rowIndex) => {
					return (
						<Grid
							container
							direction="row"
							justify="center"
							alignItems="center"
						>
							<EditButton
								style={{ marginRight: 20 }}
								onClick={() => {
									handleEdit(data[dataIndex].id);
								}}
							>
								Edit
                          </EditButton>
						</Grid>
					);
				},
			},
		},
	];


	return (
		<div>
			<Grid container
				direction="column"
				justify="center"
				alignItems="stretch">
				<Card elevation={3} style={{ marginBottom: 5 }}>
					<CardContent>
						<UserSearch submit={handleSearchUser.bind(this)}></UserSearch>
					</CardContent>
				</Card>

				<SourceTables
					title={
						<Typography variant="h6">
							Source
                                {isLoading && (
								<CircularProgress
									size={24}
									style={{ marginLeft: 15, position: "relative", top: 4 }}
								/>
							)}
						</Typography>
					}
					data={data}
					columns={columns}
					options={options}
				/>
			</Grid>
		</div>
	)
}

export default SourceTable
