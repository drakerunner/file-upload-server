import { OK, BAD_REQUEST } from 'http-status-codes';
import { Request, Response } from 'express';
import { Controller, Middleware, Get, Put, Post, Delete } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';

@Controller('api')
export class ImagesController {
  @Get('')
  private getAll(req: Request, res: Response) {
    Logger.Info('Get All', true);
    return res.status(OK).json(images);
  }
}


const images = [{
  friendlyName: 'Doc1',
  size: 100,
  data: ''
}, {
  friendlyName: 'Doc2',
  size: 100,
  data: ''
}, {
  friendlyName: 'Doc3',
  size: 100,
  data: ''
}, {
  friendlyName: 'Doc4',
  size: 100,
  data: ''
}, {
  friendlyName: 'Doc5',
  size: 100,
  data: ''
}, {
  friendlyName: 'Doc6',
  size: 100,
  data: ''
}];
