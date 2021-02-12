export default class {
  async getHtml() {
    return `
    <div class="d-flex mb-4 border-bottom pb-3">
      <svg width="4em" height="4em" class="heading-icon">
        <use xlink:href="bootstrap-icons.svg#layers-fill" width="2.5em" height="2.5em"/>
      </svg>
      <span class="align-self-center h1 pl-3">Rentals</span>
    </div>
    <div class="table-wrapper shadow">
      <div class="table-title">
        <div class="row">
          <div class="col-sm-6">
            <h2>Manage <b>Rentals</b></h2>
          </div>
          <div class="col-sm-6">
            <a class="btn btn-success" data-toggle="modal" data-target="#add-modal">Add New Rental</a>            
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
              <th>Book Name</th>
              <th>Rental Date</th>
              <th>Return Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="table-body">
          </tbody>
        </table>
        <div class="d-flex justify-content-between">
          <span id="entries-info" class="p-3"></span>
          <nav><ul id="wrapper" class="pagination user-select-none pt-2"></ul></nav>
        </div>
      </div>
    </div>
    <div id="add-modal" class="modal fade">
      <div class="modal-dialog">
        <div class="modal-content">
          <form>
            <div class="modal-header text-white" style="background-color:#6d7fcc">						
              <h4 class="modal-title">Add Rental</h4>
              <button type="button" class="close" style="padding-top:20px" data-dismiss="modal" aria-hidden="true">&times;</button>
            </div>
            <div class="modal-body">				
              <div class="form-group">
                <label>Name</label>
                <input id="name" type="text" class="form-control">
              </div>
              <div class="form-group">
                <label>Surname</label>
                <input id="surname" type="text" class="form-control">
              </div>
              <div class="form-group">
                <label>No</label>
                <input id="no" type="text" class="form-control">
              </div>
              <div class="form-group">
                <label>Book Name</label>
                <input id="book-name" type="text" class="form-control">
              </div>				
            </div>
            <div class="modal-footer">
              <input type="button" class="btn btn-default" data-dismiss="modal" value="Cancel">
              <input id="add-data" type="submit" class="btn text-white" style="background-color:#6d7fcc" value="Add">
            </div>
          </form>
        </div>
      </div>
    </div>
    <div id="edit-modal" class="modal fade">
      <div class="modal-dialog">
        <div class="modal-content">
          <form>
            <div div class="modal-header text-white" style="background-color:#6d7fcc">						
              <h4 class="modal-title">Edit Rental</h4>
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            </div>
            <div class="modal-body">					
              <p>Are you sure the book has been returned?</p>
            </div>
            <div class="modal-footer">
              <input type="button" class="btn btn-default" data-dismiss="modal" value="Cancel">
              <input id="update-data" type="submit" class="btn text-white" style="background-color:#6d7fcc" value="Update">
            </div>
          </form>
        </div>
      </div>
    </div>`;
  }
}