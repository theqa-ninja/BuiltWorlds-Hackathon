import { ExifImage } from 'exif';

const exifImage = (image) => {
  return new Promise((resolve, reject) => {
    new ExifImage({
      image 
    }, (err, data) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(data);
      }
    });
  });
}

const parseGPS = (gpsExif) => {
  const convertDMSToDD = (dms, direction) => {
    const degrees = dms[0];
    const minutes = dms[1];
    const seconds = dms[2];

    let dd = degrees + minutes/60 + seconds/(60*60);
    // Don't do anything for N or E
    if (direction == "S" || direction == "W") {
        dd = dd * -1;
    } 
    return dd;
  }

  return {
    longitude: convertDMSToDD(gpsExif.GPSLongitude, gpsExif.GPSLongitudeRef),
    latitude: convertDMSToDD(gpsExif.GPSLatitude, gpsExif.GPSLatitudeRef),
    altitude: gpsExif.GPSAltitude - gpsExif.GPSAltitudeRef ? gpsExif.GPSAltitudeRef : 0
  }
}

const extractGPSAsArray = async (image) => {
  try {
    const exif = await exifImage(image);
    if (exif && exif.gps && 'GPSLatitude' in exif.gps && 'GPSLongitude' in exif.gps && 'GPSAltitude' in exif.gps) {
      const lla = parseGPS(exif.gps);
      return [lla.latitude, lla.longitude, lla.altitude];
    }
    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export {
  extractGPSAsArray
};