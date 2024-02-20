import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { Font } from 'three/examples/jsm/loaders/FontLoader.js';

export interface TextParameters {
    font: any;
    scene: THREE.Scene;
    text?: string | undefined;
    string?: string | undefined;
    mesh?: THREE.Mesh | undefined;
    material?: THREE.MeshBasicMaterial | undefined;
    geometry?: TextGeometry | undefined;
    position?: THREE.Vector3 | undefined;
    rotation?: THREE.Euler | undefined;
    size?: number | undefined;
    color?: THREE.Color | undefined;
}

export default class Text {
    private string: string;
    public mesh: THREE.Mesh;
    private material: THREE.MeshBasicMaterial;
    private geometry: TextGeometry;
    private font: any;
    private scene: THREE.Scene;
    private position: THREE.Vector3;
    private rotation: THREE.Euler;
    private size: number;
    private color: THREE.Color;

    constructor(params: TextParameters) {
        this.font = params.font;
        this.scene = params.scene;
        this.string = params.text || '';
        this.color = params.color || new THREE.Color(0x000000);
        this.position = params.position || new THREE.Vector3(0, 0, 0);
        this.rotation = params.rotation || new THREE.Euler(0, 0, 0);
        this.size = params.size || 10;
        this.geometry = new TextGeometry(
            this.string,
            {
                font: this.font,
                size: this.size,
                height: 1,
                curveSegments: 10,
                // bevelEnabled: true,
                bevelThickness: 0.3,
                bevelSize: 0.2,
                bevelOffset: 0,
                bevelSegments: 1
            }
        )
        this.geometry.center();
        this.material = new THREE.MeshBasicMaterial({ color: this.color })
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        this.mesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
        this.scene.add(this.mesh)
    };

    setText(text: string) {
        this.geometry = new TextGeometry(
            text,
            {
                font: this.font,
                size: 10,
                height: 1,
                curveSegments: 10,
                // bevelEnabled: true,
                bevelThickness: 0.3,
                bevelSize: 0.2,
                bevelOffset: 0,
                bevelSegments: 1
            }
        )
        this.geometry.center();
        this.mesh.geometry = this.geometry;
    };

    setPosition(pos: THREE.Vector3) {
        this.mesh.position.set(pos.x, pos.y, pos.z);
    };

    setRotation(euler: THREE.Euler) {
        this.mesh.rotation.set(euler.x, euler.y, euler.z);
    };

    setColor(color: THREE.Color) {
        this.material.color = color;
    };

    setScale(x: number, y: number, z: number) {
        this.mesh.scale.set(x, y, z);
    }

    setSize(size: number) {
        this.geometry = new TextGeometry(
            this.string,
            {
                font: this.font,
                size: size,
                height: 1,
                curveSegments: 10,
                // bevelEnabled: true,
                bevelThickness: 0.3,
                bevelSize: 0.2,
                bevelOffset: 0,
                bevelSegments: 1
            }
        )
        this.mesh.geometry = this.geometry;
    }

    setVisibility(visible: boolean) {
        this.mesh.visible = visible;
    };
}
