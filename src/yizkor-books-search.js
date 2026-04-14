//copied from https://sql.js.org/examples/GUI/index.html
import { buildLikeClause, extractBookName, extractStartingImgId, formatPageCount, formatResultsDescription, buildNyplUrl } from './utils.js';

var select = document.getElementById("ddlDbSelect");
var btnSearch = document.getElementById("btnSearch");
var txtSearch = document.getElementById("txtSearch");
var outputElm = document.getElementById('output');
var errorElm = document.getElementById('error');
var lblLanguage = document.getElementById('lblLanguageValue');
var townFinderLink = document.getElementById('lnkTownFinderLink');
var startingImgId;
var db;

document.getElementById('lblYBsCount').textContent = select.options.length;
startingImgId = extractStartingImgId(select.value);
lblLanguage.textContent = select.selectedOptions[0].getAttribute('data-language');
townFinderLink.setAttribute('href', select.selectedOptions[0].getAttribute('data-townfinder-link'));
btnSearch.disabled = true;
var xhr = new XMLHttpRequest();
xhr.open('GET', "/books/" + select.value + ".db", true);
xhr.responseType = 'arraybuffer';

xhr.onload = function(e) {
	loadPageCount(this.response);
};
xhr.send();

select.addEventListener("change", (e) => 
{
	startingImgId = extractStartingImgId(select.value);
	outputElm.innerHTML = "";
	document.getElementById('resultsMeta').style.display = 'none';
	lblLanguage.textContent = e.target.selectedOptions[0].getAttribute('data-language');
	townFinderLink.setAttribute('href', e.target.selectedOptions[0].getAttribute('data-townfinder-link'));
	btnSearch.disabled = true;

	var xhr = new XMLHttpRequest();
	xhr.open('GET', "/books/" + select.value + ".db", true);
	xhr.responseType = 'arraybuffer';

	xhr.onload = function(e) {
		loadPageCount(this.response);
	};
	xhr.send();
});

txtSearch.addEventListener("keyup", () => 
{
	if (!txtSearch.value)
	{
		btnSearch.setAttribute('disabled','disabled');
	}
	else
	{
		btnSearch.removeAttribute('disabled');
	}
});

// 10a — search type toggle
document.querySelectorAll('.t-btn').forEach(btn => {
	btn.addEventListener('click', () => {
		document.querySelectorAll('.t-btn').forEach(b => b.classList.remove('active'));
		btn.classList.add('active');
	});
});

// Start the worker in which sql.js will run
var worker = new Worker("worker.sql-wasm.js");
worker.onerror = error;

// Open a database
worker.postMessage({ action: 'open' });

// Connect to the HTML element we 'print' to
function print(text) {
	outputElm.innerHTML = text.replace(/\n/g, '<br>');
}
function error(e) {
	console.log(e);
	document.getElementById('resultsMeta').style.display = 'none';
	errorElm.style.height = '2em';
	errorElm.textContent = e.message;
}

function noerror() {
	errorElm.style.height = '0';
}

// Sort a table by column index, ascending or descending
function sortTable(tbl, colIdx, ascending) {
	var tbody = tbl.querySelector('tbody');
	var rows = Array.from(tbody.querySelectorAll('tr'));
	rows.sort(function(a, b) {
		var aVal = a.cells[colIdx].textContent.trim();
		var bVal = b.cells[colIdx].textContent.trim();
		var aNum = Number(aVal);
		var bNum = Number(bVal);
		var cmp = (!isNaN(aNum) && !isNaN(bNum))
			? aNum - bNum
			: aVal.localeCompare(bVal);
		return ascending ? cmp : -cmp;
	});
	rows.forEach(function(r) { tbody.appendChild(r); });
}

// Create an HTML table
var tableCreate = function () {
	return function (columns, values) {
		var tbl = document.createElement('table');
		tbl.className = 'results-table';
		var thead = document.createElement('thead');
		var headerRow = document.createElement('tr');
		columns.forEach(function(col, idx) {
			var th = document.createElement('th');
			th.textContent = col;
			th.classList.add('th-sort');
			th.dataset.sortAsc = 'true';
			th.addEventListener('click', function() {
				var asc = th.dataset.sortAsc === 'true';
				headerRow.querySelectorAll('th').forEach(function(t) {
					t.dataset.sortAsc = 'true';
					t.classList.remove('sort-asc', 'sort-desc');
				});
				sortTable(tbl, idx, asc);
				th.dataset.sortAsc = String(!asc);
				th.classList.add(asc ? 'sort-asc' : 'sort-desc');
			});
			headerRow.appendChild(th);
		});
		thead.appendChild(headerRow);
		tbl.appendChild(thead);
		var tbody = document.createElement('tbody');
		values.forEach(function(row) {
			var tr = document.createElement('tr');
			row.forEach(function(cell) {
				var td = document.createElement('td');
				td.textContent = cell;
				tr.appendChild(td);
			});
			tbody.appendChild(tr);
		});
		tbl.appendChild(tbody);
		return tbl;
	};
}();

btnSearch.addEventListener("click", () => 
{
	noerror();
	btnSearch.textContent = 'Searching…';
	btnSearch.disabled = true;

	var xhr = new XMLHttpRequest();
	xhr.open('GET', "books/" + select.value + ".db", true);
	xhr.responseType = 'arraybuffer';

	xhr.onload = function(e) {

		var activeBtn = document.querySelector('.t-btn.active');
		var searchType = activeBtn ? activeBtn.textContent.trim().toLowerCase() : 'exact';
		var likeValue = buildLikeClause(txtSearch.value, searchType);

		var data = db.exec("SELECT p.Number as Page, l.Number as Line, w.Number as Word FROM Page p  JOIN Line l on p.Id = l.PageId JOIN Word w on w.LineId = l.Id WHERE w.Text LIKE + '" + likeValue + "';");
		// contents is now [{columns:['col1','col2',...], values:[[first row], [second row], ...]}]

		var bookName = extractBookName(select.value);
		var results = data;
		toc("Executing SQL");
		if (results && results.length == 0) {
			error({message: "No entries found for '" + txtSearch.value + "' on " + bookName + " db. Try another term."});
			outputElm.innerHTML = "";
			btnSearch.textContent = 'Search';
			btnSearch.disabled = false;
			return;
		}

		tic();
		outputElm.innerHTML = "";

		var desc = formatResultsDescription(results[0].values.length, txtSearch.value, bookName);
		document.getElementById('resultsCount').textContent = desc.countText;
		document.getElementById('resultsDesc').innerHTML = desc.descHtml;
		document.getElementById('resultsMeta').style.display = 'flex';

		for (var i = 0; i < results.length; i++) {
			outputElm.appendChild(tableCreate(results[i].columns, results[i].values));
		}

		//turn 1st column values into links
		var tds = document.querySelectorAll('table tbody td:nth-child(1)');
		for(var i = 0; i < tds.length; i++)
		{
			var pageOffset = parseInt(tds[i].textContent);
			var pageText = tds[i].textContent;
			tds[i].innerHTML = `<a class="pg-btn" target="_blank" rel="noopener noreferrer" href='${buildNyplUrl(startingImgId, pageOffset)}'>${pageText}</a>`;
		}

		// Make entire row clickable — same action as clicking the Page link
		document.querySelectorAll('table tbody tr').forEach(function(tr) {
			tr.addEventListener('click', function(e) {
				if (e.target.tagName === 'A') return; // let the anchor handle itself
				var link = tr.querySelector('td:first-child a');
				if (link) window.open(link.href, '_blank', 'noopener,noreferrer');
			});
		});

		btnSearch.textContent = 'Search';
		btnSearch.disabled = false;
		toc("Displaying results");

	};
	xhr.send();
}, true);

// Performance measurement functions
var tictime;
if (!window.performance || !performance.now) { window.performance = { now: Date.now } }
function tic() { tictime = performance.now() }
function toc(msg) {
	var dt = performance.now() - tictime;
	console.log((msg || 'toc') + ": " + dt + "ms");
}

function queryPageCount(response)
{
	var uInt8Array = new Uint8Array(response);
	db = new SQL.Database(uInt8Array);
	var data = db.exec("SELECT COUNT(1) from Page;");
	// contents is now [{columns:['col1','col2',...], values:[[first row], [second row], ...]}]
	return data[0].values[0];
}

function loadPageCount(response)
{
	var lblPages = document.getElementById('lblPages');
	lblPages.textContent = formatPageCount(queryPageCount(response));
	btnSearch.disabled = false;
}