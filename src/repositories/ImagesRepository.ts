import { Logger } from '@overnightjs/logger';
import * as Lowdb from 'lowdb';
import * as FileAsync from 'lowdb/adapters/FileAsync';

import * as fs from 'fs';

const adapter = new FileAsync('db.json');

interface Schema {
  'images': Image;
}

interface Image {
  friendlyName: string;
  size: number;
  fileName: string;
}

export default class {
  private db: Lowdb.LowdbAsync<Schema> | null = null;

  async getAll(): Promise<Image[]> {
    Logger.Info({ category: 'ImageRepository.getAll' }, true);
    const images = (await this.getImages());

    return images.value() || [];
  }

  async search(pattern: string): Promise<Image[]> {
    Logger.Info({ category: 'ImageRepository.search', pattern }, true);
    const images = (await this.getImages());
    const matches = images
      .find(({ friendlyName }: Image) => friendlyName?.indexOf(pattern) >= 0)
      .value() || [];

    if (Array.isArray(matches)) return matches

    return [matches];
  }

  async add(friendlyName: string, size: number, fileName: string): Promise<void> {
    await this.remove(friendlyName);

    Logger.Info({ category: 'ImageRepository.add', friendlyName, size, fileName }, true);
    const images = (await this.getImages());

    return images
      .push({ friendlyName, size, fileName })
      .write()
      ;
  }

  async remove(friendlyName: string): Promise<void> {
    const images = (await this.getImages());

    const beingRemoved = images
      .find({ friendlyName })
      .value();

    if (beingRemoved) {
      Logger.Info({ category: 'ImageRepository.remove', friendlyName }, true);

      await images
        .remove({ friendlyName })
        .write()
        ;

      try { fs.unlinkSync(`public/${beingRemoved.fileName}`); }
      catch (e) { Logger.Err(e); }
    }
  }

  private async getImages(): Promise<any> { // eslint-disable-line @typescript-eslint/no-explicit-any
    return (await this.getDb())
      .get('images')
      ;
  }

  private async getDb() {
    return this.db || (this.db = await this.initializeDb());
  }

  private async initializeDb() {
    const db = await Lowdb(adapter);
    await db
      .defaults({ images: [] })
      .write();
    return db;
  }
}
