$(document).ready(function() {
  var live_hours,
      first_col,
      mouseX,
      mouseY;

  $(document).mousemove(function(e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
  }).mouseover();

  function addWaiting(){
    var all_members = $(first_col).find('img.member-avatar');
    live_hours = {};
    $.each(all_members, function(i,d){
      var hours = parseFloat($(d).parent().parent().parent().find('.badge.badge-points.point-count').first().html());
      var member_name = $(d).attr('title');
      if(isNaN(hours)){
        hours = 0;
      }
      if(!(live_hours[member_name])){
        live_hours[member_name] = hours || 0;
      } else {
        live_hours[member_name] += hours;
      }
    })
    // console.log(live_hours);
    appendHours();
  }

  function appendHours(){
    $.each($('.member.ui-draggable'), function(i, d){
      var sidebar_member = $(d).find('img.member-avatar').attr('title');
      if(live_hours[sidebar_member]){
        var current_height = $(d).height();
        if(current_height === 30){
          $(d).height(current_height+25);
        }
        $(d).removeClass('hold-up');
        $(d).removeClass('caution');
        $(d).removeClass('all-good');
        if(live_hours[sidebar_member] > 40){
          $(d).addClass('hold-up');
        } else if(live_hours[sidebar_member] > 32){
          $(d).addClass('caution');
        } else {
          $(d).addClass('all-good');
        }
        $(d).append('<div class="hour-ct"></div>');
        var f_num = String(live_hours[sidebar_member]).replace('0.', '.');
        $(d).find('.hour-ct').html(f_num);
        $(d).on('mouseover', function(){
          console.log(sidebar_member);
          $('#tooltip').css({'display': 'visible', 'top': String(mouseY+5)+'px', 'left': String(mouseX)+'px'});
          $('#tooltip').html(sidebar_member);
        });
      } else{
        $(d).css('margin-bottom', '25px');
      }
      $(d).click(function(){
        addWaiting();
      });
      // $(d).on('mouseout', function(){
      //   $('#tooltip').css('display', 'none');
      // });
    })
  }

  setTimeout(function(){
    $('#content').append('<div id="tooltip"></div>')
    first_col = $('.js-list.list-wrapper').first().attr('id', 'first-col');
    addWaiting();
  }, 2000);

  $('#first-col .list-card').click(function(){
    addWaiting();
  });

  $('.window-overlay').click(function(){
    addWaiting();
  });

});
