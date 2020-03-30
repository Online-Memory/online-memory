import React, { memo, useCallback } from 'react';
import { Tile } from '../types';
import { useStyles } from './styles';

interface Props {
  tile: Tile;
  template: string;
  tileSize: number;
  disabled: boolean;
  loading: boolean;
  onCheckout: (tileId: number) => void;
}

export const TileComponent: React.FC<Props> = memo(({ template, tile, tileSize, disabled, loading, onCheckout }) => {
  const classes = useStyles({ template });

  const handleCheckOutTile = useCallback(
    (tileId: number) => () => {
      onCheckout(tileId);
    },
    [onCheckout]
  );

  const x = tile.status === 'hidden' ? 0 : (Number(tile.ref) % 8) * tileSize;
  const y = tile.status === 'hidden' ? 0 : Math.floor(Number(tile.ref) / 8) * tileSize;

  return (
    <div
      className={`tileWrapper ${classes.tileWrapper} ${disabled ? classes.tileDisabled : ''} ${
        loading ? classes.tileLoading : ''
      }`}
      style={{ width: `${tileSize}px`, height: `${tileSize}px` }}
    >
      <div className={classes.tileBox}>
        <div
          className={`tile ${classes.tile} ${tile.ref} ${tile.status} ${
            disabled ? classes.tileDisabled : classes.tileEnabled
          } ${disabled ? 'disabled' : ''} ${loading ? classes.tileLoading : ''}`}
          style={{ backgroundPosition: `-${x}px -${y}px`, backgroundSize: `${tileSize * 8}px` }}
          onClick={!disabled && !loading && tile.status === 'hidden' ? handleCheckOutTile(tile.id) : () => null}
        />
      </div>
    </div>
  );
});
