import { Card, CardHeader, CardText } from 'material-ui/Card';

import Event from "./Event";

import {
    Table,
    TableHeader,
    TableRow,
    TableHeaderColumn,
    TableBody
} from 'material-ui/Table';

export default ({
events
}) => {
    const style = {
        card: {
            marginTop: 10
        },
        label: {
            fontWeight: "bold",
            fontSize: 18
        },
        tableHeader: {
            background: "#f1ebeb"
        },
        tableHeaderColumn: {
            fontSize: 18,
            color: "black",
            fontWeight: "bold"
        }
    }

    return <Card style={style.card}>
        <CardHeader><label style={style.label}>Events log</label></CardHeader>
        <CardText>
            <Table>
                <TableHeader displaySelectAll={false}
                    style={style.tableHeader}
                    adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn style={style.tableHeaderColumn}>Time
            </TableHeaderColumn>
                        <TableHeaderColumn style={style.tableHeaderColumn}>Event
            </TableHeaderColumn>
                        <TableHeaderColumn style={style.tableHeaderColumn}>Filename
            </TableHeaderColumn>
            </TableRow>
            
 
        </TableHeader>

        <TableBody>
            {
                events.map(event => (<Event event={event} key={event.uid} />))
            }
        </TableBody>
</Table>
        </CardText>
    </Card>
}