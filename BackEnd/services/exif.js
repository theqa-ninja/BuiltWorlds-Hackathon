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
    altitude: gpsExif.GPSAltitude - gpsExif.GPSAltitudeRef
  }
}

const extractExif = async () => {
  try {
    const image = await exifImage('/home/danielyuan/Downloads/2.jpg');

    if (image && image.gps && image.gps.GPSLatitude && image.gps.GPSLongitude && image.gps.GPSAltitude) {
      return parseGPS(image.gps);
    }
    return null;
  } catch (e) {
    console.log('error happened');
    console.log(e);
  }
};

class Exif {
  constructor(url) {
    this.url = url;
    console.log(this.url)
  }

}

export default Exif;