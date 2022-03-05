import React, { useEffect, useState } from "react";
import { ClientMainDomain, ClientMainObject } from "./domains_gen/index.js";
import { getCurrentObserver, popCurrentObserver, pushCurrentObserver } from "@yuyaryshev/ydomain_client";
import { makeClientEnv } from "./ClientEnv.js";

export function useObserver() {
    const [v, setV] = useState(0);
    const callUpdate = () => {
        setV(v > 200000000 ? 0 : v + 1);
    };
    pushCurrentObserver(callUpdate);

    const unbindObserver = () => {
        if (getCurrentObserver() !== callUpdate) {
            throw new Error(`CODE00000000 ERROR Observer stack is broken: Expected 'me' to be the last observer, but got some other observer`);
        }

        popCurrentObserver();
    };
    return { callUpdate, unbindObserver };
}

export function App({ clientMain }: { clientMain: ClientMainObject }) {
    const { unbindObserver } = useObserver();
    const v = clientMain.a.get();
    try {
        return (
            <div>
                CODE00000000 Hi there!
                <br />
                {v}
            </div>
        );
    } finally {
        unbindObserver();
    }
}
