$(document).ready(function() {
  var run_time = 0;
  var live_hours = {};
  var all_members = $('.js-list.list-wrapper').first().find('img.member-avatar');

  function addWaiting(){
    $.each(all_members, function(i,d){
      var hours = parseFloat($(d).parent().parent().parent().find('.badge.badge-points.point-count').first().html());
      var member_name = $(d).attr('title');
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
        if(live_hours[sidebar_member] > 32){
          $(d).addClass('hold-up');
        } else {
          $(d).addClass('all-good');
        }
        if(run_time === 0){
          $(d).append('<div class="hour-ct">'+live_hours[sidebar_member]+'</div>');
        } else {
          $(d).find('.hour-ct').html(live_hours[sidebar_member]);
        }
      }
    })
    run_time += 1;
  }

  setTimeout(function(){
    addWaiting();
  }, 2000);


  // $('.icon-close').click(function(){
  //   setTimeout(function(){
  //     live_hours = {};
  //     addWaiting();
  //   }, 1000);
  // });


});
