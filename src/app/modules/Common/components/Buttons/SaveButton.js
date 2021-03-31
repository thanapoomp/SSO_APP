/* eslint-disable no-restricted-imports */
import React from "react";
import Button from "@material-ui/core/Button";
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';

function SaveButton(props) {
  return (
    <Button
      {...props}
      variant="contained"
      color="primary"
      startIcon={<AssignmentIndIcon />}
    >{props.children}</Button>
  );
}

export default SaveButton;
