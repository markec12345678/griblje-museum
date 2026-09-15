/**
 * make-church-model.ts — proceduralni, stilizirani (interpretativni) 3D model
 * Cerkve sv. Vida v Gribljah (Bela krajina, Slovenija).
 *
 * Enota kulturne dediščine, registra KD št. 2122 (500-letnica 1526–2026).
 * Zasnovan po opisu: baročna podoba 18. st., zvonik nad zahodnim pročeljem,
 * cerkev stoji na najvišji točki vasi. NI fotogrametrija — muzejska maketa
 * (nizko-poligonska, "voskana" estetika, brez tekstur).
 *
 * Izhod: public/models/cerkev-sv-vida.glb (three.js GLTFExporter, binarni)
 *        public/models/cerkev-sv-vida.usdz (three.js USDZExporter, AR Quick Look / iOS)
 *
 * Orientacija: pročelje + zvonik na zahodu (−X), prezbiterij na vzhodu (+X),
 * jug = +Z, sever = −Z. Model stoji na y = 0 (ploscad), središče (0, 0, 0).
 * Skript je determinističen — ponovni zagon da bajtno-identične izvoze.
 *
 * Zagon: bun scripts/make-church-model.ts
 */

import { mkdirSync, statSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { USDZExporter } from "three/examples/jsm/exporters/USDZExporter.js";

/* ------------------------------------------------------------------------- *
 * 0. Polyfill FileReader za Bun (GLTFExporter ga potrebuje za binarni GLB).
 *    Bun ima Blob, nima FileReader-ja — implementiramo le branko, ki jo
 *    izvoznik dejansko uporablja (readAsArrayBuffer + onloadend + result).
 * ------------------------------------------------------------------------- */

class FileReaderShim {
  result: ArrayBuffer | string | null = null;
  onloadend: (() => void) | null = null;
  onerror: (() => void) | null = null;

  async readAsArrayBuffer(blob: Blob): Promise<void> {
    try {
      this.result = await blob.arrayBuffer();
    } catch (err) {
      this.onerror?.();
      throw err;
    }
    this.onloadend?.();
  }

  async readAsDataURL(blob: Blob): Promise<void> {
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    this.result = "data:application/octet-stream;base64," + btoa(binary);
    this.onloadend?.();
  }
}

const globals = globalThis as { FileReader?: unknown; Date?: unknown };
if (typeof globals.FileReader === "undefined") {
  globals.FileReader = FileReaderShim;
}
/* ------------------------------------------------------------------------- *
 * 1. Deterministični "zamrznjeni" Datum za USDZ (zip sicer shrani trenutni
 *    čas v metapodatke ⇒ ne-identični bajti). Med izvozom USDZ datum fiksiramo
 *    na 2010-01-01T00:00:00Z, da je arhiv bajtno-ponovljiv.
 * ------------------------------------------------------------------------- */

const REAL_DATE = Date;
const FROZEN_EPOCH_MS = 1262304000000; // 2010-01-01T00:00:00Z

class FrozenDate extends REAL_DATE {
  constructor(...args: unknown[]) {
    if (args.length === 0) {
      super(FROZEN_EPOCH_MS);
    } else {
      super(args[0] as number | string | Date);
    }
  }
}

async function withFrozenDate<T>(fn: () => Promise<T>): Promise<T> {
  globals.Date = FrozenDate;
  try {
    return await fn();
  } finally {
    globals.Date = REAL_DATE;
  }
}

/* ------------------------------------------------------------------------- *
 * 2. Materiali (MeshStandardMaterial, flatShading — low-poly maketa).
 *    Barvna paleta po specifikaciji; brez tekstur ⇒ majhen GLB.
 * ------------------------------------------------------------------------- */

const materials = {
  stene: new THREE.MeshStandardMaterial({
    name: "stene-apno", // bela apnena belina
    color: 0xf2ead8,
    roughness: 0.9,
    metalness: 0.02,
    flatShading: true,
  }),
  streha: new THREE.MeshStandardMaterial({
    name: "streha-kritina", // temno rdeča glinena kritina
    color: 0x7d2f1f,
    roughness: 0.75,
    metalness: 0.03,
    flatShading: true,
  }),
  kamen: new THREE.MeshStandardMaterial({
    name: "kamen-ploscad", // svetlo siva kamnita ploščad
    color: 0xa8a094,
    roughness: 0.95,
    metalness: 0.0,
    flatShading: true,
  }),
  les: new THREE.MeshStandardMaterial({
    name: "les-vrata", // hrastova vrata
    color: 0x3f2d1e,
    roughness: 0.85,
    metalness: 0.0,
    flatShading: true,
  }),
  kriz: new THREE.MeshStandardMaterial({
    name: "kovina-kriz", // zlato-rjava kovina
    color: 0xc9a227,
    roughness: 0.35,
    metalness: 0.65,
    flatShading: true,
  }),
  okna: new THREE.MeshStandardMaterial({
    name: "steklo-okna", // temno sivo-modra stekla / globine odprtin
    color: 0x2e3a45,
    roughness: 0.4,
    metalness: 0.1,
    flatShading: true,
  }),
};

/* ------------------------------------------------------------------------- *
 * 3. Geometrijski pripomočki — vse normale so "pečene" ravninske
 *    (toNonIndexed + computeVertexNormals), da low-poly facetirano obliko
 *    vidimo tako v GLB kot v USDZ (AR na iOS ne pozna flatShading zastavice).
 * ------------------------------------------------------------------------- */

function flatGeometry(geometry: THREE.BufferGeometry): THREE.BufferGeometry {
  const nonIndexed = geometry.index ? geometry.toNonIndexed() : geometry;
  nonIndexed.computeVertexNormals();
  return nonIndexed;
}

function mesh(
  name: string,
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
): THREE.Mesh {
  const m = new THREE.Mesh(flatGeometry(geometry), material);
  m.name = name;
  return m;
}

/** Zaboj, položen na podano pozicijo. */
function boxMesh(
  name: string,
  sizeX: number,
  sizeY: number,
  sizeZ: number,
  position: [number, number, number],
  material: THREE.Material,
): THREE.Mesh {
  const m = mesh(name, new THREE.BoxGeometry(sizeX, sizeY, sizeZ), material);
  m.position.set(...position);
  return m;
}

/**
 * Zatrep (triangularna prizma, barva stene): zapira čelni steni pod dvokapnico.
 * Dolžina po X, trikotni presek v ravnini Y-Z.
 */
function gablePrismGeometry(spanZ: number, riseY: number, lengthX: number): THREE.BufferGeometry {
  const hw = spanZ / 2;
  const lx = lengthX / 2;
  const a1 = [-lx, 0, -hw];
  const b1 = [-lx, 0, hw];
  const c1 = [-lx, riseY, 0];
  const a2 = [lx, 0, -hw];
  const b2 = [lx, 0, hw];
  const c2 = [lx, riseY, 0];
  // trikotniki (navorni red = navzven): 2 čelni + 2 pobočji + dno
  const triangles = [
    a1, b1, c1, // zahodni zatrep (−X)
    a2, c2, b2, // vzhodni zatrep (+X)
    b1, b2, c2, b1, c2, c1, // južno pobočje (+Z)
    a2, a1, c1, a2, c1, c2, // severno pobočje (−Z)
    b1, a1, a2, b1, a2, b2, // dno
  ];
  const positions = new Float32Array(triangles.length * 3);
  triangles.forEach((vertex, i) => positions.set(vertex, i * 3));
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Eno pobočje dvokapnice: zaboj, nagnjen za kot strehe, z napučaji
 * (overhang) na spodnjem robu in majhnim prekrivanjem pri slemenu (ridge).
 * sign = +1 (jug/+Z) | −1 (sever/−Z).
 */
function roofSlopeMesh(
  name: string,
  opts: {
    sign: 1 | -1;
    ridgeY: number;
    eavesZ: number;
    angleRad: number;
    lengthX: number;
    centerX: number;
    thickness: number;
    ridgeExt: number;
    material: THREE.Material;
  },
): THREE.Mesh {
  const { sign, ridgeY, eavesZ, angleRad, lengthX, centerX, thickness, ridgeExt, material } = opts;
  const eavesY = ridgeY - eavesZ * Math.tan(angleRad);
  const slopeLen = eavesZ / Math.cos(angleRad) + ridgeExt;
  // središče med slemenom in napučajem, pomaknjeno navzven za pol debeline
  const midY = (ridgeY + eavesY) / 2;
  const midZ = (sign * eavesZ) / 2;
  const cy = midY + Math.sin(angleRad) * (ridgeExt / 2) + Math.cos(angleRad) * (thickness / 2);
  const cz = midZ - sign * Math.cos(angleRad) * (ridgeExt / 2) + sign * Math.sin(angleRad) * (thickness / 2);
  const m = mesh(name, new THREE.BoxGeometry(lengthX, thickness, slopeLen), material);
  m.position.set(centerX, cy, cz);
  m.rotation.x = sign * angleRad;
  return m;
}

/* ------------------------------------------------------------------------- *
 * 4. Gradnja modela (vsi merilni podatki v metrih)
 * ------------------------------------------------------------------------- */

const ANGLE = 35 * (Math.PI / 180); // naklon obeh dvokapnic

// — ploščad (kamnita podloga, "travnik/kamen") —
const PLINTH_TOP = 0.35;
const SINK = 0.01; // spodnji rob objektov 1 cm v ploščad (brez sovpadajočih ravnin)
const BASE_Y = PLINTH_TOP - SINK;

// — ladja: 9 × 5 m, stene 4 m —
const NAVE_LEN = 9;
const NAVE_W = 5;
const NAVE_H = 4;
const NAVE_X0 = -6.5; // zahodna fasada
const NAVE_X1 = NAVE_X0 + NAVE_LEN; // 2.5 — stik s prezbiterijem
const NAVE_TOP = BASE_Y + NAVE_H; // ≈ 4.34
const NAVE_RISE = (NAVE_W / 2) * Math.tan(ANGLE); // dvig strehe ladje

// — prezbiterij: 4 × 3.6 m, stene 3.5 m (5 cm vraščen v ladjo) —
const SAN_LEN = 4.05;
const SAN_W = 3.6;
const SAN_H = 3.5;
const SAN_X1 = 6.5;
const SAN_X0 = SAN_X1 - SAN_LEN; // 2.45
const SAN_TOP = BASE_Y + SAN_H; // ≈ 3.84
const SAN_RISE = (SAN_W / 2) * Math.tan(ANGLE);

// — zvonik: kvader 3 × 3 m nad pročeljem, 4 cm ponujen pred fasado —
const TOWER_W = 3;
const TOWER_PROUD = 0.04;
const TOWER_X0 = NAVE_X0 - TOWER_PROUD; // −6.54
const TOWER_X1 = TOWER_X0 + TOWER_W; // −3.54
const TOWER_CX = (TOWER_X0 + TOWER_X1) / 2;
const TOWER_TOP = 8.8; // vrh kvadra zvonika

function buildChurch(): THREE.Group {
  const church = new THREE.Group();
  church.name = "cerkev-sv-vida";

  // Kamnita ploščad 14 × 6.5 × 0.35 m — podloga makete
  church.add(boxMesh("ploscad", 14, PLINTH_TOP, 6.5, [0, PLINTH_TOP / 2, 0], materials.kamen));

  // ---------------- LADJA ----------------
  const ladja = new THREE.Group();
  ladja.name = "ladja";

  ladja.add(
    boxMesh("stene-ladje", NAVE_LEN, NAVE_H + SINK, NAVE_W, [
      (NAVE_X0 + NAVE_X1) / 2,
      NAVE_TOP - (NAVE_H + SINK) / 2,
      0,
    ], materials.stene),
  );

  // zatrep ladje (zapira čelni steni; zahodni del stoji za zvonikom)
  const zatrepLadje = mesh(
    "zatrep-ladje",
    gablePrismGeometry(NAVE_W, NAVE_RISE, NAVE_LEN),
    materials.stene,
  );
  zatrepLadje.position.set((NAVE_X0 + NAVE_X1) / 2, NAVE_TOP, 0);
  ladja.add(zatrepLadje);

  // dvokapnica ladje — temno rdeča glinena kritina, kot 35°
  const strehaLadje = new THREE.Group();
  strehaLadje.name = "streha-ladje";
  const naveRoof = {
    ridgeY: NAVE_TOP + NAVE_RISE,
    eavesZ: NAVE_W / 2 + 0.18,
    angleRad: ANGLE,
    lengthX: 9.14, // zahodni rob 6 cm za fasado (v zvoniku), vzhodni napučaj 0.2 m
    centerX: (NAVE_X0 + 0.06 + (NAVE_X1 + 0.2)) / 2,
    thickness: 0.14,
    ridgeExt: 0.16,
  };
  strehaLadje.add(roofSlopeMesh("streha-ladje-jug", { ...naveRoof, sign: 1, material: materials.streha }));
  strehaLadje.add(roofSlopeMesh("streha-ladje-sever", { ...naveRoof, sign: -1, material: materials.streha }));
  ladja.add(strehaLadje);

  // okna ladje: 2 južna + 2 severna, temno sivo-modra vdolbljena stekla
  const oknaLadje = new THREE.Group();
  oknaLadje.name = "okna-ladje";
  for (const [index, wx] of [-2.1, 1.1].entries()) {
    const suffix = index === 0 ? "1" : "2";
    oknaLadje.add(boxMesh(`okno-ladja-jug-${suffix}`, 0.72, 1.15, 0.09, [wx, 2.6, 2.515], materials.okna));
    oknaLadje.add(boxMesh(`okno-ladja-sever-${suffix}`, 0.72, 1.15, 0.09, [wx, 2.6, -2.515], materials.okna));
  }
  ladja.add(oknaLadje);

  church.add(ladja);

  // ---------------- PREZBITERIJ ----------------
  const prezbiterij = new THREE.Group();
  prezbiterij.name = "prezbiterij";

  prezbiterij.add(
    boxMesh("stene-prezbiterija", SAN_LEN, SAN_H + SINK, SAN_W, [
      (SAN_X0 + SAN_X1) / 2,
      SAN_TOP - (SAN_H + SINK) / 2,
      0,
    ], materials.stene),
  );

  const zatrepPrezbiterija = mesh(
    "zatrep-prezbiterija",
    gablePrismGeometry(SAN_W, SAN_RISE, SAN_LEN),
    materials.stene,
  );
  zatrepPrezbiterija.position.set((SAN_X0 + SAN_X1) / 2, SAN_TOP, 0);
  prezbiterij.add(zatrepPrezbiterija);

  const sanRoof = {
    ridgeY: SAN_TOP + SAN_RISE,
    eavesZ: SAN_W / 2 + 0.16,
    angleRad: ANGLE,
    lengthX: SAN_LEN + 0.36,
    centerX: SAN_X1 - SAN_LEN / 2 + 0.02,
    thickness: 0.12,
    ridgeExt: 0.14,
  };
  prezbiterij.add(
    roofSlopeMesh("streha-prezbiterija-jug", { ...sanRoof, sign: 1, material: materials.streha }),
  );
  prezbiterij.add(
    roofSlopeMesh("streha-prezbiterija-sever", { ...sanRoof, sign: -1, material: materials.streha }),
  );

  church.add(prezbiterij);

  // ---------------- ZVONIK ----------------
  const zvonik = new THREE.Group();
  zvonik.name = "zvonik";

  // kvader 3 × 3 m od ploščadi do 8.8 m
  zvonik.add(
    boxMesh("trup-zvonika", TOWER_W, TOWER_TOP - BASE_Y, TOWER_W, [
      TOWER_CX,
      (TOWER_TOP + BASE_Y) / 2,
      0,
    ], materials.stene),
  );

  // piramidasta streha: stožec s 4 segmenti (stranica 3.8 m, napučaj 0.4 m)
  const pyramid = mesh(
    "streha-zvonika",
    new THREE.ConeGeometry((TOWER_W + 0.8) / Math.SQRT2, 1.5, 4, 1),
    materials.streha,
  );
  pyramid.position.set(TOWER_CX, TOWER_TOP + 0.75, 0);
  pyramid.rotation.y = Math.PI / 4; // robovi piramide vzporedni s stranicami kvadra
  zvonik.add(pyramid);

  // okroglo rozetno okno na pročelju zvonika (tanko, rotiran valj)
  const rozeta = mesh("rozeta", new THREE.CylinderGeometry(0.42, 0.42, 0.06, 24, 1), materials.okna);
  rozeta.position.set(TOWER_X0 - 0.045, 6.8, 0);
  rozeta.rotation.z = Math.PI / 2; // os valja vzporedna z X
  zvonik.add(rozeta);

  // portal: temna vdolbljena odprtina 1.6 × 2.4 × 0.15 m + lesen dvolist
  // (sprednje ploskve so 1 cm pred pročeljem — brez koplanarnih ravnin)
  const portal = new THREE.Group();
  portal.name = "portal";
  portal.add(boxMesh("portal-odprtina", 0.15, 2.4, 1.6, [TOWER_X0 + 0.065, 1.55, 0], materials.okna));
  portal.add(boxMesh("portal-list-levi", 0.07, 2.2, 0.72, [TOWER_X0 - 0.04, 1.46, -0.375], materials.les));
  portal.add(boxMesh("portal-list-desni", 0.07, 2.2, 0.72, [TOWER_X0 - 0.04, 1.46, 0.375], materials.les));
  zvonik.add(portal);

  // križ na vrhu zvonika — zlato-rjava kovina, skupaj ~0.7 m (vrh ≈ 11 m)
  const kriz = new THREE.Group();
  kriz.name = "kriz";
  const pyramidTip = TOWER_TOP + 1.5; // 10.3
  kriz.add(boxMesh("kriz-navpicen", 0.08, 0.72, 0.08, [TOWER_CX, pyramidTip + 0.36, 0], materials.kriz));
  kriz.add(boxMesh("kriz-vodoraven", 0.08, 0.08, 0.44, [TOWER_CX, pyramidTip + 0.52, 0], materials.kriz));
  zvonik.add(kriz);

  church.add(zvonik);
  return church;
}

/* ------------------------------------------------------------------------- *
 * 5. Izvoz + samopreverba
 * ------------------------------------------------------------------------- */

function countScene(root: THREE.Object3D): { meshes: number; nodes: number; triangles: number } {
  let meshes = 0;
  let nodes = 0;
  let triangles = 0;
  root.traverse((object) => {
    nodes += 1;
    const maybeMesh = object as THREE.Mesh;
    if (maybeMesh.isMesh) {
      meshes += 1;
      const geometry = maybeMesh.geometry as THREE.BufferGeometry;
      triangles += (geometry.index ? geometry.index.count : geometry.attributes.position.count) / 3;
    }
  });
  return { meshes, nodes, triangles };
}

function kb(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function main(): Promise<void> {
  const scriptDir = fileURLToPath(new URL(".", import.meta.url));
  const outDir = resolve(scriptDir, "../public/models");
  mkdirSync(outDir, { recursive: true });

  const model = buildChurch();
  model.updateMatrixWorld(true);

  const stats = countScene(model);
  // precise = true: bbox po dejanskih ogliščih (ne konservativni AABB rotirane geometrije)
  const bbox = new THREE.Box3().setFromObject(model, true);
  const size = bbox.getSize(new THREE.Vector3());

  // — GLB (binarni glTF) —
  const glbBuffer = (await new GLTFExporter().parseAsync(model, {
    binary: true,
  })) as ArrayBuffer;
  const glbPath = resolve(outDir, "cerkev-sv-vida.glb");
  writeFileSync(glbPath, Buffer.from(glbBuffer));

  // — USDZ (AR Quick Look, iOS) — zamrznjen Datum ⇒ bajtno-identičen arhiv
  const usdzBytes = (await withFrozenDate(() => new USDZExporter().parseAsync(model, {}))) as Uint8Array;
  const usdzPath = resolve(outDir, "cerkev-sv-vida.usdz");
  writeFileSync(usdzPath, Buffer.from(usdzBytes));

  // — samopreverba: GLTFLoader naloži GLB in prešteje meše —
  let check = "preskočena";
  try {
    await new Promise<void>((resolvePromise, rejectPromise) => {
      new GLTFLoader().parse(
        glbBuffer,
        "",
        (gltf) => {
          const loaded = countScene(gltf.scene);
          const loadedBox = new THREE.Box3().setFromObject(gltf.scene, true);
          const loadedSize = loadedBox.getSize(new THREE.Vector3());
          check =
            `v redu — ${loaded.meshes} mesh-ov, ${loaded.nodes} vozel, ` +
            `${Math.round(loaded.triangles)} trikotnikov, ` +
            `bbox ${loadedSize.x.toFixed(2)}×${loadedSize.y.toFixed(2)}×${loadedSize.z.toFixed(2)} m`;
          resolvePromise();
        },
        (error) => rejectPromise(error),
      );
    });
  } catch (error) {
    check = `napaka: ${error instanceof Error ? error.message : String(error)}`;
  }

  console.log("Cerkev sv. Vida (Griblje) — proceduralni 3D model");
  console.log("---------------------------------------------------");
  console.log(`GLB   : ${glbPath} (${kb(statSync(glbPath).size)})`);
  console.log(`USDZ  : ${usdzPath} (${kb(statSync(usdzPath).size)})`);
  console.log(`Model : ${stats.meshes} mesh-ov, ${stats.nodes} vozel, ${Math.round(stats.triangles)} trikotnikov`);
  console.log(`BBox  : ${size.x.toFixed(2)} × ${size.y.toFixed(2)} × ${size.z.toFixed(2)} m (vrh na ${bbox.max.y.toFixed(2)} m)`);
  console.log(`Preverba GLTFLoader: ${check}`);
}

await main();
