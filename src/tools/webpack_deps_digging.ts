// cls & webpack --mode development --config webpack.frontend.config.cjs --profile --stats --json >deps_webpack.json
import { readFileSync, outputFileSync } from "fs-extra";
import { spawnSync } from "child_process";
import { GraphvizNode, GraphvizRel, graphvizRenderGraph } from "./graphviz.js";

const root_prefix = `../../../`;
const deps_webpack_str = readFileSync(root_prefix + "deps_webpack.json", "utf-8");
const deps_webpack = JSON.parse(deps_webpack_str);

let lastYid = 0;
const moduleById = new Map();
for (const m of deps_webpack.modules) {
    m.yid = ++lastYid;
    moduleById.set(m.id, m);
}

for (const m of deps_webpack.modules) {
    if (m.reasons) {
        m.reasons = new Set(m.reasons.map((reason: any) => moduleById.get(reason.moduleId)));
        for (const reason of m.reasons) {
            if (!reason.deps) {
                reason.deps = new Set();
            }
            reason.deps.add(m);
        }
    }
}

const modulesToDelete = new Set();
for (const m of deps_webpack.modules) {
    if ((m.id || m.name).endsWith(`node_modules/dom-helpers/esm/hasClass.js`)) modulesToDelete.add(m);
}

for (const m of deps_webpack.modules) {
    if ((m?.deps?.size || 0) + [...(m.reasons || [])].filter((r) => !modulesToDelete.has(r)).length < 1) {
        modulesToDelete.add(m);
    }
}

/// Deleting dublicates and modulesToDelete
const modules = new Set<any>(deps_webpack.modules);
function findModules(s: string) {
    let results = [];
    for (const m of modules) {
        const aid = m.id || m.name || "";
        if (aid.includes(s)) {
            results.push(m);
        }
    }
    return results;
}

for (const dm of modulesToDelete) {
    modules.delete(dm);
}

for (const m of deps_webpack.modules) {
    if (m.reasons) {
        m.reasons.delete(m);
        for (const dm of modulesToDelete) {
            m.reasons.delete(dm);
        }
    }

    if (m.deps) {
        m.deps.delete(m);
        for (const dm of modulesToDelete) {
            m.deps.delete(dm);
        }
    }
}

///////////////////////////
const rels: GraphvizRel[] = [];
const nodes: GraphvizNode[] = [];

for (const m of modules) {
    const { yid, id, name, size, deps } = m;
    const kb = Math.round(size / 1024);
    const label = `${kb > 0 ? ` ${kb}kb` : ""} ${id || name}`;
    nodes.push({ yid, label });
    if (deps) {
        for (const dep of deps) {
            rels.push({ from: yid, to: dep.yid });
        }
    }
}

const deps_webpack_dot_str = graphvizRenderGraph({ rels, nodes });
const fileName = "deps_webpack";
outputFileSync(root_prefix + `${fileName}.dot`, deps_webpack_dot_str, "utf-8");
//spawnSync("cmd", ["/c", "graph_viz.bat"]);
const dotPath = `"d:/ProgsReady/Graphviz/bin/dot.exe"`;
const cmdArgs = ["-Tpdf", `${fileName}.dot`, "-o", `${fileName}.pdf`];
//const fullCmd = `${dotPath} ${cmdArgs.join(" ")}`;
const fullCmd = `${dotPath} ${cmdArgs.join(" ")} && ${fileName}.pdf`;
console.log(fullCmd);
console.log("FINISHED");
