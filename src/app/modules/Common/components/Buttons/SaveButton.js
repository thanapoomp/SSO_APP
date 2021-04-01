/* eslint-disable no-restricted-imports */
import React from "react";
import Button from "@material-ui/core/Button";
import SaveIcon from '@material-ui/icons/Save';

function SaveButton(props) {
  return (
    <Button
      {...props}
      variant="contained"
      color="primary"
      startIcon={<SaveIcon />}
    >{props.children}</Button>
  );
}

export default SaveButton;
