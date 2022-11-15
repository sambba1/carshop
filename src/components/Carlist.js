import React, {useEffect, useState, useRef} from 'react';
import { AgGridReact} from'ag-grid-react';
import'ag-grid-community/dist/styles/ag-grid.css';
import'ag-grid-community/dist/styles/ag-theme-material.css';
import Button from'@mui/material/Button';
import Addcar from './Addcar';
import Editcar from './Editcar';

function Carlist(){
    const gridRef = useRef();
    const [cars, setCars] = useState([]);

    useEffect(() => fetchData(), []);

    const fetchData = () => {
        fetch('https://carstockrest.herokuapp.com/cars')
        .then(response => response.json())
        .then(data => setCars(data._embedded.cars))
        
        
    };

    const deleteCar = (link) => {
        if (window.confirm("Are you sure?")){
            fetch(link, {method: 'DELETE'})
            .then(res => fetchData())
            .catch(err => console.log(err))
        }
    };

    const saveCar = (car) =>{
        fetch('https://carstockrest.herokuapp.com/cars', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        })
        .then(res => fetchData())
        .catch(err => console.log(err))
    };

    const updateCar = (car, link) => {
        fetch(link,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        })
        .then(res => fetchData())
        .catch(err => console.log(err))
    };

    const columns = [
        {field: "brand"},
        {field: "model"},
        {field: "color"},
        {field: "fuel"},
        {field: "year"},
        {field: "price"},
        {
            headerName: "",
            cellRenderer: function(rowData){
                return <Editcar updateCar={updateCar} car={rowData.data} />
            },

        },
        {
            headerName: "",
            field: "_links.self.href",
            cellRenderer: function(field){
                return <Button onClick={() => deleteCar(field.value)} >delete</Button>
            },

        }
    ]

    return (
        <div>
            <div className="ag-theme-material"
                style={{height: '900px', width: '100%', margin: 'center'}} >
                    <Addcar saveCar={saveCar}/>
                <AgGridReact rowData={cars} columnDefs={columns}></AgGridReact>
            </div>
        </div>
    );
};
export default Carlist;