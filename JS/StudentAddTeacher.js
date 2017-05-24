/**
 * Created by pramo on 30-04-2017.
 */
$(document).ready(function () {
$("#selectbatch").hide();
    $("#saveTeacherbtn").hide();
    var teacherUsername="";
    $("#addteachbtn").click(function () {
      var id= $("#UniqueId").val();

       $.ajax({ 
            type: "POST",
            url: "/Student/addTeacherData",
            dataType: "json",
            data:{
            "Teacherid":id
        },
          success:function (response) {
              response=JSON.parse(JSON.stringify(response));
              if(response.status==="done")
              {
                  var innerhtml="";
                  alert(response.Arr);
                  for(i=0;i<response.Arr.length;i++){
                      if(response.Arr[i]&&response.Arr[i].BatchName.trim()!='')
                          innerhtml+="<option>"+response.Arr[i].BatchName.trim()+"</option>";
                  }
                  document.getElementById("selectbatch").innerHTML=innerhtml;
                  $("#selectbatch").slideDown();
                  $("#saveTeacherbtn").slideDown();
                  teacherUsername=response.teacherUsername;
                  $("#teacherUsername").append("Teacher UserName "+response.teacherUsername);
              }
              else{
                  alert("TRY AGAIN ..!!Wrong teacher ID");
                  $("#UniqueId").val('');
              }
          } 
       });
    });
    
$("#saveTeacherbtn").click(function () {
    var id= $("#UniqueId").val();
    var BatchName= $('#selectbatch option:selected').text();
    $.ajax({
        type: "POST",
        url: "/Student/addBatch",
        dataType: "json",
        data:{
            "teacherUsername":teacherUsername,
            "BatchName":BatchName
        },
        success:function (response) {
            response=JSON.parse(JSON.stringify(response));
            if(response.status==="done") {
                $("#selectbatch").hide();
                $("#saveTeacherbtn").hide();
                alert("TEACHER AND BATCH ADDED SUCCESFULLY");
            }
           else if(response.status==="exists")    {
                $("#selectbatch").hide();
                $("#saveTeacherbtn").hide();
                alert("TEACHER AND BATCH ALREADY ADDED");
            }
            else{
                $("#selectbatch").hide();
                $("#saveTeacherbtn").hide();
                alert("TRY AGAIN ..!!");
            }
        }



    });
});    


























});