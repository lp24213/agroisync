const axios = require('axios');

async function sendToSIEM(event) {
  // Exemplo: enviar para Splunk HTTP Event Collector
  if (process.env.SIEM_SPLUNK_HEC_URL && process.env.SIEM_SPLUNK_HEC_TOKEN) {
    await axios.post(
      process.env.SIEM_SPLUNK_HEC_URL,
      {
        event,
      },
      {
        headers: {
          Authorization: `Splunk ${process.env.SIEM_SPLUNK_HEC_TOKEN}`,
        },
      },
    );
  }
  // Exemplo: enviar para ELK/Logstash
  if (process.env.SIEM_ELK_URL) {
    await axios.post(process.env.SIEM_ELK_URL, event);
  }
  // QRadar integration
  if (process.env.SIEM_QRADAR_URL && process.env.SIEM_QRADAR_TOKEN) {
    await axios.post(process.env.SIEM_QRADAR_URL, event, {
      headers: {
        SEC: process.env.SIEM_QRADAR_TOKEN,
      },
    });
  }
  // ArcSight integration
  if (process.env.SIEM_ARCSIGHT_URL && process.env.SIEM_ARCSIGHT_TOKEN) {
    await axios.post(process.env.SIEM_ARCSIGHT_URL, event, {
      headers: {
        Authorization: `Bearer ${process.env.SIEM_ARCSIGHT_TOKEN}`,
      },
    });
  }
}

module.exports = { sendToSIEM };
