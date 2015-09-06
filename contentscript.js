$(document).ready(function() {
  var live_hours;
  var first_col = $('.js-list.list-wrapper').first().attr('id', 'first-col');

  function addWaiting(){
    var all_members = $(first_col).find('img.member-avatar');
    live_hours = {};
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
        // if(typeof $(d).find('.hour-ct').html() != 'undefined'){
        //   console.log($(d).find('.hour-ct'));
        //   $(d).find('.hour-ct').html(live_hours[sidebar_member]);
        // } else {
          $(d).append('<div class="hour-ct"></div>');
          $(d).find('.hour-ct').html(live_hours[sidebar_member]);
        // }
      }
      $(d).click(function(){
        addWaiting();
      })
    })
  }

  setTimeout(function(){
    addWaiting();
  }, 2000);

  // maybe return on the last time this happens?
  $('#first-col .list-card-details .badges').bind("DOMSubtreeModified",function(){
    console.log('change');
    addWaiting();
  });

  // setInterval(function(){
  //   addWaiting();
  // },3000);

});
