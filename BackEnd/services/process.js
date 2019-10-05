import { extractExif } from './exif';
import { images, clusters } from '../models';
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
  const { link:metadataLink, name, token, sessionId} = image;

  try {
    const url = await fetchImageMetaData(metadataLink, token);
    const image = await fetchImage(url, token);

    const [exif, tags ] = await Promise.all([
      extractExif(image),
      processVision(image)
    ]);

    // images.create({
    //   name,
    //   latitude: exif.altitude,
    //   longitude: exif.longitude,
    //   altitude: exif.altitude,
    //   session_id: sessionId,
    //   url,
    //   created_at:
    // })

    // TODO: Save to DB
    // console.log(exif, tags);

    return {
      imageId: null,
      name,
      exif
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}

const processImages = async (images, sessionId, token=null) => {
  images = images.map((img) => {
    const image = Object.assign({}, img);
    image.token = token;
    image.sessionId = sessionId;
    return image;
  })

  images = [images[0]];

  const payload = await asyncPool(3, images, processExifAndVision);

  console.log(payload);

  // TODO: Hook up k-means here
  return payload;
};

export default processImages;