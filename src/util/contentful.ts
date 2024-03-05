import { Asset, CollectionProp, Entry } from "contentful-management";

export const isChanged = (entity: Entry | Asset) =>
  !!entity.sys.publishedVersion &&
  entity.sys.version >= entity.sys.publishedVersion + 2;

export const isArchived = (entity: Entry | Asset) =>
  !!entity.sys.archivedVersion;

export const isDraft = (entity: Entry | Asset) =>
  !entity.sys.publishedVersion && !isArchived(entity);

export const isPublished = (entity: Entry | Asset) =>
  !!entity.sys.publishedVersion &&
  entity.sys.version == entity.sys.publishedVersion + 1;

export const hasMorePages = <T>({ skip, limit, total }: CollectionProp<T>) =>
  total > 0 && skip + limit < total;
