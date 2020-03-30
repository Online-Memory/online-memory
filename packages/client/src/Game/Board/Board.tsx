import React, { memo, useCallback } from 'react';
import { Grid } from '@material-ui/core';
import { TileComponent } from '../Tile';
import { useStyles } from './styles';
import { Tile } from '../types';

interface Props {
  loading: boolean;
  disabled: boolean;
  tiles: Tile[];
  tileSize: number;
  template: string;
  board: {
    gridX: number;
    gridY: number;
  };
  onCheckoutTile: (tileId: number) => void;
}

export const Board: React.FC<Props> = memo(
  ({ board, template, tiles, tileSize, loading, disabled, onCheckoutTile }) => {
    const classes = useStyles();
    const gridX = new Array(board.gridX).fill('');
    const gridY = new Array(board.gridY).fill('');

    const getTile = useCallback((tiles: Tile[], posX: number, posY: number, boardX: number) => {
      const id = boardX * posY + posX;

      return tiles[id];
    }, []);

    return (
      <Grid className={`Board ${classes.container}`} justify="center" xs={12} lg={9} item container>
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
                    loading={loading}
                    onCheckout={onCheckoutTile}
                  />
                </Grid>
              ))}
            </Grid>
          ))}
        </Grid>
      </Grid>
    );
  }
);
