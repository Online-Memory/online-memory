import React, { memo, useCallback, useEffect } from 'react';
import { anime } from 'react-anime';
import useSound from 'use-sound';
import { Grid } from '@material-ui/core';
import { TileComponent } from '../Tile';
import { ZoomControl, useZoom } from '../ZoomControl';
import { useStyles } from './styles';
import { Tile } from '../types';
import flipCard from '../../assets/sfx/click_001.mp3';
import takeCard from '../../assets/sfx/ping_001.mp3';

interface Props {
  loading: boolean;
  disabled: boolean;
  startTurn: boolean;
  isStarted: boolean;
  isEnded: boolean;
  tiles: Tile[];
  template: string;
  board: {
    gridX: number;
    gridY: number;
  };
  onCheckoutTile: (tileId: number) => void;
}

export const Board: React.FC<Props> = memo(
  ({ board, template, tiles, loading, disabled, startTurn, onCheckoutTile, isStarted, isEnded }) => {
    const classes = useStyles();
    const { tileSize, zoomIn, zoomOut } = useZoom(60);
    const gridX = new Array(board.gridX).fill('');
    const gridY = new Array(board.gridY).fill('');
    const [flip] = useSound(flipCard);
    const [take] = useSound(takeCard);

    const handlePlay = useCallback(
      (sound: string) => {
        if (sound === 'flip') {
          flip();
        } else if (sound === 'take') {
          take();
        }
      },
      [flip, take]
    );

    const getTile = useCallback((tiles: Tile[], posX: number, posY: number, boardX: number) => {
      const id = boardX * posY + posX;

      return tiles[id];
    }, []);

    useEffect(() => {
      if (isEnded) {
        anime({
          targets: '.tileItem',
          translateX: anime.stagger(10, {
            grid: [board.gridX, board.gridY],
            from: 'center',
            axis: 'x',
          }),
          translateY: anime.stagger(10, {
            grid: [board.gridX, board.gridY],
            from: 'center',
            axis: 'y',
          }),
          rotateZ: anime.stagger([0, 90], {
            grid: [board.gridX, board.gridY],
            from: 'center',
            axis: 'x',
          }),
          delay: anime.stagger(250, {
            grid: [board.gridX, board.gridY],
            from: 'center',
            start: 2000,
          }),
          easing: 'easeOutBack',
        });
        return;
      }

      if (isStarted) {
        return;
      }

      anime({
        targets: '.tileItem',
        scale: [
          { value: 0.5, easing: 'easeOutSine', duration: 1000 },
          { value: 1, easing: 'easeOutElastic(1, .4)', duration: 750 },
        ],
        delay: anime.stagger(150, {
          grid: [board.gridX, board.gridY],
          from: 'center',
          start: 250,
        }),
      });
    }, [board.gridX, board.gridY, isEnded, isStarted]);

    return (
      <div className={classes.boardWrapper}>
        <ZoomControl onZoomIn={zoomIn} onZoomOut={zoomOut} />
        <Grid direction="column" className={classes.boardContainer} item container>
          {gridY.map((_, indexY) => (
            <Grid key={`col-${indexY}`} container item>
              {gridX.map((_, indexX) => {
                return (
                  <Grid item key={`col-${indexY}-row-${indexX}`} className={`${classes.tileItem}`}>
                    <div
                      className={classes.tileBackground}
                      style={{
                        width: `${tileSize}px`,
                        height: `${tileSize}px`,
                      }}
                    />
                    <TileComponent
                      className="tileItem"
                      template={template}
                      tile={getTile(tiles, indexX, indexY, board.gridX)}
                      tileSize={tileSize}
                      disabled={disabled}
                      startTurn={startTurn}
                      loading={loading}
                      onCheckout={onCheckoutTile}
                      play={handlePlay}
                      isEnded={isEnded}
                    />
                  </Grid>
                );
              })}
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
);
