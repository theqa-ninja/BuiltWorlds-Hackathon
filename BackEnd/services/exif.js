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

const parseGPS = (exif) => {
  if (exif && exif.gps && 'GPSLatitude' in exif.gps && 'GPSLongitude' in exif.gps && 'GPSAltitude' in exif.gps) {
    const gpsExif = exif.gps;
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
      altitude: gpsExif.GPSAltitude - (gpsExif.GPSAltitudeRef ? gpsExif.GPSAltitudeRef : 0)
    }
  } else {
    return null;
  }
}

const parseExifExistance = (exif, relations) => {
  let prevReference = exif;
  relations.forEach((key) => {
    console.log(key, prevReference)
    if (!prevReference || !(key in prevReference))
      return null;

    prevReference = prevReference[key];
    console.log(prevReference);
  });

  return prevReference;
}

const extractExif = async (image) => {
  try {
    const exif = await exifImage(image);
    const lla = parseGPS(exif);

    return {
      altitude: lla ? lla.altitude : null,
      latitude: lla ? lla.latitude : null,
      longitude: lla ? lla.longitude : null,
      make: parseExifExistance(exif, ['image', 'Make']),
      model: parseExifExistance(exif, ['image', 'Model']),
      createdAt: parseExifExistance(exif, ['exif', 'CreateDate']),
      exif
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

export {
  extractExif
};