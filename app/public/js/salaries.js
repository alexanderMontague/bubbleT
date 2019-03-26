'use strict';

// GLOBALS
// table data
let tableData = [];
let dataTable = null;
// table element reference
const salaryTableHead = document.getElementById('salary-table-head');
const salaryTableBody = document.getElementById('salary-table-body');

// on initial page load
$(document).ready(function () {
    let selectedYear = document.getElementById('filter-year').value;

    if (selectedYear === undefined || selectedYear === 0) {
        selectedYear = 2013;
    }

    $.ajax({
        type: 'get',
        url: '/api/salaryData',
        data: {
            year: selectedYear
        },
        success: data => {
            tableData = data.salaryData;
            renderTable();
            dataTable = $('#salary-table').dataTable({
                "bRetrieve": true,
                searching: false
            });
        },
        fail: err => {
            console.log('Initial table data fetch failed', err);
        },
    });
});

// Function that re-renders the table when needed
const renderTable = () => {
    let numRows = tableData.length;

    // reset table
    salaryTableHead.innerHTML = "";
    salaryTableBody.innerHTML = "";

    // set headers
    salaryTableHead.innerHTML = `
    <tr>
        <th scope="col">Year</th>
        <th scope="col">First</th>
        <th scope="col">Last</th>
        <th scope="col">Salary</th>
        <th scope="col">Sector</th>
        <th scope="col">Employer</th>
    </tr>`;

    if (numRows > 5000) {
        numRows = 5000;
    }

    // set body data
    for (let i = 0; i < numRows; i++) {
        const newRow = salaryTableBody.insertRow(i);
        newRow.innerHTML = `
            <td>${tableData[i].calendar_year.content}</td>
            <td>${tableData[i].first_name.content}</td>
            <td>${tableData[i].last_name.content}</td>
            <td>${tableData[i].salary_paid.content}</td>
            <td>${(tableData[i].sector || tableData[i]._sector).content}</td>
            <td>${tableData[i].employer.content}</td>`;
    }
};

// sorting button click handler
document.getElementById('update-button').onclick = () => {
    // re-render table
    renderTable();
    console.log('Updated!');
};

// filter button click handler
document.getElementById('filter-button').onclick = event => {
    const selectedYear = document.getElementById('filter-year').value;
    const selectedSector = document.getElementById('filter-sector').value;
    const salaryMin = document.getElementById('min-salary').value;
    const salaryMax = document.getElementById('max-salary').value;
    const selectedEmployer = document.getElementById('filter-employer').value;
    const firstName = document.getElementById('filter-fname').value;
    const lastName = document.getElementById('filter-lname').value;

    event.preventDefault();

    // setup salary
    let salary = {};
    if (!salaryMin && !salaryMax) {
        salary = null;
    } else {
        salary.min = salaryMin || 0;
        salary.max = salaryMax || 99999999;
    }

    // create query object
    const queryObj = {
        year: selectedYear,
        sector: selectedSector || null,
        salary,
        employer: selectedEmployer || null,
        firstName: firstName || null,
        lastName: lastName || null,
        exact: null,
    };

    console.log('obj', queryObj);

    $.ajax({
        type: 'post',
        url: '/api/queryData',
        data: {
            queryObj
        },
        success: data => {
            tableData = data.queryData;
            
            // Destroying DataTable before regenerating
            if ( $.fn.DataTable.isDataTable('#salary-table') ) {
                $('#salary-table').DataTable().destroy();
                console.log("Destroyed the table!")
            }

            renderTable();

            $('#salary-table').dataTable({
                "bRetrieve": true,
                searching: false
            });
        },
        fail: err => {
            console.log('Initial table data fetch failed', err);
        },
    });

    console.log('Filtered!');
};


const dataType = 'csv'; // replace with getting value from FE element
// download salary button
document.getElementById('downloadSalaryButton').onclick = () => {
    $.ajax({
        type: 'post',
        url: '/api/downloadData',
        data: {
            type: dataType,
            data: testData
        }, // also get data from FE after initial API call to get data
        success: data => {
            const hiddenLink = document.createElement('a');
            hiddenLink.href =
                `data:text/${dataType === 'json' ? 'json' : 'csv'};charset=utf-8,` +
                encodeURI(dataType === 'json' ? JSON.stringify(data) : data);
            hiddenLink.target = '_blank';
            hiddenLink.download = `salaryData.${dataType === 'json' ? 'json' : 'csv'}`;
            hiddenLink.click();
        },
        fail: err => {
            console.log('File download failed', err);
        },
    });
};