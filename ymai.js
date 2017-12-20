javascript: c= 'Импорт аннотаций в Яндекс.Метрику (c) SergeyLossev';

if ($("#container").length==0) {	
	$('<div id="container" style="top: 70px;position: absolute;z-index: 10000001;left: '+($(".main-menu_view_basic").length?180:70)+'px;background-color: white;text-align: center;right: 0px;bottom: 69px;">'
	+'<h1 style="font-size: 20px; padding-top: 20px">'+c.replace(/(SergeyLossev)/, '<a href="https://goo.gl/VPMn4d" target="_blank">$1</a>')+'</h1><br/>'
	+'<p><b>Введите список меток по любой схеме из примеров:</b></p>'
	+'<table>'
	+'<tr><td>YYYYMMDD'+(tt='&nbsp;</td><td>&nbsp;[tab]&nbsp;</td><td>&nbsp;Текст аннотации</td></tr>')
	+'<tr><td>YYYY-MM-DD'+tt
	+'<tr><td>DD.MM.YYYY'+tt
	+'</table>'
	+'<p>Если проще - два столбца, скопированные из Excel: один - с датой, другой - с текстом. Либо результат <a href="https://goo.gl/KQ7Ef2" target="_blank">экспорта из Google Analytics</a><br/>'
	+'<b>Esc - отмена</b></p>'
	+'<table style="margin: 20px;">'
	+'<tr><td style="height: 25px;"><select id="ann_type">'+'ABCDE'.split('').map(x=>'<option>'+x+'</option>').join('')+'</select></td><td width="10px"> </td><td>Тип метки</td></tr>'
	+'<tr><td style="height: 40px;"><input type="checkbox" id="ann_check" style="margin-left: 0px;"></input></td><td width="10px"> </td><td>Копировать текст также и в описание (помимо заголовка)</td></tr>'
	+'<tr><td><input type="button" id="annotations_button" value="Go!" style="margin-left: 0px; background-color: lightseagreen; color: white;"/></td><td width="10px"></td><td>Импортировать</td></tr>'
	+'</table>'
	+'<p></p>'
	+'<textarea title="'
	+"Образец аннотаций\n"
	+"2017-12-12\tПодключили рекламу Яндекс.Директ\n"
	+"2017-12-13\tНастроили utm-метки\n"
	+"2017-12-20\tПовысили ставку до 10 руб\n"
	+"\nНЕ ошибки и варианты с датами\n"
	+"20171210\tНормальная дата в формате без тире\n"
	+"01.09.2018\tНормальная дата в формате с точками и ведущим нулём\n"
	+"2017-12-08\tСтрока\tс\tнесколькими\tтабами\n"
	+"\nОшибки\n"
	+"2017-12-09\t\n"
	+"2017-12-10строка с ошибкой\n"
	+"2017-12-10 ещё строка с ошибкой\n"
	+"9.9.2018\tкривая дата\n"
	+"белиберда\n"
	+"Ещё белиберда"
	+'" id="ann_txt" height="100%" width="100%" style="height: 100%; width: 100%; margin-left: 20px; padding-top: 7px;" placeholder="Пример:\n2017-12-31\tНаряжаем ёлку\n2018-01-01\tС Новым Годом!\n"></textarea>'
	+'</div>'
	+'<div id="progress" style="width:0%; height:10px; background-color:red; position:absolute; z-index:1001;"></div>' ).appendTo('body');
	$('p,td,table', "#container").css({textAlign: 'justify', margin: '20px'});
	fn_on = function(){
		all_ok=true;
		check_errors=ann_txt.value.trim().split(/[\r\n]+/)
		.map(x=>{
			var xx=x.trim();
			if (xx.match(/(^20\d{2}-[0-1][0-9]-[0-3][0-9])\t[^$]+/)) return(xx);
			if (xx.match(/(^[0-3][0-9]\.[0-1][0-9]\.20\d{2})\t[^$]+/)) return(xx.replace(RegExp.$1, RegExp.$1.split('.').reverse().join('-')));
			if (xx.match(/(^20\d{2}[0-1][0-9][0-3][0-9])\t[^$]+/)) return(xx.replace(RegExp.$1, xx.slice(0,4)+'-'+xx.slice(4,6)+'-'+xx.slice(6,8)));
			all_ok=false;
			return(xx.startsWith("!\t") ? x : "!\t"+x);
		});
		pr=$("#progress");
		if (all_ok) {	
			check_errors.forEach((x,i)=>{
				pr.show();
				setTimeout(()=>{(()=>{
					arr=x.split('\t');
					date=arr.shift();
					tail=arr.join(' - ');
					obj={
						"id":"",
						"date":date,
						"title":tail,
						"message": (ann_check.checked ? tail : ''),
						"group":ann_type.selectedOptions[0].innerText
					};
					pr.show().css("width", (i+1)/(check_errors.length)*100+"%");
					console.log(i);
					console.log(obj);
					if (i==check_errors.length-1) {
						$(".header2__main").css("background-color", "");
						setTimeout(()=>{
							if (confirm("Аннотации добавлены.\nТребуется перезагрузить страницу")) {
								location.reload();
							}
							pr.hide();
						}, 100);
					}
					BN('i-chart-annotations-api').add(BN('i-counters').getCounterId(), obj)
				})(i);}, i*100);
			});
			$("#container").hide();
		} else {
			ann_txt.value=check_errors.filter(x=>x.startsWith("!\t")).concat(check_errors.filter(x=>!x.startsWith("!\t"))).join("\n");
			$(ann_txt).css("background-color", "red");
			setTimeout(()=>{
				$(ann_txt).css("background-color", "");
				alert('Исправьте ошибки');
				ann_txt.focus();
			}, 100);
		}
	};
	$('#annotations_button').on('click', fn_on);
	(window.addEventListener || window.attachEvent)("keydown", function(event){if (event.key=="Escape") $("#container").hide();});
} else {
	$("#container").show().css('left', ($(".main-menu_view_basic").length?180:70));
};
with(console){clear();log(c);};



/*

белиберда
2017-12-08	Образец
20171210	Нормальная дата в формате без тире
01.09.2018	Нормальная дата в формате с точками и ведущим нулём
2017-12-08	строка	с	несколькими	табами
2017-12-09	
2017-12-12	Подключили рекламу Яндекс.Директ
2017-12-13	Настроили utm-метки
2017-12-20	Повысили ставку до 10 руб
2017-12-10строка с ошибкой
2017-12-10 ещё строка с ошибкой
9.9.2018	кривая дата
Ещё белиберда

*/