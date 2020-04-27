import React, { memo } from 'react';
import { Grid, IconButton, Paper } from '@material-ui/core';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import { useStyles } from './styles';

interface Props {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const ZoomControl: React.FC<Props> = memo(({ onZoomIn, onZoomOut }) => {
  const classes = useStyles();

  return (
    <div className={classes.zoom}>
      <Paper>
        <Grid container direction="column">
          <IconButton aria-label="delete" size="medium" onClick={onZoomIn}>
            <ZoomInIcon fontSize="inherit" />
          </IconButton>
          <IconButton aria-label="delete" size="medium" onClick={onZoomOut}>
            <ZoomOutIcon fontSize="inherit" />
          </IconButton>
        </Grid>
      </Paper>
    </div>
  );
});
