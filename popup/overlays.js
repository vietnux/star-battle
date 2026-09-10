var overlays = {
	c:true,
	success_title:'OK',
	error_title:'Cancel',
	ovlOpen: function(data, width, height, close, auto){
		close = close != undefined ? close : this.c;
		auto = auto != undefined ? auto : false;

		jQuery('#_ovl').css('cursor', 'wait');
		jQuery('#_ovl').css('color', '#000000');
		var style = (width!='' || height!='') ? "style='" +
			(width ? ("width: "+width + (width.toString().endsWith("px") || width.toString().endsWith("%") || width.toString().endsWith("vw") || width.toString().endsWith("auto") ? '' :'px' )) : '')+
			(height ? (";height: "+height + (height.toString().endsWith("px") || height.toString().endsWith("%") || height.toString().endsWith("vh") || height.toString().endsWith("auto") ? '' :'px' )) : '')+
			"'" : '';
		data = "<div class='data'>"+data+"<div style='clear:both'></div></div>" +
			"<div class='_overlay'></div>" +
			(close == true? "<div class='black'><a class='close' onclick='overlays.ovlClose()'></a></div>" :'');
		var ovlString = "<div class='_ovl-bg'></div>";
			ovlString += "<div class='centerOvl' "+style+">"+data+"<div style='clear:both'></div></div>";
			ovlString += "<div style='clear:both'></div>";

		jQuery('#_ovl').html(ovlString);
		jQuery('#_ovl').css('display', 'flex');
		jQuery('#_ovl').css('cursor', 'default');
		if( jQuery('.centerOvl').height() > jQuery(window).height() ) {
			jQuery('#_ovl').addClass('_ovl_overload');
		}

		//animate
		var time_close = 0;
		if( close == "auto" ) { time_close = 1000;}
		function  _close( close ) {
			if (close == "auto") {
				setTimeout( function() {
					jQuery(".centerOvl").animate({top: '-150%'}, function() {
						overlays.ovlClose();
					});
				}, 2000);
			}
		}
		if( auto == true ) {
			jQuery(".centerOvl").css('top', '-150%' );
			jQuery(".centerOvl").animate({top: '0'}, time_close, function(){ return _close(close); } );
		} else if( auto != '' ) {
			jQuery(".centerOvl").css( auto, '-150%' );
			if( auto == 'left') {
				jQuery(".centerOvl").animate({left: '0'}, time_close, function(){ return _close(close); });
			} else if( auto == 'right') {
				jQuery(".centerOvl").animate({right: '0'}, time_close, function(){ return _close(close); });
			} else if( auto == 'top') {
				jQuery(".centerOvl").animate({top: '0'}, time_close, function(){ return _close(close); } );
			} else if( auto == 'bottom') {
				jQuery(".centerOvl").animate({bottom: '0'}, time_close, function(){ return _close(close); } );
			}
		}
	},
	ovlClose: function(){
		//jQuery('#_ovl').slideToggle('slow');
		jQuery('#_ovl').removeClass('_ovl_overload');
		jQuery('#_ovl').hide();
		jQuery('#_ovl').html("");
        jQuery('#_ovl').removeProp('style');
		return;
	},

	ovlComfim: function(data, callbackSuccess, onerror) {
		this.ovlClose();
		this.onerror = (typeof onerror === 'function') ? onerror : function(file){
			this.ovlClose();
		};

		this.callbackSuccess = (typeof callbackSuccess === 'function') ? callbackSuccess: function(file){
				this.ovlClose();
			};
		data += '<hr><div style="clear: both; text-align: center"><button onclick="overlays.callbackSuccess();overlays.ovlClose();">'+overlays.success_title+'</button><button onclick="overlays.onerror();overlays.ovlClose()">'+overlays.error_title+'</button></div>'
		this.ovlOpen(data);
		this.success_title = 'OK';
		this.error_title = 'Cancel';
	}

};
jQuery( document ).ready(function() {
	if( jQuery('.centerOvl').height() > jQuery(window).height() ) {
		jQuery('#_ovl').css('display', 'block');
		jQuery('.centerOvl').css('height', '97vh');
	}
});

