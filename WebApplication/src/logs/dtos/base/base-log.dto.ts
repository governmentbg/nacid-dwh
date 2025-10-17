export class BaseLogDto {
  id: number;
  userId: number;
  username: string;
  logDate: Date;
  ip: string;
  verb: string;
  url: string;
  userAgent: string;
  body: string;
  bodyObj: any;
}