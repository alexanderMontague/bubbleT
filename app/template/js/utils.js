'use strict';

const testData = [
  {
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
    data: { type: dataType, data: testData }, // also get data from FE after initial API call to get data
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


