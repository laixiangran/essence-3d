import { Component, OnInit } from '@angular/core';
import ViewerOptions = Cesium.ViewerOptions;
import Viewer = Cesium.Viewer;
import Scene = Cesium.Scene;
import Globe = Cesium.Globe;
import CzmlDataSource = Cesium.CzmlDataSource;
import Cartesian3 = Cesium.Cartesian3;
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
	templateUrl: './czml.component.html',
	styleUrls: ['./czml.component.scss']
})
export class CZMLComponent implements OnInit {
	viewerOptions: ViewerOptions;
	viewer: Viewer;
	scene: Scene;
	globe: Globe;
	coords: any[] = [];

	constructor(public http: HttpClient) {
		this.viewerOptions = {
			imageryProvider: null
		};
	}

	ngOnInit() {
	}

	onViewerReady(evt: any) {
		this.viewer = evt.viewer;
		this.scene = evt.scene;
		this.globe = evt.globe;
		this.viewer.camera.setView({
			destination: new Cartesian3(-3814825.159175133, 2319265.9621706144, 4552318.714920136),
			orientation: {
				heading: 6.283185307179586,
				pitch: -0.7867941394837121,
				roll: 6.283185307179586
			}
		});
		this.getCZMLData().then((data: any) => {
			this.coords = data[0];
			this.addCZML(this.coords, true);
		});
	}

	getCZMLData(): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			const headers = new HttpHeaders({
					'Content-Type': 'application/json'
				}),
				options = {headers: headers};
			this.http.get('./assets/json/ElementNodes_1984.json', options).subscribe((data: any) => {
				const geos: any = data.objects['ElementNodes_1984'].geometries;
				const coords: any[] = [];
				const coords2: any[] = [];
				geos.forEach((geo) => {
					if (!coords[geo.properties.Element]) {
						coords[geo.properties.Element] = [];
					}
					if (!coords2[geo.properties.Element]) {
						coords2[geo.properties.Element] = [];
					}
					geo.coordinates[2] = geo.coordinates[2] * 10; // 为了效果明显，高度放大10倍
					if (coords[geo.properties.Element].length < 9) {
						[].push.apply(coords[geo.properties.Element], geo.coordinates.slice(0, 3));
					} else {
						[].push.apply(coords2[geo.properties.Element], geo.coordinates.slice(0, 3));
					}
					return false;
				});
				resolve([coords, coords2]);
			}, (error: any) => {
				reject(error);
			});
		});
	}

	addCZML(coords: any[], top: boolean = false) {
		const polygonCZML: any[] = [{
			'id': 'document',
			'name': 'CZML Geometries: Polygon',
			'version': '1.0'
		}];
		coords.forEach((coord, index) => {
			const py = {
				'id': top ? 'top' + index : 'bottom' + index,
				'name': top ? 'top' + index : 'bottom' + index,
				'polygon': {
					'positions': {
						'cartographicDegrees': coord
					},
					'material': {
						'solidColor': {
							'color': {
								'rgba': [55, 96, 151, 255]
							}
						}
					},
					'extrudedHeight': 0,
					'perPositionHeight': true,
					'outline': true,
					'outlineColor': {
						'rgba': [255, 255, 255, 10]
					}
				}
			};
			polygonCZML.push(py);
		});
		CzmlDataSource.load(polygonCZML).then((czmlDataSource: CzmlDataSource) => {
			this.viewer.dataSources.add(czmlDataSource);
		});
	}
}
