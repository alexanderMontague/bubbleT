'use strict';

// GLOBALS
// table data
let tableData = [];
// table element reference
const salaryTableHead = document.getElementById('salary-table-head');
const salaryTableBody = document.getElementById('salary-table-body');

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
            $('#salary-table').dataTable({
                "bRetrieve": true,
                searching: false
            });
        },
        fail: err => {
            console.log('Initial table data fetch failed', err);
        },
    });
});

const renderTable = () => {
    // set headers
    salaryTableHead.innerHTML = `
    <tr>
        <th scope="col">First</th>
        <th scope="col">Last</th>
        <th scope="col">Salary</th>
        <th scope="col">Sector</th>
        <th scope="col">Employer</th>
    </tr>
  `;

    // set body data
    for (let i = 0; i < 10000; i++) {
        const newRow = salaryTableBody.insertRow(i);
        newRow.innerHTML = `
            <td>${tableData[i].first_name.content}</td>
            <td>${tableData[i].last_name.content}</td>
            <td>${tableData[i].salary_paid.content}</td>
            <td>${(tableData[i].sector || tableData[i]._sector).content}</td>
            <td>${tableData[i].employer.content}</td>`;
    }
};
document.getElementById('update-button').onclick = () => {
    // re-render table
    renderTable();

    console.log("Updated!");
};

document.getElementById('filter-button').onclick = () => {
    let fyear = document.getElementById('filter-year').value;

    $.ajax({
        type: 'get',
        url: '/api/queryData',
        data: {
            queryObj: {
                year: fyear,
                sector: universities,
                salary: {
                    min: 0,
                    max: 1000000
                },
                employer: "University of Guelph",
                firstName: null,
                lastName: null,
                exact: null
            }
        },
        success: data => {
            console.log("On FE " + data.queryData);
            tableData = data.queryData;
            renderTable();
        },
        fail: err => {
            console.log('Initial table data fetch failed', err);
        },
    });

    console.log("Filtered!");
};


const testData = [{
        _sector: {
            columnName: '\ufeffSector',
            content: 'Universities',
        },
        last_name: {
            columnName: 'Last Name',
            content: 'ADAMOWICZ',
        },
        first_name: {
            columnName: 'First Name',
            content: 'SARAH JEAN',
        },
        salary_paid: {
            columnName: 'Salary Paid',
            content: '100245.7',
        },
        taxable_benefits: {
            columnName: 'Taxable Benefits',
            content: '325.06',
        },
        employer: {
            columnName: 'Employer',
            content: 'University of Guelph',
        },
        job_title: {
            columnName: 'Job Title',
            content: 'Assistant Professor',
        },
        calendar_year: {
            columnName: 'Calendar Year',
            content: '2013',
        },
    },
    {
        _sector: {
            columnName: '\ufeffSector',
            content: 'Universities',
        },
        last_name: {
            columnName: 'Last Name',
            content: 'EDWARDS',
        },
        first_name: {
            columnName: 'First Name',
            content: 'MICHELLE',
        },
        salary_paid: {
            columnName: 'Salary Paid',
            content: '100035.25',
        },
        taxable_benefits: {
            columnName: 'Taxable Benefits',
            content: '321.37',
        },
        employer: {
            columnName: 'Employer',
            content: 'University of Guelph',
        },
        job_title: {
            columnName: 'Job Title',
            content: 'Assistant Librarian',
        },
        calendar_year: {
            columnName: 'Calendar Year',
            content: '2013',
        },
    },
    {
        _sector: {
            columnName: '\ufeffSector',
            content: 'Universities',
        },
        last_name: {
            columnName: 'Last Name',
            content: 'RATNASINGHAM',
        },
        first_name: {
            columnName: 'First Name',
            content: 'SUJEEVAN',
        },
        salary_paid: {
            columnName: 'Salary Paid',
            content: '100263.36',
        },
        taxable_benefits: {
            columnName: 'Taxable Benefits',
            content: '26.76',
        },
        employer: {
            columnName: 'Employer',
            content: 'University of Guelph',
        },
        job_title: {
            columnName: 'Job Title',
            content: 'Research Associate',
        },
        calendar_year: {
            columnName: 'Calendar Year',
            content: '2013',
        },
    },
];

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