//The URIs of the REST endpoint
//The URIs of the REST endpoint
IUPS =
  "https://prod-50.northeurope.logic.azure.com:443/workflows/6ea93e05516e413c94ea2f149e27e1e0/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=N1wgCvqfNwKf2XKM-JDvfE7XSwe8qAwPluavDmE3hwU";
RAI =
  "https://prod-16.northeurope.logic.azure.com:443/workflows/af8c073023de4bc49f3975319ccb698f/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=MX83qxsXXBy9kIjy5Lqh8BScMqsvkrXmdEORoqfMkH4";
BLOB_ACCOUNT = "https://mystreamstorage.blob.core.windows.net";

$(document).ready(function () {
  // Event listener for submitting a new asset
  $("#subNewForm").on("click", function () {
    submitNewAsset();
  });

  // Event listener for getting all images
  $("#viewVideos").on("click", function () {
    getVideos();
  });
});

//A function to submit a new asset to the REST endpoint
function submitNewAsset() {
  //Create a form data object
  submitData = new FormData();
  //Get form variables and append them to the form data object
  submitData.append("FileName", $("#FileName").val());
  submitData.append("userID", $("#userID").val());
  submitData.append("userName", $("#userName").val());
  submitData.append("title", $("#title").val());
  submitData.append("description", $("#description").val());
  submitData.append("genre", $("#genre").val());
  submitData.append("publisher", $("#publisher").val());
  submitData.append("ageRating", $("#ageRating").val());
  submitData.append("File", $("#UpFile")[0].files[0]);

  //Post the form data to the endpoint, note the need to set the content type header
  $.ajax({
    url: IUPS,
    data: submitData,
    cache: false,
    enctype: "multipart/form-data",
    contentType: false,
    processData: false,
    type: "POST",
    success: function (data) {
      Swal.fire({
        position: "top-end", // Position it on the top right corner
        icon: "success",
        title: "Success",
        showConfirmButton: false, // Hide the confirmation button
        timer: 1500, // The alert will disappear after 1.5 seconds
        toast: true, // Make it a toast notification
        timerProgressBar: true, // Add a timer progress bar
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });
    },
    error: function (xhr, status, error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred: " + error,
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  });
}

function getVideos() {
  $("#VideoGrid").html(
    '<div class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span>'
  );

  $.getJSON(RAI, function (data) {
    var items = [];

    $.each(data, function (key, val) {
      items.push(`
        <div class="col-md-4 col-sm-6">
          <div class="card" style="width: 100%;">
            <video src="${
              BLOB_ACCOUNT + val["filepath"]
            }" class="card-img-top" alt="${val["fileName"]}" controls style="max-height: 200px; object-fit: cover;"></video>
            <div class="card-body">
              <h5 class="card-title">${val["title"]}</h5>
              <p class="card-text">File Name: ${val["fileName"]}</p>
              <p class="card-text">Uploaded by: ${val["userName"]} </p>
              <p class="card-text">Description: ${val["description"]}</p>
            </div>
            <div class="card-footer">
              <button type="button" class="btn btn-primary btn-sm">Like</button>
              <div class="form-group mt-2">
                <label for="comment${key}">Comment:</label>
                <textarea class="form-control" rows="2" id="comment${key}" style="resize: none;"></textarea>
              </div>
            </div>
          </div>
        </div>
      `);
    });

    $("#VideoGrid").empty();
    $("#VideoGrid").append(items.join(""));
  });
}

$(document).ready(function () {
  if (window.location.pathname.endsWith("viewfiles.html")) {
    getVideos();
  }
});
