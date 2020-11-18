
$(document).ready(() => {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  const saveCodeButton = $("#save-code-form");
  const deleteButton = $(".delete-btn");
  const updateButton = $("#update-btn");
  let hackerInput;
  
  //Here we are handling the submit on the search bar for other users.
  $("#hackerSearchBtn").on("click", (event) => {
    hackerInput = $("#hackerInput").val();
    console.log("this is the new new: ",hackerInput)
   
    //This is the route that is hit on the url
    const url = "/api/hacker/" + hackerInput;
    
    $.get(url).then(function(result) {
      console.log("before:", result);
      //Here we are decostructing the object that comes back from the call.
      const searchExport = JSON.stringify(result)
      sessionStorage.setItem("hackerSearch",searchExport)
      // We relocate you ro the window route of friends
      window.location.replace("/friend");
      // We give the values of the object to its respective html sections.
      
    });
  });
  //Here is where i get the image file path into the front end
  $.get('/imageUpload').then((data)=>{
    $(".profile").attr("src", `${data}`);
  })
  //This is the route to retrive all of the code snippets that are inside of the workbench
  $.get("/api/codeSnippets").then((data) => {
    //Here we are looping thru the lengthof the codeSnippets that we have inside of the database.
    if (data.length !== 0) {
      for (var i = 0; i < data.length; i++) {
        //Here we are creating the list of items for each one of th codes
        var row = $("<ul>");
        row.addClass("codeList");

        row.append("<li>Title: " + data[i].title + "</li>");
        row.append("<li>Code: " + data[i].code + "</li>");
        row.append("<li>Description: " + data[i].description + "</li>");

        row.append("</ul>");

        $("#codeContainerWork").prepend(row);
      }
    }
  });
  // Johnsito Doe       johnsitodoea@gmail.com  john

  // elmicheal@gmail.com
  //Here we are getting all of the information about the user that is logged into the server.
  $.get("/api/user_data").then((data) => {
    //storing the github to use later on on the ajax call for the githun api
    const userGit = data.github;
    //Giving the text values to the respective sections of the site.
    $("#name").text(data.name);
    $("#email").text(data.email);
    $("#city").text(data.city);
    $("#technology").text(data.technology);
    $("#github").text(data.github);
    $("#linkedin").text(data.linkedin);
    //Handling the click upload for the profile image 
    $("#uploadBtn").click((event) => {
      event.preventDefault();
      const input = document.querySelector("input[type=file]"),
        file = input.files[0];
      const formData = new FormData();
      formData.append("avatar", file);
      const url = "/uploads";
      $.ajax({
        type: "POST",
        url: url,
        data: formData,
        encType: "multipart/form-data",
        contentType: false,
        processData: false,
        // eslint-disable-next-line no-empty-function
      }).then((result) => {
        console.log(result);
        location.reload()
      });
    });
    //
    $.ajax({
      url: "https://api.github.com/users/" + userGit,
      data: {
        // eslint-disable-next-line camelcase
        client_id: "b9315bcd5a07fcd759d8",
        // eslint-disable-next-line camelcase
        client_secret: "a2b698bf7e7c02f898197cf136d1a41f704ca8e4",
      },
    }).done((user) => {
      $.ajax({
        url: "https://api.github.com/users/" + userGit + "/repos",
        data: {
          // eslint-disable-next-line camelcase
          client_id: "b9315bcd5a07fcd759d8",
          // eslint-disable-next-line camelcase
          client_secret: "a2b698bf7e7c02f898197cf136d1a41f704ca8e4",
          sort: "created: asc",
          // eslint-disable-next-line camelcase
          per_page: 5,
        },
      }).done((repos) => {

        $.each(repos, (_index, repo) => {
          $("#repos").append(`
          <div class="card">
            <div class="row">
              <div class="col-md-8">
                <strong>${repo.name}</strong>: ${repo.description}
              </div>
              <div id="stars" class="col-md-4">
                <span class="badge badge-info">Stars: ${repo.stargazers_count}</span>
              </div>
              <div id="repoBtn" class="col-md-12 pull-right">
                <a href="${repo.html_url}" target="_blank" class="btn btn-dark">Repo Page</a>
              </div>
            </div>
          </div>
        `);
        });
      });
      $("#profile").html(`
      <div id="repos"></div>
      `);
    });
    
  });

  function saveCode(event) {
    event.preventDefault();
    let titleHandler=$("#title").val();
    titleHandler = String(titleHandler);
    let codeHandler=$("#code").val();
    codeHandler = String(codeHandler);
    let descriptionHandler=$("#description").val();
    descriptionHandler = String(descriptionHandler);
    console.log(typeof(titleHandler));
    console.log(typeof(codeHandler));
    console.log(typeof(descriptionHandler));

    const userCode = {
      title: titleHandler ,
      code: codeHandler,
      description: descriptionHandler,
    };

    console.log(userCode);


    $.ajax("/api/code", {
      type: "POST",
      data: userCode,
    }).then((result) => {
      console.log(result);
      console.log("succsess");
      location.reload();
    });
    // function() {
    //   console.log("created new code");
    //   location.reload();
    // }
  }

  function deleteCode(event) {
    let id = $(this).data("codeid");

    console.log(id);

    $.ajax("/api/code/" + id, {
      type: "DELETE",
    }).then(function() {
      console.log("deleted code with id ", id);
      location.reload();
    });
  }

  function updateCode(event) {
    event.preventDefault();

    const id = $("#code-selector").val();
    console.log(id);

    const updatedCode = {
      title: $("#update-code [name=title]")
        .val()
        .trim(),
      code: $("#update-code [name=code]")
        .val()
        .trim(),
      description: $("#update-code [name=description]")
        .val()
        .trim(),
    };

    $.ajax("/api/code/" + id, {
      type: "PUT",
      data: updatedCode,
    }).then(function() {
      console.log("updated id ", id);
      // location.reload();
    });
  }

  saveCodeButton.on("submit", saveCode);
  deleteButton.on("click", deleteCode);
  updateButton.on("submit", updateCode);
});
