import { get, post } from './tools';

export async function getAdvertisementList(params?: any, options?: { [key: string]: any }) {
  return get({
    url: '/plugin/advertisement/list',
    params,
    options,
  });
}

export async function getAdvertisementInfo(
  params?: any,
  options?: { [key: string]: any },
) {
  return get({
    url: '/plugin/advertisement/detail',
    params,
    options,
  });
}

export async function saveAdvertisement(body: any, options?: { [key: string]: any }) {
  return post({
    url: '/plugin/advertisement/detail',
    body,
    options,
  });
}

export async function deleteAdvertisement(body: any, options?: { [key: string]: any }) {
  return post({
    url: '/plugin/advertisement/delete',
    body,
    options,
  });
}
