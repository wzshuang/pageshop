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
          $shape.width(w).height(h)
                .css("top", $(this).css("top")).css("left", $(this).css("left"))
                .find("canvas:first").attr("width",w).attr("height",h);
        },
        onStopResize: function(){
          console.log("onStopResize!");
        }
      });
    $('#dd').draggable({
      onDrag: function(){
        $shape.css("top", $(this).css("top")).css("left", $(this).css("left"));
      }
    })
})
