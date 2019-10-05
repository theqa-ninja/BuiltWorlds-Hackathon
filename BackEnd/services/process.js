import { extractGPSAsArray } from './exif';
import axios from 'axios';
import asyncPool from "tiny-async-pool";

const fetchImageMetaData = async (url, token=null) => {
  const headers = {};
  if (token)
    headers['Authorization'] = `Bearer ${token}`;

  const response = await axios.get(url, {
    headers
  });

  return response.data['included'][0]['relationships']['storage']['meta']['link']['href'];
}

const fetchImage = async (url, token=null) => {
  const headers = {};
  if (token)
    headers['Authorization'] = `Bearer ${token}`;

  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    headers
  });

  return response.data;
}

const processVision = async (image) => {
  return null;
}

const processExifAndVision = async (image) => {
  const { link:metadataLink, name, token } = image;
  // TODO: Create Image Document

  try {
    const url = await fetchImageMetaData(metadataLink, token);
    const image = await fetchImage(url, token);

    const [lla, tags ] = await Promise.all([
      extractGPSAsArray(image),
      processVision(image)
    ]);

    // TODO: Save to DB
    console.log(lla, tags);

    return {
      imageId: null,
      name,
      lla,
      tags
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}

const processImages = async (images, token=null) => {
  images = images.map((img) => {
    const image = Object.assign({}, img);
    image.token = token;
    return image;
  })

  const payload = await asyncPool(3, images, processExifAndVision);

  console.log(payload);

  // TODO: Hook up k-means here
  return payload;
};

export default processImages;