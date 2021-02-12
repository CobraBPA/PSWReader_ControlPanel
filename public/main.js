import DashboardView from './views/DashboardView.js';
import BooksView from './views/BooksView.js';
import UsersView from './views/UsersView.js';
import RentalsView from './views/RentalsView.js';

let tableData;
let state = {
  querySet: null,
  page: 1,
  rows: 5,
  window: 3
};

function navigateTo(url) {
  history.pushState(null, null, url);
  router();
};

async function router() {
  if (document.querySelector('.active') !== null) document.querySelector('.active').className = '';
  const active = document.querySelector(`a[href='${ location.pathname }']`);
  active.parentNode.className = 'active';
  const routes = [
    { path: '/', view: DashboardView },
    { path: '/books', view: BooksView },
    { path: '/users', view: UsersView },
    { path: '/rentals', view: RentalsView }
  ];

  const potentialMatches = routes.map(route => {
    return {
      route: route,
      isMatch: location.pathname === route.path
    };
  });
  let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);
  if (!match) {
    match = {
      route: routes[0],
      isMatch: true
    };
  }

  const view = new match.route.view();
  if (match.route.path === '/') {
    getData('/dashboard').then(async data => {
      document.querySelector('#app').innerHTML = await view.getHtml(data);
    });
  } else {
    getData(match.route.path).then(async data => {
      document.querySelector('#app').innerHTML = await view.getHtml();
      if (window.location.pathname === '/users') data = data.filter(el => el.role != 'ADMIN');
      tableData = data;
      state.querySet = data;
      buildTable();
    });
  }
}

function pagination(querySet, page, rows) {
  let trimStart = (page - 1) * rows;
  let trimEnd = trimStart + rows;
  let trimmedData = querySet.slice(trimStart, trimEnd);
  let pages = Math.ceil(querySet.length / rows);
  return { querySet: trimmedData, pages: pages };
}

function pageButtons(pages) {
  let wrapper = document.querySelector('#wrapper');
  let maxLeft = (state.page - Math.floor(state.window / 2));
  let maxRight = (state.page + Math.floor(state.window / 2));
  wrapper.innerHTML = '';

  if (maxLeft < 1) {
    maxLeft = 1;
    maxRight = state.window;
  }
  if (maxRight > pages) {
    maxLeft = pages - (state.window - 1);
    if (maxLeft < 1) maxLeft = 1;
    maxRight = pages;
  }
  for (let i = maxLeft; i <= maxRight; i++) {
    if (i === state.page) wrapper.innerHTML += `<li class="page-item active page"><a class="page-link">${ i }</a></li>`;
    else wrapper.innerHTML += `<li class="page-item page"><a class="page-link">${ i }</a></li>`;
  }

  wrapper.innerHTML = `<li class="page-item previous"><a class="page-link">Previous</a></li>` + wrapper.innerHTML;
  wrapper.innerHTML += `<li class="page-item next"><a class="page-link">Next</a></li>`;
  document.querySelector('.previous').addEventListener('click', () => {
    if (state.page > 1) {
      let table = document.querySelector('#table-body');
      while (table.firstChild) table.removeChild(table.firstChild);
      state.page = Number(state.page - 1);
      buildTable();
    }
  });

  document.querySelector('.next').addEventListener('click', () => {
    if (state.page < pages) {
      let table = document.querySelector('#table-body');
      while (table.firstChild) table.removeChild(table.firstChild);
      state.page = Number(state.page + 1);
      buildTable();
    }
  });

  let buttons = document.querySelectorAll('.page');
  buttons.forEach(button => {
    button.addEventListener('click', e => {
      let table = document.querySelector('#table-body');
      while (table.firstChild) table.removeChild(table.firstChild);
      state.page = Number(e.target.text);
      buildTable();
    });
  });
}

function buildTable() {
  let table = document.querySelector('#table-body');
  let data = pagination(state.querySet, state.page, state.rows);
  let myList = data.querySet;
  table.innerHTML = '';
  
  if (window.location.pathname === '/books') {
    myList.forEach(item => {
      let row =
      `<tr>
        <td>${ tableData.indexOf(item) + 1 }</td>
        <td><img src="${ item.cover }" width="50" height="75"></td>
        <td>${ item.name }</td>
        <td>${ item.author }</td>
        <td>${ item.published }</td>
        <td>${ item.desc.substring(0, 154) }</td>
        <td>${ item.type }</td>
        <td>${ item.availability }</td>
        <td>${ item.lang }</td>
        <td>
          <a class="mr-1 edit" data-toggle="modal" data-target="#edit-modal" data-value="${ item._id }">
            <svg class="bi text-warning" width="1em" height="1em" style="margin-bottom: 4px;">
              <use xlink:href="bootstrap-icons.svg#pencil-fill"/>
            </svg>
          </a>
          <a class="delete" data-toggle="modal" data-target="#delete-modal" data-value="${ item._id }">
            <svg class="bi text-danger" width="1em" height="1em" style="margin-bottom: 4px;">
              <use xlink:href="bootstrap-icons.svg#trash-fill"/>
            </svg>
          </a>
        </td>
      </tr>`;
      table.innerHTML += row;
    });
    document.querySelectorAll('.edit').forEach(button => {
      let book = tableData.find(x => x._id === button.dataset.value);
      button.addEventListener('click', () => {
        document.querySelector('#edit-modal #name').value = book.name;
        document.querySelector('#edit-modal #cover').value = book.cover;
        document.querySelector('#edit-modal #author').value = book.author;
        document.querySelector('#edit-modal #published').value = book.published;
        document.querySelector('#edit-modal #desc').value = book.desc;
        document.querySelector('#edit-modal #type').value = book.type;
        document.querySelector('#edit-modal #availability').value = book.availability;
        document.querySelector('#edit-modal #lang').value = book.lang;
        document.querySelector('#edit-modal #update-data').dataset.value = button.dataset.value;
      });
    });
    document.querySelectorAll('.delete').forEach(button => {
      button.addEventListener('click', () => {
        document.querySelector('#delete-modal #delete-data').dataset.value = button.dataset.value;
      });
    });
  } else if (window.location.pathname === '/users') {
    myList.forEach(item => {
      let row =
      `<tr>
        <td>${ tableData.indexOf(item) + 1 }</td>
        <td>${ item.name }</td>
        <td>${ item.surname }</td>
        <td>${ item.no }</td>
        <td>${ item.username }</td>
        <td>${ item.email }</td>
        <td>${ item.rented }</td>
        <td>
          <a class="delete" data-toggle="modal" data-target="#delete-modal" data-value="${ item._id }">
            <svg class="bi text-danger" width="1em" height="1em" style="margin-bottom: 4px;">
              <use xlink:href="bootstrap-icons.svg#trash-fill"/>
            </svg>
          </a>
        </td>
      </tr>`;
      table.innerHTML += row;
    });
    document.querySelectorAll('.delete').forEach(button => {
      button.addEventListener('click', () => {
        document.querySelector('#delete-modal #delete-data').dataset.value = button.dataset.value;
      });
    });
  } else if (window.location.pathname === '/rentals') {
    myList.forEach(item => {
      let row =
      `<tr>
        <td>${ tableData.indexOf(item) + 1 }</td>
        <td>${ item.user.name }</td>
        <td>${ item.user.surname }</td>
        <td>${ item.user.no }</td>
        <td>${ item.book.name }</td>
        <td>${ item.rental_date.substring(0, 10) }</td>`;
      if (item.return_date === null) {
        row += 
        `<td></td>
        <td>
          <a class="mr-1 edit" data-toggle="modal" data-target="#edit-modal" data-value="${ item._id }">
            <svg class="bi text-warning" width="1em" height="1em" style="margin-bottom:4px">
              <use xlink:href="bootstrap-icons.svg#pencil-fill"/>
            </svg>
          </a>
        </td>`;
      } else {
        row += 
        `<td>${ item.return_date.substring(0, 10) }</td>
        <td>
          <a class="mr-1" style="cursor:auto">
            <svg class="bi text-success" width="1em" height="1em" style="margin-bottom:4px">
              <use xlink:href="bootstrap-icons.svg#pencil-fill"/>
            </svg>
          </a>
        </td>`;
      }
      row += `</tr>`;
      table.innerHTML += row;
    });

    document.querySelectorAll('.edit').forEach(button => {
      button.addEventListener('click', () => {
        document.querySelector('#edit-modal #update-data').dataset.value = button.dataset.value;
      });
    });
  }
  document.querySelector('#entries-info').innerHTML = `Showing ${ myList.length } out of ${ tableData.length } entries`;
  let addDataBtn = document.querySelector('#add-data');
  if (addDataBtn != null) {
    addDataBtn.onclick = e => {
      let data;
      if (window.location.pathname === '/books') {
        data = {
          name: document.querySelector('#add-modal #name').value,
          author: document.querySelector('#add-modal #author').value,
          published: parseInt(document.querySelector('#add-modal #published').value),
          cover: document.querySelector('#add-modal #cover').value,
          desc: document.querySelector('#add-modal #desc').value,
          type: document.querySelector('#add-modal #type').value,
          availability: parseInt(document.querySelector('#add-modal #availability').value),
          lang: document.querySelector('#add-modal #lang').value
        };
      } else if (window.location.pathname === '/rentals') {
        data = {
          name: document.querySelector('#add-modal #name').value,
          surname: document.querySelector('#add-modal #surname').value,
          no: parseInt(document.querySelector('#add-modal #no').value),
          bookName: document.querySelector('#add-modal #book-name').value
        };
      }
      e.preventDefault();
      postData(window.location.pathname, data).then(res => location.reload());
    };
  }

  let updateDataBtn = document.querySelector('#update-data');
  if (updateDataBtn != null) {
    updateDataBtn.onclick = e => {
      let data;
      if (window.location.pathname === '/books') {
        data = {
          name: document.querySelector('#edit-modal #name').value,
          author: document.querySelector('#edit-modal #author').value,
          published: parseInt(document.querySelector('#edit-modal #published').value),
          cover: document.querySelector('#edit-modal #cover').value,
          desc: document.querySelector('#edit-modal #desc').value,
          type: document.querySelector('#edit-modal #type').value,
          availability: parseInt(document.querySelector('#edit-modal #availability').value),
          lang: document.querySelector('#edit-modal #lang').value
        };
      } else if (window.location.pathname === '/rentals') {
        data = { return_date: new Date() };
      }
      e.preventDefault();
      putData(window.location.pathname, data, e.target.dataset.value).then(res => location.reload());
    };
  }

  let deleteDataBtn = document.querySelector('#delete-data');
  if (deleteDataBtn != null) {
    deleteDataBtn.onclick = e => {
      e.preventDefault();
      deleteData(window.location.pathname, e.target.dataset.value).then(res => location.reload());
    };
  }
  pageButtons(data.pages);
}

function getData(path) {
  const href = window.location.origin + '/api';
  return fetch(href + path).then(res => res.json());
}

function postData(path, data) {
  const href = window.location.origin + '/api';
  return fetch(href + path, { 
    method: 'post', 
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
    body: JSON.stringify(data)
  });
}

function putData(path, data, id) {
  const href = window.location.origin + '/api';
  return fetch(href + path + '/' + id, { 
    method: 'put', 
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
    body: JSON.stringify(data)
  });
}

function deleteData(path, id) {
  const href = window.location.origin + '/api';
  return fetch(href + path + '/' + id, {
    method: 'delete'
  });
}

function noBack() {
  window.history.forward();
}

window.addEventListener('popstate', router);
document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', e => {
    if (e.target.matches('[data-link]')) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });
  router();
});

window.onload = noBack;
window.onpageshow = (evt) => { if (evt.persisted) noBack() }
window.onunload = () => void(0);