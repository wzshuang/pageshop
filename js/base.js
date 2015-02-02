$(document).ready(function(){
  var $shape = $("#shape");
  $('#dd').resizable({
        onStartResize: function(){
          console.log("onStartResize!");
        },
        onResize: function(){
          console.log("onResize!");
          var w = $(this).width()+2;
          var h = $(this).height()+2;
          $("#"+$(this).data("for")).width(w).height(h)
                .css("top", $(this).css("top")).css("left", $(this).css("left"))
                .find("canvas:first").attr("width",w).attr("height",h);
        },
        onStopResize: function(){
          console.log("onStopResize!");
        }
      });
    $('#dd').draggable({
      onDrag: function(){
        $("#"+$(this).data("for")).css("top", $(this).css("top")).css("left", $(this).css("left"));
      }
    })


    var $dd = $("#dd");
    $(".shape").on({
      click: function(){

      },
      mousedown: function(){
        $dd.css("top", $(this).css("top"))
           .css("left", $(this).css("left"))
           .width($(this).width())
           .height($(this).height());
        $dd.data("for", $(this).attr("id"))
      },
      mousemove: function(){
        $dd.trigger("onResize");
      },
      mouseup: function(){

      }
    })
})
