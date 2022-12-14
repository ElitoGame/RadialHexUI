export type actionType =
  | 'App'
  | 'Web'
  | 'PaperBin'
  | 'MediaPlayer'
  | 'SysStats'
  | 'Search'
  | 'Bookmarks'
  | 'Unset';

export default class HexTileData {
  private x: number;
  private y: number;
  private radiant: number;
  private action: actionType;
  private app: string;
  private url: string;

  constructor(x: number, y: number, radiant: number, action: actionType, app: string, url: string) {
    this.x = x;
    this.y = y;
    this.radiant = radiant;
    this.action = action;
    this.app = app;
    this.url = url;
  }

  public getX(): number {
    return this.x;
  }
  public setX(x: number) {
    this.x = x;
  }

  public getY(): number {
    return this.y;
  }
  public setY(y: number) {
    this.y = y;
  }

  public getRadiant(): number {
    return this.radiant;
  }
  public setRadiant(radiant: number) {
    this.radiant = radiant;
  }

  public getAction(): string {
    return this.action;
  }
  public setAction(action: actionType) {
    this.action = action;
  }

  public getApp(): string {
    return this.app;
  }
  public setApp(app: string) {
    this.app = app;
  }

  public getUrl(): string {
    return this.url;
  }
  public setUrl(url: string) {
    this.url = url;
  }

  public toJSON(): {
    x: number;
    y: number;
    radiant: number;
    action: string;
    app: string;
    url: string;
  } {
    return {
      x: this.x,
      y: this.y,
      radiant: this.radiant,
      action: this.action,
      app: this.app,
      url: this.url,
    };
  }

  public static fromJSON(data: {
    x: number;
    y: number;
    radiant: number;
    action: actionType;
    app: string;
    url: string;
  }) {
    return new HexTileData(data.x, data.y, data.radiant, data.action, data.app, data.url);
  }
}
