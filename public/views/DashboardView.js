export default class {
  async getHtml(data) {
    return `
    <div class="d-flex mb-2 border-bottom pb-3">
      <svg width="4em" height="4em" class="heading-icon">
        <use xlink:href="bootstrap-icons.svg#house-door-fill" width="2.5em" height="2.5em"/>
      </svg>
      <span class="align-self-center h1 pl-3">
        Dashboard
      </span>
    </div>
    <div class="row">
      <div class="col-6 mt-3">
        <div class="card shadow border-0">
          <div class="card-body">
            <div class="row">
              <div class="col-4">
                <svg width="5em" height="5em" class="m-3" style="color:#6d7fcc">
                  <use xlink:href="bootstrap-icons.svg#book-fill"/>
                </svg>
              </div>
              <div class="col-8">
                <div class="text-center m-2">
                  <p>Books</p>
                  <span class="number">${ data.books }</span>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer border-0 stats">
            <svg width="0.9em" height="0.9em">
              <use xlink:href="bootstrap-icons.svg#server"/>
            </svg>
            In current Database
          </div>
        </div>
      </div>
      <div class="col-6 mt-3">
        <div class="card shadow border-0">
          <div class="card-body">
            <div class="row">
              <div class="col-4">
                <svg width="5em" height="5em" class="m-3" style="color:#6d7fcc">
                  <use xlink:href="bootstrap-icons.svg#people-fill"/>
                </svg>
              </div>
              <div class="col-8">
                <div class="text-center m-2">
                  <p>Users</p>
                  <span class="number">${ data.users }</span>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer border-0 stats">
            <svg width="0.9em" height="0.9em">
              <use xlink:href="bootstrap-icons.svg#server"/>
            </svg>
            In current Database
          </div>
        </div>
      </div>
      <div class="col-6 mt-3">
        <div class="card shadow border-0">
          <div class="card-body">
            <div class="row">
              <div class="col-4">
                <svg width="5em" height="5em" class="m-3" style="color:#6d7fcc">
                  <use xlink:href="bootstrap-icons.svg#layers-fill"/>
                </svg>
              </div>
              <div class="col-8">
                <div class="text-center m-2">
                  <p>Rentals</p>
                  <span class="number">${ data.rentals }</span>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer border-0 stats">
            <svg width="0.9em" height="0.9em">
              <use xlink:href="bootstrap-icons.svg#server"/>
            </svg>
            In current Database
          </div>
        </div>
      </div>
      <div class="col-6 mt-3">
        <div class="card shadow border-0">
          <div class="card-body">
            <div class="row">
              <div class="col-4">
                <svg width="5em" height="5em" class="m-3" style="color:#6d7fcc">
                  <use xlink:href="bootstrap-icons.svg#star-fill"/>
                </svg>
              </div>
              <div class="col-8">
                <div class="text-center m-2">
                  <p>Likes</p>
                  <span class="number">75</span>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer border-0 stats">
            <svg width="0.9em" height="0.9em">
              <use xlink:href="bootstrap-icons.svg#server"/>
            </svg>
            In current Database
          </div>
        </div>
      </div>
    </div>`;
  }
}