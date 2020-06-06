import React from 'react'
import {Button, Input, Table } from 'semantic-ui-react'
import ColorPicker from 'rc-color-picker';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import '../App.css';
import 'rc-color-picker/assets/index.css';

// возвращает список строк после изменения последовательности
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    background: isDragging ? "#9cf3b094" : "white",
    ...draggableStyle
});

export default class EditableTable extends React.Component {
    state = {data: [], tableEditMode: "readOnly"};


    onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const data = reorder(
            this.state.data,
            result.source.index,
            result.destination.index
        );

        this.updateTableDataInLocalStorage(data);
        this.setState({
            data: data
        });

    };

    // обновляем state после ссхранения в localStorage
    updateStateGettingTableData = () => {
        this.setState({ data: this.getTableDataFromLocalStorage()});
    };

    // при изменении значений ячеек, сохраняем их в localStorage
    saveTableDataInLocalStorage = (rowNumber, key, value) => {
        let data = this.getTableDataFromLocalStorage();
        data[rowNumber][key] = value;
        localStorage["data"] = JSON.stringify(data);
    };

    // обновляем localStorage после переранжировки строк
    updateTableDataInLocalStorage = (data) => {
        localStorage["data"] = JSON.stringify(data);
    };

    // получаем данные таблицы в массиве
    getTableDataFromLocalStorage = () => {
        return JSON.parse(localStorage["data"]);
    };

    // обработчики на изменения значений в ячейках
    handleChangeName = (e, rowNumber) => {
        this.saveTableDataInLocalStorage(rowNumber, "name", e.target.value);
        this.updateStateGettingTableData();
    };
    handleChangeType = (e, rowNumber) => {
        this.saveTableDataInLocalStorage(rowNumber, "type", e.target.value);
        this.updateStateGettingTableData();
    };
    handleChangeColor = (color, rowNumber) => {
        this.saveTableDataInLocalStorage(rowNumber, "color", color.color);
        this.updateStateGettingTableData();
    };

    // добавление и удаление строк в таблице
    addNewRow = () => {
        let storageTableData = JSON.parse(localStorage["data"]);
        storageTableData.push({id: String(storageTableData.length), name: "", type: "", color: "#194fbb"});
        localStorage["data"] = JSON.stringify(storageTableData);
        this.updateStateGettingTableData();
    };
    removeRow = (e, rowNumber) => {
        let storageTableData = JSON.parse(localStorage["data"]);
        storageTableData.splice(rowNumber, 1);
        localStorage["data"] = JSON.stringify(storageTableData);
        this.updateStateGettingTableData();
    };

    // переключение режима редактирования
    switchTableEditMode = (e) => {
        if (this.state.tableEditMode === "") {
            this.setState({ tableEditMode: "readOnly"});
            e.target.innerHTML = "Редактировать"
        } else {
            this.setState({ tableEditMode: ""});
            e.target.innerHTML = "Только просмотр"
        }
        e.target.classList.toggle("basic");
    };

    // инициализация начальных значений localStorage
    componentDidMount(){
        const tableData = [
            {
                id: "0",
                name: "name1",
                type: "main1",
                color: '#f4f4f4'
            },
            {
                id: "1",
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
            <div className={"container"}>
                <div className={"tableContainer"} >
                    <DragDropContext onDragEnd={this.onDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                                <table ref={provided.innerRef}
                                       className={"ui celled table"}
                                       >
                                    <Table.Header>
                                        <tr>
                                            <th>Name</th>
                                            <th>Type</th>
                                            <th>Color</th>
                                            <th>Action</th>
                                        </tr>
                                    </Table.Header>
                                    <Table.Body>
                                        {this.state.data.map((row, rowNumber) => (
                                            <Draggable key={row.id} draggableId={row.id} index={rowNumber}>
                                                {(provided, snapshot) => (
                                                    <tr
                                                        ref={provided.innerRef}
                                                       {...provided.draggableProps}
                                                       {...provided.dragHandleProps}
                                                        style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                        )}>
                                                        <td><Input placeholder={"name"} readOnly={this.state.tableEditMode} value={row.name} onChange={(e) => this.handleChangeName(e, rowNumber)}/></td>
                                                        <td><Input placeholder={"type"} readOnly={this.state.tableEditMode} value={row.type} onChange={(e) => this.handleChangeType(e, rowNumber)}/></td>
                                                        <td>
                                                            <span className={"colorSpan"}>{row.color}</span>
                                                            <ColorPicker
                                                                animation="slide-up"
                                                                color={'#36c'}
                                                                onChange={(e) => this.handleChangeColor(e, rowNumber)}/>
                                                        </td>
                                                        <td><Button color={"red"} basic icon='delete' onClick={(e) => this.removeRow(e, rowNumber)}/></td>
                                                    </tr>
                                                    )}
                                                </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </Table.Body>
                                </table>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
                <div>
                    <Button color='green' onClick={this.addNewRow}>Добавить поле</Button>
                    <Button basic color='teal' onClick={this.switchTableEditMode}>Редактировать</Button>
                </div>
            </div>
        )
    }
}