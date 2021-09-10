var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks-list"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [], 
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks-list", JSON.stringify(tasks));
};

// event delagation
// click on the task to edit it 
$(".list-group").on("click", "p", function() {
  // get the text of the p element
  var text = $(this).text().trim();
  // create a textarea tag and add class to it
  // and give it the value of text
  var textInput = $("<textarea>")
  .addClass("form-control")
  .val(text);
  // replace the p with textInput
  $(this).replaceWith(textInput);
  textInput.trigger("focus");
});
// click off the textarea to save the new task
$(".list-group").on("blur", "textarea", function() {
  // the current value of the element
  var text = $(this).val().trim();
  // the parent elements ID
  var status = $(this).closest(".list-group").attr("id").replace("list-", "");
  // the elements position
  var index = $(this).closest(".list-group-item").index();
  // update current task
  tasks[status][index].text = text;
  saveTasks();
  // recreate p element
  var taskP = $("<p>").addClass("m-1").text(text);

  // replace textarea with p element
  $(this).replaceWith(taskP);
});
// click on due date to edit it 
$(".list-group").on("click", "span", function() {
  // get current text 
  var date = $(this).text().trim();
  // create new input Element 
  var dateInput = $("<input>").attr("type", "text").val(date);
  // swap out elements
  $(this).replaceWith(dateInput);
  // focus the new element
  dateInput.trigger("focus");
});
// click off the dateInput to save the new date
$(".list-group").on("blur", "input[type='text']", function() {
  // the current value of the element
  var date = $(this).val().trim();
  // the parent elements ID
  var status = $(this).closest(".list-group").attr("id").replace("list-", "");
  // the elements position
  var index = $(this).closest(".list-group-item").index();
  // update current task
  tasks[status][index].date = date;
  saveTasks();
  // recreate span element with bootstrap classes
  var taskSpan = $("<span>").addClass("badge badge-primary badge-pill").text(date);
  // replace input with span element
  $(this).replaceWith(taskSpan);
});


// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks[toDo].push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});
// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// jqueryUI 


// drag and sort list items in their own list and between list
$(".card .list-group").sortable({
  connectWith: $(".card .list-group"),
  scroll: false,
  tolerance: "intersect",
  helper: "clone",
  activate: function(event) {
    // console.log("activate", this);
  },
  deactivate: function(event) {
    // console.log("deactivate", this);
  },
  over: function(event) {
    // console.log("over", event.target);
  },
  out: function(event) {
    // console.log("out", event.target);
  },
  update: function(event) {
    // array to store the task data in
    var tempArr = []

    $(this).children().each(function() {
      var text = $(this)
        .find("p")
        .text()
        .trim();
      var date = $(this)
        .find("span")
        .text()
        .trim();
      // add task data to the temp array as an object
      tempArr.push({
        text: text,
        date: date
      });
    });
    // get the corresponding array name from the id atrribute by removing the "list-"
    var arrName = $(this).attr("id").replace("list-", "");
    tasks[arrName] = tempArr;

    saveTasks();
  }
});

// load tasks for the first time
loadTasks();
