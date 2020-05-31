import { OK, NO_CONTENT, CREATED } from 'http-status-codes';
import { Request, Response } from 'express';

import { Controller, Middleware, Get, Post, Delete } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';

import upload from '../middlewares/upload';

import ImagesRepository from '../repositories/ImagesRepository';

@Controller('api/images')
export default class {
  private repository = new ImagesRepository();

  @Get('')
  private async getAll(req: Request, res: Response) {
    Logger.Info('Get All', true);

    return res.status(OK).json(await this.repository.getAll());
  }

  @Get('search')
  private async search(req: Request, res: Response) {
    const { pattern } = req.query;

    if (typeof (pattern) === 'string') {
      Logger.Info(`Searching for '${pattern}'`, true);
      return res.status(OK).json(await this.repository.search(pattern));
    }

    return res.status(OK).json([]);
  }

  @Post(':friendlyName')
  @Middleware(upload)
  private async post(req: Request, res: Response) {
    const { friendlyName } = req.params;
    const { file } = req;

    Logger.Info(`Uploading file: ${friendlyName}`, true);
    await this.repository.add(friendlyName, file.size, file.filename);

    return res.status(CREATED).json();
  }

  @Delete(':friendlyName')
  private async delete(req: Request, res: Response) {
    const { friendlyName } = req.params;

    Logger.Info(`Deleting file: ${friendlyName}`, true);
    await this.repository.remove(friendlyName);

    return res.status(NO_CONTENT).json();
  }
}
