import React, { memo, useCallback } from 'react';
import { Tile } from '../types';
import { useStyles } from '../styles';

interface Props {
  tile: Tile;
  disabled: boolean;
  loading: boolean;
  onCheckout: (tileId: number) => void;
}

export const TileComponent: React.FC<Props> = memo(({ tile, disabled, loading, onCheckout }) => {
  const classes = useStyles();

  const handleCheckOutTile = useCallback(
    (tileId: number) => () => {
      onCheckout(tileId);
    },
    [onCheckout]
  );

  const x = tile.status === 'hidden' ? 0 : (Number(tile.ref) % 8) * 80;
  const y = tile.status === 'hidden' ? 0 : Math.floor(Number(tile.ref) / 8) * 80;

  return (
    <div
      className={`tileWrapper ${classes.tileWrapper} ${disabled ? classes.tileDisabled : ''} ${
        loading ? classes.tileLoading : ''
      }`}
    >
      <div className={classes.tileBox}>
        <div
          className={`tile ${tile.ref} ${tile.status} ${disabled ? classes.tileDisabled : classes.tileEnabled} ${
            disabled ? 'disabled' : ''
          } ${loading ? classes.tileLoading : ''}`}
          style={{ backgroundPosition: `-${x}px -${y}px` }}
          onClick={!disabled && !loading && tile.status === 'hidden' ? handleCheckOutTile(tile.id) : () => null}
        />
      </div>
    </div>
  );
});
