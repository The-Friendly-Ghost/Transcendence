import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { Font } from 'three/examples/jsm/loaders/FontLoader.js';

export default class Text {
    private string: string;
    private mesh: THREE.Mesh;
    private material: THREE.MeshBasicMaterial;
    private geometry: TextGeometry;
    private font: any;
    private scene: THREE.Scene;
    private position: THREE.Vector3;
    private rotation: THREE.Euler;
    private size: number;
    private color: THREE.Color;

    constructor(font: Font, scene: THREE.Scene, text?: string, color?: THREE.Color, position?: THREE.Vector3, rotation?: THREE.Euler, size?: number) {
        this.position = position || new THREE.Vector3(0, 0, 0);
        this.rotation = rotation || new THREE.Euler(0, 0, 0);
        this.string = text || '';
        this.color = color || new THREE.Color(0x000000);
        this.size = size || 10;
        this.font = font;
        this.scene = scene;
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
        this.material = new THREE.MeshBasicMaterial()
        this.mesh = new THREE.Mesh(this.geometry, this.material)
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
