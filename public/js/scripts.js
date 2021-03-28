function submitActionHandler() {
  const name = $('input[name = "name"]').val().trim();
  const mail = $('input[name = "mail"]').val().trim();
  const token = $('input[name = "token"]').val().trim();
  const description = $('textarea[name = "description"]').val().trim();
  if (name && mail && token && description) {

    $.post("/add", { name: name, mail: mail, token: token, description: description, test: "ok" })
      .done(function (data) {
        refreshList(data)
      })
      .fail(function (err) {
        alert("Error occurred: " + err.responseJSON.message);
      });
  } else  {
    alert('Prosimy wprowadzić wszystkie dane');
  }
}


/* ALL LIST BUTTONS */

function refreshList() {

  $("#list").empty();
  $.get("/list", function (peopleList) {
    for (let i = 0; i < peopleList.length; i += 1) { 
      let liElement = "<div data-entryId='"+ peopleList[i].id + "'>" 
      + peopleList[i].name + "  " + peopleList[i].mail 
      +"</div>";
      $("#list").append(liElement);
    };
  })
}
refreshList();

/* REMOVE BUTTONS */


$(document).on('click', '.removeButtons', function () {
  let showIndexNum = $(this).parent().attr("data-entryId");
  showIndexNum = parseInt(showIndexNum);
  $.get('/delete/' + showIndexNum)
    .done(function (data) {
      refreshList();
    })
    .fail(function (err) {
      console.error(`Fail delete request: ` + err)
    })
})

