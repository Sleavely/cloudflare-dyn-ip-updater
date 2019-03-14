
require('dotenv').config();
const env = process.env;

const {
  CLOUDFLARE_EMAIL,
  CLOUDFLARE_APIKEY,
  CLOUDFLARE_DOMAIN,
  REFRESH_RATE = 2,
} = process.env

const debug = require('debug')('cf-dyn-ip');
const fetch = require('node-fetch');

const cloudflare = require('cloudflare')({
  email: CLOUDFLARE_EMAIL,
  key: CLOUDFLARE_APIKEY
});

const ZONE = CLOUDFLARE_DOMAIN.split('.').slice(-2).join('.');
const RECORD = CLOUDFLARE_DOMAIN.split('.').slice(0, -2).join('.');
let currentRecord = undefined;

const getIp = function(){
  return fetch('https://api.ipify.org?format=json')
    .then(res => res.json())
    .then(res => {
      debug('Current IP: %s', res.ip);
      return res.ip;
    });
}
const refreshIp = function(){
  debug('Performing refresh.');
  return getIp()
    .then((currentIp) => {
      if(currentIp != currentRecord.content) {
        currentRecord.content = currentIp;
        return cloudflare.dnsRecords.edit(currentRecord.zone_id, currentRecord.id, {type:'A', name: CLOUDFLARE_DOMAIN, content: currentIp})
          .then((res) => {
            currentRecord = res.result;
            debug('Updated record: %o', currentRecord);
          });
      }
    });
};

// Lets boot up.
debug('Attempting to find %s in domain %s', RECORD, ZONE);
Promise.resolve()
.then(() => {
  return cloudflare.zones.browse()
    .then((zones) => {
      let zone = zones.result.find((zone) => {
        return zone.name == ZONE;
      });
      if(!zone) {
        debug('Couldnt find a zone with name %s in results: %o', ZONE, zones.result.map((zone) => zone.name));
        throw new Error('ZONE_NOT_FOUND');
      }
      debug('Found zone: %o', zone);
      return zone;
    });
})
.then((zone) => {
  return cloudflare.dnsRecords.browse(zone.id)
    .then((records) => {
      let record = records.result.find((record) => {
        return record.type == 'A' && record.name == CLOUDFLARE_DOMAIN;
      });
      if(!record) {
        debug('Couldnt find an appropriate record in the zone: %o', records.result.map((record) => record.name.substr(0, record.name.length-ZONE.length)));
        throw new Error('RECORD_NOT_FOUND');
      }
      debug('Found record: %o', record);
      return record;
    });
})
.then((record) => {
  currentRecord = record;
  return refreshIp();
})
.then(() => {
  debug(`Boot finished. Setting interval at every %d minutes.`, REFRESH_RATE);
  setInterval(() => {
    refreshIp();
  }, 1000*60*REFRESH_RATE); // Every 2 minutes
});

