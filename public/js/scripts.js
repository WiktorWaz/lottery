function submitActionHandler() {
  const name = $('input[name = "name"]').val().trim();
  const mail = $('input[name = "mail"]').val().trim();
  const token = $('input[name = "token"]').val().trim();
  const description = $('input[name = "description"]').val().trim();
  if (name && mail && token && description) {

    $.post("/add", { name: name, mail: mail, token: token, description: description, test: "ok" })
      .done(function (data) {
        // alert( "Data Loaded: " + data );
        refreshList(data)
      })
      .fail(function (err) {
        alert("Error occurred: " + err.responseJSON.message);
      });
    // alert(`wywołanie add`);
  } else  {
    alert('Prosimy wprowadzić wszystkie dane');
  }
}


/* ALL LIST BUTTONS */

function refreshList() {

  $("#list").empty();
  $.get("/list", function (peopleList) {
    for (let i = 0; i < peopleList.length; i += 1) { //najpierw spytamy server a dopiero potem wyświetlimy nie trzeba nic zmieniać w pętli trzeba coś zrobić wyżej (linijkę)
      let liElement = "<div data-entryId='"+ peopleList[i].id + "'>" 
      + peopleList[i].name + "  " + peopleList[i].mail 
      //+ " <button class='removeButtons'>usuń</button>"
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

