/**
 * Created by pramo on 30-04-2017.
 */
$(document).ready(function () {
    $("#selectteacher").hide();
    $("#selectbatch").hide();
    $("#getAttendancebtn").hide();
    $("#selectdbatchbtn").hide();
    $("#ID").hide();
   $.ajax({
       type: "GET",
       url: "/Student/getTeachers",
       dataType: "json",
       success:function (response) {
           response=JSON.parse(JSON.stringify(response));
           alert(response);
           if(response.status==="done"&&response.teacher)
           {
               var innerhtml="";
               alert(response.teacher);
               for(i=0;i<response.teacher.length;i++){
                   if(response.teacher[i]&&response.teacher[i].trim()!='')
                       innerhtml+="<option>"+response.teacher[i].trim()+"</option>";
               }
               document.getElementById("selectteacher").innerHTML=innerhtml;
               $("#selectteacher").slideDown();
               $("#selectdbatchbtn").slideDown();
           }
           else{
               alert("NO TEACHER AND BATCH ADDED");


           }
       }

   });
    $("#selectdbatchbtn").click(function () {
        alert($('#selectteacher option:selected').text());
        $.ajax({
            type: "POST",
            url: "/Student/getBatch",
            dataType: "json",
            data:{Teacher:$('#selectteacher option:selected').text()},
            success:function (response) {
                response=JSON.parse(JSON.stringify(response));
                if(response.status==="done"&&response.batch)
                {
                    var innerhtml="";
                    alert(response.batch);
                    for(i=0;i<response.batch.length;i++){
                        if(response.batch[i]&&response.batch[i].trim()!='')
                            innerhtml+="<option>"+response.batch[i].trim()+"</option>";
                    }
                    document.getElementById("selectbatch").innerHTML=innerhtml;
                    $("#getAttendancebtn").slideDown();
                    $("#selectbatch").slideDown();
                    $("#ID").slideDown();

                }
                else{
                    alert("NO BATCH FOUND");
                    $("#UniqueId").val('');
                    $("#selectteacher").hide();
                    $("#selectbatch").hide();
                    $("#getAttendancebtn").hide();
                }
            }

        });

    });
$("#getAttendancebtn").click(function () {
    var ID=$("#ID").val();
    if(ID.trim()!=='') {
        $.ajax({
            type: "POST",
            url: "/Student/viewAttendanceData",
            dataType: "json",
            data: {
                "TeacherName": $('#selectteacher option:selected').text(),
                "BatchName": $('#selectbatch option:selected').text(),
                "ID":ID
            },
            success: function (response) {
                response = JSON.parse(JSON.stringify(response));
                if (response.status === "done" && response.Arr) {
                    var total=response.total;
                    var present=response.present;
                    console.log(response.Arr);
                    var table = "<tr><th>DATE</th><th>PRESENT/ABSENT</th></tr>";
                    for (var i = 0; i < response.Arr.length; i++) {
                        var a;
                        if(response.Arr[i].P==='0')
                            a="ABSENT";
                        else
                            a="PRESENT"
                        table += "<tr> <td>"
                            + response.Arr[i].Date
                            + "</td>"
                            + "<td>"
                            + a
                            + "</td>"
                            + "</tr>";
                    }
                    console.log(table);
                    document.getElementById("AttendanceTable").innerHTML=table;
                    $('#AttendanceTable').show();
                    var chart = new CanvasJS.Chart("pieChartContainer",
                        {
                            title:{
                                text: "Student Attendance"
                            },
                            legend: {
                                maxWidth: 350,
                                itemWidth: 120
                            },
                            data: [
                                {
                                    type: "pie",
                                    showInLegend: true,
                                    legendText: "{indexLabel}",
                                    dataPoints: [
                                        { y: present, indexLabel: "PRESENT" },
                                        { y: total-present, indexLabel: "ABSENT" },

                                    ]
                                }
                            ]
                        });
                    chart.render();

                }
                else {
                    alert("NO Attendance found");
                    $("#UniqueId").val('');
                    $("#selectteacher").hide();
                    $("#selectbatch").hide();
                    $("#getAttendancebtn").hide();
                }
            }

        });
    }
    else{
        alert("STUDENT ID CANNOT BE EMPTY");
    }
    
});

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
});