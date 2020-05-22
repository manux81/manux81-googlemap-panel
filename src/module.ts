import { MetricsPanelCtrl } from "grafana/app/plugins/sdk";
import defaultsDeep from "lodash/defaultsDeep";
import { DataFrame } from "@grafana/data";
import $ from "jquery";
import "./style.css";
import angluar from "angular";
import { Loader, LoaderOptions } from "google-maps";

interface KeyValue {
  key: string;
  value: any;
}

export default class GoogleMapPanelCtrl extends MetricsPanelCtrl {
  static templateUrl = "partials/module.html";

  panelDefaults = {
    googleApiKey: ""
  };

  map: any = null;
  marker: any = null;
  input: any = null;
  value: any = null;

  // Simple example showing the last value of all data
  firstValues: KeyValue[] = [];

  /** @ngInject */
  constructor($scope, $injector, public templateSrv) {
    super($scope, $injector);
    defaultsDeep(this.panel, this.panelDefaults);

    // Get results directly as DataFrames
    (this as any).dataFormat = "series";

    // Connect signals
    this.events.on("init-edit-mode", this.onInitEditMode.bind(this));
    this.events.on("render", this.onRender.bind(this));
    this.events.on("data-error", this.onDataError.bind(this));
    this.events.on("data-received", this.onDataReceived.bind(this));

    // Create a client instance: Broker, Port, Websocket Path, Client ID
    this.map = this.googleMapLoad();
  
    angluar
      .module("grafana.directives")
      .directive("stringToNumber", this.stringToNumber);
  }

  onInitEditMode() {
    this.addEditorTab(
      "Server",
      `public/plugins/${this.pluginId}/partials/options.server.html`,
      2
    );
  }

  onRender() {
    if (!this.firstValues || !this.firstValues.length) {
      return;
    }

    // Tells the screen capture system that you finished
    this.renderingCompleted();
  }

  onDataError(err: any) {
    console.log("onDataError", err);
  }

  onDataReceived(data) {
    console.log("onDataReceived");

    if (this.map === null || this.marker === null)
      return;

    if (Array.isArray(data) && data.length > 0) {
      if (data[0].type === "table") {
        let colLat = -1;
        let colLng = -1;

        // Find column lat & lon number
        data[0].columns.forEach((c, i) => {
          if (c.text === "lat")
            colLat = i;
          else if (c.text === "lon")
            colLng = i;
        });
        console.log("cols = " + colLat + "-" + colLng + ".");
        if (colLat !== -1 && colLat !== -1) {
          let posLat = 0.0;
          let posLng = 0.0;
          data[0].rows.forEach(r => {
            posLat = r[colLat];
            posLng = r[colLng];
          });
          this.marker.setPosition({ lat: posLat, lng: posLng });
        }
      }
    }
  }

  // 6.3+ get typed DataFrame directly
  handleDataFrame(data: DataFrame[]) {
    const values: KeyValue[] = [];

    for (const frame of data) {
      for (let i = 0; i < frame.fields.length; i++) {
        values.push({
          key: frame.fields[i].name,
          value: frame.fields[i].values
        });
      }
    }

    this.firstValues = values;
  }

  async googleMapLoad(): Promise<google.maps.Map> {
    console.log("googleMapLoad call");
    var pos = {lat: 46.1265909, lng: 8.2380149 };
    const options: LoaderOptions = {
      /* todo */
    };
    const loader = new Loader(this.panel.googleApiKey, options);
    const google = await loader.load();
    const map = new google.maps.Map(document.getElementById('map'), {
      center: pos,
      zoom: 8
    });

    this.marker = new google.maps.Marker({position: pos, map: map});

    return map;
  }


  link(scope: any, elem: any, attrs: any, ctrl: any) {
    this.input = $(elem.find("#value")[0]);
    console.log("link");
  }

  stringToNumber() {
    return {
      require: "ngModel",
      link: function(scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function(value) {
          return "" + value;
        });
        ngModel.$formatters.push(function(value) {
          return parseFloat(value);
        });
      }
    };
  }

  connect() {
    console.log("Call connect");
    this.map = this.googleMapLoad();
  }

}

export { GoogleMapPanelCtrl as PanelCtrl };
