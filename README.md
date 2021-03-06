# A Google Maps plugin for Grafana

This plugin shows how to embed a Google Maps window in a Grafana dashboard
pinpointing coordinates read from the datasource.

![GoogleMapPanel](https://github.com/ddileo/manux81-googlemap-panel/blob/master/src/img/GoogleMapPanel.png)

# Application

Data comes from a database query.
Prometheus, InfluxDB, Graphite, Elasticsearch, MySQL etc...
and it can be in a Table format.

In order to allow the plugin to make use of the coordinates produced by the query,
it is necessary to specify two columns called «lat» for latitude and «lng» for longitude.

For instance:

```
SELECT d0 as lat, d1 as lng
FROM table_name
WHERE $__timeFilter(time_index)
ORDER BY time_index
```

# Settings

Google API key
The required Google API key must be entered in the server section.

```
  panelDefaults = {
    googleApiKey: ""
  };
```

# Build
In order to build the code, either Yarn or npm must be used.
In the first place, dependencies must be installed with:
```
npm install
```
After that, the plugin can be built with:
```
npm run build
```
You can also run the code in development with:
```
npm run dev
```
# Contributing

Kindly find below how to contribute

https://docs.synchronicity-iot.eu/docs/contributing/contribution
