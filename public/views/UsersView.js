export default class {
  async getHtml() {
    return `
    <div class="d-flex mb-4 border-bottom pb-3">
      <svg width="4em" height="4em" class="heading-icon">
        <use xlink:href="bootstrap-icons.svg#people-fill" width="2.5em" height="2.5em"/>
      </svg>
      <span class="align-self-center h1 pl-3">Users</span>
    </div>
    <div class="table-wrapper shadow">
      <div class="table-title">
        <div class="row">
          <div class="col-sm-6">
            <h2>Manage <b>Users</b></h2>
          </div>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table table-striped table-sm table-bordered">
          <thead>
            <tr>
              <th>Lp</th>
              <th>Name</th>
              <th>Surname</th>
              <th>No</th>
              <th>Username</th>
              <th>Email</th>
              <th>Rented</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="table-body"></tbody>
        </table>
        <div class="d-flex justify-content-between">
          <span id="entries-info" class="p-3"></span>
          <nav><ul id="wrapper" class="pagination user-select-none pt-2"></ul></nav>
        </div>
      </div>
    </div>
    <div id="delete-modal" class="modal fade">
      <div class="modal-dialog">
        <div class="modal-content">
          <form>
            <div div class="modal-header text-white" style="background-color:#6d7fcc">						
              <h4 class="modal-title">Delete User</h4>
              <button type="button" class="close" style="padding-top:20px" data-dismiss="modal" aria-hidden="true">&times;</button>
            </div>
            <div class="modal-body">					
              <p>Are you sure you want to delete these Record?</p>
            </div>
            <div class="modal-footer">
              <input type="button" class="btn btn-default" data-dismiss="modal" value="Cancel">
              <input id="delete-data" type="submit" class="btn btn-danger" value="Delete">
            </div>
          </form>
        </div>
      </div>
    </div>`;
  }
}