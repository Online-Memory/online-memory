import React, { memo, useCallback } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { CHECKOUT_TILE } from '../../graphql';
import { Player, Tile } from '../types';
import { useStyles } from '../styles';

interface Props {
  userId: string;
  gameId: string;
  playerTurn: Player;
  tile: Tile;
}

export const TileComponent: React.FC<Props> = memo(({ userId, gameId, playerTurn, tile }) => {
  const classes = useStyles();

  const [checkoutTile] = useMutation(CHECKOUT_TILE, {
    onError: err => {
      console.warn(err);
    },
  });

  const handleCheckOutTile = useCallback(
    tile => () => {
      checkoutTile({
        variables: {
          checkoutTileInput: {
            tileId: tile.id,
            gameId,
          },
        },
      });
    },
    [checkoutTile, gameId]
  );

  return (
    <div className={classes.tileBox}>
      {!tile.owner && playerTurn.userId === userId && (
        <img
          className={classes.tile}
          src={`/tiles/${tile.status === 'show' ? tile.ref : '000'}.png`}
          alt="Memory Tile"
          onClick={handleCheckOutTile(tile)}
        />
      )}
      {!tile.owner && playerTurn.userId !== userId && (
        <img
          className={`${classes.tile} ${classes.tileDisabled}`}
          src={`/tiles/${tile.status === 'show' ? tile.ref : '000'}.png`}
          alt="Memory Tile"
        />
      )}
    </div>
  );
});