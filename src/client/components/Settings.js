import { Card, CardHeader, CardText } from 'material-ui/Card';
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import CircularProgress from "material-ui/CircularProgress";


export default ({
    folder,
    folderInputError,
    onFolderTextChange,
    onStartButtonClick,
    onStopButtonClick,
    monitorInfo,
    isMonitorStatusUpdating
}) => {

    const style = {
        button: {
            margin: 10
        },
        card: {
            marginTop: 30
        },
        statusLabel: {
            marginTop: 5,
            color: "red"
        },
        outerCenteredDiv: {
            margin: "0 auto",
            textAlign: "center",
            width: 300
        },
        loadingProgress: {
            width: 100,
            display: "inline-block"
        }
    };
    return <Card style={style.card}>
       
        <CardText style={style.outerCenteredDiv}>
            <TextField hintText="Enter folder to monitor"
                disabled={monitorInfo.monitoring}
                floatingLabelText="Folder to monitor"
                name="txtFolder"
                value={folder}
                fullWidth={true}
                onChange={onFolderTextChange} /><br />
            {
                isMonitorStatusUpdating ?
                    <div> <CircularProgress style={style.loadingProgress} /></div> :
                    <div>
                        <RaisedButton style={style.button} name="btnStart" label="Start" onClick={onStartButtonClick} disabled={folder === "" || monitorInfo.monitoring} />
                        <RaisedButton style={style.button} name="btnStop" label="Stop" onClick={onStopButtonClick} disabled={!monitorInfo.monitoring} />
                    </div>
                    
            }     
            {
                monitorInfo.monitoring && !isMonitorStatusUpdating ? <label style={style.statusLabel}>Monitoring folder: "{monitorInfo.folderMonitored}"</label> : null
            }
            {
                folderInputError !== "" && <label style={style.statusLabel}>{folderInputError}</label>
            }
        </CardText>
    </Card>
}