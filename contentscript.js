$(document).ready(function() {
  var live_hours;
  var first_col;

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
    console.log(live_hours);
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
      }
      $(d).click(function(){
        addWaiting();
      })
    })
  }

  setTimeout(function(){
    first_col = $('.js-list.list-wrapper').first().attr('id', 'first-col');
    addWaiting();
  }, 4000);

  $('#first-col .list-card').click(function(){
    addWaiting();
  });

  $('.window-overlay').click(function(){
    addWaiting();
  });

});
