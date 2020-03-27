/* @flow */

/*::
import type { WebpackStats, NormalizedWebpackStats } from "./analyze";
*/

module.exports = function normalizeStats(
  stats /*: WebpackStats */
) /*: NormalizedWebpackStats */ {
  let modules = new Map();
  let chunks = {};
  let counter = 0;

  (stats.chunks || []).forEach(chunk => {
    chunks[chunk.id] = {
      id: chunk.id,
      names: chunk.names,
      size: chunk.size
    };

    (chunk.modules || []).forEach(m => {
      modules.set(m.name, m);
    });
  });

  (stats.modules || []).forEach(m => {
    modules.set(m.name, m);
    (m.modules || []).forEach(sm => {
      modules.set(sm.name, { ...sm, chunks: m.chunks });
    });
  });

  (stats.children || []).forEach(child => {
    let normalizedChild = normalizeStats(child);
    chunks = Object.assign({}, { ...chunks, ...normalizedChild.chunks });
    normalizedChild.modules.forEach(m => {
      modules.set(m.name, m);
    });
  });

  return { modules: Array.from(modules.values()), chunks };
};
