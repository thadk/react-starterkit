import React from 'react';
import ItemList from '../components/itemList.jsx';
import ItemStore from '../stores/itemStore';
import EsriTileLayer from '../components/map/esriTileLayer.jsx';
import PointLayer from '../components/map/pointLayer.jsx';
import Popup from '../components/map/popup.jsx';
import ItemActions from '../actions/itemActions';

class Home extends React.Component {

  constructor(props){
    super(props);

    var mapCountries = {
                "bbox": [
                  39.985976355423105,
                  -20.0665597,
                  202.68718509200005,
                  48.1606518
                ],
                "features": [
                {
                    "geometry": {
                      "coordinates": [
                        201.2088957,
                        -19.8149809
                      ],
                      "type": "Point"
                    },
                    "id": "CK",
                    "properties": {
                      "name": "Cook Islands",
                      "totals": {
                        "bbox": [
                          194.17546634200005,
                          -21.93889739399988,
                          202.68718509200005,
                          -8.94670989399988
                        ],
                        "commitments": {
                          "amount": 36210000.0,
                          "unit": "USD"
                        },
                        "disbursements": {
                          "amount": 35895467.4,
                          "unit": "USD"
                        },
                        "locations": {
                          "amount": 4,
                          "unit": null
                        },
                        "projects": {
                          "amount": 5,
                          "unit": null
                        }
                      }
                    },
                    "type": "Feature"
                  },
                  {
                    "geometry": {
                      "coordinates": [
                        103.8315717,
                        36.5601152
                      ],
                      "type": "Point"
                    },
                    "id": "CN",
                    "properties": {
                      "name": "China",
                      "totals": {
                        "bbox": [
                          73.6022563070002,
                          15.775376695000048,
                          134.7725793870002,
                          53.56944447900004
                        ],
                        "commitments": {
                          "amount": 13611280000.0,
                          "unit": "USD"
                        },
                        "disbursements": {
                          "amount": 7943209902.05,
                          "unit": "USD"
                        },
                        "locations": {
                          "amount": 905,
                          "unit": null
                        },
                        "projects": {
                          "amount": 98,
                          "unit": null
                        }
                      }
                    },
                    "type": "Feature"
                  },
                  {
                    "geometry": {
                      "coordinates": [
                        90.2419999,
                        23.8456777
                      ],
                      "type": "Point"
                    },
                    "id": "BD",
                    "properties": {
                      "name": "Bangladesh",
                      "totals": {
                        "bbox": [
                          88.02178959200009,
                          20.73871491100003,
                          92.64285119700017,
                          26.623544007000064
                        ],
                        "commitments": {
                          "amount": 7606150000.0,
                          "unit": "USD"
                        },
                        "disbursements": {
                          "amount": 3930777637.26,
                          "unit": "USD"
                        },
                        "locations": {
                          "amount": 571,
                          "unit": null
                        },
                        "projects": {
                          "amount": 77,
                          "unit": null
                        }
                      }
                    },
                    "type": "Feature"
                  },
                  {
                    "geometry": {
                      "coordinates": [
                        73.3022582,
                        3.8277948
                      ],
                      "type": "Point"
                    },
                    "id": "MV",
                    "properties": {
                      "name": "Maldives",
                      "totals": {
                        "bbox": [
                          72.684825066,
                          -0.688571872999901,
                          73.75318444100017,
                          7.107245184000149
                        ],
                        "commitments": {
                          "amount": 97350000.0,
                          "unit": "USD"
                        },
                        "disbursements": {
                          "amount": 45803571.92,
                          "unit": "USD"
                        },
                        "locations": {
                          "amount": 21,
                          "unit": null
                        },
                        "projects": {
                          "amount": 7,
                          "unit": null
                        }
                      }
                    },
                    "type": "Feature"
                  },
                  {
                    "geometry": {
                      "coordinates": [
                        101.0033334,
                        15.1143997
                      ],
                      "type": "Point"
                    },
                    "id": "TH",
                    "properties": {
                      "name": "Thailand",
                      "totals": {
                        "bbox": [
                          97.35140100100008,
                          5.62989003500013,
                          105.65099776200006,
                          20.4450064090001
                        ],
                        "commitments": {
                          "amount": 377100000.0,
                          "unit": "USD"
                        },
                        "disbursements": {
                          "amount": 342924969.57,
                          "unit": "USD"
                        },
                        "locations": {
                          "amount": 5,
                          "unit": null
                        },
                        "projects": {
                          "amount": 2,
                          "unit": null
                        }
                      }
                    },
                    "type": "Feature"
                  },
                  {
                    "geometry": {
                      "coordinates": [
                        71.0158341,
                        38.5298857
                      ],
                      "type": "Point"
                    },
                    "id": "TJ",
                    "properties": {
                      "name": "Tajikistan",
                      "totals": {
                        "bbox": [
                          67.34269006300022,
                          36.67864084900019,
                          75.16412479700008,
                          41.039976705000086
                        ],
                        "commitments": {
                          "amount": 882972000.0,
                          "unit": "USD"
                        },
                        "disbursements": {
                          "amount": 471653046.73,
                          "unit": "USD"
                        },
                        "locations": {
                          "amount": 111,
                          "unit": null
                        },
                        "projects": {
                          "amount": 21,
                          "unit": null
                        }
                      }
                    },
                    "type": "Feature"
                  },
                  {
                    "geometry": {
                      "coordinates": [
                        185.1314877,
                        -20.0665597
                      ],
                      "type": "Point"
                    },
                    "id": "TO",
                    "properties": {
                      "name": "Tonga",
                      "totals": {
                        "bbox": [
                          183.78069095100005,
                          -22.33879973799992,
                          186.0857446620001,
                          -15.55950286299992
                        ],
                        "commitments": {
                          "amount": 48080000.0,
                          "unit": "USD"
                        },
                        "disbursements": {
                          "amount": 34768781.5,
                          "unit": "USD"
                        },
                        "locations": {
                          "amount": 14,
                          "unit": null
                        },
                        "projects": {
                          "amount": 7,
                          "unit": null
                        }
                      }
                    },
                    "type": "Feature"
                  },
                  {
                    "geometry": {
                      "coordinates": [
                        187.8387507,
                        -13.7545957
                      ],
                      "type": "Point"
                    },
                    "id": "WS",
                    "properties": {
                      "name": "Samoa",
                      "totals": {
                        "bbox": [
                          187.21741783900012,
                          -14.05282968499999,
                          188.56230716200008,
                          -13.46282317499994
                        ],
                        "commitments": {
                          "amount": 124990000.0,
                          "unit": "USD"
                        },
                        "disbursements": {
                          "amount": 91726624.1,
                          "unit": "USD"
                        },
                        "locations": {
                          "amount": 39,
                          "unit": null
                        },
                        "projects": {
                          "amount": 12,
                          "unit": null
                        }
                      }
                    },
                    "type": "Feature"
                  },
                  {
                    "geometry": {
                      "coordinates": [
                        47.5421113,
                        40.289119
                      ],
                      "type": "Point"
                    },
                    "id": "AZ",
                    "properties": {
                      "name": "Azerbaijan",
                      "totals": {
                        "bbox": [
                          44.77455855300022,
                          38.392644755,
                          50.62574303500011,
                          41.89044159000015
                        ],
                        "commitments": {
                          "amount": 1737400000.0,
                          "unit": "USD"
                        },
                        "disbursements": {
                          "amount": 699713353.04,
                          "unit": "USD"
                        },
                        "locations": {
                          "amount": 71,
                          "unit": null
                        },
                        "projects": {
                          "amount": 13,
                          "unit": null
                        }
                      }
                    },
                    "type": "Feature"
                  },
                  {
                    "geometry": {
                      "coordinates": [
                        104.9028043,
                        12.7155625
                      ],
                      "type": "Point"
                    },
                    "id": "KH",
                    "properties": {
                      "name": "Cambodia",
                      "totals": {
                        "bbox": [
                          102.31342370600012,
                          10.415773620000081,
                          107.61051639900009,
                          14.704581605000087
                        ],
                        "commitments": {
                          "amount": 1176730000.0,
                          "unit": "USD"
                        },
                        "disbursements": {
                          "amount": 585212318.67,
                          "unit": "USD"
                        },
                        "locations": {
                          "amount": 421,
                          "unit": null
                        },
                        "projects": {
                          "amount": 60,
                          "unit": null
                        }
                      }
                    },
                    "type": "Feature"
                  },
                  {
                    "geometry": {
                      "coordinates": [
                        79.6157215,
                        22.8879525
                      ],
                      "type": "Point"
                    },
                    "id": "IN",
                    "properties": {
                      "name": "India",
                      "totals": {
                        "bbox": [
                          68.1434025400001,
                          6.74555084800015,
                          97.36225305200006,
                          35.49540557900009
                        ],
                        "commitments": {
                          "amount": 15320996000.0,
                          "unit": "USD"
                        },
                        "disbursements": {
                          "amount": 8074676484.55,
                          "unit": "USD"
                        },
                        "locations": {
                          "amount": 1323,
                          "unit": null
                        },
                        "projects": {
                          "amount": 101,
                          "unit": null
                        }
                      }
                    },
                    "type": "Feature"
                  },
                  {
                    "geometry": {
                      "coordinates": [
                        167.7008441,
                        -16.2012679
                      ],
                      "type": "Point"
                    },
                    "id": "VU",
                    "properties": {
                      "name": "Vanuatu",
                      "totals": {
                        "bbox": [
                          166.52051842500012,
                          -20.253106377999913,
                          169.89893639400023,
                          -13.064873955999843
                        ],
                        "commitments": {
                          "amount": 15820000.0,
                          "unit": "USD"
                        },
                        "disbursements": {
                          "amount": 33033.0,
                          "unit": "USD"
                        },
                        "locations": {
                          "amount": 8,
                          "unit": null
                        },
                        "projects": {
                          "amount": 2,
                          "unit": null
                        }
                      }
                    },
                    "type": "Feature"
                  },
                  {
                    "geometry": {
                      "coordinates": [
                        106.3009352,
                        16.6421827
                      ],
                      "type": "Point"
                    },
                    "id": "VN",
                    "properties": {
                      "name": "Vietnam",
                      "totals": {
                        "bbox": [
                          102.11865523300011,
                          8.565578518000152,
                          109.47242272200018,
                          23.366275127000122
                        ],
                        "commitments": {
                          "amount": 9381970000.0,
                          "unit": "USD"
                        },
                        "disbursements": {
                          "amount": 4868094971.36,
                          "unit": "USD"
                        },
                        "locations": {
                          "amount": 896,
                          "unit": null
                        },
                        "projects": {
                          "amount": 85,
                          "unit": null
                        }
                      }
                    },
                    "type": "Feature"
                  },
                  {
                    "geometry": {
                      "coordinates": [
                        67.2959647,
                        48.1606518
                      ],
                      "type": "Point"
                    },
                    "id": "KZ",
                    "properties": {
                      "name": "Kazakhstan",
                      "totals": {
                        "bbox": [
                          46.47827884900002,
                          40.58465566000008,
                          87.3237960210001,
                          55.434550273000085
                        ],
                        "commitments": {
                          "amount": 2458300000.0,
                          "unit": "USD"
                        },
                        "disbursements": {
                          "amount": 1719434533.63,
                          "unit": "USD"
                        },
                        "locations": {
                          "amount": 50,
                          "unit": null
                        },
                        "projects": {
                          "amount": 11,
                          "unit": null
                        }
                      }
                    },
                    "type": "Feature"
                  },
                  {
                    "geometry": {
                      "coordinates": [
                        134.3480333,
                        7.197636
                      ],
                      "type": "Point"
                    },
                    "id": "PW",
                    "properties": {
                      "name": "Palau",
                      "totals": {
                        "bbox": [
                          131.13111412900005,
                          2.949042059000149,
                          134.7273429907992,
                          8.096617828631437
                        ],
                        "commitments": {
                          "amount": 44800000.0,
                          "unit": "USD"
                        },
                        "disbursements": {
                          "amount": 16486632.73,
                          "unit": "USD"
                        },
                        "locations": {
                          "amount": 12,
                          "unit": null
                        },
                        "projects": {
                          "amount": 4,
                          "unit": null
                        }
                      }
                    },
                    "type": "Feature"
                  },
                  {
                    "geometry": {
                      "coordinates": [
                        178.5203532,
                        -7.7590691
                      ],
                      "type": "Point"
                    },
                    "id": "TV",
                    "properties": {
                      "name": "Tuvalu",
                      "totals": {
                        "bbox": [
                          176.1252547540001,
                          -9.420668226999808,
                          179.90674889400017,
                          -5.67750416499986
                        ],
                        "commitments": {
                          "amount": 5590000.0,
                          "unit": "USD"
                        },
                        "disbursements": {
                          "amount": 5590000.0,
                          "unit": "USD"
                        },
                        "locations": {
                          "amount": 1,
                          "unit": null
                        },
                        "projects": {
                          "amount": 2,
                          "unit": null
                        }
                      }
                    },
                    "type": "Feature"
                  },
                  {
                    "geometry": {
                      "coordinates": [
                        155.2606335,
                        6.9672811
                      ],
                      "type": "Point"
                    },
                    "id": "FM",
                    "properties": {
                      "name": "Micronesia, Federated States of",
                      "totals": {
                        "bbox": [
                          138.06381269600016,
                          0.918158270000148,
                          163.04656009200008,
                          9.775580145000134
                        ],
                        "commitments": {
                          "amount": 9040000.0,
                          "unit": "USD"
                        },
                        "disbursements": {
                          "amount": 328500.21,
                          "unit": "USD"
                        },
                        "locations": {
                          "amount": 2,
                          "unit": null
                        },
                        "projects": {
                          "amount": 2,
                          "unit": null
                        }
                      }
                    },
                    "type": "Feature"
                  },
                  {
                    "geometry": {
                      "coordinates": [
                        145.2315238,
                        -6.4701205
                      ],
                      "type": "Point"
                    },
                    "id": "PG",
                    "properties": {
                      "name": "Papua New Guinea",
                      "totals": {
                        "bbox": [
                          140.84921106000016,
                          -11.636325778999847,
                          155.96753991,
                          -1.346368096999882
                        ],
                        "commitments": {
                          "amount": 1004620000.0,
                          "unit": "USD"
                        },
                        "disbursements": {
                          "amount": 435436056.66,
                          "unit": "USD"
                        },
                        "locations": {
                          "amount": 332,
                          "unit": null
                        },
                        "projects": {
                          "amount": 26,
                          "unit": null
                        }
                      }
                    },
                    "type": "Feature"
                  },
                  {
                    "geometry": {
                      "coordinates": [
                        69.3413433,
                        29.9484969
                      ],
                      "type": "Point"
                    },
                    "id": "PK",
                    "properties": {
                      "name": "Pakistan",
                      "totals": {
                        "bbox": [
                          60.8443787030001,
                          23.694525458000058,
                          77.0489709880002,
                          37.054483541000096
                        ],
                        "commitments": {
                          "amount": 9856140000.0,
                          "unit": "USD"
                        },
                        "disbursements": {
                          "amount": 5949171223.05,
                          "unit": "USD"
                        },
                        "locations": {
                          "amount": 393,
                          "unit": null
                        },
                        "projects": {
                          "amount": 63,
                          "unit": null
                        }
                      }
                    },
                    "type": "Feature"
                  }
                ],
                "type": "FeatureCollection"
    };

    this.state = {
      items : [],
      loading: false,
      countries: null
    };
    console.log(this.state);

  }

  componentDidMount() {
    this.unsubscribe = ItemStore.listen(this.onStatusChange.bind(this));
    ItemActions.loadItems();
  }


  componentWillUnmount() {
    this.unsubscribe();
  }

  onStatusChange(state) {
    this.setState(state);
  }

  dblclick(feature, layer) {
    MetaActions.transitionTo('country', {}, {c: [feature.id]});
  }

  pin(featureData, latlng) {
    var size = 80; // size for divIcon

console.log("hi");

    return L.marker(latlng, {
      icon: L.divIcon({
        className: 'country-location-marker',
        iconSize: [size, size],
        iconAnchor: [size/2, size/2],
      }),
      title: featureData.properties.name,
      alt: 'Clickable map marker for ' + featureData.properties.name,
      riseOnHover: true
    });
  }

  popup(country) {
    var d = country.properties;
    var countryPage;
    if(country.id === 'PH') {
      countryPage = "http://www.adb.org/countries/philippines/main";
    } else if(country.id === 'IN') {
      countryPage = "http://www.adb.org/countries/india/main";
    }
    return (
      <Popup className="country-popup">
        <Popup.Header>
          <h3 className="panel-title totals">
            <Link to="country" query={{c: [country.id]}}>
              {d.name}
            </Link>
          </h3>
        </Popup.Header>

        <div className="panel-body totals">
          <p className="clearfix country-footer">
          Marker
          </p>
        </div>
      </Popup>
    );
  }

  render() {


    return (
      <div>
        <EsriTileLayer theme="DarkGray" getMap={this.props.getMap} />
        <PointLayer
          getMap={this.props.getMap}
          geojson={this.state.countries}
          pin={this.pin}
          popup={this.popup}
          popupMaxWidth={320}
          dblclick={this.dblclick} />
        <h1>Home Area</h1>
        <ItemList { ...this.state } />

      </div>
    );
  }
}

export default Home;
