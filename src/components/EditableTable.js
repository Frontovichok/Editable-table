import React from 'react'
import { Icon, Button, Radio, Input, Table } from 'semantic-ui-react'
import ColorPicker from 'rc-color-picker';

import '../App.css';
import 'rc-color-picker/assets/index.css';

export default class EditableTable extends React.Component {
    state = {data: [], tableEditMode: "readOnly"};

    updateStateGettingTableData = () => {
        this.setState({ data: this.getTableDataFromLocalStorage()});
    };

    uploadTableDataToLocalStorage = (rowNumber, key, value) => {
        let data = this.getTableDataFromLocalStorage();
        data[rowNumber][key] = value;
        localStorage["data"] = JSON.stringify(data);
    };

    getTableDataFromLocalStorage = () => {
        return JSON.parse(localStorage["data"]);
    };

    handleChangeName = (e, rowNumber) => {
        this.uploadTableDataToLocalStorage(rowNumber, "name", e.target.value);
        this.updateStateGettingTableData();
    };
    handleChangeType = (e, rowNumber) => {
        this.uploadTableDataToLocalStorage(rowNumber, "type", e.target.value);
        this.updateStateGettingTableData();
    };
    handleChangeColor = (color, rowNumber) => {
        this.uploadTableDataToLocalStorage(rowNumber, "color", color.color);
        this.updateStateGettingTableData();
    };
    addNewRow = () => {
        let storageTableData = JSON.parse(localStorage["data"]);
        storageTableData.push({name: "", type: "", color: "#194fbb"});
        localStorage["data"] = JSON.stringify(storageTableData);
        this.updateStateGettingTableData();
    };

    removeRow = (e, rowNumber) => {
        let storageTableData = JSON.parse(localStorage["data"]);
        storageTableData.splice(rowNumber, 1);
        localStorage["data"] = JSON.stringify(storageTableData);
        // this.updateStateGettingTableData();
    };

    switchTableEditMode = (e) => {
        if (this.state.tableEditMode === "") {
            this.setState({ tableEditMode: "readOnly"});
            e.target.innerHTML = "Вкл редактирование"
        } else {
            this.setState({ tableEditMode: ""});
            e.target.innerHTML = "Выкл редактирование"
        }
        e.target.classList.toggle("basic");
    };

    componentDidMount(){
        const tableData = [
            {
                name: "name1",
                type: "main1",
                color: '#f4f4f4'
            },
            {
                name: 'name2',
                type: 'side',
                color: '#f8f8f8'}
        ];
        if (localStorage["data"] === undefined) {
            localStorage["data"] = JSON.stringify(tableData);
        }
        this.updateStateGettingTableData();
    }

    render() {
        return (
            <div className={"tableContainer"} >
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Type</Table.HeaderCell>
                            <Table.HeaderCell>Color</Table.HeaderCell>
                            <Table.HeaderCell>Action</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.state.data.map((row, rowNumber) =>
                            <Table.Row key={rowNumber}>
                                <Table.Cell><Input readOnly={this.state.tableEditMode} value={row.name} onChange={(e) => this.handleChangeName(e, rowNumber)}/></Table.Cell>
                                <Table.Cell><Input readOnly={this.state.tableEditMode} value={row.type} onChange={(e) => this.handleChangeType(e, rowNumber)}/></Table.Cell>
                                <Table.Cell>
                                    <span className={"colorSpan"}>{row.color}</span>
                                    <ColorPicker
                                        animation="slide-up"
                                        color={'#36c'}
                                        onChange={(e) => this.handleChangeColor(e, rowNumber)}/>
                                </Table.Cell>
                                <Table.Cell><Button color={"red"} basic icon='delete' onClick={(e) => this.removeRow(e, rowNumber)}/></Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
                <Button color='green' onClick={this.addNewRow}>Добавить поле</Button>
                <Button basic color='teal' onClick={this.switchTableEditMode}>Вкл редактирование</Button>
            </div>
        )
    }
}