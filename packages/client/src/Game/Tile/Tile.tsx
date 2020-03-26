import React, { memo, useCallback } from 'react';
import { Tile } from '../types';
import { useStyles } from '../styles';

interface Props {
  tile: Tile;
  disabled: boolean;
  onCheckout: (tileId: number) => void;
}

export const TileComponent: React.FC<Props> = memo(({ tile, onCheckout, disabled }) => {
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
    <div className={classes.tileBox}>
      <div
        className={`tile ${tile.ref} ${tile.status} ${disabled ? classes.tileLoading : ''}`}
        style={{ backgroundPosition: `-${x}px -${y}px` }}
        onClick={!disabled ? handleCheckOutTile(tile.id) : () => null}
      />
    </div>
  );
});
