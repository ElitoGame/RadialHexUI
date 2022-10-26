import HexTileData, { actionType } from './HexTileData';

export default class HexUiData {
  toJSON: () => {
    hexTiles: {
      tiles: Array<{ x: number; y: number; radiant: number; action: string; url: string }>;
    };
  };
  static fromJSON: (data: {
    tiles: Array<{
      x: number;
      y: number;
      radiant: number;
      action: actionType;
      url: string;
    }>;
  }) => HexUiData;
  getCoreTiles: () => Array<HexTileData>;
  getRadiantTiles: (radiant: number) => Array<HexTileData>;

  constructor(tiles: Array<HexTileData>);
}
