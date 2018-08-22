import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BoxGeometry, Mesh, MeshNormalMaterial, PerspectiveCamera, Scene, WebGLRenderer} from 'three'

@Component({
	templateUrl: './three.component.html',
	styleUrls: ['./three.component.scss']
})
export class ThreeComponent implements OnInit {
	@ViewChild('container') containerRef: ElementRef;
	container: HTMLDivElement;
	scene: Scene;
	camera: PerspectiveCamera;
	renderer: WebGLRenderer;
	geometry: BoxGeometry;
	material: MeshNormalMaterial;
	mesh: Mesh;

	constructor() {
	}

	ngOnInit() {
		this.container = this.containerRef.nativeElement;
		this.init();
		this.animate();
	}

	init() {
		this.camera = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
		this.camera.position.z = 1;
		this.scene = new Scene();
		this.geometry = new BoxGeometry( 0.2, 0.2, 0.2 );
		this.material = new MeshNormalMaterial();
		this.mesh = new Mesh(this.geometry, this.material);
		this.scene.add(this.mesh);
		this.renderer = new WebGLRenderer({
			antialias: true
		});
		this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
		this.container.appendChild(this.renderer.domElement);
	}

	animate() {
		requestAnimationFrame(this.animate.bind(this));
		this.mesh.rotation.x += 0.01;
		this.mesh.rotation.y += 0.02;
		this.renderer.render(this.scene, this.camera);
	}
}
