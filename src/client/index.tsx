import { clientEnv, makeClientEnv } from "./ClientEnv.js";
import React from "react";
import { render } from "react-dom";
//import {ClientMainUI} from "./pages/ClientMainUI.js";
import { App } from "./App.js";
import { SnackbarProvider } from "notistack";
import { ClientMainDomain } from "./domains_gen/index.js";

const useHotReloading = true;

//import {ReactToolboxTest} from "./pages/react_toolbox";

let AbstractIndex: any = App; //useHotReloading ? hot(ClientMainUI) : ClientMainUI;

(async () => {
    let root = document.querySelector("#root");
    if (!root) {
        root = document.createElement("div");
        root.id = "root";
        document.body.appendChild(root);
    }

    const env = await makeClientEnv(4440);
    const clientMain = await ClientMainDomain.getOrCreateEx(env.objectRoot, "a73e24f0-c68b-47e4-bbcb-92585e04c653:singleton");

    await clientMain.a.set(`CODE07000001 Wow! Something is printed here! But it doesn't re-render... :-( `);
    console.log("clientMain - initialized", { cpl: "CODE07000002", "clientMain.a.get()": clientMain.a.get() });

    setInterval(async () => {
        await clientMain.a.set(`CODE07000003 Wow! This: ${new Date().toISOString().slice(-3, -1)} - re-renders! `);
    }, 200);

    // setInterval(async () => {
    //     console.log("clientMain - updated - 1", { cpl: "CODE07000002", "clientMain.a.get()": clientMain.a.get() });
    // }, 2000);

    render(
        <SnackbarProvider
            maxSnack={3}
            autoHideDuration={3000}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            transitionDuration={{ exit: 50, enter: 50 }}
        >
            <AbstractIndex clientMain={clientMain} />
        </SnackbarProvider>,
        root,
    );
})();

// @ts-ignore
if (module.hot) {
    // @ts-ignore
    module.hot.accept();
}

// import React from 'react'
// import ReactDOM from 'react-dom'
// //import './index.css'
// import {App} from "./App.js"
//
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// )
