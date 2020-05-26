import React, { memo, useCallback, CSSProperties, useEffect, useState } from 'react';
import { Tile } from '../types';
import { useStyles } from './styles';

interface Props {
  tile: Tile;
  template: string;
  tileSize: number;
  disabled: boolean;
  loading: boolean;
  isEnded?: boolean;
  startTurn?: boolean;
  className?: string;
  style?: CSSProperties;
  onCheckout?: (tileId: number) => void;
  play?: (sound: string) => void;
}

export const TileComponent: React.FC<Props> = memo(
  ({ className, style, template, tile, tileSize, disabled, loading, onCheckout, startTurn, play, isEnded = false }) => {
    const classes = useStyles({ template, tileStatus: tile.status });
    const [playSound, setPlaySound] = useState(false);

    const handleCheckOutTile = useCallback(
      (tileId: number) => () => {
        if (loading || !onCheckout) {
          return;
        }

        if (!disabled && tile.status === 'hidden') {
          onCheckout(tileId);
          setPlaySound(true);
        }
      },
      [disabled, loading, onCheckout, tile.status]
    );

    useEffect(() => {
      if (tile.status === 'show' && playSound) {
        play && play('flip');
        setPlaySound(false);
      }
      if (tile.status === 'taken' && playSound) {
        play && play('take');
        setPlaySound(false);
      }
    }, [play, playSound, tile.status]);

    const x = tile.status === 'hidden' ? 0 : (Number(tile.ref) % 8) * tileSize;
    const y = tile.status === 'hidden' ? 0 : Math.floor(Number(tile.ref) / 8) * tileSize;

    return (
      <div
        className={`tileWrapper ${classes.tileWrapper} ${className} ${disabled ? classes.tileDisabled : ''} ${
          loading ? classes.tileLoading : ''
        }`}
        style={style}
      >
        <div
          className={`tile ${classes.tile} ${tile.ref} ${isEnded ? 'show' : tile.status} ${
            disabled ? classes.tileDisabled : classes.tileEnabled
          } ${disabled ? 'disabled' : ''} ${startTurn ? 'startTurn' : ''} ${loading ? classes.tileLoading : ''}`}
          style={{
            backgroundPosition: `-${x}px -${y}px`,
            backgroundSize: `${tileSize * 8}px`,
            width: `${tileSize}px`,
            height: `${tileSize}px`,
          }}
          onClick={handleCheckOutTile(tile.id)}
        />
      </div>
    );
  }
);
