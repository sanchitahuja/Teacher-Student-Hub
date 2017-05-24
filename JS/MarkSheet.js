/**
 * Created by pramo on 24-04-2017.
 */
$(document).ready(function () {


var length=-1;
$("#saveMarksbtn").hide();
$('#makemarksheetbtn').click(function () {
    var title=$('#MarksheetTitle').val();
    if(title==='')
    {
        alert("You cant Leave the TiTle Empty");
    }
    else{
        alert("Marksheet title "+title);
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/Marksheet/addsheet",
            dataType: "json",
            success: function (response) {
                response=JSON.parse(JSON.stringify(response));
                alert(response);
                alert("arr "+response.data);
                alert("status "+response.status);

                // length=response.data.length;
                if(response!==null&&response.status.trim()==="done"&&response.Arr) {
                    var table = "<tr><th>STUDENT ID</th><th>STUDENT NAME</th><th>ADD MARKS</th></tr>";
                    for (var i = 0; i < response.Arr.length; i++) {
                        table += "<tr> <td>"
                            + response.data[i].StudentID.toUpperCase()
                            + "</td>"
                            + "<td>"
                            + response.data[i].StudentName
                            + "</td>"
                            + "<td>"
                            + "<input type='number' value='" + response.data[i].StudentID + "'>"
                            + "</td>"
                            + "</tr>";
                    }
                    document.getElementById("MarksTable").innerHTML = table;
                    if (table !== "")
                        $("#saveMarksbtn").slideDown(200);
                    $("#selectedbatch").prop("disabled", true);
                }
                else{
                    $("#MarksTable").append("<br>The MarkSheet Already Exist Try adding another name");
                }
            },
            data:{
                "BatchName":$('#selectedbatch option:selected').text(),
                "MarkTitle":title
            }
        });
    }
});
var marks=[];
$('#saveMarksbtn').click(function () {
    var title=$('#MarksheetTitle').val();
    var cellIndexMapping1 = { 0: true};
    var cellIndexMapping1 = { 2: true};
    $("#MarksTable").find("input").attr('disabled',true);
    var MarksArr = [];


    $("#MarksTable tr").each(function(rowIndex) {
        var tds=$(this).find('td')
        var StudentID=tds.eq(0).text();
        alert("Student id "+tds.eq(0).text());
        var Marks=tds.find('input').val();
        alert("Marks"+tds.find('input').val());
        if(StudentID.trim()!==''&&Marks.trim()!=='')
        MarksArr.push({"StudentID":StudentID.trim(),"Marks":Marks});
    });
   sendMarks(MarksArr,title);
    // for(var i=0;i<MarksArr.length;i++){
    //     console.log("Name "+MarksArr[i].StudentID+" Marks "+MarksArr[i].Marks);
    // }

});
  var sendMarks=function (MarksArr,title) {

      $.ajax({
          type: "POST",
          url: "http://localhost:8080/Marksheet/addMarks",
          dataType: "json",
          data:{
              "MarkTitle":title,
              "BatchName":$('#selectedbatch option:selected').text(),
              "Arr":MarksArr
          },
          success:function (response) {
              response=JSON.parse(JSON.stringify(response));
              if(response.status==="done")
              {
                  alert("Marks Added Succesfully");
                  
                  $('#MarksTable').hide();
                  $('#saveMarksbtn').hide();

              }
          }
      });
  };

});