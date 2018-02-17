$(document).ready(function(){
(function($){
  "use strict";
  var lightboxFragment = document.createDocumentFragment();
  var settings = [];
  var scrollCounter = [];
  var sectionWithSlider = [];
  var lastSection = [];
  var skip = false; /**need this gate to skip page when navigation is clicked*/
  var wideWidth = false; /*one variable to check the width within all code*/
  var isLight = false;

$.fn.chronology = function(options){
  settings = $.extend(true, {}, $.fn.chronology.defaults, options);
  var anchorName = [];
  var mainFragment = document.createDocumentFragment();
  this.prepend($('<div />', {'id': 'fullpage'}));
  if(window.innerWidth>$.fn.chronology.defaults.widthToCompare){
    wideWidth = true;
  }
  createSections(settings.contents, anchorName, mainFragment);
  $('#fullpage').append(mainFragment);
  this.prepend(lightboxFragment);
  //if(wideWidth){
  registerListener();
//}

  createCustomNavigation(anchorName, this);
  $('#fullpage').fullpage($.extend(true, settings.fullpageSetting, {loopBottom: false, autoScrolling: wideWidth, fitToSection: wideWidth, anchors: anchorName }));
  if(wideWidth == false){
	  $('.chronology-generic-container container, .image-frame, .image-frame >img, div.image-holder.translate-customTranslate').css({'transform': 'translate(0%, 0%)'});
	  $('.image').css({'max-width': '80vw', 'max-height': '80vh'});
	  $('.image-holder').css('margin', '100px 0px');
			$('.titleSection').each(function(){
				$(this).css('background-color', settings.color[String($(this).data('anchor')).substring(0, 5)]);
			});
    $('.section'+lastSection).remove();
    }
	lightBoxListener();
	imageProtector();
	elevator(lastSection-1);

	createMobileNavigation();
		detectOrientationChangeAndReload();
	//windowResizeListener();
};


function detectOrientationChangeAndReload(){
   $(window).bind('orientationchange', function(event) {
    console.log('changed orientation');
    						setTimeout(function(){
								window.location.reload();
							});
   });
}

function createMobileNavigation(){
	$('.mobileNav').on('click', function(){
		    $('.chronology-nav').css({'width': '71px'});
			document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
	});
	$('.chronology-nav a.closebtn').on('click', function(){
	$('.chronology-nav').css({'width': '0'});
			document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
	});
	$('div.elevator').on('click', function(){
		$.fn.fullpage.silentMoveTo('intro');
	});
}
	function elevator(elevatorOn){
		$('.elevator').appendTo($('.section.section'+elevatorOn).css({}));
	}


function windowResizeListener(){
	//upon resize of width make sure the page is reloaded() use only width not height for mobile compability
	var oldWindowWidth = $('window').width();
	var videoCause = false;
	var resizeOrNo = true;
	$(window).resize(function(){
		var newWindowWidth = $(window).width();
		if(oldWindowWidth != newWindowWidth ){

			$('video').each(function(){
				if($(window).width()==$(this).outerWidth()){
					console.log('if');
						videoCause = true;
						resizeOrNo = false;
						return false;
				}else{
					if(videoCause){
						videoCause = false;
						resizeOrNo = true;
						return false;
					}else{
					if(videoCause == false && resizeOrNo == true){
						setTimeout(function(){
								window.location.reload();
							});
						}
					}
				}
			});
			oldWindowWidth = newWindowWidth;
		}

	});

}




function imageProtector(){
	// first over lay 1px image over image so they will only drag 1px image
	// second make sure no right click so they cannot save the page itself
	$('.image-protection').after($('<img />').attr('src', 'frontend/imageProtection.png').css({'position': 'absolute',
	'width': '100%', 'height': '100%', 'top': '0', 'left': '0'}));
   //$("body").on("contextmenu",function(e){
  //    return false;
 //  });
}

/**************************************************SLIDER/SECTION INITIATOR******************************************************************/

//Create both slider and section pages
function createSections(contents, anchorName,  mainFragment){
  lastSection = 0;
  var  modalId = 0;
  var urlOfCurrentBgImage = "";
  var lastSectionAnchor = "";
  contents.forEach(function(content){
    if(content.type == 'section'){
       lastSection = lastSection + 1;
       anchorName.push(content.anchorName);
       urlOfCurrentBgImage = content.image;
       lastSectionAnchor = content.anchorName;
     }else if(content.type == 'slider'){
       modalId = modalId + 1;
     }else{
	 }
    $.fn.chronology.createPage[content.type](content, lastSection, mainFragment, modalId, urlOfCurrentBgImage, lastSectionAnchor);
  });
  createScrollCounter(lastSection);
}
/*Create scroll counter for slider */
function createScrollCounter(lastSection){
  scrollCounter = new Array(lastSection);
  scrollCounter.slice(1);
  scrollCounter.fill(0);
}

/**************************************************SLIDER/SECTION CHOSER******************************************************************/

//Customiseable function to add page
$.fn.chronology.createPage = {
  section: function(content, lastSection, mainFragment){
    mainFragment.appendChild(createGenericBootstrapSection(content, lastSection));
  },
  slider: function(content, lastSection,  mainFragment, modalId, urlOfCurrentBgImage, lastSectionAnchor){
    if(content.sectionPart!="TRUE"){
    sectionWithSlider.push(lastSection);
  }
    mainFragment.querySelector('.section'+lastSection).appendChild(createSlider(content, modalId, lastSectionAnchor));
    lightboxFragment.appendChild(createLightbox(content, modalId, urlOfCurrentBgImage, lastSection));
  }
};
//Create Inner Container contents for sections
$.fn.chronology.createContainer = {
  video: function(content){
    return createVideoSection(content);
  },
  info: function(content){
    return createMainIntro(content);
  },
  center: function(content){
    return createCenterSection(content);
  },
  quote: function(content){
    return createQuoteSection(content);
  },
  left: function(content){
    return createLeftSection(content);
  },
  right: function(content){
    return createRightSection(content);
  },
  title: function(content){
    return createTitlePage(content);
  },
  blank: function(content) {
    return $('<div />', {'class': 'section'});
  }
};
function findTranslateXY(translate){
  var x = 0;
  var y = 0;
  switch (translate) {
    case 'right':
    x= 120;
    y= 0;
    break;

    case 'rightToCenter':
    x= 120;
    y= 0;
    break;
   case 'rightBottom':
   x= 120;
   y= 40;
   break;
  case 'rightTop':
  x= 120;
  y= -50;
  break;


  case 'left':
  x= -120;
  y= 0;
  break;
  case 'leftToCenter':
  x= -120;
  y= 0;
  break;
  case 'leftBottom':
  x= -120;
  y= 40;
  break;
  case 'leftTop':
  x= -120;
  y= -50;
  break;

  case 'top': case true:
  x= 0;
  y= -120;
  break;
  case 'topToCenter':
  x= 0;
  y= -120;
  break;
  case 'topRight':
  x= 50;
  y= -120;
  break;
  case 'topLeft':
  x= -50;
  y= -120;
  break;

      case 'bottom':
      x= 0;
      y= 120;
      break;
      case 'bottomToCenter':
      x= 0;
      y= 120;
      break;
      case 'bottomRight':
      x= 50;
      y= 120;
      break;
      case 'bottomLeft':
      x= -50;
      y= 120;
      break;

      default:
      x= 0;
      y= 0;
      break;

  }
  return getActualCoordinates(x, y);
}
function findTranslateX2Y2(translate){
  var x2 = 0;
  var y2 = 0;
  switch (translate) {
    case 'right':
    x2= 50;
    y2= 0;
    break;

    case 'rightToCenter':
    x2= 0;
    y2= 0;
    break;
   case 'rightBottom':
   x2= 50;
   y2= 40;
   break;
  case 'rightTop':
  x2= 50;
  y2= -50;
  break;


  case 'left':
  x2= -50;
  y2= 0;
  break;
  case 'leftToCenter':
  x2= 0;
  y2= 0;
  break;
  case 'leftBottom':
  x2= -50;
  y2= 40;
  break;
  case 'leftTop':
  x2= -50;
  y2= -50;
  break;

  case 'top': case true:
  x2= 0;
  y2= -50;
  break;
  case 'topToCenter':
  x2= 0;
  y2= 0;
  break;
  case 'topRight':
  x2= 50;
  y2= -50;
  break;
  case 'topLeft':
  x2= -50;
  y2= -50;
  break;

      case 'bottom':
      x2= 0;
      y2= 40;
      break;
      case 'bottomToCenter':
      x2= 0;
      y2= 0;
      break;
      case 'bottomRight':
      x2= 50;
      y2= 40;
      break;
      case 'bottomLeft':
      x2= -50;
      y2= 40;
      break;

      default:
      x2= 0;
      y2= 0;
      break;

  }
  return getActualCoordinates(x2, y2);
}
function findFade(translate){
  switch (translate) {
  case 'top':
      return true;
  case 'topToCenter':
      return true;
  case 'topRight':
      return true;
  case 'topLeft':
      return true;
      case 'bottom':
          return true;
      case 'bottomToCenter':
           return true;
      case 'bottomRight':
        return true;
      case 'bottomLeft':
        return true;

      default:
          return false;
  }
}

/**************************************************SLIDER CREATOR******************************************************************/

//Create Inner and Outter Slider Content
function createSlider(content, modalId, lastSectionAnchor){
  var  translate ="50%, -50%";
  var translatePosition = $('<div />').addClass('image-holder translate-customTranslate x'+content.translate) ;
  var start_coordinates;
  var end_coordinates;
  if(content.translate!='customTranslate'){
    /*If normal default translates*/
      //  translate =  findTranslate(content.translate);
      start_coordinates = findTranslateXY(content.translate);
       end_coordinates = findTranslateX2Y2(content.translate);
      var fade = findFade(content.translate);
      if(fade){ /*Add fade in animation if fade is true*/
        start_coordinates = JSON.parse(start_coordinates);
        end_coordinates = JSON.parse(end_coordinates);
        start_coordinates.opacity = 0;
        start_coordinates.visibility = 'hidden';
        end_coordinates.opacity = 1;
        end_coordinates.visibility = 'visible';
        start_coordinates = JSON.stringify(start_coordinates);
        end_coordinates = JSON.stringify(end_coordinates);
      }
      $(translatePosition).attr({'data-translatestart': start_coordinates, 'data-translateend': end_coordinates, 'data-fade': content.fade})
                            .css(JSON.parse(start_coordinates));
  }  else if(content.sectionPart){
    /* if Image part of section and not a slider*/
  	  var coordinates = getActualCoordinates(content.x, content.y);
  	  $(translatePosition).css(JSON.parse(coordinates));
  } else if(content.translate== "customTranslate"){
    /*if Custom translate*/
       start_coordinates = getActualCoordinates(content.x, content.y);
       end_coordinates = getActualCoordinates(content.x2, content.y2);
      if(content.fade){ /*Add fade in animation if fade is true*/
        start_coordinates = JSON.parse(start_coordinates);
        end_coordinates = JSON.parse(end_coordinates);
        start_coordinates.opacity = 0;
        start_coordinates.visibility = 'hidden';
        end_coordinates.opacity = 1;
        end_coordinates.visibility = 'visible';
        start_coordinates = JSON.stringify(start_coordinates);
        end_coordinates = JSON.stringify(end_coordinates);
      }
      $(translatePosition).attr({'data-translatestart': start_coordinates, 'data-translateend': end_coordinates, 'data-fade': content.fade})
                            .css(JSON.parse(start_coordinates));
  }
 var rotate = '0';
 var max_width = settings.max_width;
 var max_height = settings.max_height;
 if(content.max_width||content.max_height){
   max_width = content.max_width+'vw';
   max_height = content.max_height+'vh';
 }
 if(content.rotate){
   rotate = content.rotate;
 }
 var slider = document.createElement('div');
$(slider).addClass('widget-sliding').append($(translatePosition)
          //.append($('<div />').addClass('image-btn-wrapper').css('display', 'inline-block')
          .append($('<div />').addClass('image-frame').css({'transform': 'translate('+translate+')'})
          //.append($('<div />').addClass('image-wrapper').css({'transform': 'rotate('+rotate+'deg)'})
          .append($('<img />').addClass('image image-protection').attr('data-src2', content.image)
          .css({'transform':'rotate('+rotate+'deg)','max-width': max_width, 'max-height': max_height}))
          .append($('<div />').addClass('btn-holder')
            .append($('<button />')
              .addClass('btn  btn-over-image ')
              .append($('<span />').text(content.buttonText))
              .attr({'data-toggle': 'modal', 'data-target': '#imageModal'+modalId})
                  .append($('<div />').addClass('imgBtn_backgroundColor')
                    .append($('<img />').addClass('image-btn').css('background-color',  settings.color[lastSectionAnchor.substring(0, 5)])
                    .attr({'data-src2': settings.image_btn})
                  )))
            )
      ));

 return slider;
}

/*Create Lightbox for slider*/
function createLightbox(content, modalId, urlOfCurrentBgImage, lastSection){
  var rotate = '0';
  if(content.lightboxRotate){
    rotate = content.lightboxRotate;
  }
  var text_color = "#000000";
  if(content.color){
    text_color = content.color;
  }
  var text_shadow = String(settings.text_shadow);
  if(content.text_shadow){
    text_shadow = content.text_shadow;
  }
 var lightbox_max_width = settings.lightbox_max_width;
 var lightbox_max_height = settings.lightbox_max_height;
 if(content.lightbox_max_width||content.lightbox_max_height){
   lightbox_max_width = content.lightbox_max_width+'vw';
   lightbox_max_height = content.lightbox_max_height+'vh';
 }
 /* Oldies
  var modal = document.createElement('div');
  $(modal).addClass('modalImage'+modalId).css('color', text_color)
      .append($('<div />').addClass('modal fade').attr({'id': 'imageModal'+modalId, 'tabindex': '-1', 'role': 'dialog', 'aria-labelledby': 'imageModal'+modalId+'Label', 'aria-hidden': 'true'})
      .append($('<div />').addClass('modal-dialog').attr('role', 'document')
        .append($('<div />').addClass('modal-content section'+lastSection).attr('data-bg', 'url('+urlOfCurrentBgImage+')')
        .append($('<button />').addClass('close').attr({'data-dismiss': 'modal', 'aria-label': 'Close'})
        .append($('<span />').attr('aria-hidden', 'true').html('&times;')))
        .append($('<div />').addClass('modal-body')
        .append($('<div />').addClass('table-container')
        .append($('<div />').addClass('container')
        .append($('<div />').addClass('row is-flex')
          .append($('<div />').addClass('col-md-6')
            .append($('<div />').addClass('lightbox-image-frame').css({transform: 'rotate('+rotate+'deg)'})
            .append($('<img />').attr('data-src2', content.image).addClass('lightbox-image image-protection').css({'max-width': lightbox_max_width, 'max-height': lightbox_max_height}))))
              .append($('<div />').addClass('col-md-6 lightbox-text')
				.append($('<div />').addClass('lightboxTextContainerTable')
                  .append($('<p />').html(content.caption).css("text-shadow", text_shadow))))))))))
	*/

			  var modal = document.createElement('div');
  $(modal).addClass('modalImage'+modalId).css('color', text_color)
      .append($('<div />').addClass('modal fade').attr({'id': 'imageModal'+modalId, 'tabindex': '-1', 'role': 'dialog', 'aria-labelledby': 'imageModal'+modalId+'Label', 'aria-hidden': 'true'})
      .append($('<div />').addClass('modal-dialog').attr('role', 'document')
        .append($('<div />').addClass('modal-content section'+lastSection).attr('data-bg', 'url('+urlOfCurrentBgImage+')')
        .append($('<button />').addClass('close').attr({'data-dismiss': 'modal', 'aria-label': 'Close'})
        .append($('<span />').addClass('glyphicon glyphicon-remove').attr('aria-hidden', 'true').html('')))
        .append($('<div />').addClass('modal-body')
        .append($('<div />').addClass('table-container')
        .append($('<div />').addClass('container-fluid')
			.append($('<div />').addClass('row')
				.append($('<div />').addClass('col-md-12')
                  .append($('<div />').addClass('lightbox-image-frame').css({transform: 'rotate('+rotate+'deg)'})
                   .append($('<img />').attr('data-src2', content.image).addClass('lightbox-image image-protection').css({'max-width': lightbox_max_width, 'max-height': lightbox_max_height})))))
                 .append($('<div />').addClass('row')
					.append($('<div />').addClass('col-md-12 lightbox-text')
				.append($('<div />').addClass('lightboxTextContainerTable')
                  .append($('<p />').html(content.caption).css("text-shadow", text_shadow)))))))))	)

); return modal;}

/**************************************************SECTION CREATOR******************************************************************/
function createTitlePage(content){
    var text_shadow = String(settings.text_shadow);
  if(content.text_shadow){
    text_shadow = content.text_shadow;
  }
  var color = content.color;
  var div=$('<div />').addClass('decadeTitleContainer')
  .append($('<span />').addClass('decadeTitle').text(content.dateTitle).css({'text-shadow': text_shadow}));

  return div;
}

function createVideoSection(content){
    var text_shadow = String(settings.text_shadow);
    if(content.text_shadow){
        text_shadow = content.text_shadow;
    }
	var text_color = 'white';
	if(content.color){
		text_color = content.color;
	}
  var div1 = $('<div />').addClass('row video-container')
      .append($('<div />').addClass('col-md-12')
  .append($('<div />').addClass('video-player')
      .append($('<video />').addClass('video').attr({'controls': 'true', 'width': '400', 'autoplay': ''})
                        .append($('<source />').attr({'data-src': content.texts+'.mp4', 'type': 'video/mp4'}).text('  Your browser does not support HTML5 video.'))
	.append($('<source />').attr({'data-src': content.texts+'.webm', 'type': 'video/webm'}).text('  Your browser does not support HTML5 video.'))
		.append($('<source />').attr({'data-src': content.texts+'.mov', 'type': 'video/quicktime'}).text('  Your browser does not support HTML5 video.'))
						)));
  var div =  $(div1).add($('<div />').addClass('row').css({"text-shadow": "text_shadow", "color": text_color})
                            .append($('<div />').addClass('col-md-12')
											.append($('<div />').addClass('videoCaption')
												.append($('<p />').html(content.caption)))));
  return div;
}

function createCenterSection(content) {
  var text_shadow = String(settings.text_shadow);
  if(content.text_shadow){
    text_shadow = content.text_shadow;
  }
  var dateTitle = $('<div />').addClass('contents-container');
  if(content.dateTitle){
    $(dateTitle).append($('<div />').addClass('headingContainer')
                  .css('color', settings.color[String(content.anchorName).substring(0, 5)])
                    .append($('<h1 />').html(content.dateTitle).addClass('dateTitle').css('text-align', 'center'))
                    .append($('<hr />').attr('align', 'center').css({'box-shadow': text_shadow, 'border-top': '1.5px solid'+settings.color[String(content.anchorName).substring(0, 5)]}))
                );
  }

  var div = $('<div />', {'class': 'chronology-generic-row row'}).css("text-shadow", text_shadow)
                .append($('<div />', {'class': 'col-md-12 col-sm-12'})
                  .append($(dateTitle).css('text-align', 'center')
                    .append($('<p />').html(content.texts))
                )
              );
    return div;
}

function createMainIntro(content){
	var text_shadow = String(settings.text_shadow);
  if(content.text_shadow){
    text_shadow = content.text_shadow;
  }

  var div = $('<div />' , {'class': 'chronology-generic-row row'})
                          .css("text-shadow", text_shadow)
                          .append($('<div />', {'class': 'col-md-12'})
						              .append($('<h1 />').html(content.texts).addClass('francis_bacon')));
  return div;
}

function createRightSection(content){
  var text_shadow = String(settings.text_shadow);
  if(content.text_shadow){
    text_shadow = content.text_shadow;
  }
  var dateTitle = $('<div />').addClass('contents-container ');
  if(content.dateTitle){
    $(dateTitle).append($('<div />').addClass('headingContainer')
      .css('color', settings.color[String(content.anchorName).substring(0, 5)]) /*Color this*/
        .append($('<h1 />').html(content.dateTitle).addClass('dateTitle').css('text-align', 'left'))
        .append($('<hr />').attr('align', 'left').css({'box-shadow': text_shadow})));
  }
  var div = $('<div />', {'class': 'chronology-generic-row row'}).css("text-shadow", text_shadow)
                      .append($('<div />').addClass('col-md-6 col-sm-6'))
                      .append($('<div />').addClass('col-md-6 col-sm-6')
                      .append($('<div />').addClass('textRight')
                      .append($(dateTitle).append($('<p />').html(content.texts).attr('align', 'left')))));
                      return div;
                    }

function createLeftSection(content){
  var text_shadow = String(settings.text_shadow);
  if(content.text_shadow){
    text_shadow = content.text_shadow;
  }
  var dateTitle = $('<div />').addClass('contents-container left-container').css("text-shadow", text_shadow);
  if(content.dateTitle){
    $(dateTitle).append($('<div />').addClass('headingContainer')
      .css('color', settings.color[String(content.anchorName).substring(0, 5)]) /*Color this*/
        .append($('<h1 />').html(content.dateTitle).addClass('dateTitle').css('text-align', 'right'))
        .append($('<hr />').attr('align', 'right').css("box-shadow", text_shadow)));
  }
  var div = $('<div />', {'class': 'chronology-generic-row row'}).css("text-shadow", text_shadow)
                      .append($('<div />').addClass('col-md-6 col-sm-6')
                      .append($('<div />').addClass('textLeft')
                      .append($(dateTitle).append($('<p />').html(content.texts).attr('align', 'right')))
                      .append($('<div />').addClass('col-md-6 col-md-6'))));
  return div;
}

function createQuoteSection(content){
  var quote_shadow = String(settings.quote_shadow);
  if(content.quote_shadow){
   quote_shadow = content.quote_shadow;
  }
  var div = $('<div />', {'class': 'chronology-generic-row row'})
                              .append($('<div />').addClass('col-md-12')
                              .append($('<div />')
                              .append($('<div />').addClass('quotes').css({'text-shadow': quote_shadow})
                              .append($('<h2 />').html(content.texts))
                              .append($('<hr />').css({'box-shadow': quote_shadow}))
                              .append($('<p />').html(content.quoteWriter)))));
  return div;
}

//Creates common Inner section using bootstrap structure
function createGenericBootstrapSection(content, lastSection){
  var text_color = "#000000";
  var innerSection = "center";
  var typeOfPage ="";
  if(content.innerSection){
	  innerSection = content.innerSection;
  }
  if(content.color){
    text_color = content.color;
  }
  if(content.innerSection=='title'){
	  typeOfPage = 'titleSection';
  }
  var genericSection = document.createElement('div');
  $(genericSection).addClass(typeOfPage+' fixedBG fpBackgroundImg chronology-section section section'+lastSection).css('color', text_color);
  if(content.image){
    $(genericSection).attr('data-bg', 'url('+content.image+')');
  }else if(content.backgroundColor){
	$(genericSection).css('background-color', content.backgroundColor);
  }else{
  //$('.titleSection').css('background-color', settings.color[String(content.anchorName).substring(0, 5)]);
  }
  $(genericSection)
  .append($('<div />', {'class': 'chronology-generic-container container'})
  .append($.fn.chronology.createContainer[innerSection](content)));
  return genericSection;
}

//Creates Custom Navigation
function createCustomNavigation(anchorName, attachment){
  var previousAnchorName = "startAnchorNames";
  var navigation = $('<ul />', {'class': 'chronology-nav-ul'});
  craeteCloseBtn(navigation);
  //homeAndLife(navigation);  //home and life link in nav bar
  anchorName.forEach(function(anchor){
    if(anchor){
    if (anchor.indexOf(previousAnchorName) >= 0){
      //if it is sub anchor :: do nothing
    }else{
      previousAnchorName = anchor;

      $('<li />').attr('data-anchorName', anchor).addClass('chronology-nav-ul-li')
      .append($('<a />')
      .append($('<span />').html(anchor)))
      .appendTo(navigation);
    }
}});
//$(navigation).children().first().addClass('active');
$(attachment).append($('<div />', {'class': 'chronology-nav'}).append(navigation));
}
function craeteCloseBtn(navigation){
	$('<li />').addClass('chronology-close-btn')
		.append($('<a />').attr({'href': 'javascript:void(0)'}).addClass("closebtn").html('&times;'))
		.appendTo(navigation);

}
function homeAndLife(navigation){
      $('<li />').addClass('chronology-nav-ul-li')
      .append($('<a />').attr('href', $.fn.chronology.defaults.home_url)
      .append($('<span />').css('text-transform', 'uppercase').html('home')))
      .appendTo(navigation);
	  $('<li />').addClass('chronology-nav-ul-li')
      .append($('<a />').attr('href', $.fn.chronology.defaults.life_url)
      .append($('<span />').css('text-transform', 'uppercase').html('life')))
      .appendTo(navigation);
}

/**************************************************Common Functions******************************************************************/


/*lazyLoad images and backgroung images save bandwith by loading one section above and below of current section loaded*/
function lazyLoadViewPort( index){
	/*Lazzy Loads the Background Images*/
	[].forEach.call(document.querySelectorAll('div[data-bg].section'+index), function(img) {
			 img.style.backgroundImage = img.getAttribute('data-bg');
    img.removeAttribute('data-bg');
});}
function lazyLoad( index){
	/*Lazy Loads the images*/
	[].forEach.call(document.querySelectorAll('.section'+index+' img[data-src2]'),    function(img) {
  img.setAttribute('src', img.getAttribute('data-src2'));
  img.onload = function() {
    img.removeAttribute('data-src2');
  };
});}
/*Custom side navigation need to have active class after it section is loaded which is done by following code*/
var customNavigationActive = (function(){
  var oldAnchor = "";
  return function(newAnchor){
    if(oldAnchor!=newAnchor){
      oldAnchor = newAnchor;
    $('.chronology-nav-ul-li[data-anchorName='+newAnchor+']').addClass('active')
    .siblings().removeClass('active');
    }
  }
})();
/*Change background color of navigation bar and titleSection */
var customNavigationChangeColor = (function(){
  var oldAnchor = ""; /*use clourse to store last anchor value so , their will be less call using $*/
  return function(newAnchor){
    if(oldAnchor!=newAnchor){
      oldAnchor = newAnchor;
      $('.chronology-nav, .titleSection, .mobileNav').css({'background-color': settings.color[newAnchor]});
    }
  };
})();
/*when skiping sections make sure the images before and after are in right place ##NEED OPTIMISATION MADAN */
function onSkipTransformSlider(index){
  /*Make sure all the slider before anchor is slided when going to that specific page */
  for(var temp=1; temp<index;  temp++){
      transformCustom('.section' +temp);
    scrollCounter[temp] = 2;
  }
  /*Make sure all the slider after the current slider is set to invisible or to there inital position*/
  for(var temp2=index+1; temp2<lastSection; temp2++){
        transformCustomBack('.section'+temp2);
      scrollCounter[temp2] = 0;
  }
}
/*For custom navigation, register Click listener to move to section */
function registerListener(){
 $(document).on('click', 'li.chronology-nav-ul-li > a', function(event){
  skip = true;
  $('.widget-sliding>.image-holder').css('transition', 'visibility 0s, transform 0s ease, opacity 0s ease');
  $.fn.fullpage.silentMoveTo($(event.target).text());
  setTimeout(function(){
    $('.widget-sliding>.image-holder').css('transition', 'visibility 1s, transform 1s ease, opacity 1s ease');
  }, 1000);
    skip = false;
    });
}

/*onscroll down transform image to end translate*/
function transformCustom(sectionNumber){
    var objectSlider = $(sectionNumber+ " .translate-customTranslate");
    var objectSliderLength = objectSlider.length;
        for(var i=0; i<=objectSliderLength; i++){
          var currentObjectSliderEnd = $(objectSlider[i]).data('translateend');
          if(currentObjectSliderEnd){
            $(objectSlider[i]).css(currentObjectSliderEnd);
          }
        }
  }
/*onscroll up transform image back*/
function transformCustomBack(sectionNumber){
    var objectSlider = $(sectionNumber+ " .translate-customTranslate");
    var objectSliderLength = objectSlider.length;
          for(var i=0; i<=objectSliderLength; i++){
            var currentObjectSliderStart = $(objectSlider[i]).data('translatestart');
            if(currentObjectSliderStart){
              $(objectSlider[i]).css(currentObjectSliderStart);
            }
          }
      }
/*Get new traslate coordinate using content provided*/
function getActualCoordinates(x, y){
	  var x_percentage = -50; /*Default percentage in the translate object/element*/
	  var y_percentage = 50;
	  x_percentage = x_percentage + x/2; /*User inputed co-orinate percentage to put on the actual translate object/element, Ratio it down to half xy/2*/
	  y_percentage = y_percentage + y/2;
	  return '{"transform": "translate('+x_percentage+'%, '+y_percentage+'%)"}'; /*Returns the tranlsate css with acutual cooridnates*/
  }

function lightBoxListener(){
	$('button.close, button.btn-over-image').on('click', function(){
		if(isLight == false){
			isLight = true;
		}else{
			isLight = false;
		}
	});
}
/**************************************************Default Variables******************************************************************/

//fullpage Plugin settings
var fullpageSetting= {
	responsive: 769,
    scrollingSpeed: 800,
    animateAnchor: false,
    css3: false,
    navigation: false,
    onLeave: function(index, nextIndex, direction){
      if(wideWidth){
		  if(isLight==false){
      if(skip){
        /** Do nothing if the navigation button was clicked, this is so that there won't be any stoping when navigation btn is clicked  */
      }else{
        var secLength = sectionWithSlider.length;
      for(var s=0; s<secLength; s++){
        if(sectionWithSlider[s]==index){
          if(direction == 'down'){
            if(scrollCounter[index] == 0){
              scrollCounter[index] = 1;
                  transformCustom('.section' +index);
              setTimeout(function(){scrollCounter[index] = 2;}, 1000);
              return false;
            }else if (scrollCounter[index] == 1) {

              return false;
            }else if(nextIndex == lastSection){ /*Need this line to make sure the last section doesn;t scroll down the rabit hole*/

              return false;
            }
          }else if (direction == 'up') {
            if(scrollCounter[index] == 2){
              scrollCounter[index] = 1;
                transformCustomBack('.section'+index);
              setTimeout(function(){scrollCounter[index] = 0;}, 1000);

              return false;
            }else if (scrollCounter[index] ==1) {
              return false;
            }
          }
          break;
        }
     }
      if(nextIndex==lastSection){ /**This will enable us to have last section to invisible to user*/
        return false;
      }
    }
		  }else{
			  return false;
		  }
  }
         },
         afterLoad: function(anchorLink, index){
    if(wideWidth){

          onSkipTransformSlider(index);
        }
		  var newAnchorLink = anchorLink.substring(0, 5);
          customNavigationChangeColor(newAnchorLink);
          customNavigationActive(newAnchorLink);
  	  /*Lazzy load after page load and its up and down for smooth scroll load*/
      lazyLoadViewPort(index);
      lazyLoad( index);
      lazyLoadViewPort( index+1);
      lazyLoad( index+1);
	       lazyLoadViewPort(index-1);
      lazyLoad( index-1);
	    lazyLoadViewPort(index+2);
      lazyLoad( index+2);
	  	    lazyLoadViewPort(index-2);
      lazyLoad( index-2);

	  	    lazyLoadViewPort(index+3);
      lazyLoad( index+3);
	  	  	    lazyLoadViewPort(index-3);
      lazyLoad( index-3);
	  	  	    lazyLoadViewPort(index+4);
      lazyLoad( index+4);
	  	    lazyLoadViewPort(index-4);
      lazyLoad( index-4);
    }
  };
/*Default Settings*/
$.fn.chronology.defaults = {
    contents: {},
    fullpageSetting : fullpageSetting,
    sectionWithSlider: [],
    color: {'intro': '#999999', '1910s': '#203B34', '1920s': '#007EA9', '1930s': '#F0AD06', '1940s': '#D46F29', '1950s': '#136750', '1960s': '#712931', '1970s': '#D1BFCB', '1980s': '#1A4476', '1990s': '#000000' },
    widthToCompare: 768,
    text_shadow:  '',
    image_btn: 'frontend/css/btn/arrow.svg',
    max_width: '50vw',
    max_height: '50vh',
	lightbox_max_width: '100%',
	lightbox_max_height: '60vh',
    quote_shadow: '',//rgb(134, 134, 134) 1px 1px 1px,
	home_url: 'http://google.com/',
	life_url: 'http://google.com'
};

}(jQuery));
});
