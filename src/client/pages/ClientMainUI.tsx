// Этот файл нужно переделать после того как тесты станут зелеными, забрав правила работы с UI моделями из тестов.

import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { observer } from "mobx-react-lite";
import { ClientMainObject } from "../domains_gen/index.js";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import {maybeValue} from "ystd";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        gridContainer: {
            display: "grid",
            gridTemplateAreas: `
            "header header"
            "sideBar editor"
            `,

            gridTemplateColumns: "1fr 3fr",
            gridTemplateRows: "64px 1fr",
            width: "100%",
            height: "100%",
        },
        projects: {},
        fileTree: {},
        header: {
            gridArea: "header",
        },
        sideBar: {
            gridArea: "sideBar",
            display: "flex",
            flexDirection: "column",
        },
        editor: {
            width: "100%",
            height: "100%",
            gridArea: "editor",
        },
        editor2: {
            width: "100%",
            height: "100%",
        },
        root: {
            flexGrow: 1,
            width: "100%",
            height: "100%",
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
        button: {},
        list: {
            width: 250,
        },
    }),
);

export const ClientMainUI: React.FC<{ clientMain: ClientMainObject }> = observer(function ClientMainUI({ clientMain }: { clientMain: ClientMainObject }) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <div className={classes.gridContainer}>
                <AppBar className={classes.header} onClick={clientMain.drawerOpen.toggler()} position="static">
                    <Toolbar>
                        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                        {/*<Typography variant="h6" className={classes.title}>*/}
                        {/*TODO*/}
                        {/*</Typography>*/}
                        <Button
                            color="inherit"
                            onClick={() => {
                                console.log("clientMain.sendAuthExit");
                            }}
                        >
                            Logout
                        </Button>
                    </Toolbar>
                </AppBar>
                <div className={classes.sideBar}>
                    <div>Side bar</div>
                </div>
                <div className={classes.editor}>
                    <Paper className={classes.editor2}>
                        <Typography>Editor will be here</Typography>
                    </Paper>
                </div>
            </div>

            <Drawer open={maybeValue(clientMain.drawerOpen.get())} onClose={clientMain.drawerOpen.toggler()}>
                <div
                    className={classes.list}
                    role="presentation"
                    onClick={clientMain.drawerOpen.toggler()}
                    onKeyDown={clientMain.drawerOpen.toggler()}
                >
                    <List>
                        <ListItem button key={"item0"} onClick={clientMain.projectsDialog.toggler()}>
                            <ListItemIcon>
                                <MailIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Select project"} />
                        </ListItem>
                        <ListItem button key={"item1"}>
                            <ListItemIcon>
                                <MailIcon />
                            </ListItemIcon>
                            <ListItemText primary={"item1"} />
                        </ListItem>
                        <ListItem button key={"item2"}>
                            <ListItemIcon>
                                <InboxIcon />
                            </ListItemIcon>
                            <ListItemText primary={"item2"} />
                        </ListItem>
                    </List>
                    {/*<Divider />*/}
                </div>
            </Drawer>
        </div>
    );
});

// <span>sessionId = {clientMain?.session?.id}</span>
// <span>ts = {clientMain?.ts}</span>
// <Button className={classes.button}>
// Default button
// </Button>

// @ts-ignore
if (module.hot) {
    // @ts-ignore
    module.hot.accept();
}
