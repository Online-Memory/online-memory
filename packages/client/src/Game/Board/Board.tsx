import React, { memo, useCallback } from 'react';
import { Grid } from '@material-ui/core';
import { TileComponent } from '../Tile';
import { ZoomControl, useZoom } from '../ZoomControl';
import { useStyles } from './styles';
import { Tile } from '../types';

interface Props {
  loading: boolean;
  disabled: boolean;
  startTurn: boolean;
  tiles: Tile[];
  template: string;
  board: {
    gridX: number;
    gridY: number;
  };
  onCheckoutTile: (tileId: number) => void;
}

export const Board: React.FC<Props> = memo(
  ({ board, template, tiles, loading, disabled, startTurn, onCheckoutTile }) => {
    const classes = useStyles();
    const { tileSize, zoomIn, zoomOut } = useZoom(60);
    const gridX = new Array(board.gridX).fill('');
    const gridY = new Array(board.gridY).fill('');

    const getTile = useCallback((tiles: Tile[], posX: number, posY: number, boardX: number) => {
      const id = boardX * posY + posX;

      return tiles[id];
    }, []);

    return (
      <div className={classes.boardWrapper}>
        <ZoomControl onZoomIn={zoomIn} onZoomOut={zoomOut} />
        <Grid direction="column" className={classes.boardContainer} item container>
          {gridY.map((_, indexY) => (
            <Grid key={`col-${indexY}`} container item>
              {gridX.map((_, indexX) => (
                <Grid item key={`col-${indexY}-row-${indexX}`} className="tileItem">
                  <TileComponent
                    template={template}
                    tile={getTile(tiles, indexX, indexY, board.gridX)}
                    tileSize={tileSize}
                    disabled={disabled}
                    startTurn={startTurn}
                    loading={loading}
                    onCheckout={onCheckoutTile}
                  />
                </Grid>
              ))}
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
);
