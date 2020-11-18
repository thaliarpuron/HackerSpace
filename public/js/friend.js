$(document).ready(()=>{
    const imported = sessionStorage.getItem("hackerSearch");
    const importParsed = JSON.parse(imported)
    console.log(importParsed)
    
    $(".friendProfile").attr("src",importParsed.profileImage);
      //Here we are looping thru the lengthof the codeSnippets that we have inside of the database.
      $("#friendName").text(importParsed.name);
      $("#friendEmail").text(importParsed.email);
      $("#friendCity").text(importParsed.city);
      $("#friendTechnology").text(importParsed.technology);
      $("#friendGithub").text(importParsed.github);
      $("#friendLinkedin").text(importParsed.linkedin);
   
      $.ajax({
        url: "https://api.github.com/users/" + importParsed.github,
        data: {
          // eslint-disable-next-line camelcase
          client_id: "b9315bcd5a07fcd759d8",
          // eslint-disable-next-line camelcase
          client_secret: "a2b698bf7e7c02f898197cf136d1a41f704ca8e4",
        },
      }).done((user) => {
        $.ajax({
          url: "https://api.github.com/users/" + importParsed.github + "/repos",
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
        $("#friendProfile").html(`
      <div id="repos"></div>
      `);
      });

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
      const codeUrl = "/api/friend/codeSnippets/" + importParsed.id;
      $.get(codeUrl).then(data=>{
          console.log(data)
          if (data.length !== 0) {
            for (var i = 0; i < data.length; i++) {
              //Here we are creating the list of items for each one of th codes
              var row = $("<ul>");
              row.addClass("codeList");

              row.append("<li>Title: " + data[i].title + "</li>");
              row.append("<li>Code: " + data[i].code + "</li>");
              row.append("<li>Description: " + data[i].description + "</li>");

              row.append("</ul>");

              $("#friendCodeContainerWork").prepend(row);
            }
          }


      });
})