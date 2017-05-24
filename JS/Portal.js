/**
 * Created by pramo on 01-05-2017.
 */
var addcomment=function (PostID) {
    $.ajax({
        type: "Post",
        url: "/Portal/comment",
        dataType: "json",
        data:{
            PostID:PostID
        },
        success:function (response) {
            response=JSON.parse(JSON.stringify(response));
            if(response.status==="done")
            {
                getComment(PostID);


            }
        }


    });
};
var getComment=function (PostID) {
    $.ajax({
        type: "Post",
        url: "/Portal/getComments",
        dataType: "json",
        data:{
            PostID:PostID
        },
        success:function (response) {
            response=JSON.parse(JSON.stringify(response));
            if(response.status==="done")
            {
                var html="<br>";
                for(var i=0;response.Arr.length;i++)
                {
                    html+="<br>"+response.Arr[i].UserID;
                    html+="<br>"+response.Arr[i].Time;
                    html+="<br>"+"<h4>"+response.Arr[i].CommentText+"</h4>";
                }
                if(i===response.Arr.length){
                    html+="</p>";
                    var x="#"+PostID
                    $(x).html=html;
                }


            }
        }


    });
};
$(document).ready(function () {

    $("#addPost").click(function () {
        alert("POst started");
        $("#addpost").prop('disabled', true);
        if($('#PostInput').val()!=='') {
            $.ajax({
                type: "POST",
                url: "/Portal/Post",
                dataType: "json",
                data: {
                    "PostText": $('#PostInput').val()
                },
                success: function (response) {
                    response = JSON.parse(JSON.stringify(response));
                    if (response.status === "done") {
                        $("#addpost").prop('disabled', false);
                        alert("Post Added");
                        getPosts();
                    }
                    else {
                        alert("Something went wrong");
                    }
                }

            });
        }
    });


    var getPosts=function () {
        $.ajax({
            type: "GET",
            url: "/Portal/getPosts",
            dataType: "json",
            success:function (response) {
                response=JSON.parse(JSON.stringify(response));
                if(response.status==="done")
                {
                    var html="<p>";var i;
                    for( i=0;i<response.Arr.length;i++)
                    {
                        alert(response.Arr[i].PosterID);
                        html+="<h2>"+response.Arr[i].PosterID+"</h2>"
                        html+=response.Arr[i].Time;
                        html+="<p>"+response.Arr[i].PostText+"</p>"
                        html+="<br><input value='View Comments' type='button' onClick=getComment('"+response.Arr[i].PostID.trim()+"')>"+"";
                        html+="<div id='"+response.Arr[i].PostID.trim()+"'>"+"</div>";
                        html+="<br><textarea id='Comment"+response.Arr[i].PostID.trim()+"'>"+"</textarea>";
                        html+="<br><input type='button' onclick='$(this).addcomment("+response.Arr[i].PostID.trim()+"')>";
                    }
                    if(i===response.Arr.length){
                        html+="</p>";
                        $("#Posts").html(html);

                    }

                }
            }
        });
    };
    getPosts();





    
    
    
    
    }
);
