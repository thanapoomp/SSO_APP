/* eslint-disable no-restricted-imports */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import RoleTables from "mui-datatables";
import { getRoleFilter } from "../_redux/authCrud";
import { Grid, Typography, CircularProgress, Card, CardContent } from "@material-ui/core";
import * as swal from "../../Common/components/SweetAlert";
import { useHistory } from "react-router-dom";
import RoleSearch from "../components/RoleSearch";
import EditButton from '../../Common/components/Buttons/EditButton';

var flatten = require("flat");
require("dayjs/locale/th");
var dayjs = require("dayjs");
dayjs.locale("th");

function RoleTable(props) {

	const history = useHistory()
	const [data, setData] = React.useState([]);
	const [totalRecords, setTotalRecords] = React.useState(0);
	const [isLoading, setIsLoading] = React.useState(true);

	const [dataFilter, setDataFilter] = React.useState({
		page: 1,
		recordsPerPage: 10,
		orderingField: "",
		ascendingOrder: true,
		searchValues: {
			roleName: "",
			isActive: ""
		}
	});

	React.useEffect(() => {
		//load data from api
		loadData();
	}, [dataFilter]);

	const loadData = () => {

		getRoleFilter(
			dataFilter.orderingField,
			dataFilter.ascendingOrder,
			dataFilter.page,
			dataFilter.recordsPerPage,
			dataFilter.searchValues.roleName,
			dataFilter.searchValues.isActive,
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
					swal.swalError("Error", res.data.message);
				}
			})
			.catch((err) => {
				swal.swalError("Error", err.message);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const handleSearchUser = (values) => {

		if (values.isActive === 0) {
			values.isActive = ""
			setDataFilter({
				...dataFilter,
				page: 1,
				searchValues: values
			});

		} else {
			setDataFilter({
				...dataFilter,
				page: 1,
				searchValues: values
			});
		}
	}

	const options = {

		setRowProps: (row, dataIndex, rowIndex) => {
			if (data[dataIndex].isActive === true) {
				return {
					style: {
						background: '#e3f2fd'
					}
				};
			} else {
				return {
					style: {
						background: '#eeeeee'
					}
				};

			}
		},
		draggableColumns: {
			enabled: true,
		},
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
			name: "roleName",
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
			name: "createdBy.userName",
			label: "สร้างโดย",
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
			label: "สร้างวันที่",
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
			options: {
				filter: false,
				sort: false,
				empty: true,
				viewColumns: false,
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

									history.push(`/User/EditRoles/${data[dataIndex].id}`)
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
						<RoleSearch submit={handleSearchUser.bind(this)}></RoleSearch>
					</CardContent>
				</Card>

				<RoleTables
					title={
						<Typography variant="h6">
							Role
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

export default RoleTable
