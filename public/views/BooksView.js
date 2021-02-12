export default class {
  async getHtml() {
    return `
    <div class="d-flex mb-4 border-bottom pb-3">
      <svg width="4em" height="4em" class="heading-icon">
        <use xlink:href="bootstrap-icons.svg#book-fill" width="2.5em" height="2.5em"/>
      </svg>
      <span class="align-self-center h1 pl-3">Books</span>
    </div>
    <div class="table-wrapper shadow">
      <div class="table-title">
        <div class="row">
          <div class="col-sm-6">
            <h2>Manage <b>Books</b></h2>
          </div>
          <div class="col-sm-6">
            <a class="btn btn-success" data-toggle="modal" data-target="#add-modal">Add New Book</a>            
          </div>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table table-striped table-sm table-bordered">
          <thead>
            <tr>
              <th>Lp</th>
              <th>Cover</th>
              <th>Name</th>
              <th>Author</th>
              <th>Published</th>
              <th>Description</th>
              <th>Type</th>
              <th>Availability</th>
              <th>Lang</th>
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
    <div id="add-modal" class="modal fade">
      <div class="modal-dialog">
        <div class="modal-content">
          <form>
            <div class="modal-header text-white" style="background-color:#6d7fcc">						
              <h4 class="modal-title">Add Book</h4>
              <button type="button" class="close" style="padding-top:20px" data-dismiss="modal" aria-hidden="true">&times;</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Cover</label>
                <input id="cover" type="text" class="form-control">
              </div>				
              <div class="form-group">
                <label>Name</label>
                <input id="name" type="text" class="form-control">
              </div>
              <div class="form-group">
                <label>Author</label>
                <input id="author" type="text" class="form-control">
              </div>
              <div class="form-group">
                <label>Published</label>
                <input id="published" type="text" class="form-control">
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea id="desc" class="form-control"></textarea>
              </div>
              <div class="form-group">
                <label>Type</label>
                <input id="type" type="text" class="form-control">
              </div>
              <div class="form-group">
                <label>Availability</label>
                <input id="availability" type="text" class="form-control">
              </div>
              <div class="form-group">
                <label>Lang</label>
                <input id="lang" type="text" class="form-control">
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
            <div class="modal-header text-white" style="background-color:#6d7fcc">						
              <h4 class="modal-title">Edit Book</h4>
              <button type="button" class="close" style="padding-top:20px" data-dismiss="modal" aria-hidden="true">&times;</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Cover</label>
                <input id="cover" type="text" class="form-control">
              </div>				
              <div class="form-group">
                <label>Name</label>
                <input id="name" type="text" class="form-control">
              </div>
              <div class="form-group">
                <label>Author</label>
                <input id="author" type="text" class="form-control">
              </div>
              <div class="form-group">
                <label>Published</label>
                <input id="published" type="text" class="form-control">
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea id="desc" class="form-control"></textarea>
              </div>
              <div class="form-group">
                <label>Type</label>
                <input id="type" type="text" class="form-control">
              </div>
              <div class="form-group">
                <label>Availability</label>
                <input id="availability" type="text" class="form-control">
              </div>
              <div class="form-group">
                <label>Lang</label>
                <input id="lang" type="text" class="form-control">
              </div>				
            </div>
            <div class="modal-footer">
              <input type="button" class="btn btn-default" data-dismiss="modal" value="Cancel">
              <input id="update-data" type="submit" class="btn text-white" style="background-color:#6d7fcc" value="Update">
            </div>
          </form>
        </div>
      </div>
    </div>
    <div id="delete-modal" class="modal fade">
      <div class="modal-dialog">
        <div class="modal-content">
          <form>
            <div class="modal-header text-white" style="background-color:#6d7fcc">						
              <h4 class="modal-title">Delete Book</h4>
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