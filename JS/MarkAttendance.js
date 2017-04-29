$(document).ready(function () {


$("#saveAttendancebtn").hide();
var httpreq=null;
$("#markAttendancebtn").click(function () {
    var data={
            BatchName:$('#selectedbatch option:selected').text(),
            date:document.getElementById("date").value
        };
    $.ajax({
        type: "POST",
        url: "http://localhost:8080/Attendance/getAttendancedata",
        dataType: "json",
        success: function (response) {
            response=JSON.parse(JSON.stringify(response));
            alert(response);
                var table="<tr><th>STUDENT ID</th><th>STUDENT NAME</th><th>MARK</th></tr>";
                    for(var i=0;i<response.length;i++)
                    {
                        table+="<tr> <td>"
                        +response[i].StudentID
                        +"</td>"
                        + "<td>"
                        +response[i].StudentName
                        +"</td>"
                        +"<td>"
                         +"<input type='checkbox' value='"+response[i].StudentID+"'>"
                         +"</td>"
                        +"</tr>";
                    }
                document.getElementById("AttendanceTable").innerHTML=(table);
                if(table!=="")
                $("#saveAttendancebtn").show();
                $("#selectedbatch").prop("disabled",true);

        },
        data: data
    });
    $("#saveAttendancebtn").click(function () {
       var n=$( "input:checked");
        var Arr=[];

        for(var i=0;i<n.length;i++)
        {
            Arr.push({"StudentID":n[i].value});
        }
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/Attendance/mark",
            dataType: "json",
            data:{
                "Arr":Arr,
                "BatchName":$('#selectedbatch option:selected').text(),
                "Date":(document.getElementById("date").value)
            },
            success:function (response) {
                response=JSON.parse(JSON.stringify(response));
                alert(response);
                if(response.status==="done")
                {
                    $("#AttendanceTable").append("<br><br>ATTENDANCE IS MARKED FOR "+Arr.length+" Students");
                    $("#saveAttendancebtn").hide();
                }
            },
            error:function (err) {
                alert(err);
            }
        });

    });
    // httpreq = new XMLHttpRequest();
    // httpreq.open("POST","/Attendance/getAttendancedata/",true);
    // httpreq.setRequestHeader("Content-type", 'application/json; charset=utf-8');
    // var data={
    //     BatchName:$('#selectedbatch option:selected').text(),
    //     date:(document.getElementById("date").value)
    // };
    // httpreq.send(data);
    // alert(data);
    // httpreq.onreadystatechange=function () {
    //     var response=(httpreq.responseText);
    //     alert(response);
    //     var table="";
    //         for(var i=0;i<response.length;i++)
    //         {
    //             table+="<tr> <td>"
    //             +response.StudentID
    //             +"</td>"
    //             + "<td>"
    //             +response.StudentName
    //             +"</td>"
    //             +"</tr>";
    //         }
    //     document.getElementById("AttendanceTable").append(table);
    //     if(table!=="")
    //     $("#saveAttendancebtn").show();
    // };
});
});