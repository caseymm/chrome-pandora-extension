$(document).ready(function() {
  var live_hours,
      first_col;

  function addWaiting(){
    var all_members = $(first_col).find('img.member-avatar');
    live_hours = {};
    $.each(all_members, function(i,d){
      var card_title = $(d).parent().parent().parent().find('.list-card-title').html().split("</span>")[1];
      var hours = parseFloat($(d).parent().parent().parent().find('.badge.badge-points.point-count').first().html());
      var member_name = $(d).attr('title');
      if(isNaN(hours)){
        hours = 0;
      }
      if(!(live_hours[member_name])){
        live_hours[member_name] = {'total': hours || 0, 'tasks': []};
        live_hours[member_name]['tasks'].push([card_title, hours]);
      } else {
        live_hours[member_name]['total'] += hours;
        live_hours[member_name]['tasks'].push([card_title, hours]);
      }
    })
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
        var set_class = 'all-good';
        if(live_hours[sidebar_member]['total'] > 40){
          $(d).addClass('hold-up');
          set_class = 'caution';
        } else if(live_hours[sidebar_member]['total'] > 32){
          set_class = 'caution';
        }
        $(d).addClass(set_class);

        $(d).append('<div class="hour-ct"></div>');
        var f_num = String(live_hours[sidebar_member]['total']).replace('0.', '.');
        $(d).find('.hour-ct').html(f_num);
        $(d).mouseenter(function(event, ui){
          var position = $(d).position();
          var p_top = position['top'];
          var p_left = ($('.board-main-content').width() + position['left']) - 207;
          $('#tooltip').css({'display': 'block', 'top': String(p_top)+'px', 'left': String(p_left)+'px'});
          $('#tooltip #member-name').html(sidebar_member.split(' (')[0]+' '+'('+live_hours[sidebar_member]['tasks'].length+')');

          live_hours[sidebar_member]['tasks'].sort(function(first, second) {
            return second[1] - first[1];
          });
          $.each(live_hours[sidebar_member]['tasks'], function(i, d){
            $('#tooltip #tasks').append('<tr id="tr-'+i+'"></tr>');
            $('#tr-'+i).append('<td class="hour-block">'+d[1]+'</td>');
            $('#tr-'+i).append('<td class="item-task">'+d[0]+'</td>');
          })
        });
        $(d).mouseleave(function(){
          $('#tooltip').css('display', 'none');
          $('#tooltip #tasks').find('tr').remove();
        });
      } else{
        $(d).css('margin-bottom', '30px');
      }
      $(d).click(function(){
        addWaiting();
      });
    })
  }

  setTimeout(function(){
    $('#content').append('<div id="tooltip"><div id="member-name"></div><table id="tasks"></table></div>')
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
