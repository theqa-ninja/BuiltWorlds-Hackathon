import axios from 'axios';
import { ExifImage } from 'exif';

const exifImage = (image) => {
  return new Promise((resolve, reject) => {
    new ExifImage({
      image 
    }, (err, data) => {
      console.log(err, data);
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

class Exif {
  constructor(url) {
    this.url = url;
  }

  async extractGPS() {
    try {
      const exif = await this._fetchImage();
      if (exif && exif.gps && exif.gps.GPSLatitude && exif.gps.GPSLongitude && exif.gps.GPSAltitude) {
        this.lla =  parseGPS(image.gps);
        return this.lla;
      }
      return null;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async extractGPSAsArray() {
    const lla = this.extractGPS();

    if (lla) {
      return [lla.latitude, lla.longitude, lla.altitude];
    }
    return null;

  }

  async _fetchImage() {
    try {
      const response = await axios.get(this.url, {
        responseType: 'arraybuffer',
        headers: {
          // 'Range': 'bytes=0-100'
        }
      });

      this.image = response.data;
      this.exif = await exifImage(this.image);
      return this.exif;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

export default Exif;