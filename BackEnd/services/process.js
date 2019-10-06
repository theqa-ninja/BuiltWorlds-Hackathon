import { extractExif } from './exif';
import { images, clusters } from '../models';
import {kMeans} from '../utility/kMeans';
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

    // const newImage = {
    //   id: Math.floor(Math.random()*100000)
    // }
    // console.log(newImage);

    const newImage = await images.create({
      filename: name,
      latitude: exif.altitude,
      longitude: exif.longitude,
      altitude: exif.altitude,
      make: exif.make,
      model: exif.model,
      exif,
      session_id: sessionId,
      url,
      created_at: new Date(exif.createdAt)
    });

    return {
      imageId: newImage.id,
      name,
      lla: [
        exif.latitude ? exif.latitude : 0,
        exif.longitude? exif.longitude : 0,
        exif.altitude ? exif.altitude : 0
      ],
      make: exif.make,
      model: exif.model,
      exif
    };
  } catch (e) {
    console.error(e);
    return {
      lla: [0,0,0] 
    };
  }
}

const processImages = async (images, sessionId, token=null) => {
  images = images.map((img) => {
    const image = Object.assign({}, img);
    image.token = token;
    image.sessionId = sessionId;
    return image;
  })

  // images = images.slice(0,10);

  const payload = await asyncPool(3, images, processExifAndVision);

  console.log('????');
  const results = kMeans(payload, Math.floor(Math.sqrt(payload.length / 2)), 2);
  console
  console.log(results);

  // TODO: Hook up k-means here
  return payload;
};

export default processImages;