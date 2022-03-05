export type GraphvizNodeId = string;
export interface GraphvizRel {
    from: GraphvizNodeId;
    to: GraphvizNodeId;
}

export function graphvizRenderRel({ from, to }: GraphvizRel) {
    return `    n${from} -> n${to};`;
}

export interface GraphvizNode {
    yid: GraphvizNodeId;
    id?: string;
    name?: string;
    label?: string;
    shape?: GraphvizNodeShape;
    color?: string;
}

export function graphvizRenderNode({ yid, id, name, label, shape, color }: GraphvizNode) {
    return `    n${yid} [label="${label || name || id || yid}", shape="${shape || "box"}" style="filled,solid" color="#${color || "ffffff"}"];`;
}

export interface GraphvizGraph {
    rels: GraphvizRel[];
    nodes: GraphvizNode[];
}

export function graphvizRenderGraph({ rels, nodes }: GraphvizGraph) {
    return `
digraph tasks {
    rankdir=LR;
    size="30,9";
    node [color=lightgray, style=filled, fontname=Arial, colorscheme=pastel28];
${rels.map(graphvizRenderRel).join("\n")}

${nodes.map(graphvizRenderNode).join("\n")}
}
`;
}

export type GraphvizNodeShape =
    | "box"
    | "polygon"
    | "ellipse"
    | "oval"
    | "circle"
    | "point"
    | "egg"
    | "triangle"
    | "plaintext"
    | "plain"
    | "diamond"
    | "trapezium"
    | "parallelogram"
    | "house"
    | "pentagon"
    | "hexagon"
    | "septagon"
    | "octagon"
    | "doublecircle"
    | "doubleoctagon"
    | "tripleoctagon"
    | "invtriangle"
    | "invtrapezium"
    | "invhouse"
    | "Mdiamond"
    | "Msquare"
    | "Mcircle"
    | "rect"
    | "rectangle"
    | "square"
    | "star"
    | "none"
    | "underline"
    | "cylinder"
    | "note"
    | "tab"
    | "folder"
    | "box3d"
    | "component"
    | "promoter"
    | "cds"
    | "terminator"
    | "utr"
    | "primersite"
    | "restrictionsite"
    | "fivepoverhang"
    | "threepoverhang"
    | "noverhang"
    | "assembly"
    | "signature"
    | "insulator"
    | "ribosite"
    | "rnastab"
    | "proteasesite"
    | "proteinstab"
    | "rpromoter"
    | "rarrow"
    | "larrow"
    | "lpromoter";
