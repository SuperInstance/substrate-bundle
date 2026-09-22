// substrate-bundle: BUNDLE opcode
// Groups N observations into a named collection. Creates a bundle ID
// that can be referenced as one. Member observations remain individually
// addressable. Additions are append-only.

const { fnv1a64Hex } = require('@superinstance/observation-primitive');

function bundle(name, observationIds, bundler, opts = {}) {
  if (!name) throw new Error('bundle requires name');
  if (!Array.isArray(observationIds) || observationIds.length === 0) {
    throw new Error('bundle requires non-empty observationIds array');
  }
  if (!bundler?.id && typeof bundler !== 'string') {
    throw new Error('bundle requires bundler with id');
  }
  const bundlerId = typeof bundler === 'string' ? bundler : bundler.id;
  const time = Date.now();
  const description = opts.description || null;

  return {
    type: 'bundle',
    id: fnv1a64Hex(JSON.stringify({
      n: name,
      m: observationIds.slice().sort(),
      b: bundlerId,
      t: time,
    })),
    name,
    description,
    members: observationIds,
    bundler: bundlerId,
    time,
    member_count: observationIds.length,
    is_append_only: true, // adding new members is fine; removing isn't
  };
}

module.exports = { bundle };
