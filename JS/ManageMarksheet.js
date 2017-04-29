/**
 * Created by pramo on 29-04-2017.
 */
$(document).ready(function () {
    $("#updateMarksbtn").hide();
   $('#viewMarksheetbtn').click(function () {
      var BatchName= $('#selectedbatch option:selected').text();
       $.ajax({
           type:'POST',
           url:'/Marksheet/manageMarksheet/getList',
           data:{
               BatchName:BatchName
           },
           dataType: "json",
           success:function (response) {
               response=JSON.parse(JSON.stringify(response));
               if(response.status.trim()==="done"&&response.marklist){
                   var i=0;
                   var innerhtml="";
                   alert(response.marklist);
                   for(i=0;i<response.marklist.length;i++){
                       if(response.marklist[i]&&response.marklist[i].trim()!='')
                       innerhtml+="<option>"+response.marklist[i].trim()+"</option>";
                   }
                   document.getElementById("selectMarksheet").innerHTML=innerhtml;

                   $("#selectedbatch").attr("disabled",true);
               }
               else{
                   alert("Server ERROR");
               }
           }
       });
   });
    $("#getMarks").click(function () {
        var MarkTitle=$("#selectMarksheet option:selected").text();
        var BatchName=$("#selectedbatch option:selected").text();
        $.ajax({
            type:"POST",
            url:"/Marksheet/manageMarksheet/getMarks",
            data:{
                "MarkTitle":MarkTitle,
                "BatchName":BatchName
            },
            dataType: "json",
            success:function (response) {

                response=JSON.parse(JSON.stringify(response));
                var table="";
                alert("status "+response.status);
                alert("data "+response.data);
                if(response&&response.status==="done"&&response.data){
                   table= "<tr><th>STUDENT ID</th><th>MARKS</th></tr>";
                    for (var i = 0; i < response.data.length; i++) {
                        table += "<tr>"
                            + "<td>"
                            + response.data[i].StudentID
                            + "</td>"
                            + "<td>"
                            + "<input type='number' value=" + response.data[i].Marks + " readonly='true' ondblclick='this.readOnly=false'>"
                            + "</td>"
                            + "</tr>";
                    }
                    console.log(table);
                    $("#updateMarksbtn").slideDown(200);
                    document.getElementById("MarksTable").innerHTML=table;
                }
                else{
                    alert("NOT DONE");
                }
            }

        });
    });
    $("#updateMarksbtn").click(function () {
        var title=$('#selectMarksheet option:selected').text();
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
    });
    var sendMarks=function (MarksArr,title) {

        $.ajax({
            type: "POST",
            url: "/Marksheet/manageMarksheet/updateMarksheet",
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
                    alert("Marks UPDATED Succesfully");

                    $('#MarksTable').hide();
                    $('#updateMarksbtn').hide();
                    

                }
            }
        });
    };
});