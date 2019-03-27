'use strict';

// GLOBALS
// table data
let tableData = [];
let dataTable = null;
// table element reference
const salaryTableHead = document.getElementById('salary-table-head');
const salaryTableBody = document.getElementById('salary-table-body');

// on initial page load
$(document).ready(function() {
  // set multiselects
  $('#filter-year').multiselect();
  $('#filter-sector').multiselect();

  let selectedYear = document.getElementById('filter-year').value;

  if (selectedYear === undefined || selectedYear === 0) {
    selectedYear = 2013;
  }

  $.ajax({
    type: 'get',
    url: '/api/salaryData',
    data: {
      year: selectedYear,
    },
    success: data => {
      tableData = data.salaryData;
      renderTable();
      dataTable = $('#salary-table').dataTable({
        bRetrieve: true,
        searching: false,
      });
    },
    error: err => {
      console.log('Initial table data fetch failed', err);
    },
  });
});

// Function that re-renders the table when needed
const renderTable = () => {
  let numRows = tableData.length;

  // reset table
  salaryTableHead.innerHTML = '';
  salaryTableBody.innerHTML = '';

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
  const selectedYear = $('#filter-year').val();
  const selectedSector = $('#filter-sector').val();
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
    year: selectedYear.length !== 0 ? selectedYear : null,
    sector: selectedSector.length !== 0 ? selectedSector : null,
    salary,
    employer: selectedEmployer || null,
    firstName: firstName || null,
    lastName: lastName || null,
    exact: null,
  };

  $.ajax({
    type: 'post',
    url: '/api/queryData',
    data: {
      queryObj,
    },
    success: data => {
      tableData = data.queryData;

      // Destroying DataTable before regenerating
      if ($.fn.DataTable.isDataTable('#salary-table')) {
        $('#salary-table')
          .DataTable()
          .destroy();
        console.log('Destroyed the table!');
      }

      renderTable();

      $('#salary-table').dataTable({
        bRetrieve: true,
        searching: false,
      });
    },
    error: err => {
      console.log('Initial table data fetch failed', err);
    },
  });
};

const dataType = 'csv'; // replace with getting value from FE element
// download salary button
document.getElementById('downloadSalaryButton').onclick = () => {
  $.ajax({
    type: 'post',
    url: '/api/downloadData',
    data: {
      type: dataType,
      data: tableData,
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
    error: err => {
      alert('File is too large! Please create a more detailed query.');
      console.log('File download failed', err);
    },
  });
};

// CHART JS SECTION

// Pie Chart
let sectorData = {};
let pieChart = null;
let myPieChart = document.getElementById('pie-chart').getContext('2d');
let pieChartTitle = document.getElementById('pie-chart-title');

// create pie chart
const updateChart = () => {
  if (pieChart !== null) {
    pieChart.destroy();
  }
  pieChart = new Chart(myPieChart, {
    type: 'pie',
    data: {
      labels: Object.keys(sectorData),
      datasets: [
        {
          data: Object.values(sectorData),
          backgroundColor: [
            '#3366CC',
            '#DC3912',
            '#FF9900',
            '#109618',
            '#990099',
            '#3B3EAC',
            '#0099C6',
            '#DD4477',
            '#66AA00',
            '#B82E2E',
            '#316395',
            '#994499',
            '#22AA99',
            '#AAAA11',
            '#6633CC',
            '#E67300',
            '#8B0707',
            '#329262',
            '#5574A6',
            '#3B3EAC',
          ],
          borderWidth: 2,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
};

// data cleansing for default sector
document.getElementById('view-type-pie-tab').onclick = () => {
  sectorData = {};
  for (let i = 0; i < tableData.length; i++) {
    // if sector is not there yet
    const sectorKey = (tableData[i].sector || tableData[i]._sector).content.replace(/&amp;/g, '&');
    if (!sectorData[sectorKey]) {
      sectorData[sectorKey] = 1;
    } else {
      sectorData[sectorKey]++;
    }
  }
  updateChart();
};

// sector view
document.getElementById('pie-sector-button').onclick = () => {
  sectorData = {};
  pieChartTitle.innerHTML = 'Number of Individuals Making Over $100k by Sector';
  for (let i = 0; i < tableData.length; i++) {
    // if sector is not there yet
    const sectorKey = (tableData[i].sector || tableData[i]._sector).content.replace(/&amp;/g, '&');
    if (!sectorData[sectorKey]) {
      sectorData[sectorKey] = 1;
    } else {
      sectorData[sectorKey]++;
    }
  }
  updateChart();
};

// employer view
document.getElementById('pie-employer-button').onclick = () => {
  sectorData = {};
  pieChartTitle.innerHTML = 'Number of Individuals Making Over $100k by Employer';
  for (let i = 0; i < tableData.length; i++) {
    // if employer is not there yet
    const employerKey = tableData[i].employer.content.replace(/&amp;/g, '&');
    if (!sectorData[employerKey]) {
      sectorData[employerKey] = 1;
    } else {
      sectorData[employerKey]++;
    }
  }
  updateChart();
};

// employer view
document.getElementById('pie-year-button').onclick = () => {
  sectorData = {};
  pieChartTitle.innerHTML = 'Number of Individuals Making Over $100k per Year';
  for (let i = 0; i < tableData.length; i++) {
    // if employer is not there yet
    const yearKey = tableData[i].calendar_year.content;
    if (!sectorData[yearKey]) {
      sectorData[yearKey] = 1;
    } else {
      sectorData[yearKey]++;
    }
  }
  updateChart();
};

// employer view
document.getElementById('pie-salary-button').onclick = () => {
  pieChartTitle.innerHTML = 'Number of Individuals Contained in each Salary Range';
  sectorData = {
    '$100k - $125k': 0,
    '$125k - $150k': 0,
    '$150k - $200k': 0,
    '$200k - $250k': 0,
    '$250k - $300k': 0,
    '$300k - $350k': 0,
    '$350k+': 0,
  };
  for (let i = 0; i < tableData.length; i++) {
    const currSalary = Number(tableData[i].salary_paid.content);
    if (currSalary < 125e3) {
      sectorData['$100k - $125k']++;
    } else if (currSalary >= 125e3 && currSalary < 150e3) {
      sectorData['$125k - $150k']++;
    } else if (currSalary >= 150e3 && currSalary < 200e3) {
      sectorData['$150k - $200k']++;
    } else if (currSalary >= 200e3 && currSalary < 250e3) {
      sectorData['$200k - $250k']++;
    } else if (currSalary >= 250e3 && currSalary < 300e3) {
      sectorData['$250k - $300k']++;
    } else if (currSalary >= 300e3 && currSalary < 350e3) {
      sectorData['$300k - $350k']++;
    } else {
      sectorData['$350k+']++;
    }
  }
  updateChart();
};
