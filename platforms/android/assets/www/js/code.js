var bas,
	timeouts,
	battery,
	connection,
	notification;

$(function(){
	flag=false;
	/* battery= navigator.battery;
	connection= navigator.connection;


	if(battery.level<=0.30)
		notify(String.prototype.es.B1,String.prototype.es.B2) 
	else
		flag=true ;

	if(navigator.onLine)
	{
		flag=flag*true;
	}
	else
	{
		notify(String.prototype.es.I1,String.prototype.es.I2);
		flag= false;
	} */
	flag=true;
	(flag)? scrap(): appclose();

	//Android back button
	document.addEventListener("backbutton", restore, false);
	//Android menu option
	document.addEventListener("menubutton", menu, false);
});

function iscool()
{
	if(battery.charging)
	{
		$('input').off();
		scrap();
	}
}

function appclose()
{
	$('input').on('keyup',function(){
		$('#lista').html( $("<article>"+String.prototype.es.err +"</article>" ));
	});
	$(battery).on("chargingchange",iscool);
}

function notify(tit, cont )
{
	 notification= navigator.mozNotification.createNotification(tit,cont);
      notification.show();
}

function scrap()
{
	$('input').on('keyup',buscar);
	$('.item').off();
	//$(document).on('click',".item", map);
	$(document).on('click',".item span", restore);
	$.ajax({
			type:"POST",
			url:"museos.json",
			dataType:"json",
			error:function(jqXHR, status){
				alert("Error con la base de datos"+status);
			},	
			success:function(json){
				bas=json;
				items();		
				$('.item').on('click', map);
			}
	});
}

function restore(event)
{
	event.stopPropagation();
	scrap();
	$('#map').removeClass('visiblemap');
	$('#map').addClass('hiddenmap');
	$(this).parent().remove();
	$('input').val('');
}
function menu()
{

	$("#menu").addClass('visiblemenu');
}

function map()
{
	console.log('click');
	var index=$(this).attr('id');
	var cssclick={'position':'fixed',
					'bottom':'0',
					'z-index':'2',
					'left':'10%',
					'background':'rgba(232, 235, 238, 0.83)',
					'border-radius':'0px 0 0 50px'
					};

	$(this).append( $('<span> <strong> x </strong> </span>') );
	$('#lista article').not('#'+index).remove();
	$(this).css(cssclick);
	$('#map').removeClass('hiddenmap');
	$('#map').addClass('visiblemap');
	initialize(bas[index].dir);


	$('.item').off();
	$('.item').on('click',fullinfo);
}


function fullinfo()
{
	if($(this).css('height')=="110px")
	{
		$(this).addClass("fulllinfo");
		$(this).append( $("<p class='info' > <strong>"+String.prototype.es.info+"</strong>  <br> "+ bas[ $(this).attr('id')].des +"</p>") );
		$(this).append( $("<p class='info' > <strong>"+String.prototype.es.dir+"</strong>  <br> "+ bas[ $(this).attr('id')].dir +"</p>") );
	}
	else
	{	
		$(this).removeClass("fulllinfo");
		$(this).children('.info').remove();
	}

}

function items()
{
	$('#lista').html('');
	$(bas).each(function(i){
		$('<article class="item" id="'+i+'" > <figure> <img src="'+ bas[i].url+'"/></figure> <p>'+ bas[i].name+'</p>  <p>  <strong>'+ String.prototype.es.hor+'</strong> <br>'+ bas[i].hor +' </p> </article>').appendTo('#lista');
	});
	
}

function itemapp(el, i)
{
	//console.log('itemapp');
		$('<article class="item" id="'+i+'"> <figure> <img src="'+ el.url+'"/></figure> <p>'+ el.name+'</p>  <p>  <strong>'+ String.prototype.es.hor+'</strong> <br>'+ el.hor +' </p> </article>').appendTo('#lista');
}

function buscar()
{ 
	
	
	clearTimeout(timeouts);
    timeouts= setTimeout(function(){

	console.log('buscando...');

	var estacion= $('input').val().toLowerCase();
	$('#lista').html('');
	if(estacion!="")
	{
		$(bas).each(function(i){
			//console.log(this.name.toLowerCase()+' - '+i );
			if( this.name.toLowerCase().removeAccents().indexOf(estacion.removeAccents())!=-1)
			{
				itemapp(this, i);
			}
		});
	}
	else
	{
		items();
	}

	$('.item').on('click', map);
	},500);

}

 function initialize(str) {

	
	//b=$(este).children('img').attr('class')+' '+$(este).children('.info').children('.titulo').text()+' Distrito Federal';
	//Estacion a buscar en mapa
	b=str;
	//Inicializar geocoder paa búsqueda y cuadro de mapa
	geocoder = new google.maps.Geocoder();
	var h=$("#map").css("height");
	var map8=$('<div id="m"></div>').css('height',h);
	$('#map article').append(map8);

	var mapOptions = {
  	zoom :16,
  	mapTypeId: google.maps.MapTypeId.ROADMAP,
  	center: new google.maps.LatLng(0.673792,-103.3354131)
	};


	var map = new google.maps.Map(document.getElementById("m"),mapOptions);

	

		console.log(b);
		var address = b;
		  geocoder.geocode( { 'address': address}, function(results, status) {
		    if (status == google.maps.GeocoderStatus.OK) {
		      map.setCenter(results[0].geometry.location);
		      var marker = new google.maps.Marker({
		          map: map,
		          position: results[0].geometry.location
		      });
		    } else {
		      alert('Geocode was not successful for the following reason: ' + status);
		    }
		  });
	
}


//**quita acentos*/
 String.prototype.removeAccents = function ()
{
	var __r = 
	{
			'À':'A','Á':'A','Â':'A','Ã':'A','Ä':'A','Å':'A','Æ':'E',
			'È':'E','É':'E','Ê':'E','Ë':'E',
			'Ì':'I','Í':'I','Î':'I',
			'Ò':'O','Ó':'O','Ô':'O','Ö':'O',
			'Ù':'U','Ú':'U','Û':'U','Ü':'U',
			'Ñ':'N'
	};


	return this.replace(/[ÀÁÂÃÄÅÆÈÉÊËÌÍÎÒÓÔÖÙÚÛÜÑ]/gi, function(m)
	{
			var ret = __r[m.toUpperCase()];
			if (m === m.toLowerCase())
				ret = ret.toLowerCase();
			return ret;
		});

};

String.prototype.es={
						"B1":"Bateria Baja.",
						"B2":"Podrías intentar cargar el teléfono.",
						"I1":"Desconectado.",
						"I2":"De verdad necesito internet.",
						"err":"Lo siento, hay problemas y no puedo trabajar.",
						"dir":"Domicilio: ",
						"hor":"Horario: ",
						"info":"Información: "
						}