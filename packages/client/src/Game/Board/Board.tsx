import React, { memo, useCallback, useEffect, useState } from 'react';
import { anime } from 'react-anime';
import useSound from 'use-sound';
import { Grid } from '@material-ui/core';
import { TileComponent } from '../Tile';
import { ZoomControl, useZoom } from '../ZoomControl';
import { useStyles } from './styles';
import { Tile } from '../types';
import flipCard from '../../assets/sfx/click_001.mp3';
import takeCard from '../../assets/sfx/ping_001.mp3';
import cardReset from '../../assets/sfx/card_flip_001.mp3';
import start from '../../assets/sfx/start_game.mp3';
import end from '../../assets/sfx/end_game.mp3';

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
    const [playSound, setPlaySound] = useState<string | null>(null);
    const [flip] = useSound(flipCard);
    const [take] = useSound(takeCard);
    const [flipBack] = useSound(cardReset);
    const [startGame] = useSound(start);
    const [endGame] = useSound(end);

    const playMedia = useCallback(
      async (media: typeof flip | typeof take | typeof flipBack | typeof startGame | typeof endGame, delay = 0) => {
        await new Promise(res => setTimeout(res, delay));
        media();
      },
      [endGame, flip, flipBack, startGame, take]
    );

    useEffect(() => {
      if (playSound === 'show1' && tiles.filter(tile => tile.status === 'show').length === 1) {
        flip();
      }
      if (playSound === 'show2' && tiles.filter(tile => tile.status === 'show').length === 2) {
        flip();
        setPlaySound(null);
      }
      if (playSound === 'show2' && !tiles.filter(tile => tile.status === 'show').length) {
        take();
        setPlaySound(null);
      }
      if (!isStarted && startTurn && !playSound) {
        playMedia(startGame, 250);
      } else if (playSound === 'reset' && !tiles.filter(tile => tile.status === 'show').length) {
        flipBack();
      }
    }, [flip, flipBack, isStarted, playMedia, playSound, startGame, startTurn, take, tiles]);

    const getTile = useCallback((tiles: Tile[], posX: number, posY: number, boardX: number) => {
      const id = boardX * posY + posX;

      return tiles[id];
    }, []);

    const handleCheckoutTile = useCallback(
      (tile: Tile) => {
        if (startTurn) {
          setPlaySound('reset');
        } else if (tile.status === 'hidden') {
          if (playSound === 'show1') {
            setPlaySound('show2');
          } else {
            setPlaySound('show1');
          }
        }
        onCheckoutTile(tile.id);
      },
      [onCheckoutTile, playSound, startTurn]
    );

    useEffect(() => {
      if (isEnded) {
        playMedia(endGame, 2000);
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

      if (isStarted || !startTurn) {
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
    }, [board.gridX, board.gridY, endGame, isEnded, isStarted, playMedia, startTurn]);

    return (
      <div className={classes.boardWrapper}>
        <ZoomControl onZoomIn={zoomIn} onZoomOut={zoomOut} />
        <Grid direction="column" className={classes.boardContainer} item container>
          {gridY.map((_, indexY) => (
            <Grid key={`col-${indexY}`} container item>
              {gridX.map((_, indexX) => (
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
                    firstMove={!isStarted && startTurn}
                    loading={loading}
                    onCheckout={handleCheckoutTile}
                    isEnded={isEnded}
                  />
                </Grid>
              ))}
            </Grid>
          ))}
          {!isStarted && startTurn ? <div className={classes.clickToStart}>click to start</div> : null}
        </Grid>
      </div>
    );
  }
);
