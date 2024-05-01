import React from 'react';
import './App.css';
import {useState} from "react";
import {dummyData} from "./data";

const data = dummyData;
const App = () => {
    const [expandedRows, setExpandedRows] = useState([]);
    const [columnWidths, setColumnWidths] = useState({
        checkbox: 25,
        name: 200,
        code: 100,
        expiration: 150,
        status: 100,
        department: 150,
        user_status: 150,
        job_title: 150
    });

    const [resizingColumn, setResizingColumn] = useState(null);
    const [resizingColumnStartX, setResizingColumnStartX] = useState(0);
    const [resizingColumnStartWidth, setResizingColumnStartWidth] = useState(0);
    const [sorting, setSorting] = useState({key: 'name', order: 'asc'});

    const toggleRow = (name) => {
        const isExpanded = expandedRows.includes(name);
        if (isExpanded) {
            setExpandedRows(expandedRows.filter(rowName => rowName !== name));
        } else {
            setExpandedRows([...expandedRows, name]);
        }
    };

    const startResize = (columnKey, resizingColumnStartX, resizingColumnStartWidth) => {
        setResizingColumn(columnKey);
        setResizingColumnStartX(resizingColumnStartX);
        setResizingColumnStartWidth(resizingColumnStartWidth);
    };

    const resize = (event) => {
        if (resizingColumn) {
            const newWidth = resizingColumnStartWidth + event.clientX - resizingColumnStartX;
            setColumnWidths(prevState => ({
                ...prevState,
                [resizingColumn]: Math.max(newWidth, 0)
            }));
        }
    };

    const stopResize = () => {
        setResizingColumn(null);
    };

    const handleSort = (key) => {
        const order = sorting.key === key && sorting.order === 'asc' ? 'desc' : 'asc';
        setSorting({key, order});

        // Store the names of expanded rows before sorting
        const expandedNames = expandedRows.map(index => data[index].name);

        // Sort data array by the specified key
        data.sort((a, b) => {
            if (order === 'asc') {
                return a[key].localeCompare(b[key]);
            } else {
                return b[key].localeCompare(a[key]);
            }
        });

        // Restore expanded rows after sorting
        const restoredExpandedRows = data.filter(person => expandedNames.includes(person.name)).map(person => data.indexOf(person));
        setExpandedRows(restoredExpandedRows);
    };

    const TableHeader = ({ columnKey, title }) => {
        // Create invisible bounds 5px near border and create hover zone to show resize cursor
        const handleMouseMove = (e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const distanceToBorder = Math.min(
                e.clientX - rect.left,
                rect.right - e.clientX
            );
            if (distanceToBorder <= 5) {
                e.currentTarget.style.cursor = 'col-resize';
            } else {
                e.currentTarget.style.cursor = 'auto';
            }
        };

        const handleMouseDown = (e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const distanceToBorder = Math.min(
                e.clientX - rect.left,
                rect.right - e.clientX
            );
            if (distanceToBorder <= 5) {
                startResize(columnKey, e.clientX, columnWidths[columnKey]);
            }
        };

        return (
            <th style={{ width: `${columnWidths[columnKey]}px` }}
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}>
                <span>{title}</span>
                <span className="sort-icon" onClick={(e) => handleSort(columnKey)}>
                    {sorting.key === columnKey && (
                        <span>{sorting.order === 'asc' ? ' ▲' : ' ▼'}</span>
                    )}
                </span>
            </th>
        );
    };

    return (
        <div className="resizable-table" onMouseMove={resize} onMouseUp={stopResize}>
            <table>
                <thead>
                <tr>
                    <th style={{width: `${columnWidths.checkbox}px`}}><input type="checkbox"/></th>
                    <TableHeader columnKey='name' title='Full Name/Health Check'></TableHeader>
                    <TableHeader columnKey='code' title='Code'></TableHeader>
                    <TableHeader columnKey='expiration' title='Expiration'></TableHeader>
                    <TableHeader columnKey='status' title='Status'></TableHeader>
                    <TableHeader columnKey='department' title='Department'></TableHeader>
                    <TableHeader columnKey='user_status' title='User Status'></TableHeader>
                    <TableHeader columnKey='job_title' title='Job Title'></TableHeader>
                </tr>
                </thead>
                <tbody>
                {data.map((person, index) => (
                    <React.Fragment key={index}>
                        <tr onClick={() => toggleRow(index)}>
                            <td><input type="checkbox"/></td>
                            <td>
                                {person.name} {person.health_check.length > 0
                                && <span className="caret">{expandedRows.includes(index) ? '▲' : '▼'}</span>}
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{person.department}</td>
                            <td>{person.user_status}</td>
                            <td>{person.job_title}</td>
                        </tr>
                        {expandedRows.includes(index)
                            && person.health_check.map((check, checkIndex) => (
                                <tr key={checkIndex}>
                                    <td><input type="checkbox"/></td>
                                    <td>{check.title}</td>
                                    <td>{check.code}</td>
                                    <td>{check.expiration}</td>
                                    <td>{check.status}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            ))}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
            <div className="resize-handle"/>
        </div>
    );
};

export default App;
