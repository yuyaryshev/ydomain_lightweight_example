export {};
/*
import React from "react";
import { PureComponent } from "HastyTBDClient";
import { TextField } from "../components/TextField.js";
import { withSnackbar } from "notistack";
import Button from "@material-ui/core/Button";
import { ListUi } from "../../../HastyTBD.js";
import { domains } from "../../domains/index.js";
import { DbgBorder } from "../components/DbgBorder.js";
import { YListItem } from "../components/YListItem.js";

// <Menu binding={this.props.binding}/>

const dbgf = (a) => {
    return a.name();
};

class VariousTests0 extends PureComponent<any, any> {
    constructor(props: any) {
        super(props);
        this.onClickTest = () => {
            this.props.enqueueSnackbar("Тест Snackbar", { variant: "warning" });
        };

        this.listUi = new ListUi({ listController: domains.TestDomain.all });
    }

    boundRender() {
        let ver = 3;
        let x = `Version ${ver} `;
        return (
            <div>
                <div>
                    {x} <br />
                    {this.props.binding.testBinding()} <br />
                    Empty project started. React loaded. See TODO.txt for customization plan.
                </div>
                <TextField binding={this.props.binding.textField1} />
                <Button variant="contained" color="primary" onClick={this.onClickTest}>
                    Hello World2
                </Button>

                <input type="text" name="name" />
                <div>
                    ListUi(TestDomain.all):
                    {this.listUi.getData().map((a) => (
                        <li key={a.id}>
                            ({a.id}) - {dbgf(a)}
                        </li>
                    ))}
                </div>

                <DbgBorder>
                    YListItem:
                    <YListItem binding={window.store.testObject1}></YListItem>
                </DbgBorder>
            </div>

            // TODO BREAKING_CODE Раскомментить и поместить выше для падения
            //                 <div>
            //                     ListUi(TestDomain.all):
            //                     {this.listUi.data.map(a => <li key={a.id}>({a.id}) - {dbgf(a)}</li>)}
            //                 </div>
        );
    }
}
//

export const VariousTests = withSnackbar(VariousTests0);

if (module.hot) {
    module.hot.accept();
    //       console.log('Accepting the updated printMe module!');
}
*/
