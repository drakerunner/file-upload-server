import { OK, NO_CONTENT, CREATED, BAD_REQUEST } from 'http-status-codes';
import { Request, Response } from 'express';

import { Controller, Middleware, Get, Post, Delete } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';

import upload from '../middlewares/upload';
import ImagesRepository from '../repositories/ImagesRepository';

import validateSearchPattern from '../validators/validateSearchPattern';
import validateFilename from '../validators/validateFilename';

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
      const validation = validateSearchPattern(pattern);

      if (validation.isValid()) {
        Logger.Info(`Searching for '${pattern}'`, true);
        return res.status(OK).json(await this.repository.search(pattern));
      }
      else {
        Logger.Warn(`Search pattern with error '${validation.errorsSummary()}'`, true);
        return res.status(BAD_REQUEST).json(validation.errorsSummary());
      }
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

    const validation = validateFilename(friendlyName);
    if (validation.isValid()) {
      Logger.Info(`Deleting file: ${friendlyName}`, true);
      await this.repository.remove(friendlyName);

      return res.status(NO_CONTENT).json();
    }
    else {
      Logger.Warn(`friendlyName with error '${validation.errorsSummary()}'`, true);
      return res.status(BAD_REQUEST).json(validation.errorsSummary());
    }
  }
}
