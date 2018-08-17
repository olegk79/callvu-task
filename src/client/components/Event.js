import {
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import moment from "moment";

import { Component } from "react";

import EVENTS from "./events";

const getEventDesc = (event) => {
    switch (event.event_id) {
        case EVENTS.FILE_ADDED:
            return "File added";
        case EVENTS.FILE_REMOVED:
            return "File removed";
        default:
            return "N/A";

    }
}

export default ({ event }) => {
    return <TableRow>
        <TableRowColumn>{moment(event.timestamp).format("DD/MM/YYYY HH:mm:ss.SSS")}
        </TableRowColumn>
        <TableRowColumn>{getEventDesc(event)}
        </TableRowColumn>
        <TableRowColumn>{event.filename}
        </TableRowColumn>
    </TableRow>
}

Component.muiName = "TableRow";