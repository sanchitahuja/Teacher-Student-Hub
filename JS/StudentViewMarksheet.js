/**
 * Created by pramo on 30-04-2017.
 */
$(document).ready(function () {
    $("#selectteacher").hide();
    $("#selectbatch").hide();
    $("#selectMarksheet").hide();
    $("#getMarkSheetbtn").hide();
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
                    $("#getMarkSheetbtn").slideDown();
                    $("#selectbatch").slideDown();
                    $("#ID").slideDown();

                }
                else{
                    alert("NO BATCH FOUND");
                    $("#UniqueId").val('');
                    $("#selectteacher").hide();
                    $("#selectbatch").hide();
                    $("#getMarkSheetbtn").hide();
                }
            }

        });

    });
    $('#getMarkSheetbtn').click(function () {
        alert("Clicker get Marksheet");
            $.ajax({
                type: "POST",
                url: "/Student/getMarksheet",
                dataType: "json",
                data: {
                    "TeacherName": $('#selectteacher option:selected').text(),
                    "BatchName": $('#selectbatch option:selected').text(),

                },
                success: function (response) {
                    response = JSON.parse(JSON.stringify(response));
                    var innerhtml="";
                    alert(response.teacher);
                    var i=0;
                    if (response.status === "done" && response.marklist) {
                        for(i=0;i<response.marklist.length;i++){
                            if(response.marklist[i]&&response.marklist[i].trim()!='')
                                innerhtml+="<option>"+response.marklist[i].trim()+"</option>";
                        }
                        document.getElementById("selectMarksheet").innerHTML=innerhtml;
                        $("#selectMarksheet").slideDown();

                    }
                }

            });


    });
    $("#getMarksbtn").click(function () {
        var Marksheettitle=$('#selectMarksheet option:selected').text();
        Marksheettitle=Marksheettitle.replace($('#selectteacher option:selected').text(),'');
        var ID=$('#ID').val();
        if(ID.trim()!=='') {
            $.ajax({
                type: "POST",
                url: "/Student/viewMarksheetData",
                dataType: "json",
                data: {
                    "TeacherName": $('#selectteacher option:selected').text(),
                    "BatchName": $('#selectbatch option:selected').text(),
                    "Marksheettitle": Marksheettitle,
                    "StudentID":ID
                },
                success: function (response) {
                    response = JSON.parse(JSON.stringify(response));
                    var innerhtml = "";
                    alert(response.teacher);
                    if (response.status === "done") {
                        document.getElementById("Marks").innerHTML = "<h3>Your Marks in " + Marksheettitle + " are " + response.marks + ".</h3>";

                    }
                    else {
                        alert("STUDENT ID NOT FOUND TRY AGAIN..!!!");
                    }
                }

            });
        }
        else{
            alert("STUDENT ID CANNOT BE EMPTY");
        }

    });


























});