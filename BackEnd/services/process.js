import { extractGPSAsArray } from './exif';
import axios from 'axios';
import asyncPool from "tiny-async-pool";

const fetchImage = async (url, token=null) => {
  const headers = {};
  if (token)
    headers['Authorization'] = `bearer ${token}`;

  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    headers
  });

  return response.data;
}

const processVision = async (image) => {
  return null;
}

const processExifAndVision = async (url, token) => {
  // TODO: Create Image Document

  try {
    const image = await fetchImage(url, token);

    const [lla, tags ] = await Promise.all([
      extractGPSAsArray(image),
      processVision(image)
    ]);

    // TODO: Save to DB
    console.log(lla, tags);

    return {
      imageId: null,
      lla,
      tags
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}

const processImages = async (urls, token=null) => {
  const payload = await asyncPool(3, urls, processExifAndVision);

  // TODO: Hook up k-means here
  return payload;
};

export default processImages;