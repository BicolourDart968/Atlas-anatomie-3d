// Génère data/attach.json : pour chaque muscle (id « Nom.l » / « Nom.r »), le centre de ses surfaces d'origine
// et de terminaison, tirées de la couche Insertions, avec leur rayon (écart quadratique moyen au centre) :
// [ox, oy, oz, or, ex, ey, ez, er], null pour une attache absente.
// L'app s'en sert pour orienter les fibres : de l'origine vers la terminaison, en éventail vers l'attache la plus étroite.
// Usage : node outils/attaches.cjs
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const Draco = require(path.join(root, 'draco/draco_decoder.js'));

function trs(n) {
  const [x, y, z, w] = n.rotation || [0, 0, 0, 1], [sx, sy, sz] = n.scale || [1, 1, 1], t = n.translation || [0, 0, 0];
  const m = [1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w), 2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w), 2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)];
  return p => [0, 1, 2].map(r => m[r * 3] * p[0] * sx + m[r * 3 + 1] * p[1] * sy + m[r * 3 + 2] * p[2] * sz + t[r]);
}
Draco().then(D => {
  const j = JSON.parse(fs.readFileSync(path.join(root, 'models/insertions.json'), 'utf8')), b = Buffer.from(j.glb, 'base64');
  const jl = b.readUInt32LE(12), g = JSON.parse(b.subarray(20, 20 + jl).toString()), bin = b.subarray(20 + jl + 8);
  const patches = {};
  for (const n of g.nodes) {
    if (n.mesh == null) continue;
    const prim = g.meshes[n.mesh].primitives[0], ext = prim.extensions.KHR_draco_mesh_compression, bv = g.bufferViews[ext.bufferView];
    const buf = new D.DecoderBuffer(), dec = new D.Decoder(), mesh = new D.Mesh(), raw = bin.subarray(bv.byteOffset || 0, (bv.byteOffset || 0) + bv.byteLength);
    buf.Init(new Int8Array(raw.buffer, raw.byteOffset, raw.byteLength), raw.byteLength);
    if (!dec.DecodeBufferToMesh(buf, mesh).ok()) throw new Error('draco ' + n.name);
    const attr = dec.GetAttributeByUniqueId(mesh, ext.attributes.POSITION), arr = new D.DracoFloat32Array();
    dec.GetAttributeFloatForAllPoints(mesh, attr, arr);
    const f = trs(n), step = Math.max(1, Math.floor(arr.size() / 3 / 3000)), pts = [];
    for (let i = 0; i < arr.size() / 3; i += step) pts.push(f([arr.GetValue(i * 3), arr.GetValue(i * 3 + 1), arr.GetValue(i * 3 + 2)]));
    D.destroy(arr); D.destroy(mesh); D.destroy(dec); D.destroy(buf);
    const m = n.name.match(/^(.*)\.([oe])\d*([lr])$/);
    if (!m) continue;
    const key = m[1] + '.' + m[3];
    ((patches[key] ||= { o: [], e: [] })[m[2]]).push(...pts);
  }
  const mid = p => {
    if (!p.length) return [null, null, null, null];
    const c = [0, 1, 2].map(i => p.reduce((t, q) => t + q[i], 0) / p.length);
    return [...c, Math.sqrt(p.reduce((t, q) => t + (q[0] - c[0]) ** 2 + (q[1] - c[1]) ** 2 + (q[2] - c[2]) ** 2, 0) / p.length)].map(v => Math.round(v * 1e4) / 1e4);
  };
  const out = {};
  for (const [k, v] of Object.entries(patches)) out[k] = [...mid(v.o), ...mid(v.e)];
  fs.writeFileSync(path.join(root, 'data/attach.json'), JSON.stringify(out));
  console.log(Object.keys(out).length, 'muscles,', fs.statSync(path.join(root, 'data/attach.json')).size, 'octets');
  for (const k of ['Gluteus maximus muscle.l', 'Ascending part of trapezius muscle.l', 'Descending part of trapezius muscle.l', 'Pectoralis major muscle.l', 'Sternocostal head of pectoralis major muscle.l', 'Latissimus dorsi muscle.l', 'Deltoid muscle.l', 'Temporalis muscle.l', 'Gluteus medius muscle.l']) console.log(k, JSON.stringify(out[k]));
});
