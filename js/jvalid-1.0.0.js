/*
 * jValid (for jQuery)
 * version: 1.0 (16/01/2013)
 * @requires jQuery v1.4.2 or later
 *
 * Licensed under Creative Commons :
 *   http://creativecommons.org/licenses/by-nc/3.0/legalcode
 *
 * Guillermo Hernandez [ guillermo@worktrait.com ]
 * Worktrait.com
 */
(function($) {
	$.fn.jvalid = function( options ){
		/* "This" contains the form to validate*/
		var formThis = this;
		/* Create default options, extending them with any options that were provided */
		var settings = $.extend( {
			/* Rules in the form [ OBLIGATORY , 'valFunct', 'FancyName' , 'EqualToInputName', 'OrInputName', minsize, maxsize ]*/
			rules					: {},
			inputRequired_msg		: 'The field \'%s\' is required',
			inputMinLength_msg		: 'The field \'%s\' cannot contain less than %d characters',
			inputMaxLength_msg		: 'The field \'%s\' cannot contain more than %d characters',
			inputBothEqual_msg		: 'The fields \'%s\' and \'%d\' have to be equal',
			inputEitherSel_msg		: 'Fields \'%s\' or \'%d\', either one is required',
			inputBadSyntax_msg		: 'The field \'%s\' contain syntax errors',
			show 					: function(msg) {
					/* The Function to show messages*/
					alert(msg);
				},
			hide 					: function( ) { 
					/* The Function to hide messages*/
				},
			submit 					: function( ) { 
					/* If everything is ok, what to do?*/
					return true;
				},
			/* Default Functions to validate data */
			'email' 				: function(txt){
					if(txt == '')
						return true;
					var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;  
					return emailPattern.test(txt);
				},
			'input' 				: function(txt){
				if(txt == '')
					return true;
				var noconPattern = /^[\w áéíóúÁÉÍÓÚàèìòùÀÈÌÒÙñÑ"\.\,\'\-\;\:\#\@\+\%\(\)\&\$\*\?\¿\!]*$/;
				if(!noconPattern.test(txt)){
					return false;
				}
				return true;
				},
			'textarea' 				: function(txt){
				if(txt == '')
					return true;
				var noconPattern = /^[\w áéíóúÁÉÍÓÚàèìòùÀÈÌÒÙñÑ"=\~\|\°\¬\/\\\[\]\{\}\^\`\.\,\'\-\;\:\#\@\+\%\(\)\&\$\*\?\¿\¡\!\n\r]*$/;
				if(!noconPattern.test(txt)){
					return false;
				}
				return true;
				},
			'file' 					: function(txt){
				if(txt == '')
					return true;
				var ext = (txt.substring(txt.lastIndexOf("."))).toLowerCase(); 
				if(ext!=".jpg" || ext!=".jpeg" || ext!=".swf" || ext!=".png")
					return false;
				return true;
				},
			'url' 					: function(txt){
				if(txt == ''){
					return true;
				}
				var urlPattern = /^[\w áéíóúÁÉÍÓÚàèìòùÀÈÌÒÙñÑ"=\~\|\°\¬\/\\\[\]\{\}\^\`\.\,\'\-\;\:\#\@\+\%\(\)\&\$\*\?\¿\¡\!\n\r]*$/;  
				return urlPattern.test(txt);
			},
			'date' 					: function(txt){
				if(txt == '')
					return true;
				var datePattern = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/;  
				return datePattern.test(txt);
			},
			'chars'	 				: function(txt){
				if(txt == '')
					return true;
				var alphaPattern = /^[a-zA-Z]*$/;  
				return alphaPattern.test(txt);
			},
			'varchars'				: function(txt){
				if(txt == '')
					return true;
				var alphanumPattern = /^[a-zA-Z0-9 ]*$/;  
				return alphanumPattern.test(txt);
			},
			'decimal' 			: function(txt){
						if(txt == '')
							return true;
						var numDecPattern = /^[0-9]+(\.[0-9][0-9]?)?$/;  
						return numDecPattern.test(txt);
			}
			}, options);			
		/* Assign a trigger to each element of the form */		
		/* We check for all the children that matches an input, textarea or select */
		this.find("input:not(:submit), select, textarea").each(function(){  
			/* "$(this)" nos contains the child of the form */
			$(this).change(function(){
				settings.hide.call($);
				inputName	= $(this).attr("name");
				inputValue	= $(this).val();
				/* If the input doesn't exist on rules then it's true */
				if(settings.rules[inputName]){
					/* Guardo todos los valores */
					obligatory 	= settings.rules[inputName][0];
					valFunction = settings.rules[inputName][1];
					FancyName 	= settings.rules[inputName][2];
					equalToName	= settings.rules[inputName][3];
					OrInputName	= settings.rules[inputName][4];
					minsize 	= settings.rules[inputName][5];
					maxsize 	= settings.rules[inputName][6];
					/* Obligatory? */
					if(obligatory && inputValue.length == 0){
						$(this).removeClass("ok");
						$(this).addClass("fail");
						/* Generate Error */
						settings.show.call($, settings.inputRequired_msg.replace(/%s/g, FancyName));
						/* Return False */
						return false;
					}else if(obligatory){
						$(this).removeClass("fail");
						$(this).addClass("ok");
					}else{
						$(this).removeClass("fail");
						$(this).removeClass("ok");
					}
					/* MAX size */
					if(maxsize != -1 && $.trim(inputValue).length > 0 && $.trim(inputValue).length > maxsize){
							$(this).removeClass("ok");
							$(this).addClass("fail");
							/* Generate Error */
							var txt = settings.inputMaxLength_msg.replace(/%s/g, FancyName);
							txt 	= txt.replace(/%d/g, maxsize);
							settings.show.call($, txt);
							/* Return False */
							return false;
					}else if(maxsize != -1 && inputValue.length > 0){
						$(this).removeClass("fail");
						$(this).addClass("ok");
					}
					/* MIN size */
					if(minsize != -1 && $.trim(inputValue).length > 0 && $.trim(inputValue).length < minsize){
							$(this).removeClass("ok");
							$(this).addClass("fail");
							/* Generate Error */
							var txt = settings.inputMinLength_msg.replace(/%s/g, FancyName);
							txt 	= txt.replace(/%d/g, minsize);
							settings.show.call($, txt);
							/* Return False */
				            return false;
					}else if(minsize != -1 && inputValue.length > 0){
						$(this).removeClass("fail");
						$(this).addClass("ok");
					}
					/* This OR */
					if(OrInputName != ''){
						compareObj = formThis.find('input[name="' + OrInputName + '"]')
						compareVal = compareObj.val();
						compareNam = compareObj.attr("name");
						if(compareVal != '' || inputValue != ''){
							$(this).removeClass("fail");
							compareObj.removeClass("fail");
						}else{
							compareObj.removeClass("ok");
							compareObj.addClass("fail");
							$(this).removeClass("ok");
							$(this).addClass("fail");
							/* Generate Error */
							var txt = settings.inputEitherSel_msg.replace(/%s/g, FancyName);
							txt 	= txt.replace(/%d/g, settings.rules[compareNam][2]);
							settings.show.call($, txt);
							/* Return False */
				            return false;
						}
					}
					/* Equal to */
					if(equalToName != ''){
						compareObj = formThis.find('input[name="' + equalToName + '"]')
						compareVal = compareObj.val();
						compareNam = compareObj.attr("name");
						if(compareVal  != inputValue){
							compareObj.removeClass("ok");
							compareObj.addClass("fail");
							$(this).removeClass("ok");
							$(this).addClass("fail");
							/* Generate Error */
							var txt = settings.inputBothEqual_msg.replace(/%s/g, FancyName);
							txt 	= txt.replace(/%d/g, settings.rules[compareNam][2]);
							settings.show.call($, txt);
							/* Return False */
				            return false;
						}else{
							$(this).removeClass("fail");
							compareObj.removeClass("fail");
							if(!compareObj.hasClass("fail")){
								compareObj.addClass("ok");
							}
						}

					}
					/* Function Validator */
					if(!settings[valFunction](inputValue)){
						$(this).removeClass("ok");
						$(this).addClass("fail");
						/* Generate Error */
						settings.show.call($, settings.inputBadSyntax_msg.replace(/%s/g, FancyName));
						/* Return False */
						return false
					}else if(inputValue != ''){
						$(this).removeClass("fail");
						$(this).addClass("ok");
					}
				}
				return true;
			});
		});
		
		/* Asign a trigger on submit */
		this.submit(function() {
			var submitQ = true;
			/*  $(this) now contain the form element */
			$(this).find("input:not(:submit), select, textarea").each(function(){  
				/* "$(this)" now contain the child of the form */
				if(!($(this).attr("name") == undefined) && !($(this).attr("id") == undefined)){
					if(!$(this).triggerHandler("change")){
						submitQ = false;
						/* Return in this case breaks the each */
						return false;
					}
				}
			});
			/* Everything was ok? */
			if(submitQ){
				return settings.submit.call($);
			}else{
				return false;
			}
		});
		
	};
})(jQuery);