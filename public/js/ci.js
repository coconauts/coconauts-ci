
var projectTemplate, buildsTemplate ;
$(document).ready(function(){

  projectTemplate = $('#project-template').html();
  Mustache.parse(projectTemplate);
  buildsTemplate = $('#builds-template').html();
  Mustache.parse(buildsTemplate);

  $("#new-save").click(saveProject);

  loadProjects();

  $("#toggle-new").click(function(){
    $("#new-application").toggle("fast");
  });

  setInterval(loadProjects, 10*1000);

});

var buildProject = function(e){
  e.stopPropagation();
  var project = $(this).attr('project');
  $.ajax({
    url: "/build",
    method: "POST",
    data: { name: project }
  });
}

var builds = function(projectName){
  $.ajax({
    url: "build",
    data: { name: projectName, from: 1, to: 10 },
    success: function(json){
      var rendered = Mustache.render(buildsTemplate, json);
      $(".previous-builds[project="+projectName+"]").html(rendered);

      $('.build').click(function(e){
        e.stopPropagation();
          $(this).find('.collapsible-body').toggle("fast");
      });
      //updateCollapsible('.nested-collapsible');
    }
  })
}

var edit = function(e){
  e.stopPropagation();

  $("#new-application").show("fast");

  var project = $(this).attr('project');
  $.ajax({
    url: "project",
    data: {name: project},
    success: function(json){
      $("#new-name").val(json.name);
      $("#new-repo").val(json.repository);
      $("#new-commands").val(json.commands);
      $("#frequency-value").val(json.frequency.value);
    //  $("#frequency-unit").attr('checked', json.frequency.unit);
       $("#log-success").prop('checked', json.logSuccess == "true");

    }
  });
};

var deleteProject = function(e){
  e.stopPropagation();

  var project = $(this).attr('project');

  if (confirm("Are you sure you want to remove the project: "+project + " ?")){
    $.ajax({
      url: "/project",
      method: "DELETE",
      data: { name: project }
    });
  }
}
/*
var updateCollapsible = function(tag){
  $(tag).collapsible({ accordion : true });
};*/

var loadProjects = function() {
  $.ajax({
    url: "projects",
    success: function(json){
      var rendered = Mustache.render(projectTemplate, json.applications);
      $("#projects").html(rendered);

      afterLoad();
    }
  })
}

var afterLoad = function(){
  //updateCollapsible('.collapsible');
  $('.project').click(function(e){
    e.stopPropagation();
      $(this).children('.collapsible-body').toggle("fast");
  });

  $(".build-now").click(buildProject);
  $(".edit").click(edit);
  $(".delete").click(deleteProject);

  $(".project").click(function(){
    builds($(this).attr('project'));
  });
}
var saveProject = function(){
  var name = $("#new-name").val();
  var repo = $("#new-repo").val();
  var commands = $("#new-commands").val();
  var frenquecyValue = $('#frequency-value').val();
  var frenquecyUnit = $('input[name=freq]:checked').val();
  var logSuccess = $("#log-success").is(':checked') ;

  if (!name || !commands) {
    alert("You must introduce a name and commands");
    return;
  }
//  console.log(data);
  $.ajax({
    url: "/project",
    method: "POST",
    data: {
      name: name,
      repository: repo,
      commands:commands,
      frequency: {
        value: frenquecyValue,
        unit: frenquecyUnit
      },
      logSuccess: logSuccess
    }
  });
};
//var rendered = Mustache.render(template, {name: name});
