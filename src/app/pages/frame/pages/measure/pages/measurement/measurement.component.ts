import { Component, OnInit } from '@angular/core';
import ViewerOptions = Cesium.ViewerOptions;
import Viewer = Cesium.Viewer;
import Scene = Cesium.Scene;
import Globe = Cesium.Globe;
import { SelectItem } from 'primeng/primeng';
import Cartesian3 = Cesium.Cartesian3;
import Cartographic = Cesium.Cartographic;
import sampleTerrain = Cesium.sampleTerrain;
import Entity = Cesium.Entity;
import PolylineGraphics = Cesium.PolylineGraphics;

@Component({
	templateUrl: './measurement.component.html',
	styleUrls: ['./measurement.component.scss']
})
export class MeasurementComponent implements OnInit {
	viewerOptions: ViewerOptions;
	viewer: Viewer;
	scene: Scene;
	globe: Globe;
	selectedMode: SelectItem = {label: '空间测量', value: 'space'};
	modes: SelectItem[];

	constructor() {
		this.modes = [
			{label: '空间测量', value: 'space'},
			{label: '贴地测量', value: 'affixedTo'}
		];
	}

	ngOnInit() {
	}

	onViewerReady(evt: any) {
		this.viewer = evt.viewer;
		this.scene = evt.scene;
		this.globe = evt.globe;
		this.viewer.camera.setView({
			destination: new Cartesian3(317341.1198994921, 5642696.778815073, 2961682.3300576834),
			orientation: {
				heading: 0.34555839949062594,
				pitch: -0.1422794351856307,
				roll: 0.0009471063581933947
			}
		});
		this.rangeFinding();
	}

	/**
	 * 测距
	 */
	rangeFinding() {
		const positions: Cartesian3[] = Cartesian3.fromDegreesArray([
			86.953793, 27.928257,
			86.953793, 27.988257,
			86.896497, 27.988257
		]);
		const cartographicArray: Cartographic[] = [];
		for (let i = 0; i < positions.length; i += 3) {
			cartographicArray.push(this.globe.ellipsoid.cartesianToCartographic(positions[i]));
		}
		sampleTerrain(this.viewer.terrainProvider, 18, cartographicArray)
			.then((raisedPositionsCartograhpic) => {
				const raisedPositions: Cartesian3[] = this.globe.ellipsoid.cartographicArrayToCartesianArray(raisedPositionsCartograhpic);
				console.log(raisedPositions);
				this.viewer.entities.add(new Entity({
					polyline: new PolylineGraphics({
						positions: raisedPositions,
						width: 5,
						clampToGround: true,
						material: Cesium.Color.RED
					})
				}));
				this.viewer.zoomTo(this.viewer.entities);
			});
	}

	/**
	 * 清除
	 */
	clear() {

	}

	/**
	 * 测量模式切换
	 * @param $event
	 */
	modeChange($event) {

	}
}
